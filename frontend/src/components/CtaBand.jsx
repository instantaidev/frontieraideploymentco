import { company } from '../data/site.js'

function CtaBand() {
  return (
    <section className="cta-band">
      <div className="shell">
        <h2 className="cta-band-title">
          <span>Bring us your hardest workflow.</span>
          <span>We will run it in production.</span>
        </h2>
        <div className="button-row">
          <a className="btn btn-secondary" href={`mailto:${company.email}`}>
            {company.email}
          </a>
          <a className="btn btn-primary" href="#contact">
            {company.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  )
}

export default CtaBand
