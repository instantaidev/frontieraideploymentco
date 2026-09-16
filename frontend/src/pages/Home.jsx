import TeaserCard from '../components/TeaserCard.jsx'
import { services } from '../data/services.js'
import { products } from '../data/products.js'
import { deploymentOS } from '../data/deploymentOS.js'

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="glow" aria-hidden="true" />
        <div className="hero-content">
          <span className="badge">
            <span className="dot" />
            Coming soon
          </span>
          <h1 className="title">
            Frontier AI
            <br />
            Deployment Company
          </h1>
          <p className="tagline">Launching soon.</p>
        </div>
      </section>

      <section className="overview-section" id="services">
        <div className="section-header">
          <h2>Services</h2>
          <p>End-to-end services to take AI from strategy to production.</p>
        </div>
        <div className="teaser-grid">
          {services.map((service) => (
            <TeaserCard
              key={service.slug}
              to={`/services#${service.slug}`}
              title={service.title}
              summary={service.summary}
            />
          ))}
        </div>
      </section>

      <section className="overview-section" id="products">
        <div className="section-header">
          <h2>Applications & Products</h2>
          <p>AI-native products across the industries we serve.</p>
        </div>
        <div className="teaser-grid">
          {products.map((product) => (
            <TeaserCard
              key={product.slug}
              to={`/products#${product.slug}`}
              title={product.title}
              summary={product.summary}
            />
          ))}
        </div>
      </section>

      <section className="overview-section" id="deployment-os">
        <div className="section-header">
          <h2>DeploymentOS</h2>
          <p>The AI infrastructure layer underneath everything we build.</p>
        </div>
        <div className="teaser-grid">
          {deploymentOS.map((item) => (
            <TeaserCard
              key={item.slug}
              to={`/deployment-os#${item.slug}`}
              title={item.title}
              summary={item.summary}
            />
          ))}
        </div>
      </section>

      <section className="cta-section" id="contact">
        <h2>Let's build what's next.</h2>
        <p>We're launching soon — reach out to be one of the first to work with us.</p>
        <a className="cta-button" href="mailto:hello@frontierdeploy.co">
          Get in touch
        </a>
      </section>
    </div>
  )
}

export default Home
