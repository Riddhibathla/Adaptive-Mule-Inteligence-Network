const loginStep = document.querySelector("#loginStep");
const twoFactorStep = document.querySelector("#twoFactorStep");
const loginStatus = document.querySelector("#loginStatus");
const twoFactorStatus = document.querySelector("#twoFactorStatus");
const demoCodeHint = document.querySelector("#demoCodeHint");
let challengeId = null;

async function request(path, body) {
  const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Unable to complete the request.");
  return data;
}

function setStatus(node, message, error = false) {
  node.textContent = message;
  node.classList.toggle("error", error);
}

document.querySelector("#passwordToggle").addEventListener("click", (event) => {
  const input = document.querySelector("#passphrase");
  const visible = input.type === "text";
  input.type = visible ? "password" : "text";
  event.currentTarget.textContent = visible ? "Show" : "Hide";
  event.currentTarget.setAttribute("aria-label", visible ? "Show passphrase" : "Hide passphrase");
});

document.querySelector("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  setStatus(loginStatus, "Checking access credentials…");
  try {
    const data = await request("/api/auth/login", Object.fromEntries(form));
    challengeId = data.challengeId;
    loginStep.hidden = true;
    twoFactorStep.hidden = false;
    if (data.demoCode) {
      demoCodeHint.hidden = false;
      demoCodeHint.textContent = `Hackathon demo code: ${data.demoCode}`;
    }
    document.querySelector("#verificationCode").focus();
  } catch (error) {
    setStatus(loginStatus, error.message, true);
  }
});

document.querySelector("#twoFactorForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const code = document.querySelector("#verificationCode").value.replace(/\D/g, "");
  if (code.length !== 6) return setStatus(twoFactorStatus, "Enter all six digits of your verification code.", true);
  setStatus(twoFactorStatus, "Verifying secure access…");
  try {
    await request("/api/auth/verify", { challengeId, code });
    window.location.assign("/dashboard");
  } catch (error) {
    setStatus(twoFactorStatus, error.message, true);
  }
});

document.querySelector("#verificationCode").addEventListener("input", (event) => { event.target.value = event.target.value.replace(/\D/g, "").slice(0, 6); });
document.querySelector("#backToLogin").addEventListener("click", () => { challengeId = null; twoFactorStep.hidden = true; loginStep.hidden = false; demoCodeHint.hidden = true; setStatus(twoFactorStatus, ""); });

fetch("/api/auth/session").then((response) => response.json()).then((data) => { if (data.authenticated) window.location.replace("/dashboard"); }).catch(() => {});
