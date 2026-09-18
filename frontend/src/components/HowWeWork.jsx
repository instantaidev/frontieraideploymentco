import { phases } from '../data/site.js'

function HowWeWork() {
  return (
    <section className="shell model" id="model">
      <span className="eyebrow">How we work</span>
      <h2 className="section-title model-title">
        Engineers in the room, not a statement of work
      </h2>

      <div className="model-grid">
        {phases.map((phase) => (
          <div className="phase" key={phase.title}>
            <p className="phase-when">{phase.when}</p>
            <h3 className="phase-title">{phase.title}</h3>
            <p className="phase-body">{phase.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowWeWork
