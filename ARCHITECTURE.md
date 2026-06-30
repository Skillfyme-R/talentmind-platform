# TalentMind AI — System Architecture

**Version:** 1.0  
**Company:** TalentMind Inc.  
**Product:** TalentMind Platform — Enterprise Talent Intelligence  

---

## 1. Overview

TalentMind AI is a cloud-native, multi-tenant SaaS platform that orchestrates Retrieval-Augmented Generation (RAG) pipelines, LangGraph-based agentic workflows, and vector-semantic search to automate and augment the enterprise talent acquisition lifecycle.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TalentMind Platform                          │
│                                                                     │
│  ┌──────────┐   ┌──────────────┐   ┌────────────────────────────┐  │
│  │  Next.js │   │  FastAPI     │   │   LangGraph Orchestrator   │  │
│  │  Web App │──▶│  REST API    │──▶│   (Multi-Agent Engine)     │  │
│  └──────────┘   └──────────────┘   └────────────────────────────┘  │
│                        │                        │                   │
│               ┌────────▼────────┐    ┌──────────▼──────────┐       │
│               │  Auth Service   │    │  RAG Pipeline        │       │
│               │  (SAML/OIDC)    │    │  (Embed + Retrieve) │       │
│               └─────────────────┘    └──────────┬──────────┘       │
│                                                 │                   │
│              ┌──────────────────────────────────▼─────────────┐    │
│              │             Vector Knowledge Base               │    │
│              │          Qdrant (primary) / Pinecone            │    │
│              └─────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌──────────────────┐  ┌────────────────┐  ┌────────────────────┐  │
│  │  PostgreSQL       │  │  Redis Cache   │  │  S3 Document Store │  │
│  │  (Metadata)       │  │  (Sessions)    │  │  (Raw Files)       │  │
│  └──────────────────┘  └────────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Components

### 2.1 Frontend — `talentmind-web`
- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + custom design tokens
- **UI Library:** MUI v9 (icon set)
- **Fonts:** Plus Jakarta Sans (display) + Inter (body)
- **Key pages:** Landing, Dashboard, Pipeline Builder, Candidate Review, Eval Reports, Admin

### 2.2 REST API — `talentmind-api`
- **Framework:** FastAPI (Python 3.12)
- **Auth:** JWT Bearer + SAML 2.0 / OIDC via python-saml / authlib
- **Rate limiting:** Redis-backed sliding window per tenant
- **Async runtime:** asyncio + httpx for LLM calls
- **Docs:** Auto-generated OpenAPI 3.1 at `/api/v1/docs`

### 2.3 LangGraph Orchestrator — `talentmind-orchestrator`
- **Engine:** LangGraph v0.2 (stateful graph execution)
- **State store:** Redis (short-lived workflow state) + PostgreSQL (audit trail)
- **Agent registry:** Pluggable agent classes loaded from `agents/` module
- **Tracing:** LangSmith (cloud) + OpenTelemetry → Jaeger (self-hosted)

### 2.4 RAG Pipeline — `talentmind-rag`
- **Document loaders:** PyMuPDF (PDFs), unstructured (DOCX/HTML), custom ATS connectors
- **Chunking:** Recursive character text splitter (512 tokens, 64 overlap)
- **Embeddings:** OpenAI `text-embedding-3-large` (default) / Cohere `embed-english-v3.0`
- **Vector store:** Qdrant (self-hosted via Helm) or Pinecone (cloud)
- **Retrieval:** Hybrid dense (cosine) + sparse (BM25) search, MMR re-ranking
- **Re-ranker:** Cohere Rerank v3 / BGE-Reranker-Large

### 2.5 Agent Registry

| Agent | Responsibility | LLM |
|-------|---------------|-----|
| `ResumeParserAgent` | Structured extraction from raw resume | Claude Sonnet 4.6 |
| `EmbeddingAgent` | Chunk + embed + upsert to vector store | — |
| `RAGRetrieverAgent` | Hybrid search + re-rank | — |
| `SkillsAssessmentAgent` | Skills graph matching + gap analysis | Claude Sonnet 4.6 |
| `CultureFitAgent` | Role-specific culture alignment scoring | Claude Haiku 4.5 |
| `RiskFlagAgent` | Red-flag detection (gaps, mismatches) | Claude Haiku 4.5 |
| `ScoringAggregatorAgent` | Weighted score fusion | — |
| `ExplainAgent` | Natural-language rationale generation | Claude Sonnet 4.6 |
| `AuditLogAgent` | Compliance log writer | — |
| `EvalHarnessAgent` | RAGAS-style metric computation | Claude Sonnet 4.6 |

### 2.6 Vector Knowledge Base

```
Collections (per tenant, namespace-isolated):
├── resumes          — candidate document embeddings
├── job_descriptions — JD embeddings (requirements, culture)
├── assessments      — structured assessment results
└── org_knowledge    — company-specific context (values, rubrics)
```

**Schema per vector:**
```json
{
  "id": "uuid",
  "vector": [1536-dim float32],
  "payload": {
    "tenant_id": "nexora-corp",
    "doc_type": "resume | jd | assessment",
    "candidate_id": "uuid",
    "chunk_index": 3,
    "source_file": "s3://talentmind-docs/...",
    "created_at": "2025-06-30T10:00:00Z"
  }
}
```

### 2.7 Evaluation Framework

- **Metrics:** RAG faithfulness, answer relevance, context precision, context recall (RAGAS)
- **Custom metrics:** Candidate match accuracy, explanation quality score, bias detection rate
- **Harness:** `EvalHarnessAgent` runs nightly batch evaluation + stores results in PostgreSQL
- **Dashboards:** Grafana + Prometheus metrics exported from every pipeline run
- **Human feedback:** Thumbs up/down on AI decisions → RL signal for fine-tuning queue

