import { academicBackground, employers } from '../data/site.js'

function About() {
  return (
    <section className="about" id="about">
      <div className="shell">
        <div className="about-grid">
          <div>
            <span className="eyebrow">About us</span>
            <h2 className="section-title about-title">
              Built by people who have already shipped this
            </h2>
            <p className="about-body">
              We are a small, senior team — engineers and operators trained at IIT, IIIT, IISc,
              BITS Pilani and IIM, who have spent their careers taking systems from prototype to
              production inside large, regulated organisations.
            </p>
            <p className="about-body">
              Between us: <strong>100+ years of combined experience in AI</strong>, cloud
              infrastructure and enterprise delivery. No layer of account managers between you
              and the people writing the code.
            </p>
          </div>

          <div>
            <p className="about-label">Academic background</p>
            <div className="about-tags">
              {academicBackground.map((school) => (
                <span className="tag tag-pastel" key={school}>
                  {school}
                </span>
              ))}
            </div>

            <p className="about-label">Previously built and ran systems at</p>
            <div className="employer-grid">
              {employers.map((employer) => (
                <span className="employer" key={employer}>
                  {employer}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
