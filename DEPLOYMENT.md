# TalentMind AI — Deployment Guide

**Version:** 1.0  
**Last Updated:** 2025-06-30

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | ≥ 20 LTS | Web app runtime |
| Python | ≥ 3.12 | API + orchestrator |
| Docker | ≥ 24 | Container builds |
| kubectl | ≥ 1.30 | Kubernetes management |
| helm | ≥ 3.15 | Chart deployment |
| terraform | ≥ 1.9 | Infrastructure provisioning |
| AWS CLI | ≥ 2.15 | Cloud operations |

---

## 1. Local Development

### 1.1 Clone and install

```bash
git clone https://github.com/talentmind-inc/talentmind-platform.git
cd talentmind-platform

# Web app
cd talentmind-web
npm install
cp .env.example .env.local
npm run dev                    # http://localhost:3000

# API + orchestrator
cd ../talentmind-api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload  # http://localhost:8000
```

### 1.2 Environment variables

**`talentmind-web/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/v1
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_LANGSMITH_PROJECT=talentmind-dev
```

**`talentmind-api/.env`**
```env
# ── App ──────────────────────────────────────────────────────────
TALENTMIND_ENV=development
TALENTMIND_SECRET_KEY=<generate: openssl rand -hex 32>
TALENTMIND_API_VERSION=v1
TALENTMIND_CORS_ORIGINS=http://localhost:3000

# ── Database ──────────────────────────────────────────────────────
TALENTMIND_DB_URL=postgresql+asyncpg://talentmind:password@localhost:5432/talentmind_dev
TALENTMIND_REDIS_URL=redis://localhost:6379/0

# ── Vector Store ─────────────────────────────────────────────────
TALENTMIND_QDRANT_URL=http://localhost:6333
TALENTMIND_QDRANT_API_KEY=                # empty for local
TALENTMIND_EMBEDDING_MODEL=text-embedding-3-large
TALENTMIND_EMBEDDING_DIMENSIONS=1536

# ── LLM Providers ────────────────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-...              # Claude models
OPENAI_API_KEY=sk-...                    # Embeddings
COHERE_API_KEY=...                       # Reranker

# ── LangSmith ────────────────────────────────────────────────────
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls__...
LANGCHAIN_PROJECT=talentmind-dev
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com

# ── Storage ──────────────────────────────────────────────────────
TALENTMIND_S3_BUCKET=talentmind-docs-dev
TALENTMIND_S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# ── Auth ─────────────────────────────────────────────────────────
TALENTMIND_JWT_ALGORITHM=RS256
TALENTMIND_JWT_EXPIRY_SECONDS=900
TALENTMIND_SAML_ENTITY_ID=https://app.talentmind.ai
```

### 1.3 Docker Compose (full stack locally)

```bash
docker compose -f docker-compose.dev.yml up -d
```

Services started:
- `talentmind-web` → port 3000
- `talentmind-api` → port 8000
- `talentmind-worker` → background
- `postgres` → port 5432
- `redis` → port 6379
- `qdrant` → port 6333 (HTTP) + 6334 (gRPC)

---

## 2. Docker Images

### 2.1 Build

```bash
# Web app
docker build \
  -f docker/Dockerfile.web \
  -t talentmind-web:$(git rev-parse --short HEAD) \
  ./talentmind-web

# API
docker build \
  -f docker/Dockerfile.api \
  -t talentmind-api:$(git rev-parse --short HEAD) \
  ./talentmind-api

# Worker (orchestrator + RAG pipeline)
docker build \
  -f docker/Dockerfile.worker \
  -t talentmind-worker:$(git rev-parse --short HEAD) \
  ./talentmind-orchestrator
```

### 2.2 Push to ECR

```bash
aws ecr get-login-password --region us-east-1 \
  | docker login --username AWS \
    --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/talentmind-web:$TAG
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/talentmind-api:$TAG
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/talentmind-worker:$TAG
```

---

## 3. Infrastructure Provisioning (Terraform)

### 3.1 Bootstrap

