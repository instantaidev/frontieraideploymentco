// Single source of truth for the landing page. Section ids double as the
// anchors the nav dropdowns link to, so ordering here drives both.

export const company = {
  name: 'Frontier AI Deployment Company',
  email: 'hello@frontierdeploy.co',
  site: 'frontierdeploy.co',
  siteUrl: 'https://frontierdeploy.co',
  ctaLabel: 'Book a deployment call',
}

export const stats = [
  { value: '7', label: 'Services, strategy to AI Ops' },
  { value: '8', label: 'Industries with AI-native products' },
  { value: '6', label: 'DeploymentOS layers under every build' },
  { value: '1', label: 'Team accountable end to end' },
]

export const services = [
  {
    id: 'ai-strategy',
    title: 'AI Strategy',
    body: 'Where AI earns its keep in your P&L, in what order, and what it costs to get there. A sequenced portfolio with owners and a build-or-buy call on every line.',
  },
  {
    id: 'ai-transformation',
    title: 'AI Transformation',
    body: 'Rebuilding the operating model around AI — processes, decision rights, governance and funding — so deployed systems change how the business runs, not just what it demos.',
  },
  {
    id: 'ai-integration',
    title: 'AI Integration',
    body: 'Wiring models into the systems of record — ERP, CRM, core banking, MES — with the identity, data contracts and audit trails your security review will ask for.',
  },
  {
    id: 'ai-ops',
    title: 'AI Ops',
    body: 'Running what we ship: on-call, drift and eval regression, cost per task, model upgrades. Production AI is an operated system, and someone has to own the pager.',
  },
  {
    id: 'ai-workforce',
    title: 'AI Workforce Transformation',
    body: 'Role-by-role redesign, enablement and incentives, so the people around a deployed system adopt it instead of routing around it.',
  },
  {
    id: 'ai-native-sdlc',
    title: 'AI-Native SDLC',
    body: 'Your delivery organisation rebuilt around agents: spec-to-code workflows, evals in CI, review gates that assume machine authorship. Throughput, with the controls intact.',
  },
  {
    id: 'agentic-ai',
    title: 'Agentic AI Development',
    body: 'Agents that take actions in real systems — scoped tools, human checkpoints, replayable traces — built for the failure modes, not the demo path.',
  },
]

export const industries = [
  {
    id: 'bfsi',
    title: 'BFSI',
    body: 'Underwriting, KYC remediation and surveillance copilots that hold up to the regulator.',
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing',
    body: 'Yield, quality inspection and maintenance agents wired to the plant floor, not a dashboard.',
  },
  {
    id: 'aerospace',
    title: 'Aerospace',
    body: 'Airworthiness documentation, MRO triage and compliance evidence assembled automatically.',
  },
  {
    id: 'defence',
    title: 'Defence',
    body: 'Sovereign, air-gapped deployments with full provenance on every model and prompt.',
  },
  {
    id: 'retail',
    title: 'Retail',
    body: 'Assortment, pricing and service agents that read the catalogue as well as your buyers do.',
  },
  {
    id: 'supply-chain',
    title: 'Supply Chain',
    body: 'Demand sensing and exception handling that resolves the disruption instead of reporting it.',
  },
  {
    id: 'logistics',
    title: 'Logistics',
    body: 'Dispatch, yard and freight-audit agents working the queue in real time.',
  },
  {
    id: 'real-estate',
    title: 'Real Estate',
    body: 'Lease abstraction, diligence and portfolio intelligence over documents nobody has read.',
  },
]

export const osLayers = [
  {
    id: 'finetuning',
    title: 'Finetuning',
    body: 'Domain adaptation on your data, with the provenance and rollback story to match.',
  },
  {
    id: 'inferencing',
    title: 'Inferencing',
    body: 'Serving at a known latency and a known cost per task — in your cloud, region or rack.',
  },
  {
    id: 'evals',
    title: 'Evals',
    body: 'Task-level test suites that gate releases. If it cannot be evaluated, it does not ship.',
  },
  {
    id: 'observability',
    title: 'Observability',
    body: 'Traces, drift and spend on one pane, so a regression is a ticket rather than a rumour.',
  },
  {
    id: 'deployment-platform',
    title: 'Deployment Platform',
    body: 'Environments, secrets, guardrails and release pipelines, standard on day one.',
  },
  {
    id: 'fde-model',
    title: 'FDE-Led Deployment Model',
    body: 'Forward-deployed engineers inside your team — the delivery method, made part of the stack.',
  },
]

export const phases = [
  {
    when: 'Week 1—2',
    title: 'Sit with the work',
    body: 'Our engineers work alongside your operators, find the tasks worth automating, and write down what "better" measures.',
  },
  {
    when: 'Week 3—8',
    title: 'Ship into production',
    body: 'One workflow, live, on DeploymentOS — real users, real data, evals in CI. No parallel pilot environment to migrate out of later.',
  },
  {
    when: 'Ongoing',
    title: 'Run it and widen it',
    body: 'We hold the pager while your team takes over, then repeat across the next workflow — or hand the whole thing off.',
  },
]

export const academicBackground = ['IIT', 'IIIT', 'IISc', 'BITS Pilani', 'IIM']

export const employers = [
  'Oracle Cloud Infrastructure',
  'Google',
  'Microsoft',
  'IBM',
  'Jio',
  'Honeywell',
  'Fidelity Investments',
  'Utopus Insights',
  'Okta',
]

export const footerLinks = [
  { href: '#services', label: 'Services' },
  { href: '#products', label: 'Industries' },
  { href: '#os', label: 'DeploymentOS' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]
