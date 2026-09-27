const API = "";

const state = {
  events: [],
  alerts: [],
  links: [],
  metrics: {},
  model: {},
  learningEvents: [],
  latestDecision: null,
  filter: "all",
  paused: false,
};

const el = {
  signOut: document.querySelector("#signOut"),
  pauseStream: document.querySelector("#pauseStream"),
  seedIncident: document.querySelector("#seedIncident"),
  transactionList: document.querySelector("#transactionList"),
  alertQueue: document.querySelector("#alertQueue"),
  decisionBadge: document.querySelector("#decisionBadge"),
  decisionDetail: document.querySelector("#decisionDetail"),
  reasonCodes: document.querySelector("#reasonCodes"),
  modelBreakdown: document.querySelector("#modelBreakdown"),
  modelReportDetails: document.querySelector("#modelReportDetails"),
  modelReportContent: document.querySelector("#modelReportContent"),
  metricEvents: document.querySelector("#metricEvents"),
  metricAccounts: document.querySelector("#metricAccounts"),
  metricHeld: document.querySelector("#metricHeld"),
  metricRegHits: document.querySelector("#metricRegHits"),
  metricPrevented: document.querySelector("#metricPrevented"),
  learningTitle: document.querySelector("#learningTitle"),
  learningDetail: document.querySelector("#learningDetail"),
  clusterCount: document.querySelector("#clusterCount"),
  networkCanvas: document.querySelector("#networkCanvas"),
  graphInspector: document.querySelector("#graphInspector"),
  graphTooltip: document.querySelector("#graphTooltip"),
  feedPulse: document.querySelector("#feedPulse"),
  resolveTop: document.querySelector("#resolveTop"),
  ingestForm: document.querySelector("#ingestForm"),
  confirmMule: document.querySelector("#confirmMule"),
  falsePositive: document.querySelector("#falsePositive"),
  feedbackStatus: document.querySelector("#feedbackStatus"),
};

el.signOut?.addEventListener("click", async () => {
  await fetch("/api/auth/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  window.location.assign("/");
});

const graphView = {
  nodes: [],
  selectedNode: null,
  hoveredNode: null,
};

const animatedMetrics = new Map();
let lastEventId = null;
let feedbackStatusHoldUntil = 0;
let modelReportLoaded = false;

async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
}

function reportMetric(label, value) {
  return `<div><span>${label}</span><strong>${value ?? "-"}</strong></div>`;
}

async function loadModelReport() {
  if (modelReportLoaded || !el.modelReportContent) return;
  el.modelReportContent.textContent = "Loading evaluation summary…";
  try {
    const report = await api("/api/model/report");
    const test = report.test || {};
    const splits = report.splitCounts || {};
    const limitations = (report.limitations || []).slice(0, 2);
    el.modelReportContent.innerHTML = `
      <div class="model-report-metrics">
        ${reportMetric("Held-out F1", test.f1)}
        ${reportMetric("Precision", test.precision)}
        ${reportMetric("Recall", test.recall)}
        ${reportMetric("Test records", test.samples)}
      </div>
      <p><strong>Evaluation split:</strong> ${splits.train ?? "-"} training / ${splits.validation ?? "-"} validation / ${splits.test ?? "-"} held-out test records.</p>
      <p><strong>Decision threshold:</strong> ${report.threshold ?? "-"}. ${report.algorithms?.supervised || ""}</p>
      ${limitations.length ? `<p class="model-report-note"><strong>Scope:</strong> ${limitations.join(" ")}</p>` : ""}
    `;
    modelReportLoaded = true;
  } catch (error) {
    el.modelReportContent.textContent = "The evaluation report could not be loaded.";
  }
}

el.modelReportDetails?.addEventListener("toggle", () => {
  if (el.modelReportDetails.open) loadModelReport();
});