```bash
cd infrastructure/envs/prod

# Initialize remote state (S3 + DynamoDB lock)
terraform init \
  -backend-config="bucket=talentmind-terraform-state" \
  -backend-config="key=prod/terraform.tfstate" \
  -backend-config="region=us-east-1"

# Preview changes
terraform plan -var-file="prod.tfvars" -out=prod.tfplan

# Apply
terraform apply prod.tfplan
```

### 3.2 Key Terraform outputs

```bash
terraform output eks_cluster_endpoint      # EKS API endpoint
terraform output rds_endpoint              # PostgreSQL host
terraform output elasticache_endpoint      # Redis host
terraform output s3_document_bucket        # S3 bucket name
terraform output ecr_repository_urls       # ECR image URLs
```

### 3.3 Configure kubectl

```bash
aws eks update-kubeconfig \
  --region us-east-1 \
  --name talentmind-prod-cluster
```

---

## 4. Kubernetes Deployment (Helm)

### 4.1 Create secrets

```bash
kubectl create namespace talentmind-prod

kubectl create secret generic talentmind-secrets \
  --namespace talentmind-prod \
  --from-literal=ANTHROPIC_API_KEY="sk-ant-..." \
  --from-literal=OPENAI_API_KEY="sk-..." \
  --from-literal=COHERE_API_KEY="..." \
  --from-literal=TALENTMIND_SECRET_KEY="$(openssl rand -hex 32)" \
  --from-literal=LANGCHAIN_API_KEY="ls__..." \
  --from-literal=TALENTMIND_DB_URL="postgresql+asyncpg://..." \
  --from-literal=TALENTMIND_REDIS_URL="redis://..."
```

### 4.2 Deploy Qdrant (StatefulSet)

```bash
helm repo add qdrant https://qdrant.github.io/qdrant-helm
helm repo update

helm upgrade --install qdrant qdrant/qdrant \
  --namespace talentmind-prod \
  --values helm/qdrant-values.yaml \
  --set replicaCount=3 \
  --set persistence.size=100Gi \
  --set apiKey.enabled=true
```

### 4.3 Deploy TalentMind Platform

```bash
helm upgrade --install talentmind ./helm/talentmind \
  --namespace talentmind-prod \
  --values helm/values.prod.yaml \
  --set web.image.tag=$GIT_SHA \
  --set api.image.tag=$GIT_SHA \
  --set worker.image.tag=$GIT_SHA \
  --wait --timeout 10m
```

**`helm/values.prod.yaml` (key settings):**
```yaml
web:
  replicaCount: 3
  resources:
    requests: { cpu: "250m", memory: "512Mi" }
    limits:   { cpu: "1000m", memory: "1Gi" }
  autoscaling:
    enabled: true
    minReplicas: 3
    maxReplicas: 10
    targetCPUUtilizationPercentage: 70

api:
  replicaCount: 5
  autoscaling:
    enabled: true
    minReplicas: 5
    maxReplicas: 20

worker:
  replicaCount: 4
  autoscaling:
    enabled: true         # KEDA ScaledObject on Redis queue depth
    minReplicas: 4
    maxReplicas: 16

ingress:
  enabled: true
  className: nginx
  tls: true
  hosts:
    - host: app.talentmind.ai
      paths: [{ path: "/", service: talentmind-web }]
    - host: api.talentmind.ai
      paths: [{ path: "/v1", service: talentmind-api }]
```

### 4.4 Verify deployment

```bash
kubectl get pods -n talentmind-prod
kubectl rollout status deployment/talentmind-web -n talentmind-prod
kubectl rollout status deployment/talentmind-api -n talentmind-prod

# Smoke test
curl https://api.talentmind.ai/v1/health
# {"status": "healthy", "version": "1.0.0", "qdrant": "ok", "redis": "ok", "db": "ok"}
```

---

## 5. CI/CD Pipeline (GitHub Actions)

The full pipeline is defined in `.github/workflows/talentmind-ci.yml`.

### Workflow stages:

