import { industries } from '../data/site.js'

function Industries() {
  return (
    <section className="shell industries" id="products">
      <span className="eyebrow">Industry products</span>
      <h2 className="section-title">AI-native products, per sector</h2>
      <p className="industries-lede">
        Deployments repeat. Where they do, we productise them — so the second client in a sector
        starts from a working system rather than a blank repo.
      </p>

      <div className="industries-grid">
        {industries.map((industry) => (
          <div className="industry" key={industry.id}>
            <h3 className="industry-title" id={industry.id}>
              {industry.title}
            </h3>
            <p className="industry-body">{industry.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Industries
