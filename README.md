# AgentFlow Enterprise 🚀

[![CI Pipeline](https://github.com/Ruchithak71/AgentFlow-Enterprise-v2/actions/workflows/ci.yml/badge.svg)](https://github.com/Ruchithak71/AgentFlow-Enterprise-v2/actions)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Python](https://img.shields.io/badge/Python-3.10-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

An asynchronous, polyglot microservice platform designed for enterprise **SAP S/4HANA Invoice Auditing** and **Dynamic Multi-Model AI Routing**.

It combines a high-throughput **Java 17 / Spring Boot 3** ingestion gateway, an event-driven **RabbitMQ** broker, an autonomous **Python 3.10 AI Worker** integrating with SAP BAPIs, **PostgreSQL 15** for ACID audit persistence, **Redis 7** for sub-millisecond result caching, and an interactive **React 18 + Vite + Tailwind CSS** dashboard.

---

## 🏛️ High-Level Architecture

```
                    ┌────────────────────────────────────────┐
                    │      React 18 + Vite Web Dashboard     │
                    │         (http://localhost:5173)        │
                    └───────────────────┬────────────────────┘
                                        │ REST / Ingestion / Polling
                                        ▼
                    ┌────────────────────────────────────────┐
                    │      Spring Boot Orchestrator Gateway  │
                    │         (http://localhost:8081)        │
                    └───┬───────────────────────────────┬────┘
                        │ Ingestion Insert              │ AMQP Jackson JSON
                        ▼                               ▼
        ┌───────────────────────────────┐     ┌──────────────────────────────────┐
        │        PostgreSQL 15          │     │        RabbitMQ Broker           │
        │  (Flyway Schema Migrations)   │     │ (Exchange: agentflow_exchange)   │
        └───────────────────────────────┘     └─────────────────┬────────────────┘
                                                                │
                                                                │ Fair Dispatch (prefetch=1)
                                                                ▼
                                              ┌──────────────────────────────────┐
                                              │      Python 3.10 AI Worker       │
                                              │  - S/4HANA BAPI Master Data      │
                                              │  - Tenacity Resilient Retries    │
                                              │  - Dynamic LLM Router:           │
                                              │    ├─ Gemini 2.0 Flash           │
                                              │    ├─ OpenAI GPT-4o              │
                                              │    ├─ Claude 3.5 Sonnet          │
                                              │    └─ SAP AI Core (PII Boundary) │
                                              └─────────────────┬────────────────┘
                                                                │ Cache Enriched Dossier (TTL 1h)
                                                                ▼
                                              ┌──────────────────────────────────┐
                                              │         Redis 7 Cache            │
                                              │         (Key: task:{id})         │
                                              └──────────────────────────────────┘
```

---

## ⚡ Key Highlights & Capabilities

- **Asynchronous Ingestion**: Ingestion requests (`POST /api/tasks`) persist directly to PostgreSQL with state `QUEUED` and publish to RabbitMQ in `<15ms`, returning an immediate `202 Accepted` correlation ID.
- **Fair Consumer Dispatch**: RabbitMQ consumer runs with `prefetch_count=1` to guarantee fair distribution across workers based on CPU availability, preventing thundering-herd issues.
- **Dead Letter Exchange (DLX)**: Poison pills or corrupt payloads trigger `basic_nack(requeue=False)` to route directly to `sap_ai_tasks_dlq` without blocking the pipeline.
- **Dynamic Multi-Model Router**:
  | Criteria | Target AI Provider | Role |
  |---|---|---|
  | `containsPII == true` | **SAP AI Core** | Zero-storage enterprise privacy boundary (GDPR/HIPAA) |
  | `invoiceAmount > $100,000` | **GPT-4o** | High-value forensic compliance audit |
  | `pageCount > 10` | **Claude 3.5 Sonnet** | Extended-context document analysis |
  | *Default* | **Gemini 2.0 Flash** | Ultra-fast, high-throughput automated audit |
- **Resilient AI Execution**: Backed by `tenacity` exponential backoff retries with graceful local engine fallbacks to guarantee uptime under API rate limits or network partitions.
- **Sub-Millisecond Polling**: Completed audit dossiers are cached in Redis under `task:{taskId}` with a 1-hour TTL (`ex=3600`), serving client polling (`GET /api/tasks/{taskId}`) in `<2ms` without putting read pressure on PostgreSQL.

---

## 🛠️ Tech Stack

| Tier | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, TypeScript, Tailwind CSS, Lucide Icons, Axios |
| **Gateway / Orchestrator** | Java 17, Spring Boot 3.2.3, Spring AMQP, Spring Data JPA, Flyway, Tomcat |
| **AI Worker** | Python 3.10, Pika (AMQP), Redis-py, Google GenAI SDK, OpenAI SDK, Tenacity |
| **Datastores & Broker** | PostgreSQL 15 Alpine, RabbitMQ 3.12 Alpine (Management), Redis 7 Alpine |
| **Containerization** | Docker, Docker Compose (Multi-stage builds, non-root users, health probes) |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/) running with WSL2 backend.
- [Node.js](https://nodejs.org/) v18+ and npm.

### 2. Configure Environment
Clone the repository and copy the example environment file:
```bash
git clone https://github.com/Ruchithak71/AgentFlow-Enterprise-v2.git
cd AgentFlow-Enterprise-v2
cp .env.example .env
```
*(Optional: add your `GEMINI_API_KEY` and `OPENAI_API_KEY` in `.env`. If left blank, the system automatically uses the internal local deterministic fallback engine!)*

### 3. Spin Up Backend Infrastructure
```bash
docker-compose up --build -d
```
Verify that all 5 microservices are healthy:
```bash
docker ps
```
- PostgreSQL: `localhost:5432`
- RabbitMQ AMQP: `localhost:5672` | Management UI: `http://localhost:15672` (guest/guest)
- Redis: `localhost:6379`
- Spring Boot Gateway: `http://localhost:8081` (Actuator: `http://localhost:8081/actuator/health`)

### 4. Start the Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🧪 End-to-End Testing via REST API

### 1. Submit an Invoice Task
```bash
curl -X POST http://localhost:8081/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "vendorId": "VEN-1001",
    "invoiceAmount": 4500.50,
    "pageCount": 2,
    "containsPII": false,
    "taskType": "INVOICE_AUDIT"
  }'
```
**Response (HTTP 202 Accepted):**
```json
{
  "status": "ACCEPTED",
  "taskId": "TASK-1788792166519",
  "message": "Task successfully queued and persisted in database."
}
```

### 2. Retrieve Completed Audit Dossier
```bash
curl http://localhost:8081/api/tasks/TASK-1788792166519
```
**Response (HTTP 200 OK from Redis):**
```json
{
  "status": "COMPLETED",
  "provider": "GEMINI_FLASH",
  "taskType": "INVOICE_AUDIT",
  "result": {
    "provider": "GEMINI_FLASH_LOCAL_ENGINE",
    "vendorId": "VEN-1001",
    "sapAccountStatus": "ACTIVE",
    "overallVendorRiskScore": 15.0,
    "riskCategory": "LOW_RISK",
    "audit_status": "APPROVED",
    "keyFindings": [
      "Invoice amount ($4500.5) checked against SAP limit ($500,000.00).",
      "SAP Account Status: ACTIVE.",
      "Standard automated line-item verification complete."
    ]
  }
}
```

---

## 📂 Project Directory Structure

```text
AgentFlow-Enterprise/
├── .github/workflows/ci.yml       # GitHub Actions CI Workflow
├── docker-compose.yml             # Full microservices fleet definition
├── .env.example                   # Sane default environment variables
├── .gitignore                     # Git hygiene configuration
├── java-orchestrator/             # Spring Boot 3 Ingestion Gateway
│   ├── Dockerfile                 # Multi-stage maven build
│   ├── pom.xml                    # Maven dependencies
│   └── src/main/
│       ├── java/com/agentflow/    # Controller, Services, Entities, Repositories, Config
│       └── resources/
│           ├── application.properties
│           └── db/migration/      # Flyway SQL migration scripts
├── python-ai-worker/              # Autonomous AI Consumer & Model Router
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── sap_bapi_client.py         # S/4HANA Master Data RFC/BAPI simulator
│   └── worker.py                  # Pika AMQP consumer & Tenacity retry router
└── frontend/                      # React 18 + Vite Single Page Application
    ├── src/
    │   ├── components/            # Audit modal, router visualizer, task table, form
    │   ├── api/client.ts          # Typed REST API client
    │   └── App.tsx                # Main dashboard view
    ├── vite.config.ts             # Reverse proxy configuration to Spring Boot
    └── package.json
```

---

## 📄 License
This project is licensed under the Apache 2.0 License.
