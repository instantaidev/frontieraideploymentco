import { osLayers } from '../data/site.js'

function DeploymentOS() {
  return (
    <section className="os section-dark" id="os">
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">Infrastructure</span>
            <h2 className="section-title">DeploymentOS</h2>
          </div>
          <p className="section-lede">
            The layer underneath every engagement. Six capabilities, shared across clients, so
            nobody pays twice to rebuild the plumbing.
          </p>
        </div>

        <div className="os-grid">
          {osLayers.map((layer, index) => (
            <div className="os-card" key={layer.id}>
              <p className="os-card-index">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="os-card-title" id={layer.id}>
                {layer.title}
              </h3>
              <p className="os-card-body">{layer.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DeploymentOS
