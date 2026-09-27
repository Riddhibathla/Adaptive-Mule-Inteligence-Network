# How machine learning works in this project

The transaction backend trains and runs actual scikit-learn models. The bundled
CSV is a **40-row demonstration dataset**, not proof of accuracy on real bank data.
The consumer PAN/phone lookup remains a separate synthetic demonstration; it does
not use these models or retrieve actual bank records.

## Run and demonstrate

From the project directory, with Python 3.11 or newer:

```powershell
python -m pip install -r backend/requirements.txt
python backend/evaluate_model.py
python -m unittest discover -s backend/tests -v
python backend/server.py
```

Restart an already running server after installing the dependencies. Models fit
once at process startup, not on every API request. The seeded fit is deterministic
for the same dataset and library environment. No external service or paid API is
needed for training or inference. There is no automatic production deployment or
automatic retraining.

- Dashboard: <http://127.0.0.1:5173/>
- Machine-readable model card: <http://127.0.0.1:5173/api/model/report>
- Existing metadata endpoint: <http://127.0.0.1:5173/api/model>
- Offline evaluation artifact: `artifacts/model_report.json`

## What the models learn

| Component | Input and purpose | How it is used |
|---|---|---|
| Random Forest, 128 trees | Learns nonlinear combinations of transaction behavior from safe/fraud labels | 60% of the supervised estimate |
| Logistic Regression | Learns a regularized, scaled linear relationship between behavior and the label | 40% of the supervised estimate; also evaluated alone as a baseline |
| Isolation Forest, 100 trees | Learns typical behavior using only safe training examples | Produces an anomaly score; unusual does not necessarily mean fraudulent |
| Graph proximity | Connections to risky accounts, devices, phones, and cases | Explicit policy signal; this is not a trained graph neural network |
| Watchlists and feedback | Existing policy flags and investigator decisions | Explicit policy signals; feedback does not silently alter learned weights |

Seven behavioral features feed the learned models:

1. Transaction amount.
2. Amount divided by the account's historical average amount.
3. Account transaction count in the preceding hour.
4. Account transaction count in the preceding day.
5. Number of accounts observed on the same device, including the current account.
6. Whether the beneficiary is new to the account.
7. Whether this is a UPI transaction above 45,000.

Counts, amounts, and ratios use a fixed `log1p` transform. The logistic scaler is
fitted on training data only. Offline CSV rows and online transactions share the
same feature-building function. Account identifiers, label, recorded risk score,
investigator outcome, watchlists, cyber cases, graph risk, and feedback risk are
excluded from supervised and anomaly model inputs.

For live transactions, features are computed **before** the event is added to
history. A trusted upstream caller can supply `context` historical summaries.
This supports replay of the dataset and integrations with a bank feature store.
It must not be exposed as user-controlled evidence in a production banking API.
Without supplied context, the demo uses bounded in-memory history and an average
amount of 18,000 for new accounts. These cold-start defaults are a limitation.

## Evaluation judges can inspect

- Labels `mule` and `fraud` are positive; `safe` and `false_positive` are negative.
- Five `review` rows are excluded because review is not a confirmed fraud label.
- Labeled rows are ordered chronologically and initially split 60% / 20% / 20%.
- Earlier rows for sender accounts appearing in a later split are removed.
- No jittered copies or synthetic augmentation are added.
- Models and preprocessing fit only on training rows.
- The decision threshold is selected on validation F1, with ties closest to 0.5.
- The final test set is evaluated without changing weights or the threshold.
- The report includes precision, recall, F1, ROC-AUC, average precision, Brier score,
  false-positive rate, confusion counts, and a separately tuned logistic baseline.
- Dataset SHA-256, library version, fixed seed, split counts, and feature
  importances make a result traceable and reproducible.

The current split has only seven test examples. Even a perfect score on seven
examples would be weak evidence. Do not advertise it as real-world accuracy.
Shared devices/counterparties can cross splits, and the original historical
summaries cannot be independently verified. Larger, independently labeled data
and network-disjoint testing are required before deployment. The report measures
the supervised ensemble; it does not validate the complete policy engine.

The old Kaggle adapters have been removed from training: they inserted target
labels into model inputs and fabricated unavailable features. Credit-card and
PaySim data need separately designed feature-compatible pipelines before reuse.

## Why a transaction was flagged

`modelBreakdown` returns both component estimates, disagreement, anomaly score,
policy contributions, the decision threshold, final policy score, inference
duration, dataset fingerprint, and four leading feature explanations.

For each explanation, the backend replaces one feature with the median from safe
training rows, predicts again, and reports the change in model output. A positive
delta means the observed feature raised the estimate relative to that reference.
These are sensitivity explanations, **not SHAP values, causal effects, or additive
contributions**. Correlated features can make this comparison less meaningful.

The decision score is a documented policy blend:

```text
65% supervised estimate
+ 10% Isolation Forest anomaly score
+ 10% watchlist/case rules
+ 10% graph proximity
+  5% investigator feedback
```

Explicit watchlist/cyber-case policy floors may raise this score. Transactions
above the supervised threshold, near it, or with substantial model disagreement
are routed for review. Review decisions enter the alert queue even when the
policy score is below 66. The demo records recommendations; it does not freeze
accounts or transfer funds. Probabilities are not calibrated, and the combined
policy score is not a fraud probability.

## A reproducible demo request

Run this after starting the server:

```powershell
$demoTransaction = @{
  account = 'DEMO-SENDER'
  beneficiary = 'DEMO-RECEIVER'
  device = 'DEMO-DEVICE'
  phone = 'DEMO-PHONE'
  amount = 185000
  channel = 'UPI'
  caseId = $null
  context = @{
    averageAmount = 18000
    hourlyTxnCount = 8
    dailyTxnCount = 20
    sharedDeviceAccountCount = 6
    isNewBeneficiary = $true
  }
} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://127.0.0.1:5173/api/transactions' `
  -Method Post -ContentType 'application/json' -Body $demoTransaction
```

This demonstrates behavior-based detection without a watchlist match or cyber
case. Show its estimate, the explanations, and its review alert. Then open the
model report and explain the held-out evaluation and its small sample size.

Suggested pitch:

> We combine a Random Forest and Logistic Regression to screen transaction
> behavior, and use Isolation Forest to detect unusual patterns. Every decision
> includes feature-level evidence. We keep graph and regulatory policy signals
> separate from learned predictions, and evaluate on a chronological holdout.
> This prototype demonstrates the workflow; bank-scale validation is the next step.

## Technical references

- [Random Forest documentation](https://scikit-learn.org/1.8/modules/generated/sklearn.ensemble.RandomForestClassifier.html)
- [Isolation Forest documentation](https://scikit-learn.org/1.8/modules/generated/sklearn.ensemble.IsolationForest.html)
- [Preventing data leakage](https://scikit-learn.org/1.8/common_pitfalls.html)

The backend remains a local hackathon prototype: authentication, durable storage,
verified bank integrations, and production operational controls are not supplied
by this ML upgrade.
