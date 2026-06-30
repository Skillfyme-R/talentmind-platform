# TalentMind AI — API Reference

**Base URL:** `https://api.talentmind.ai/v1`  
**Auth:** Bearer JWT (obtain via `/auth/token`)  
**Content-Type:** `application/json`  
**OpenAPI spec:** `https://api.talentmind.ai/v1/docs`

---

## Authentication

### POST `/auth/token`
Exchange credentials or SAML assertion for a JWT access token.

```json
// Request
{
  "grant_type": "password",
  "email": "recruiter@nexora-corp.com",
  "password": "••••••••"
}

// Response 200
{
  "access_token": "eyJhbGciOiJSUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 900,
  "refresh_token": "rt_...",
  "tenant_id": "nexora-corp",
  "roles": ["recruiter", "pipeline_run"]
}
```

### POST `/auth/refresh`
Rotate refresh token for a new access token.

### POST `/auth/saml/callback`
SAML 2.0 assertion callback — handled by IdP redirect flow.

---

## Candidates

### POST `/candidates/ingest`
Ingest one or more candidate documents (resume, LinkedIn export, GitHub profile).

```json
// Request (multipart/form-data)
{
  "files": ["resume.pdf", "linkedin.json"],
  "job_requisition_id": "req_abc123",
  "source": "upload | ats_webhook | linkedin"
}

// Response 202 Accepted
{
  "ingestion_id": "ing_xyz789",
  "status": "queued",
  "document_count": 2,
  "estimated_completion_ms": 4200,
  "webhook_url": "https://api.talentmind.ai/v1/ingestions/ing_xyz789"
}
```

### GET `/candidates`
List candidates in the tenant's knowledge base.

**Query params:** `job_id`, `status`, `score_min`, `limit` (default 20), `cursor`

```json
// Response 200
{
  "candidates": [
    {
      "id": "cand_001",
      "name": "Priya Subramaniam",
      "email": "priya@example.com",
      "vector_id": "vec_qdrant_001",
      "match_score": 94.2,
      "match_tag": "Top Match",
      "skills": ["Python", "LangChain", "PyTorch", "Kubernetes"],
      "indexed_at": "2025-06-30T09:15:00Z",
      "last_assessed_at": "2025-06-30T10:02:00Z"
    }
  ],
  "total": 142,
  "next_cursor": "cur_..."
}
```

### GET `/candidates/{candidate_id}`
Retrieve a single candidate with full profile, scores, and audit trail.

### DELETE `/candidates/{candidate_id}`
Remove candidate from the knowledge base (GDPR right to erasure).

---

## Job Requisitions

### POST `/requisitions`
Create a new job requisition and trigger embedding of the JD.

```json
// Request
{
  "title": "Senior ML Engineer",
  "department": "AI Platform",
  "location": "Remote — US",
  "job_description": "We are looking for...",
  "scoring_rubric": {
    "skills_weight": 0.45,
    "culture_weight": 0.30,
    "experience_weight": 0.25
  },
  "target_headcount": 3
}

// Response 201
{
  "requisition_id": "req_abc123",
  "status": "active",
  "jd_vector_id": "vec_jd_001",
  "created_at": "2025-06-30T08:00:00Z"
}
```

### GET `/requisitions/{req_id}/shortlist`
Return AI-ranked candidate shortlist for a requisition.

```json
// Response 200
{
  "requisition_id": "req_abc123",
  "shortlist": [
    {
      "rank": 1,
      "candidate_id": "cand_001",
      "name": "Priya Subramaniam",
      "composite_score": 94.2,
      "skills_score": 96.0,
      "culture_score": 91.5,
      "risk_flags": [],
      "explanation": "Priya demonstrates strong alignment with the Senior ML Engineer role...",
      "retrieved_chunks": 8,
      "retrieval_latency_ms": 124
    }
  ],
  "pipeline_run_id": "run_001",
  "generated_at": "2025-06-30T10:02:00Z"
}
```

---

## Pipeline Runs

### POST `/pipelines/run`
Trigger a full LangGraph pipeline run for a requisition.

```json
// Request
{
  "requisition_id": "req_abc123",
  "pipeline_config": {
    "retrieval_k": 20,
    "rerank_top_n": 8,
    "agents": ["skills", "culture", "risk", "explain"],
    "evaluation_enabled": true
  }
}

// Response 202 Accepted
{
  "run_id": "run_001",
  "status": "running",
  "langgraph_session_id": "lg_sess_abc",
  "estimated_duration_sec": 45,
  "progress_ws": "wss://api.talentmind.ai/v1/pipelines/run_001/progress"
}
```

### GET `/pipelines/{run_id}`
Get pipeline run status, intermediate state, and results.