```
PR opened/updated:
  1. lint-and-type-check    (ESLint, mypy, ruff) — ~2 min
  2. unit-tests             (jest, pytest) — ~4 min
  3. integration-tests      (docker-compose + pytest -m integration) — ~8 min
  4. build-images           (docker buildx --platform linux/amd64) — ~6 min
  5. eval-pipeline-check    (run eval harness on 50-sample fixture) — ~5 min

Merge to main:
  6. push-images-to-ecr     (tag with git SHA)
  7. deploy-staging         (helm upgrade talentmind-staging --wait)
  8. smoke-tests-staging    (k6 script + API contract tests)
  9. [Manual approval gate] ← required for prod
  10. deploy-prod           (helm upgrade talentmind-prod --wait)
  11. post-deploy-verify    (checkly synthetic run)
```

### Required GitHub secrets:
```
AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
ANTHROPIC_API_KEY, OPENAI_API_KEY, COHERE_API_KEY
LANGCHAIN_API_KEY
KUBECONFIG_PROD, KUBECONFIG_STAGING
HELM_CHART_MUSEUM_TOKEN
SLACK_WEBHOOK_URL        (deploy notifications)
```

---

## 6. Database Migrations

```bash
# Run migrations (Alembic)
cd talentmind-api
alembic upgrade head

# Generate a new migration
alembic revision --autogenerate -m "add_candidate_embeddings_metadata_table"

# Rollback one step
alembic downgrade -1
```

---

## 7. Qdrant Collection Bootstrap

Run once per new tenant or on fresh environment:

```bash
python scripts/bootstrap_qdrant.py \
  --tenant-id nexora-corp \
  --qdrant-url https://qdrant.talentmind.ai \
  --embedding-dim 1536
```

This creates collections: `resumes`, `job_descriptions`, `assessments`, `org_knowledge` with optimized HNSW index settings.

---

## 8. Monitoring Setup

```bash
# Deploy Prometheus + Grafana stack
helm upgrade --install talentmind-monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --values helm/monitoring-values.yaml

# Import TalentMind Grafana dashboards
kubectl apply -f monitoring/grafana-dashboards/ -n monitoring
```

**Key Grafana dashboards:**
- `TalentMind — Pipeline Overview` (latency, throughput, error rates)
- `TalentMind — RAG Accuracy` (RAGAS metrics over time)
- `TalentMind — LLM Usage` (token counts, cost, latency per agent)
- `TalentMind — Vector Store` (Qdrant collection sizes, query latency)
- `TalentMind — Tenant Health` (per-tenant usage, SLA compliance)

---

## 9. Production Readiness Checklist

```
Infrastructure
  ☑ EKS cluster in 3 AZs with node group auto-scaling
  ☑ RDS Aurora PostgreSQL — Multi-AZ, automated backups (7-day retention)
  ☑ ElastiCache Redis — cluster mode, 3 shards
  ☑ Qdrant — 3-node StatefulSet, PVC 100Gi SSD per node
  ☑ S3 — versioning enabled, lifecycle rules, cross-region replication
  ☑ CloudFront CDN for web app
  ☑ WAF rules on ALB (OWASP Core Rule Set)

Security
  ☑ All secrets in AWS Secrets Manager (not in env files)
  ☑ TLS 1.3 enforced on all endpoints
  ☑ RBAC configured on Kubernetes
  ☑ Network policies restrict pod-to-pod traffic
  ☑ ECR image scanning on push
  ☑ SAST (Semgrep) in CI pipeline

Observability
  ☑ Prometheus scraping all services on /metrics
  ☑ OpenTelemetry traces to Jaeger
  ☑ Centralized logging (Fluent Bit → CloudWatch)
  ☑ LangSmith tracing enabled on all LangGraph runs
  ☑ PagerDuty alerts for SLA breach, error spike, queue depth

Compliance
  ☑ GDPR: right to erasure API implemented
  ☑ Audit logs immutable (CloudWatch with retention 365 days)
  ☑ SOC 2 controls mapped and documented
  ☑ EEOC-compliant decision audit trail per pipeline run
```

---

*Deployment version: 1.0 · Last updated: 2025-06-30 · Owner: TalentMind Platform Engineering*
