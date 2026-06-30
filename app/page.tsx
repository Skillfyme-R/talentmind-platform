"use client";

import { useState } from "react";
import {
  Brain,
  Network,
  Zap,
  BarChart3,
  ShieldCheck,
  Cloud,
  ArrowRight,
  Check,
  X,
  CheckCircle2,
  Play,
  BookOpen,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  Monitor,
  FileText,
} from "lucide-react";
import Navbar from "./components/Navbar";

/* ─────────────────────────────────────────────────────────────────────
   Modal types
───────────────────────────────────────────────────────────────────── */
type ModalType =
  | "demo"
  | "trial"
  | "contact-sales"
  | "watch-video"
  | "docs"
  | "sign-in"
  | null;

/* ─────────────────────────────────────────────────────────────────────
   Root page — manages all modal state
───────────────────────────────────────────────────────────────────── */
export default function Home() {
  const [modal, setModal] = useState<ModalType>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const open = (m: ModalType) => setModal(m);
  const close = () => setModal(null);

  return (
    <>
      <Navbar
        onSignIn={() => open("sign-in")}
        onDemo={() => open("demo")}
        user={user}
        onSignOut={() => setUser(null)}
      />

      <HeroSection onDemo={() => open("demo")} onVideo={() => open("watch-video")} />
      <TrustedBySection />
      <StatsSection />
      <FeaturesSection id="platform" />
      <HowItWorksSection id="how-it-works" onDocs={() => open("docs")} />
      <UseCasesSection id="use-cases" />
      <TestimonialsSection />
      <PricingSection
        id="pricing"
        onTrial={() => open("trial")}
        onDemo={() => open("demo")}
        onSales={() => open("contact-sales")}
      />
      <CtaBannerSection onDemo={() => open("demo")} onExplore={() => open("docs")} />
      <FooterSection />

      {/* ── MODALS ── */}
      {modal === "demo" && <DemoModal onClose={close} />}
      {modal === "trial" && <TrialModal onClose={close} />}
      {modal === "contact-sales" && <SalesModal onClose={close} />}
      {modal === "watch-video" && <VideoModal onClose={close} />}
      {modal === "docs" && <DocsModal onClose={close} />}
      {modal === "sign-in" && (
        <SignInModal
          onClose={close}
          onSuccess={(name, email) => { setUser({ name, email }); close(); }}
        />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════════ */
function HeroSection({ onDemo, onVideo }: { onDemo: () => void; onVideo: () => void }) {
  return (
    <section className="relative w-full overflow-hidden pt-28 pb-20 gradient-hero-bg">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-violet-200/25 blur-3xl" />
        <div className="absolute top-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-200/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] rounded-full bg-indigo-100/30 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 max-w-[600px]">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-700 tracking-wide">
                Now with LangGraph v0.2 · Multi-Agent Orchestration
              </span>
            </div>

            <h1 className="font-display text-[52px] font-extrabold leading-[1.1] tracking-tight text-[#1e1b4b]">
              Hire Smarter with{" "}
              <span className="gradient-text-brand">Agentic AI</span>{" "}
              Talent Intelligence
            </h1>

            <p className="mt-5 text-[17px] leading-relaxed text-[#4b5563] max-w-[520px]">
              TalentMind AI orchestrates{" "}
              <strong className="text-[#4338ca] font-semibold">RAG pipelines</strong>,{" "}
              <strong className="text-[#4338ca] font-semibold">LangGraph workflows</strong>, and{" "}
              <strong className="text-[#4338ca] font-semibold">semantic vector search</strong> to
              surface the right talent — with full explainability, compliance, and enterprise-grade
              observability built in.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              {[
                "RAG-powered matching",
                "Multi-agent assessments",
                "Vector knowledge base",
                "LangGraph orchestration",
                "Real-time eval metrics",
              ].map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-indigo-100 text-indigo-800 shadow-sm"
                >
                  <Check size={11} strokeWidth={2.5} className="text-indigo-500" />
                  {f}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-10">
              <button onClick={onDemo} className="btn-primary">
                Request a Demo
                <ArrowRight size={16} />
              </button>
              <button onClick={onVideo} className="btn-outline">
                <Play size={15} className="text-indigo-600" />
                Watch 8-min Video
              </button>
            </div>

            <p className="mt-5 text-xs text-[#9ca3af]">
              Trusted by <strong className="text-[#6b7280]">500+ enterprises</strong> · SOC 2 Type II · GDPR Ready
            </p>
          </div>

          <div className="flex-1 flex justify-center items-center relative w-full max-w-[540px]">
            <div className="absolute w-[460px] h-[460px] rounded-full border border-indigo-200/50 animate-float" style={{ animationDuration: "8s" }} />
            <div className="absolute w-[380px] h-[380px] rounded-full border border-violet-200/40 animate-float" style={{ animationDuration: "6s", animationDelay: "1s" }} />
            <PlatformMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function PlatformMockup() {
  return (
    <div className="relative z-10 w-full max-w-[480px] tm-card p-5 shadow-2xl glow-indigo animate-float" style={{ animationDuration: "7s" }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-3 h-3 rounded-full bg-red-400" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-400" />
        <div className="ml-3 h-5 flex-1 rounded bg-indigo-50 flex items-center px-3">
          <span className="text-[9px] text-indigo-400 font-mono">app.talentmind.ai / pipeline / evaluate</span>
        </div>
      </div>

      <div className="bg-[#0f0e2e] rounded-xl p-4 mb-4 font-mono text-[11px] leading-relaxed">
        <div className="text-emerald-400">▶ TalentMind Orchestrator  <span className="text-indigo-300">v2.4.1</span></div>
        <div className="text-slate-400 mt-1">├─ <span className="text-violet-300">ResumeParser</span>   ✓ 142 docs ingested</div>
        <div className="text-slate-400">├─ <span className="text-violet-300">EmbeddingAgent</span>  ✓ vectors indexed</div>
        <div className="text-slate-400">├─ <span className="text-violet-300">RAGRetriever</span>    ✓ k=8 retrieved</div>
        <div className="text-slate-400">├─ <span className="text-violet-300">ScoringAgent</span>    <span className="text-yellow-400">⟳ running…</span></div>
        <div className="text-slate-500">└─ <span className="text-slate-500">ExplainAgent</span>    ⏳ queued</div>
        <div className="mt-2 text-slate-500 text-[10px]">LangGraph state: <span className="text-cyan-400">evaluate_candidate</span></div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { name: "Priya S.", score: 94, tag: "Top Match", color: "#10b981" },
          { name: "Marcus T.", score: 87, tag: "Strong Fit", color: "#6366f1" },
          { name: "Aiko W.", score: 81, tag: "Potential", color: "#8b5cf6" },
        ].map((c) => (
          <div key={c.name} className="bg-[#f8f7ff] rounded-lg p-2.5 border border-indigo-50">
            <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white text-[10px] font-bold mb-1.5">
              {c.name[0]}
            </div>
            <div className="text-[10px] font-semibold text-[#1e1b4b]">{c.name}</div>
            <div className="text-[18px] font-extrabold mt-0.5" style={{ color: c.color }}>{c.score}</div>
            <div className="text-[8px] font-medium px-1.5 py-0.5 rounded-full mt-1 inline-block" style={{ background: `${c.color}18`, color: c.color }}>{c.tag}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-indigo-50 rounded-lg px-3 py-2">
        <VectorIcon />
        <div className="flex-1">
          <div className="text-[10px] font-semibold text-indigo-800">Vector knowledge base</div>
          <div className="text-[9px] text-indigo-500">142 resumes · 38 JDs · 12 assessments indexed</div>
        </div>
        <div className="text-[10px] font-bold text-emerald-500">Live</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TRUSTED BY
═══════════════════════════════════════════════════════════════════ */
function TrustedBySection() {
  const logos = [
    "Nexora Corp", "Blueshift Labs", "Quantify AI", "Vanta Systems",
    "PolarEdge", "Stratos HR", "Meridian Global",
  ];
  return (
    <div className="bg-white border-y border-indigo-50 py-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#9ca3af] mb-6">
          Trusted by forward-thinking talent teams at
        </p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {logos.map((name) => (
            <span key={name} className="text-[15px] font-bold text-[#c4c4d8] tracking-tight select-none">
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STATS
═══════════════════════════════════════════════════════════════════ */
function StatsSection() {
  const stats = [
    { value: "94%", label: "Candidate match accuracy", sub: "vs 61% industry avg" },
    { value: "3.2×", label: "Faster time-to-hire", sub: "median across customers" },
    { value: "500M+", label: "Candidate vectors indexed", sub: "across all tenants" },
    { value: "99.97%", label: "Platform uptime SLA", sub: "enterprise guarantee" },
  ];
  return (
    <section className="bg-[#f8f7ff] py-16">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.value} className="tm-card p-6 text-center">
              <div className="font-display text-[36px] font-extrabold gradient-text-brand leading-none">{s.value}</div>
              <div className="mt-2 text-sm font-semibold text-[#1e1b4b]">{s.label}</div>
              <div className="mt-1 text-xs text-[#9ca3af]">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PLATFORM FEATURES — Lucide icons
═══════════════════════════════════════════════════════════════════ */
const features = [
  {
    Icon: Brain,
    color: "#4338ca",
    bg: "#eef2ff",
    title: "RAG-Powered Talent Retrieval",
    desc: "Ingest resumes, job descriptions, and assessment reports into a high-performance vector knowledge base. Our retrieval engine surfaces the most semantically relevant candidates using hybrid dense + sparse search.",
    tags: ["Pinecone / Qdrant", "LangChain Retrievers", "BM25 + cosine"],
  },
  {
    Icon: Network,
    color: "#7c3aed",
    bg: "#f5f3ff",
    title: "Multi-Agent Candidate Assessment",
    desc: "LangGraph-orchestrated agent pipelines autonomously parse, embed, score, and explain every candidate — with configurable criteria, custom rubrics, and full audit trails for compliance.",
    tags: ["LangGraph workflows", "Tool calling", "Structured outputs"],
  },
  {
    Icon: Zap,
    color: "#d97706",
    bg: "#fffbeb",
    title: "Real-Time Embedding Pipeline",
    desc: "Streaming document ingestion with incremental vector updates. Supports PDFs, LinkedIn exports, GitHub profiles, and ATS integrations via webhook or batch ingest API.",
    tags: ["OpenAI / Cohere embeddings", "Async ingestion", "Webhook triggers"],
  },
  {
    Icon: BarChart3,
    color: "#059669",
    bg: "#ecfdf5",
    title: "Evaluation & Observability Framework",
    desc: "Every AI decision is measured. Built-in RAGAS-style evaluation metrics, LangSmith tracing, custom eval harnesses, and real-time Grafana dashboards — no blind spots in your pipeline.",
    tags: ["RAGAS metrics", "LangSmith tracing", "Prometheus + Grafana"],
  },
  {
    Icon: ShieldCheck,
    color: "#0369a1",
    bg: "#f0f9ff",
    title: "Enterprise Auth & Multi-Tenancy",
    desc: "SSO via SAML 2.0 / OIDC, RBAC with org-level scoping, tenant isolation at the vector collection layer, and full audit logging. SOC 2 Type II certified.",
    tags: ["SAML 2.0 / OIDC", "RBAC", "Tenant isolation"],
  },
  {
    Icon: Cloud,
    color: "#6366f1",
    bg: "#eef2ff",
    title: "Cloud-Native Deployment",
    desc: "Helm charts, Terraform modules, and GitHub Actions CI/CD pipelines ship with the platform. Deploy to AWS, GCP, or Azure. Horizontal scaling via Kubernetes HPA.",
    tags: ["Kubernetes / Helm", "Terraform IaC", "Multi-cloud"],
  },
];

function FeaturesSection({ id }: { id: string }) {
  return (
    <section id={id} className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          eyebrow="Platform Capabilities"
          title="Enterprise AI Engineering — End to End"
          sub="Every component of the talent intelligence stack, built on production-grade AI primitives."
        />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ Icon, color, bg, title, desc, tags }: typeof features[0]) {
  return (
    <div className="tm-card p-7 flex flex-col gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: bg }}
      >
        <Icon size={22} color={color} strokeWidth={1.8} />
      </div>
      <h3 className="font-display font-bold text-[17px] text-[#1e1b4b] leading-snug">{title}</h3>
      <p className="text-sm text-[#6b7280] leading-relaxed flex-1">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HOW IT WORKS
═══════════════════════════════════════════════════════════════════ */
const workflowSteps = [
  {
    step: "01", title: "Ingest & Embed",
    desc: "Upload JDs, resumes, or connect your ATS. The embedding pipeline chunks, cleans, and vectorizes every document in real time.",
    detail: "ResumeParserAgent → EmbeddingAgent → VectorStore (Qdrant)",
    color: "#6366f1",
  },
  {
    step: "02", title: "Retrieve & Re-rank",
    desc: "When a job opens, the RAG retriever runs hybrid semantic search across the vector knowledge base and re-ranks by role-specific criteria.",
    detail: "RAGRetrieverAgent → HybridRanker → CandidateShortlist",
    color: "#8b5cf6",
  },
  {
    step: "03", title: "Multi-Agent Assessment",
    desc: "LangGraph orchestrates a chain of specialized agents — skills extractor, culture-fit scorer, red-flag detector — producing structured verdicts.",
    detail: "SkillsAgent + CultureAgent + FlagAgent → ScoringAgent",
    color: "#7c3aed",
  },
  {
    step: "04", title: "Explain & Audit",
    desc: "The ExplainAgent generates natural-language rationales for every decision. Full audit logs are written for compliance and EEOC review.",
    detail: "ExplainAgent → AuditLogger → ComplianceReport",
    color: "#4338ca",
  },
  {
    step: "05", title: "Evaluate & Improve",
    desc: "Continuous evaluation with RAGAS-style metrics, human feedback loops, and A/B testing of retrieval strategies.",
    detail: "EvalHarness → MetricsStore → FeedbackLoop",
    color: "#3730a3",
  },
];

function HowItWorksSection({ id, onDocs }: { id: string; onDocs: () => void }) {
  return (
    <section id={id} className="py-24 bg-[#f8f7ff]">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          eyebrow="LangGraph Agentic Workflow"
          title="From Job Requisition to Ranked Shortlist — Fully Automated"
          sub="TalentMind's multi-agent pipeline handles the entire talent intelligence lifecycle, with humans in the loop where it matters."
        />

        <div className="mt-14 relative">
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {workflowSteps.map((s) => (
              <WorkflowStep key={s.step} {...s} />
            ))}
          </div>
        </div>

        <div className="mt-12 tm-card p-6 bg-[#0f0e2e] border-indigo-900">
          <div className="text-xs font-semibold text-indigo-400 mb-3 uppercase tracking-widest">LangGraph State Machine — Simplified</div>
          <div className="font-mono text-[12px] text-slate-300 leading-[1.8] overflow-x-auto">
            <div><span className="text-indigo-400">START</span> → ingest_documents → embed_chunks → index_vectors</div>
            <div className="ml-12">→ retrieve_candidates(k=20) → rerank(top=8)</div>
            <div className="ml-24">→ assess_skills → assess_culture → flag_risks</div>
            <div className="ml-36">→ aggregate_scores → generate_explanations</div>
            <div className="ml-48">→ audit_log → <span className="text-emerald-400">END</span></div>
          </div>
          <button onClick={onDocs} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            <BookOpen size={13} /> View full architecture docs
            <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </section>
  );
}

function WorkflowStep({ step, title, desc, detail, color }: typeof workflowSteps[0]) {
  return (
    <div className="tm-card p-5 flex flex-col gap-3 relative">
      <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-white text-sm shrink-0" style={{ background: color }}>
        {step}
      </div>
      <h4 className="font-display font-bold text-[15px] text-[#1e1b4b]">{title}</h4>
      <p className="text-xs text-[#6b7280] leading-relaxed flex-1">{desc}</p>
      <div className="text-[9px] font-mono px-2 py-1.5 rounded-md leading-relaxed" style={{ background: `${color}12`, color }}>
        {detail}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   USE CASES — Lucide icons replacing emojis
═══════════════════════════════════════════════════════════════════ */
const useCases = [
  {
    Icon: Monitor,
    iconColor: "#4338ca",
    iconBg: "#eef2ff",
    industry: "Technology",
    title: "AI-Augmented Engineering Hiring",
    desc: "Auto-screen thousands of engineering candidates with skills-graph matching, GitHub signal analysis, and LLM-judged take-home assessments.",
    metric: "68% reduction in time-to-offer",
  },
  {
    Icon: BarChart3,
    iconColor: "#059669",
    iconBg: "#ecfdf5",
    industry: "Financial Services",
    title: "Compliant Talent Analytics",
    desc: "Bias-audited scoring, EEOC-compliant explanation generation, and real-time diversity dashboards — approved for regulated hiring environments.",
    metric: "100% audit trail coverage",
  },
  {
    Icon: ShieldCheck,
    iconColor: "#0369a1",
    iconBg: "#f0f9ff",
    industry: "Healthcare",
    title: "Credentialing & Licensure Intelligence",
    desc: "RAG over medical credentialing corpora surfaces qualified clinicians while surfacing licensure gaps, expiry risks, and specialty alignment.",
    metric: "41% faster credentialing cycle",
  },
  {
    Icon: Network,
    iconColor: "#7c3aed",
    iconBg: "#f5f3ff",
    industry: "Enterprise HR",
    title: "Internal Mobility & Upskilling",
    desc: "Map employee skill vectors against open roles, identify capability gaps, and generate personalized upskilling roadmaps via knowledge-base RAG.",
    metric: "2.8× higher internal placement rate",
  },
];

function UseCasesSection({ id }: { id: string }) {
  return (
    <section id={id} className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          eyebrow="Industry Use Cases"
          title="Built for Every Talent Challenge"
          sub="TalentMind adapts its AI pipeline to the specific hiring context, compliance requirements, and data landscape of your industry."
        />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((u) => (
            <UseCaseCard key={u.title} {...u} />
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCaseCard({ Icon, iconColor, iconBg, industry, title, desc, metric }: typeof useCases[0]) {
  return (
    <div className="tm-card p-7 flex gap-5">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: iconBg }}>
        <Icon size={22} color={iconColor} strokeWidth={1.8} />
      </div>
      <div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-500">{industry}</span>
        <h4 className="font-display font-bold text-[17px] text-[#1e1b4b] mt-1 mb-2">{title}</h4>
        <p className="text-sm text-[#6b7280] leading-relaxed mb-4">{desc}</p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold text-emerald-700">{metric}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TESTIMONIALS
═══════════════════════════════════════════════════════════════════ */
const testimonials = [
  {
    quote: "TalentMind's RAG pipeline cut our senior engineering hire cycle from 87 days to 31. The explainability layer made our DEI team actually trust the AI scores.",
    name: "Samira Al-Rashidi",
    title: "VP of Talent Acquisition, Nexora Corp",
    initials: "SA",
  },
  {
    quote: "We evaluated four AI hiring platforms. TalentMind was the only one that gave us full LangGraph workflow visibility, LangSmith tracing, and SOC 2 compliance out of the box.",
    name: "Daniel Ferreira",
    title: "CPTO, Blueshift Labs",
    initials: "DF",
  },
  {
    quote: "The internal mobility use case alone paid for the platform in Q1. Mapping employee skill embeddings to open roles is genuinely magical — and the eval harness proves it works.",
    name: "Yuki Tanaka",
    title: "Chief People Officer, PolarEdge",
    initials: "YT",
  },
];

function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#f8f7ff]">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          eyebrow="Customer Stories"
          title="What Talent Leaders Are Saying"
          sub="Real outcomes from enterprise HR and talent acquisition teams using TalentMind in production."
        />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ quote, name, title, initials }: typeof testimonials[0]) {
  return (
    <div className="tm-card p-7 flex flex-col gap-5">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-sm">★</span>
        ))}
      </div>
      <p className="text-sm text-[#374151] leading-relaxed flex-1 italic">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3 pt-2 border-t border-indigo-50">
        <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold shrink-0">
          {initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-[#1e1b4b]">{name}</div>
          <div className="text-xs text-[#9ca3af]">{title}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PRICING — each plan button opens a different modal
═══════════════════════════════════════════════════════════════════ */
function PricingSection({
  id,
  onTrial,
  onDemo,
  onSales,
}: {
  id: string;
  onTrial: () => void;
  onDemo: () => void;
  onSales: () => void;
}) {
  const plans = [
    {
      name: "Starter",
      price: "$499",
      period: "/month",
      desc: "For growing teams getting started with AI-assisted hiring.",
      features: [
        "Up to 50 active job requisitions",
        "5,000 candidate vectors indexed",
        "Basic RAG retrieval pipeline",
        "Email + ATS webhook ingestion",
        "Standard evaluation dashboard",
        "Community support",
      ],
      cta: "Start Free Trial",
      highlight: false,
      onCta: onTrial,
    },
    {
      name: "Growth",
      price: "$1,999",
      period: "/month",
      desc: "For talent teams scaling AI across the full hiring funnel.",
      features: [
        "Unlimited job requisitions",
        "500,000 candidate vectors",
        "Multi-agent assessment pipeline",
        "LangGraph workflow builder",
        "LangSmith tracing & eval harness",
        "RBAC + SSO (SAML 2.0)",
        "Priority support + SLA",
      ],
      cta: "Request Demo",
      highlight: true,
      onCta: onDemo,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For large organizations with complex compliance and infrastructure needs.",
      features: [
        "Unlimited everything",
        "Dedicated vector cluster",
        "Custom LangGraph agents",
        "On-prem / VPC deployment",
        "SOC 2 · GDPR · EEOC reporting",
        "Dedicated CSM + SLA",
        "Terraform + Helm IaC modules",
      ],
      cta: "Contact Sales",
      highlight: false,
      onCta: onSales,
    },
  ];

  return (
    <section id={id} className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          eyebrow="Transparent Pricing"
          title="Plans That Scale With Your Talent Ambitions"
          sub="No per-seat pricing surprises. Pay for the intelligence infrastructure you use."
        />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`tm-card p-8 flex flex-col gap-6 relative ${
                p.highlight ? "border-indigo-400 shadow-xl ring-2 ring-indigo-400/20 scale-[1.02]" : ""
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-brand text-white text-xs font-bold shadow">
                  Most Popular
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{p.name}</div>
                <div className="mt-2 flex items-end gap-1">
                  <span className="font-display text-[38px] font-extrabold text-[#1e1b4b] leading-none">{p.price}</span>
                  {p.period && <span className="text-sm text-[#9ca3af] mb-1">{p.period}</span>}
                </div>
                <p className="mt-2 text-sm text-[#6b7280]">{p.desc}</p>
              </div>
              <ul className="flex flex-col gap-2.5 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#374151]">
                    <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={p.onCta}
                className={p.highlight ? "btn-primary w-full justify-center" : "btn-outline w-full justify-center"}
              >
                {p.cta}
                <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CTA BANNER
═══════════════════════════════════════════════════════════════════ */
function CtaBannerSection({ onDemo, onExplore }: { onDemo: () => void; onExplore: () => void }) {
  return (
    <section className="py-24 bg-[#f8f7ff]">
      <div className="max-w-[900px] mx-auto px-6 text-center">
        <div className="tm-card p-12 relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero-bg opacity-60" />
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-violet-200/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-200/30 blur-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 border border-indigo-200 mb-6">
              <span className="text-xs font-semibold text-indigo-700">No credit card required · 14-day free trial</span>
            </div>
            <h2 className="font-display text-[40px] font-extrabold text-[#1e1b4b] leading-tight">
              Ready to Build a{" "}
              <span className="gradient-text-brand">Smarter Talent Pipeline?</span>
            </h2>
            <p className="mt-4 text-[16px] text-[#6b7280] max-w-[520px] mx-auto leading-relaxed">
              Join 500+ enterprise HR teams using TalentMind AI to accelerate hiring, reduce bias, and make every talent decision explainable.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button onClick={onDemo} className="btn-primary text-base px-8 py-4">
                Request a Live Demo
                <ArrowRight size={17} />
              </button>
              <button onClick={onExplore} className="btn-outline text-base px-8 py-4">
                Explore the Platform
                <ExternalLink size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════════ */
const footerLinks = {
  Product: ["Platform Overview", "RAG Pipeline", "Agent Orchestration", "Evaluation Framework", "Integrations", "Changelog"],
  Company: ["About TalentMind", "Blog", "Careers", "Press Kit", "Security", "Trust Center"],
  Resources: ["Documentation", "API Reference", "LangGraph Guide", "Vector DB Setup", "Community", "Status"],
  Legal: ["Privacy Policy", "Terms of Service", "GDPR", "SOC 2 Report", "Cookie Policy"],
};

function FooterSection() {
  return (
    <footer className="bg-[#0f0e2e] text-slate-400">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="5" r="2.5" fill="white" opacity="0.9" />
                  <circle cx="4" cy="13" r="2.5" fill="white" opacity="0.7" />
                  <circle cx="14" cy="13" r="2.5" fill="white" opacity="0.7" />
                  <line x1="9" y1="7.5" x2="4" y2="10.5" stroke="white" strokeWidth="1.2" opacity="0.6" />
                  <line x1="9" y1="7.5" x2="14" y2="10.5" stroke="white" strokeWidth="1.2" opacity="0.6" />
                  <line x1="4" y1="13" x2="14" y2="13" stroke="white" strokeWidth="1.2" opacity="0.6" />
                </svg>
              </div>
              <span className="font-display font-bold text-white text-lg">
                Talent<span className="text-indigo-400">Mind</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 max-w-[220px]">
              Enterprise talent intelligence powered by RAG, LangGraph, and multi-agent AI.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["SOC 2", "GDPR", "CCPA"].map((b) => (
                <span key={b} className="text-[10px] font-semibold px-2 py-1 rounded border border-slate-700 text-slate-500">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h5 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">{category}</h5>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">© 2025 TalentMind Inc. All rights reserved.</p>
          <p className="text-xs text-slate-700 font-mono">
            Built with LangGraph · Qdrant · Claude · Next.js · TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MODALS — each one is distinct
═══════════════════════════════════════════════════════════════════ */

function ModalShell({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-[460px] shadow-2xl relative overflow-hidden animate-slide-up">
        {children}
      </div>
    </div>
  );
}

function ModalClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
    >
      <X size={16} />
    </button>
  );
}

/* 1. Demo Modal — book a live demo */
function DemoModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", role: "" });
  const [submitted, setSubmitted] = useState(false);

  return (
    <ModalShell onClose={onClose}>
      <div className="gradient-brand p-7 pb-8">
        <ModalClose onClose={onClose} />
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={14} className="text-indigo-200" />
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">Live Demo</span>
        </div>
        <h2 className="font-display text-[22px] font-extrabold text-white leading-snug">Request a Live Demo</h2>
        <p className="text-sm text-indigo-200 mt-1">30 minutes, tailored to your role and pipeline.</p>
      </div>
      <div className="p-7">
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-emerald-500" />
            </div>
            <h3 className="font-display font-bold text-[18px] text-[#1e1b4b] mb-2">You&apos;re on the list!</h3>
            <p className="text-sm text-[#6b7280]">A solutions engineer will reach out within one business day.</p>
            <button onClick={onClose} className="btn-primary mt-6 w-full justify-center">Close</button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col gap-3">
            {[
              { key: "name", label: "Full Name", placeholder: "Samira Al-Rashidi", type: "text" },
              { key: "email", label: "Work Email", placeholder: "samira@company.com", type: "email" },
              { key: "company", label: "Company", placeholder: "Nexora Corp", type: "text" },
              { key: "role", label: "Your Role", placeholder: "VP of Talent Acquisition", type: "text" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-[#374151] mb-1">{field.label}</label>
                <input
                  type={field.type}
                  required
                  placeholder={field.placeholder}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-sm text-[#1e1b4b] placeholder-[#d1d5db] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            ))}
            <button type="submit" className="btn-primary w-full justify-center mt-2 py-3">
              Book My Demo <ArrowRight size={15} />
            </button>
            <p className="text-center text-[11px] text-[#9ca3af]">No spam, no credit card. Just a real demo.</p>
          </form>
        )}
      </div>
    </ModalShell>
  );
}

/* 2. Trial Modal — start free trial */
function TrialModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <ModalShell onClose={onClose}>
      <div className="p-7 pb-0">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
          <X size={16} />
        </button>
        <div className="flex items-center gap-2 mb-2">
          <Zap size={16} className="text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Free Trial</span>
        </div>
        <h2 className="font-display text-[22px] font-extrabold text-[#1e1b4b] leading-snug">Start Your 14-Day Free Trial</h2>
        <p className="text-sm text-[#6b7280] mt-1 mb-6">No credit card required. Full Starter plan access, cancel anytime.</p>
      </div>

      <div className="px-7 pb-7">
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: "50 job requisitions", icon: <FileText size={13} /> },
            { label: "5,000 vectors indexed", icon: <Brain size={13} /> },
            { label: "RAG retrieval pipeline", icon: <Network size={13} /> },
            { label: "Eval dashboard", icon: <BarChart3 size={13} /> },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs text-[#374151] bg-indigo-50 rounded-lg px-3 py-2">
              <span className="text-indigo-600">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        {submitted ? (
          <div className="text-center py-4">
            <CheckCircle2 size={36} className="text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold text-[#1e1b4b]">Check your inbox!</p>
            <p className="text-sm text-[#6b7280] mt-1">We&apos;ve sent your activation link to <strong>{email}</strong></p>
            <button onClick={onClose} className="btn-primary mt-5 w-full justify-center">Done</button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Work Email</label>
              <input
                type="email" required placeholder="you@company.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-sm text-[#1e1b4b] placeholder-[#d1d5db] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3">
              Activate Free Trial <ArrowRight size={15} />
            </button>
            <p className="text-center text-[11px] text-[#9ca3af]">14-day trial · No credit card · Cancel anytime</p>
          </form>
        )}
      </div>
    </ModalShell>
  );
}

/* 3. Sales Modal — enterprise contact */
function SalesModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", size: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  return (
    <ModalShell onClose={onClose}>
      <div className="bg-[#0f0e2e] p-7 pb-6">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          <X size={16} />
        </button>
        <div className="flex items-center gap-2 mb-2">
          <Phone size={14} className="text-indigo-300" />
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Enterprise Sales</span>
        </div>
        <h2 className="font-display text-[22px] font-extrabold text-white leading-snug">Talk to Our Sales Team</h2>
        <p className="text-sm text-slate-400 mt-1">Custom pricing, dedicated infrastructure, compliance reviews.</p>
      </div>
      <div className="p-7">
        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 size={36} className="text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold text-[#1e1b4b] text-lg">Message received!</p>
            <p className="text-sm text-[#6b7280] mt-1">Our enterprise team will contact you within 4 business hours.</p>
            <button onClick={onClose} className="btn-primary mt-5 w-full justify-center">Close</button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col gap-3">
            {[
              { key: "name", label: "Full Name", placeholder: "Daniel Ferreira", type: "text" },
              { key: "email", label: "Work Email", placeholder: "daniel@company.com", type: "email" },
              { key: "company", label: "Company", placeholder: "Blueshift Labs", type: "text" },
              { key: "size", label: "Company Size", placeholder: "e.g. 500–2,000 employees", type: "text" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-[#374151] mb-1">{field.label}</label>
                <input
                  type={field.type} required placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-sm text-[#1e1b4b] placeholder-[#d1d5db] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">What are you looking to solve?</label>
              <textarea
                rows={3} placeholder="Describe your hiring challenge..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-sm text-[#1e1b4b] placeholder-[#d1d5db] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3">
              Send to Sales Team <ArrowRight size={15} />
            </button>
          </form>
        )}
      </div>
    </ModalShell>
  );
}

/* 4. Video Modal — product demo video */
function VideoModal({ onClose }: { onClose: () => void }) {
  // RAG Explained in 8 Minutes — concise, beginner-friendly
  const videoId = "HREbdmOSQ18";

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[780px] animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-1">Product Walkthrough</p>
            <h2 className="font-display text-xl font-extrabold text-white">RAG Explained in 8 Minutes</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden border border-indigo-900/60 shadow-2xl">
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title="RAG + LangGraph AI Pipeline Overview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">8 min · RAG pipelines + LangGraph agents explained</p>
          <button onClick={onClose} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors">
            <Mail size={12} /> Contact us
          </button>
        </div>
      </div>
    </div>
  );
}

/* 5. Docs Modal — platform documentation */
function DocsModal({ onClose }: { onClose: () => void }) {
  const sections = [
    {
      Icon: Brain, color: "#4338ca", bg: "#eef2ff",
      title: "RAG Pipeline Setup",
      desc: "Connect your ATS, configure vector stores, tune retrieval.",
      url: "https://python.langchain.com/docs/tutorials/rag/",
    },
    {
      Icon: Network, color: "#7c3aed", bg: "#f5f3ff",
      title: "LangGraph Agents",
      desc: "Build custom agent workflows, define state machines.",
      url: "https://langchain-ai.github.io/langgraph/",
    },
    {
      Icon: BarChart3, color: "#059669", bg: "#ecfdf5",
      title: "Eval & Observability",
      desc: "RAGAS metrics, LangSmith tracing, Grafana dashboards.",
      url: "https://docs.ragas.io/en/latest/",
    },
    {
      Icon: ShieldCheck, color: "#0369a1", bg: "#f0f9ff",
      title: "Auth & Compliance",
      desc: "SSO setup, RBAC configuration, SOC 2 audit guides.",
      url: "https://next-auth.js.org/getting-started/introduction",
    },
  ];

  return (
    <ModalShell onClose={onClose}>
      <div className="p-7 border-b border-indigo-50">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
          <X size={16} />
        </button>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={16} className="text-indigo-600" />
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Documentation</span>
        </div>
        <h2 className="font-display text-[20px] font-extrabold text-[#1e1b4b]">Explore the Platform Docs</h2>
        <p className="text-sm text-[#6b7280] mt-1">Everything you need to build on TalentMind.</p>
      </div>
      <div className="p-7 flex flex-col gap-3">
        {sections.map((s) => (
          <a
            key={s.title}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border border-indigo-50 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: s.bg }}>
              <s.Icon size={18} color={s.color} strokeWidth={1.8} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-[#1e1b4b]">{s.title}</div>
              <div className="text-xs text-[#9ca3af] mt-0.5">{s.desc}</div>
            </div>
            <ExternalLink size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
          </a>
        ))}
        <button onClick={onClose} className="btn-outline w-full justify-center mt-2">
          Close
        </button>
      </div>
    </ModalShell>
  );
}

/* 6. Sign In Modal */
function SignInModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (name: string, email: string) => void }) {
  const [form, setForm] = useState({ email: "", password: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = form.email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    onSuccess(name, form.email);
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="p-7 border-b border-indigo-50">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
          <X size={16} />
        </button>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="5" r="2.5" fill="white" opacity="0.9" />
              <circle cx="4" cy="13" r="2.5" fill="white" opacity="0.7" />
              <circle cx="14" cy="13" r="2.5" fill="white" opacity="0.7" />
              <line x1="9" y1="7.5" x2="4" y2="10.5" stroke="white" strokeWidth="1.2" opacity="0.6" />
              <line x1="9" y1="7.5" x2="14" y2="10.5" stroke="white" strokeWidth="1.2" opacity="0.6" />
              <line x1="4" y1="13" x2="14" y2="13" stroke="white" strokeWidth="1.2" opacity="0.6" />
            </svg>
          </div>
          <span className="font-display font-bold text-[#1e1b4b]">TalentMind</span>
        </div>
        <h2 className="font-display text-[20px] font-extrabold text-[#1e1b4b]">Welcome back</h2>
        <p className="text-sm text-[#6b7280] mt-1">Sign in to your TalentMind workspace.</p>
      </div>
      <div className="p-7">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Work Email</label>
            <input
              type="email" required placeholder="you@company.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-sm text-[#1e1b4b] placeholder-[#d1d5db] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#374151]">Password</label>
              <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Forgot password?</a>
            </div>
            <input
              type="password" required placeholder="••••••••"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-sm text-[#1e1b4b] placeholder-[#d1d5db] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <button type="submit" className="btn-primary w-full justify-center py-3 mt-1">
            Sign In <ArrowRight size={15} />
          </button>
          <div className="relative flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-indigo-100" />
            <span className="text-xs text-[#9ca3af]">or</span>
            <div className="flex-1 h-px bg-indigo-100" />
          </div>
          <button type="button" className="btn-outline w-full justify-center py-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
        </form>
        <p className="text-center text-xs text-[#9ca3af] mt-5">
          Don&apos;t have an account?{" "}
          <a href="#" className="text-indigo-600 font-semibold hover:underline">Start free trial</a>
        </p>
      </div>
    </ModalShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SHARED UTILITIES
═══════════════════════════════════════════════════════════════════ */
function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="text-center max-w-[680px] mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">{eyebrow}</span>
      </div>
      <h2 className="font-display text-[36px] font-extrabold text-[#1e1b4b] leading-tight">{title}</h2>
      <p className="mt-4 text-[16px] text-[#6b7280] leading-relaxed">{sub}</p>
    </div>
  );
}

function VectorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#6366f1" opacity="0.7" />
      <rect x="12" y="2" width="6" height="6" rx="1.5" fill="#8b5cf6" opacity="0.7" />
      <rect x="2" y="12" width="6" height="6" rx="1.5" fill="#a78bfa" opacity="0.7" />
      <rect x="12" y="12" width="6" height="6" rx="1.5" fill="#c4b5fd" opacity="0.7" />
      <line x1="8" y1="5" x2="12" y2="5" stroke="#6366f1" strokeWidth="1" strokeDasharray="1.5 1.5" />
      <line x1="5" y1="8" x2="5" y2="12" stroke="#6366f1" strokeWidth="1" strokeDasharray="1.5 1.5" />
      <line x1="15" y1="8" x2="15" y2="12" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="1.5 1.5" />
      <line x1="8" y1="15" x2="12" y2="15" stroke="#a78bfa" strokeWidth="1" strokeDasharray="1.5 1.5" />
    </svg>
  );
}
