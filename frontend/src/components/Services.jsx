import { services } from '../data/site.js'

function Services() {
  return (
    <section className="shell services" id="services">
      <div className="section-head">
        <div>
          <span className="eyebrow">Services</span>
          <h2 className="section-title">The work, in seven parts</h2>
        </div>
        <p className="section-lede">
          Engagements start wherever you actually are — a mandate with no roadmap, or a model
          with no path to production.
        </p>
      </div>

      <div>
        {services.map((service, index) => (
          <div className="service-row" key={service.id}>
            <p className="service-index">{String(index + 1).padStart(2, '0')}</p>
            <h3 className="service-title" id={service.id}>
              {service.title}
            </h3>
            <p className="service-body">{service.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Services
