export const deploymentOS = [
  {
    slug: 'finetuning',
    title: 'Finetuning',
    summary: 'Adapting foundation models to your domain and data.',
    description:
      'We finetune foundation models on your proprietary data so they speak your domain fluently — without the cost and time of training from scratch.',
    highlights: [
      'Domain and task-specific finetuning pipelines',
      'Data curation and synthetic data generation',
      'Parameter-efficient finetuning (LoRA/QLoRA and beyond)',
    ],
  },
  {
    slug: 'inferencing',
    title: 'Inferencing',
    summary: 'Low-latency, cost-efficient model serving at scale.',
    description:
      'A serving layer tuned for throughput and cost — batching, caching, and routing requests across models so you get production-grade latency without overpaying for compute.',
    highlights: [
      'Autoscaling, low-latency model serving',
      'Multi-model routing and cost optimization',
      'On-prem, VPC, or cloud-native deployment',
    ],
  },
  {
    slug: 'evals',
    title: 'Evals',
    summary: 'Knowing whether your AI system is actually working.',
    description:
      'Continuous evaluation pipelines — golden datasets, automated scoring, and regression testing — so you catch quality drops before your users do.',
    highlights: [
      'Golden-dataset and automated eval pipelines',
      'Regression testing on every model or prompt change',
      'Human-in-the-loop quality review',
    ],
  },
  {
    slug: 'observability',
    title: 'Observability',
    summary: 'Full visibility into what your AI systems are doing in production.',
    description:
      'Tracing, logging, and monitoring purpose-built for LLM and agent systems — so every decision, tool call, and cost is visible and auditable.',
    highlights: [
      'Request-level tracing for models and agents',
      'Cost, latency, and quality dashboards',
      'Alerting on drift, failures, and anomalies',
    ],
  },
  {
    slug: 'deployment-platform',
    title: 'Deployment Platform',
    summary: 'The infrastructure backbone that runs your AI in production.',
    description:
      'A unified platform to package, deploy, and manage AI systems across environments — so every team ships models the same reliable way instead of reinventing infrastructure each time.',
    highlights: [
      'Standardized deployment pipelines across teams',
      'Environment parity from dev to production',
      'Governance, access control, and versioning',
    ],
  },
  {
    slug: 'fde-led-deployment-model',
    title: 'FDE-Led Deployment Model',
    summary: 'Forward-deployed engineers embedded in your team until it ships.',
    description:
      'Our engineers work embedded inside your team through design, build, and rollout — closing the gap between a proof of concept and a production system that actually gets used.',
    highlights: [
      'Engineers embedded on-site or in your workflows',
      'Hands-on delivery, not just advisory',
      'Ownership through to production rollout',
    ],
  },
]
