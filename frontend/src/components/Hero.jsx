import { company, stats } from '../data/site.js'

function Hero() {
  return (
    <section className="section-dark" id="top">
      <div className="shell hero">
        <p className="hero-kicker">{company.name}</p>
        <h1 className="hero-title">
          <span>AI in production.</span>
          <span className="accent">Not in pilot.</span>
        </h1>
        <p className="hero-lede">
          We embed forward-deployed engineers inside your operation, ship AI systems into
          production, and run them. Strategy through inference — one team, one accountability
          line, measured on outcomes rather than decks.
        </p>
        <div className="button-row">
          <a className="btn btn-primary" href="#contact">
            {company.ctaLabel}
          </a>
          <a className="btn btn-ghost" href="#os">
            See DeploymentOS
          </a>
        </div>
      </div>

      <div className="shell stats">
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