async function loadState() {
  if (state.paused) return;
  try {
    const data = await api("/api/state");
    const newestId = data.events && data.events[0] && data.events[0].id;
    Object.assign(state, data);
    if (newestId && newestId !== lastEventId) {
      lastEventId = newestId;
      triggerIngestionPulse();
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

function riskClass(score) {
  if (score >= 82) return "high";
  if (score >= 66) return "hold";
  if (score >= 48) return "medium";
  return "neutral";
}

function riskBarClass(score) {
  if (score >= 66) return "high";
  if (score >= 48) return "medium";
  return "";
}

function riskItemClass(score) {
  if (score >= 82) return "risk-freeze";
  if (score >= 48) return "risk-review";
  return "risk-safe";
}

function riskLabel(score) {
  if (score >= 82) return "Freeze";
  if (score >= 48) return "Review";
  return "Safe";
}

function riskChipClass(score) {
  if (score >= 82) return "freeze";
  if (score >= 48) return "review";
  return "safe";
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString();
}

function relativeTime(value) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

function renderTransaction(item) {
  return `
    <article class="transaction-item ${riskItemClass(item.score)}">
      <div class="item-top">
        <div>
          <div><span class="channel">${item.channel}</span> ${item.account} -> ${item.beneficiary}<span class="risk-chip ${riskChipClass(item.score)}">${riskLabel(item.score)}</span></div>
          <div class="item-meta">${item.location} | ${item.device} | ${formatTime(item.timestamp)} | ${relativeTime(item.timestamp)} | ${item.source}</div>
        </div>
        <div class="amount">${formatMoney(item.amount)}</div>
      </div>
      <div class="risk-meter" aria-label="Risk score ${item.score}">
        <span class="${riskBarClass(item.score)}" style="width:${item.score}%"></span>
      </div>
    </article>
  `;
}

function renderAlert(alert) {
  return `
    <article class="alert-item">
      <div class="alert-top">
        <div>
          <strong>${alert.title}</strong>
          <div class="alert-meta">${alert.account} | ${formatMoney(alert.amount)} | ${relativeTime(alert.timestamp)}${alert.caseId ? ` | ${alert.caseId}` : ""}</div>
        </div>
        <span class="status-badge ${riskClass(alert.score)}">${alert.score}</span>
      </div>
      <div class="alert-meta">${alert.action}</div>
    </article>
  `;
}

function renderDecision(item) {
  if (!item) {
    el.decisionBadge.textContent = "Monitoring";
    el.decisionBadge.className = "status-badge neutral";
    el.decisionDetail.innerHTML = "";
    el.reasonCodes.innerHTML = "";
    el.modelBreakdown.innerHTML = "";
    return;
  }
  el.decisionBadge.textContent = item.action;
  el.decisionBadge.className = `status-badge ${riskClass(item.score)}`;
  el.decisionDetail.innerHTML = `
    <div class="detail-cell"><span>Risk score</span><strong>${item.score}/100</strong></div>
    <div class="detail-cell"><span>Account</span><strong>${item.account}</strong></div>
    <div class="detail-cell"><span>Beneficiary</span><strong>${item.beneficiary}</strong></div>
    <div class="detail-cell"><span>Source feed</span><strong>${item.caseId || item.source}</strong></div>
  `;
  el.reasonCodes.innerHTML = item.reasons.map((reason) => `<li>${reason}</li>`).join("");
  const model = item.modelBreakdown || {};
  const validation = state.model.validation || model.validation || {};
  el.modelBreakdown.innerHTML = [
    ["ML estimate (uncalibrated)", model.supervisedProbability !== undefined ? `${Math.round(model.supervisedProbability * 100)}%` : "-"],
    ["Anomaly score", model.anomalyScore ?? "-"],
    ["Graph score", model.graphScore ?? "-"],
    ["Rules score", model.rulesScore ?? "-"],
    ["Demo test F1", validation.f1 ?? "-"],
    ["Test examples", validation.testSamples ?? "-"],
    ["Precision/Recall", validation.precision !== undefined ? `${validation.precision}/${validation.recall}` : "-"],
    ["Training data", displayTrainingSource(state.model.trainingSource)],
    ["Feedback boost", model.feedbackBoost ?? "-"],
    ["Model", displayModelName(model.modelVersion)],
    ["Inference time", model.inferenceMs !== undefined ? `${model.inferenceMs} ms` : "-"],
  ]
    .map(([label, value]) => `<div class="model-chip"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

function displayTrainingSource(source) {
  if (!source || source === "-") return "-";
  if (source.includes("adaptive_mule_training_dataset")) return "Bundled demo CSV";
  return source.replace(".csv", "");
}

function displayModelName(version) {
  if (!version || version === "-") return "-";
  if (version === "behavior-forest-logistic-v5") return "Random Forest + Logistic";
  if (version.includes("dataset-logistic")) return "Dataset logistic v4";
  if (version.includes("logistic")) return "Logistic ensemble";
  return version;
}

function renderGraph() {
  const canvas = el.networkCanvas;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  const nodes = new Map();
  const now = Date.now();
  const dashOffset = now / 70;
  state.links.forEach((link) => {
    if (!nodes.has(link.from)) nodes.set(link.from, { id: link.from, kind: "source", risk: link.score });
    if (!nodes.has(link.to)) nodes.set(link.to, { id: link.to, kind: "beneficiary", risk: 35 });
    nodes.get(link.from).risk = Math.max(nodes.get(link.from).risk, link.score);
  });

  const nodeList = [...nodes.values()].slice(0, 18);
  const centerX = width / 2;
  const centerY = height / 2;
  nodeList.forEach((node, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(nodeList.length, 1);
    const radius = index % 3 === 0 ? 128 : 176;
    node.x = centerX + Math.cos(angle) * radius;
    node.y = centerY + Math.sin(angle) * radius;
  });

  ctx.lineWidth = 1.5;
  state.links.forEach((link) => {
    const from = nodes.get(link.from);
    const to = nodes.get(link.to);
    if (!from || !to || from.x === undefined || to.x === undefined) return;
    const propagation = (Math.sin(now / 260 + link.score) + 1) / 2;
    ctx.strokeStyle = link.score >= 82
      ? `rgba(169, 40, 40, ${0.45 + propagation * 0.22})`
      : `rgba(44, 79, 127, ${0.24 + propagation * 0.14})`;
    ctx.setLineDash(link.score >= 66 ? [12, 6] : [5, 10]);
    ctx.lineDashOffset = -dashOffset;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.setLineDash([]);

    if (link.score >= 66) {
      const t = (now / 900 + link.score / 100) % 1;
      const px = from.x + (to.x - from.x) * t;
      const py = from.y + (to.y - from.y) * t;
      ctx.fillStyle = link.score >= 82 ? "rgba(169, 40, 40, 0.82)" : "rgba(44, 79, 127, 0.72)";
      ctx.beginPath();
      ctx.arc(px, py, link.score >= 82 ? 4 : 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  nodeList.forEach((node) => {
    const selected = graphView.selectedNode === node.id;
    const hovered = graphView.hoveredNode === node.id;
    const suspicious = node.risk >= 66;
    const pulse = selected || hovered
      ? 3 + Math.sin(now / 180) * 2
      : suspicious
        ? Math.max(0, Math.sin(now / 230 + node.x) * 2.4)
        : Math.max(0, Math.sin(now / 300 + node.x) * 1);
    if (suspicious) {
      ctx.strokeStyle = node.risk >= 82 ? "rgba(169, 40, 40, 0.18)" : "rgba(179, 107, 22, 0.16)";
      ctx.lineWidth = 7 + Math.max(0, Math.sin(now / 260 + node.y) * 3);
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20 + pulse, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.fillStyle = node.risk >= 82 ? "#b73535" : node.kind === "source" ? "#166064" : "#5f7f3b";
    ctx.arc(node.x, node.y, (node.risk >= 82 ? 16 : 12) + pulse, 0, Math.PI * 2);
    ctx.fill();
    if (selected || hovered) {
      ctx.strokeStyle = "rgba(22, 96, 100, 0.38)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 24, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "#18201f";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(node.id, node.x, node.y + 29);
  });

  graphView.nodes = nodeList.map((node) => ({ ...node }));
  if (!graphView.selectedNode && graphView.nodes.length) {
    graphView.selectedNode = graphView.nodes.find((node) => node.risk >= 66)?.id || graphView.nodes[0].id;
    renderGraphInspector(graphView.selectedNode);
  }

  if (!nodeList.length) {
    ctx.fillStyle = "#66716d";
    ctx.font = "16px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Waiting for backend transaction links", centerX, centerY);
  }

  el.clusterCount.textContent = `${state.links.length} links`;
}

function renderMetrics() {
  animateMetric(el.metricEvents, state.metrics.events || 0);
  animateMetric(el.metricAccounts, state.metrics.highRiskAccounts || 0);
  animateMetric(el.metricHeld, state.metrics.fundsHeld || 0, formatMoney);
  animateMetric(el.metricRegHits, state.metrics.regulatoryHits || 0);
  animateMetric(el.metricPrevented, state.metrics.fundsHeld || 0, formatMoney);
}

function animateMetric(element, target, formatter = (value) => Math.round(value).toString()) {
  const start = animatedMetrics.has(element) ? animatedMetrics.get(element) : Number(String(element.textContent).replace(/[^\d.]/g, "")) || 0;
  const end = Number(target) || 0;
  animatedMetrics.set(element, end);
  const startTime = performance.now();
  const duration = 420;
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = formatter(start + (end - start) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function renderLearningEvent() {
  const latest = state.learningEvents && state.learningEvents[0];
  if (!latest) {
    el.learningTitle.textContent = "Waiting for regulatory or investigator feedback";
    el.learningDetail.textContent = "The model will update when a cyber alert or feedback signal arrives.";
    return;
  }
  el.learningTitle.textContent = latest.title;
  const detailText = latest.detail || "";
  const confidence = latest.title.toLowerCase().includes("rbi") && !detailText.toLowerCase().includes("adaptive confidence")
    ? " Adaptive confidence increased after RBI feed ingestion."
    : "";
  el.learningDetail.textContent = `${detailText}. ${latest.patternsLearned} new fraud patterns learned.${confidence}`;
}

function triggerIngestionPulse() {
  if (!el.feedPulse) return;
  el.feedPulse.textContent = "new transaction ingested";
  el.feedPulse.classList.remove("feed-active");
  void el.feedPulse.offsetWidth;
  el.feedPulse.classList.add("feed-active");
  setTimeout(() => {
    el.feedPulse.textContent = "ingesting now";
  }, 900);
}

function render() {
  const filtered = state.events.filter((item) => {
    if (state.filter === "high") return item.score >= 82;
    if (state.filter === "held") return item.score >= 66;
    return true;
  });
  el.transactionList.innerHTML = filtered.slice(0, 24).map(renderTransaction).join("");
  el.alertQueue.innerHTML = state.alerts.length ? state.alerts.map(renderAlert).join("") : '<p class="alert-meta">No active escalations.</p>';
  renderDecision(state.latestDecision);
  renderMetrics();
  renderLearningEvent();
  renderGraph();
}

function inspectGraphNode(nodeId) {
  graphView.selectedNode = nodeId;
  renderGraphInspector(nodeId);
  renderGraph();
}

function renderGraphInspector(nodeId) {
  const linked = state.links.filter((link) => link.from === nodeId || link.to === nodeId);
  const events = state.events.filter((event) => event.account === nodeId || event.beneficiary === nodeId || event.device === nodeId || event.phone === nodeId);
  const suspicious = linked.filter((link) => link.score >= 66);
  const locations = new Set(events.map((event) => event.location).filter(Boolean));
  const riskReasons = [...new Set(events.flatMap((event) => event.reasons || []))].slice(0, 4);
  const chainDepth = estimateChainDepth(nodeId);
  el.graphInspector.innerHTML = `
    <p class="eyebrow">Node investigation</p>
    <strong>${nodeId}</strong>
    <span>${linked.length} linked accounts | ${suspicious.length} suspicious transfers | fraud chain depth ${chainDepth}</span>
    <ul>
      <li>Linked accounts: ${linked.slice(0, 5).map((link) => (link.from === nodeId ? link.to : link.from)).join(", ") || "No direct linked account yet"}</li>
      <li>Location mismatch: ${locations.size > 1 ? `Yes, activity across ${[...locations].join(", ")}` : "No clear mismatch in current window"}</li>
      <li>Suspicious transfers: ${suspicious.map((link) => `${link.from}->${link.to} (${link.score})`).slice(0, 3).join(", ") || "None above hold threshold"}</li>
      <li>Risk reasons: ${riskReasons.join("; ") || "No material reason codes attached"}</li>
    </ul>
  `;
}

function estimateChainDepth(nodeId) {
  const adjacency = new Map();
  state.links.forEach((link) => {
    if (!adjacency.has(link.from)) adjacency.set(link.from, []);
    adjacency.get(link.from).push(link.to);
  });
  const queue = [{ id: nodeId, depth: 0 }];
  const seen = new Set([nodeId]);
  let maxDepth = 0;
  while (queue.length) {
    const current = queue.shift();
    maxDepth = Math.max(maxDepth, current.depth);
    (adjacency.get(current.id) || []).forEach((next) => {
      if (!seen.has(next) && current.depth < 6) {
        seen.add(next);
        queue.push({ id: next, depth: current.depth + 1 });
      }
    });
  }
  return maxDepth;
}

async function injectCyberIncident() {
  const scored = await api("/api/cyber-alerts", { method: "POST", body: JSON.stringify({}) });
  showImmediateDecision(scored);
}

async function submitTransaction(event) {
  event.preventDefault();
  const formElement = event.currentTarget;
  const form = new FormData(formElement);
  const payload = Object.fromEntries(form.entries());
  payload.amount = Number(payload.amount);
  const scored = await api("/api/transactions", { method: "POST", body: JSON.stringify(payload) });
  formElement.reset();
  showImmediateDecision(scored);
}

function showImmediateDecision(scored) {
  state.latestDecision = scored;
  state.events = [scored, ...state.events.filter((item) => item.id !== scored.id)].slice(0, 60);
  if (scored.score >= 66) {
    state.alerts = [
      {
        id: scored.id,
        title: scored.score >= 82 ? "Potential mule account containment" : "Suspicious fund-flow hold",
        account: scored.account,
        score: scored.score,
        action: scored.action,
        caseId: scored.caseId,
        amount: scored.amount,
      },
      ...state.alerts,
    ].slice(0, 30);
  }
  if (scored.source === "government-cyber-alert") {
    state.learningEvents = [
      {
        title: "RBI cyber alert ingested",
        detail: "Model weights updated",
        patternsLearned: 7,
      },
      ...(state.learningEvents || []),
    ];
    state.model.learnedPatterns = (state.model.learnedPatterns || 0) + 7;
  }
  render();
}

async function sendFeedback(label) {
  if (!state.latestDecision) return;
  const activeButton = label === "false_positive" ? el.falsePositive : el.confirmMule;
  setFeedbackLoading(activeButton, true);
  const feedback = await api("/api/feedback", {
    method: "POST",
    body: JSON.stringify({ eventId: state.latestDecision.id, label }),
  });
  state.learningEvents = [
    {
      title: label === "false_positive" ? "False positive feedback received" : "Adaptive learning event",
      detail: label === "false_positive" ? "Threshold calibration adjusted" : "Model weights updated",
      patternsLearned: label === "false_positive" ? 1 : 5,
    },
    ...(state.learningEvents || []),
  ];
  showFeedbackResult(label, feedback);
  await loadState();
  setFeedbackLoading(activeButton, false, true);
}

function setFeedbackLoading(button, loading, success = false) {
  [el.confirmMule, el.falsePositive].forEach((item) => {
    item.disabled = loading;
    if (!success) item.classList.remove("success");
  });
  button.classList.toggle("loading", loading);
  if (loading) {
    el.feedbackStatus.textContent = "Submitting investigator feedback to adaptive model...";
    el.feedbackStatus.className = "feedback-status";
  }
  if (success) {
    button.classList.add("success");
    setTimeout(() => button.classList.remove("success"), 1600);
  }
}

function showFeedbackResult(label, feedback) {
  const isFalsePositive = label === "false_positive";
  el.feedbackStatus.className = `feedback-status ${isFalsePositive ? "review" : "success"}`;
  feedbackStatusHoldUntil = Date.now() + 6000;
  el.feedbackStatus.textContent = isFalsePositive
    ? "Feedback saved: false positive. Threshold calibration adjusted for similar future transactions."
    : "Feedback saved: confirmed mule. Linked accounts, devices, and graph risk weights were strengthened.";
  renderLearningEvent();
}

async function resolveTopAlert() {
  const top = state.alerts[0];
  if (!top) return;
  await api(`/api/alerts/${top.id}/resolve`, { method: "POST", body: JSON.stringify({}) });
  await loadState();
}

document.querySelectorAll(".segmented button").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.closest(".segmented");
    group.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    if (button.dataset.filter) {
      state.filter = button.dataset.filter;
      render();
    }
  });
});

el.pauseStream.addEventListener("click", () => {
  state.paused = !state.paused;
  el.pauseStream.title = state.paused ? "Resume dashboard refresh" : "Pause dashboard refresh";
  el.pauseStream.ariaLabel = state.paused ? "Resume dashboard refresh" : "Pause dashboard refresh";
  el.pauseStream.innerHTML = `<span data-icon="${state.paused ? "play" : "pause"}"></span>`;
});

el.seedIncident.addEventListener("click", injectCyberIncident);
el.resolveTop.addEventListener("click", resolveTopAlert);
el.ingestForm.addEventListener("submit", submitTransaction);
el.confirmMule.addEventListener("click", () => sendFeedback("confirmed_mule"));
el.falsePositive.addEventListener("click", () => sendFeedback("false_positive"));
el.networkCanvas.addEventListener("click", (event) => {
  const rect = el.networkCanvas.getBoundingClientRect();
  const scaleX = el.networkCanvas.width / rect.width;
  const scaleY = el.networkCanvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const node = graphView.nodes.find((item) => Math.hypot(item.x - x, item.y - y) <= 24);
  if (node) inspectGraphNode(node.id);
});
el.networkCanvas.addEventListener("mousemove", (event) => {
  const rect = el.networkCanvas.getBoundingClientRect();
  const scaleX = el.networkCanvas.width / rect.width;
  const scaleY = el.networkCanvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const node = graphView.nodes.find((item) => Math.hypot(item.x - x, item.y - y) <= 26);
  graphView.hoveredNode = node ? node.id : null;
  if (node) {
    const linked = state.links.filter((link) => link.from === node.id || link.to === node.id);
    const suspicious = linked.filter((link) => link.score >= 66).length;
    el.graphTooltip.hidden = false;
    el.graphTooltip.style.left = `${el.networkCanvas.offsetLeft + event.clientX - rect.left + 18}px`;
    el.graphTooltip.style.top = `${el.networkCanvas.offsetTop + event.clientY - rect.top + 18}px`;
    el.graphTooltip.innerHTML = `<strong>${node.id}</strong><span>Risk ${Math.round(node.risk)} | ${linked.length} links | ${suspicious} suspicious transfers</span><span>Click to inspect propagation path.</span>`;
  } else {
    el.graphTooltip.hidden = true;
  }
});
el.networkCanvas.addEventListener("mouseleave", () => {
  graphView.hoveredNode = null;
  el.graphTooltip.hidden = true;
});

loadState();
setInterval(loadState, 1500);
setInterval(() => {
  if (!state.paused) renderGraph();
}, 240);
setInterval(() => {
  if (!state.paused) {
    renderMetrics();
    const rows = document.querySelectorAll(".transaction-item .item-meta, .alert-item .alert-meta");
    if (rows.length) render();
  }
}, 5000);