---

## 3. LangGraph Workflow State Machine

```
                    ┌─────────┐
                    │  START  │
                    └────┬────┘
                         │
              ┌──────────▼──────────┐
              │  ingest_documents   │  ← webhook / batch
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │  embed_and_index    │  ← async, fan-out
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │  retrieve_candidates│  ← hybrid search k=20
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │  rerank_shortlist   │  ← Cohere Rerank → top 8
              └──────────┬──────────┘
                         │
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
    ┌─────────────┐ ┌──────────┐ ┌──────────────┐
    │assess_skills│ │culture_  │ │  flag_risks  │
    │             │ │fit_check │ │              │
    └──────┬──────┘ └────┬─────┘ └──────┬───────┘
           └─────────────┼──────────────┘
                         │
              ┌──────────▼──────────┐
              │  aggregate_scores   │
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │  generate_explain   │
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │  write_audit_log    │
              └──────────┬──────────┘
                         │
                    ┌────▼────┐
                    │   END   │
                    └─────────┘
```

---

## 4. Infrastructure Architecture

### 4.1 Kubernetes (Production)

```
talentmind-prod namespace
├── Deployments
│   ├── talentmind-web          (2–10 replicas, HPA)
│   ├── talentmind-api          (3–20 replicas, HPA)
│   ├── talentmind-orchestrator (2–8 replicas, HPA)
│   ├── talentmind-worker       (4–16 replicas, KEDA)
│   └── qdrant                  (3-node StatefulSet)
├── Services
│   ├── talentmind-web-svc      (ClusterIP)
│   ├── talentmind-api-svc      (ClusterIP)
│   └── qdrant-svc              (ClusterIP)
├── Ingress
│   └── nginx-ingress           (TLS via cert-manager)
├── ConfigMaps & Secrets
│   └── talentmind-config, talentmind-secrets
└── PersistentVolumeClaims
    └── qdrant-data-pvc         (100Gi SSD per node)
```

### 4.2 Terraform Modules

```
infrastructure/
├── modules/
│   ├── talentmind-eks/        ← EKS cluster + node groups
│   ├── talentmind-rds/        ← PostgreSQL Aurora Serverless
│   ├── talentmind-elasticache/← Redis cluster
│   ├── talentmind-s3/         ← Document storage + lifecycle
│   ├── talentmind-iam/        ← Service accounts, IRSA
│   ├── talentmind-vpc/        ← VPC, subnets, NAT, SGs
│   └── talentmind-monitoring/ ← Prometheus, Grafana, Alertmanager
└── envs/
    ├── dev/
    ├── staging/
    └── prod/
```

### 4.3 CI/CD — GitHub Actions

```yaml
# .github/workflows/talentmind-ci.yml
Triggers: push to main, PR to main

Jobs:
  lint-and-type-check  → ESLint, mypy, ruff
  unit-tests           → pytest (API), jest (web)
  integration-tests    → docker-compose up → pytest -m integration
  build-images         → docker buildx, push to ECR
  eval-pipeline-check  → run eval harness on staging data
  deploy-staging       → helm upgrade talentmind-staging
  smoke-tests          → k6 load test + API contract tests
  deploy-prod          → helm upgrade talentmind-prod (manual approval gate)
```

---

## 5. Security Architecture

| Layer | Control |
|-------|---------|
| Auth | SAML 2.0 / OIDC SSO · JWT (15-min expiry) · Refresh tokens |
| Authz | RBAC (Admin, Recruiter, HiringManager, Viewer) · Tenant isolation |
| Transport | TLS 1.3 everywhere · HSTS preload |
| Data at rest | AES-256 (S3, RDS, EBS) · Qdrant collection-level encryption |
| Secrets | AWS Secrets Manager → Kubernetes ExternalSecrets |
| Network | Private subnets · SG allow-lists · No public RDS/Qdrant |
| Compliance | SOC 2 Type II · GDPR · EEOC audit logs |
| Observability | All LLM inputs/outputs logged (redacted PII) for audit |

---

## 6. Monitoring & Observability Stack

```
Metrics:   Prometheus → Grafana (dashboards: pipeline latency, RAG accuracy, agent errors)
Traces:    OpenTelemetry → Jaeger (distributed traces across API + orchestrator + agents)
LLM Ops:  LangSmith (LangGraph run tracking, eval results, token usage)
Logs:      Fluent Bit → AWS CloudWatch / OpenSearch
Alerts:    Alertmanager → PagerDuty (on-call rotation)
Uptime:    Checkly (synthetic monitoring, API contract tests every 5 min)
```

---

## 7. Data Flow — Candidate Ingestion

```
1. Recruiter uploads resume PDF
2. API → S3 raw upload
3. Webhook → talentmind-worker queue (Redis Streams)
4. Worker: ResumeParserAgent → structured JSON
5. Worker: EmbeddingAgent → 1536-dim vector
6. Upsert to Qdrant (tenant collection, candidate_id payload)
7. Metadata → PostgreSQL (candidate record, chunk offsets)
8. Event published → WebSocket → Dashboard "Indexed" notification
```

---

## 8. Multi-Tenancy Model

- **Isolation level:** Qdrant collection-per-tenant (hard namespace boundary)
- **Data plane:** All queries filtered by `tenant_id` at API and vector store layers
- **Auth plane:** JWT claims include `tenant_id`; middleware rejects cross-tenant access
- **Billing plane:** Per-tenant vector count + LLM token usage metered via usage events → Stripe

---

*Architecture version: 1.0 · Last updated: 2025-06-30 · Owner: TalentMind Engineering*
