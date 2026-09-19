# RevAgent — Autonomous AI Revenue Recovery Engine

RevAgent is an intelligent, automated revenue recovery agent built for Razorpay merchants. It converts payment drop-offs into completed orders by combining real-time failure diagnostics, localized Generative AI messaging, deterministic financial guardrails, and automated Razorpay checkout links.

---

# Key Features & Architecture

## Real-Time Failure Diagnostics (`DIAGNOSTICS`)

Captures Razorpay webhook events to analyze drop-off causes (e.g., `INSUFFICIENT_FUNDS`, `AUTHENTICATION_FAILED`, `PAYMENT_TIMED_OUT`).

## Generative AI Messaging (`LLM_PLANNING`)

Dynamically determines optimal outreach channels (WhatsApp/SMS), calculates context-aware discounts, and drafts localized Hinglish messages under 140 characters.

## Deterministic Guardrails (`GUARDRAIL_EVALUATION`)

Enforces strict merchant profitability limits, retry caps, and margin protection rules before dispatching incentives.

## Automated Checkout Links (`RAZORPAY_LINK_CREATED`)

Interacts directly with the Razorpay Payment Links API to generate unique checkout links tied to customer sessions.

## Multi-Channel Dispatch (`MESSAGE_DISPATCHED`)

Instantly sends recovery links via WhatsApp or SMS.

## 5-Step Explainable Audit Trace

Offers full transparency for finance teams by logging every diagnostic step, AI prompt decision, and API action in structured database records.

---

# Tech Stack

## Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite

## Frontend

* Next.js
* React
* Tailwind CSS

## Integrations

* Razorpay Payment Links API
* OpenAI API

---

# Project Objectives

* **Automate Recovery:** Trigger immediate, hands-free outreach upon payment failure events.
* **Contextual Interventions:** Move away from generic SMS spam by using dynamic, personalized messaging tailored to Indian e-commerce buyers.
* **Margin Safety:** Prevent AI hallucinations from exceeding merchant profit boundaries using strict code-level guardrails.
* **Auditability:** Provide complete visual and database traceability for every financial action taken by the agent.

---

# Build Challenges & Engineering Solutions

## 1. Asynchronous Database Session Management

### Challenge

Delegating tasks to FastAPI’s `BackgroundTasks` caused SQLAlchemy sessions to close before background threads finished, resulting in `DetachedInstanceError` exceptions during `AuditLog` commits.

### Solution

Scoped isolated thread-local database sessions (`SessionLocal()`) specifically to background lifecycles and optimized critical workflow paths for real-time frontend responsiveness.

---

## 2. Guardrails Against Financial Drift

### Challenge

Risk of LLM models hallucinating unauthorized discounts or executing high-risk retry attempts.

### Solution

Separated reasoning from execution. The LLM acts purely as an advisor (`LLM_PLANNING`), while output is validated through a deterministic Safety Guardrail Engine (`GUARDRAIL_EVALUATION`) that caps discounts and limits retries.

---

## 3. Service Interface Standardization

### Challenge

Class method mismatches across service modules (`RecoveryAgent`, `RazorpayService`, `MessagingService`) caused silent execution drops in `try...except` blocks.

### Solution

Standardized all service module interfaces using `@classmethod` and `@staticmethod` decorators and introduced fallback logic across API integrations to ensure unbroken 5-step audit traces.

---

# Getting Started

## Prerequisites

* Python 3.10+
* Node.js 18+

---

# 1. Backend Setup

## Navigate to Backend

```bash
cd backend
```

## Create and Activate Virtual Environment

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Run the Backend Server

```bash
uvicorn app.main:app --reload
```

Backend runs locally at:

```text
http://127.0.0.1:8000
```

---

# 2. Frontend Setup

## Navigate to Frontend

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

## Run the Development Server

```bash
npm run dev
```

Frontend runs locally at:

```text
http://localhost:3000
```

---

# Demonstration Workflow

## Open the Application

Open:

```text
http://localhost:3000
```

in your browser.

## Simulate Batch

Click **"Simulate Batch"** to generate realistic payment failure events.

## Run Agent

Click **"Run Agent"** on any failed transaction.

## Audit Trace

Click **"Audit Trace"** to view the full 5-step execution log from initial diagnostics to message dispatch.