```json
// Response 200
{
  "run_id": "run_001",
  "status": "completed",
  "langgraph_state": {
    "current_node": "END",
    "completed_nodes": ["ingest", "embed", "retrieve", "rerank", "assess_skills", "culture_fit", "flag_risks", "aggregate", "explain", "audit_log"],
    "duration_ms": 38420
  },
  "metrics": {
    "candidates_retrieved": 20,
    "candidates_shortlisted": 8,
    "avg_retrieval_latency_ms": 118,
    "total_llm_tokens": 24680,
    "ragas_faithfulness": 0.94,
    "ragas_answer_relevance": 0.91
  }
}
```

### GET `/pipelines/{run_id}/trace`
Retrieve LangSmith trace URL and OpenTelemetry span data for the run.

---

## Evaluation

### POST `/eval/run`
Run evaluation harness against a pipeline run.

```json
// Request
{
  "pipeline_run_id": "run_001",
  "eval_set": "production_sample_50",
  "metrics": ["faithfulness", "answer_relevance", "context_precision", "match_accuracy"]
}

// Response 202 Accepted
{
  "eval_id": "eval_001",
  "status": "running",
  "estimated_duration_sec": 180
}
```

### GET `/eval/{eval_id}/results`
Retrieve evaluation metrics and per-candidate scores.

```json
// Response 200
{
  "eval_id": "eval_001",
  "pipeline_run_id": "run_001",
  "status": "completed",
  "summary": {
    "ragas_faithfulness": 0.942,
    "ragas_answer_relevance": 0.913,
    "ragas_context_precision": 0.887,
    "candidate_match_accuracy": 0.938,
    "bias_detection_rate": 0.012,
    "explanation_quality_score": 0.901
  },
  "completed_at": "2025-06-30T10:05:00Z"
}
```

---

## Knowledge Base

### GET `/knowledge-base/stats`
Return vector store statistics for the tenant.

```json
// Response 200
{
  "tenant_id": "nexora-corp",
  "collections": {
    "resumes": { "vector_count": 48230, "disk_mb": 742 },
    "job_descriptions": { "vector_count": 312, "disk_mb": 8 },
    "assessments": { "vector_count": 1840, "disk_mb": 28 },
    "org_knowledge": { "vector_count": 580, "disk_mb": 12 }
  },
  "total_vectors": 50962,
  "embedding_model": "text-embedding-3-large",
  "embedding_dimensions": 1536
}
```

### POST `/knowledge-base/search`
Direct semantic search over the knowledge base (for debugging / BI).

```json
// Request
{
  "query": "senior Python engineer with LangChain and Kubernetes experience",
  "collection": "resumes",
  "top_k": 5,
  "hybrid": true,
  "rerank": true
}
```

---

## Webhooks

### POST `/webhooks`
Register a webhook for pipeline and ingestion events.

```json
// Request
{
  "url": "https://your-app.com/talentmind-events",
  "events": ["ingestion.completed", "pipeline.completed", "eval.completed"],
  "secret": "whsec_..."
}
```

**Event payload schema:**
```json
{
  "event": "pipeline.completed",
  "run_id": "run_001",
  "tenant_id": "nexora-corp",
  "timestamp": "2025-06-30T10:02:00Z",
  "data": { /* run result object */ }
}
```

Payloads are signed with HMAC-SHA256 using your webhook secret (header: `X-TalentMind-Signature`).

---

## Error Responses

All errors follow RFC 7807 Problem Details:

```json
{
  "type": "https://api.talentmind.ai/errors/insufficient-vectors",
  "title": "Insufficient indexed vectors",
  "status": 422,
  "detail": "The requisition requires at least 10 candidate vectors. Currently 3 indexed for job_id req_abc123.",
  "instance": "/v1/pipelines/run",
  "trace_id": "otel_trace_abc123"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request — validation error |
| 401 | Unauthenticated — missing or expired JWT |
| 403 | Forbidden — insufficient role or cross-tenant access |
| 404 | Resource not found |
| 422 | Unprocessable — semantic validation failed |
| 429 | Rate limited — retry after `Retry-After` header |
| 500 | Internal server error — trace ID included |
| 503 | LLM provider unavailable — retry with backoff |

---

## Rate Limits

| Plan | API calls/min | Pipeline runs/hour | Vectors indexed/day |
|------|--------------|-------------------|-------------------|
| Starter | 60 | 10 | 1,000 |
| Growth | 600 | 100 | 50,000 |
| Enterprise | Unlimited | Unlimited | Unlimited |

---

*API version: v1 · Last updated: 2025-06-30 · Changelog: `https://api.talentmind.ai/changelog`*
