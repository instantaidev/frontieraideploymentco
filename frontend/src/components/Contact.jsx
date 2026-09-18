import { useState } from 'react'
import { company } from '../data/site.js'

function Contact() {
  const [sent, setSent] = useState(false)

  const onSubmit = (event) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <section className="contact" id="contact">
      <div className="shell">
        <div className="contact-grid">
          <div>
            <span className="eyebrow">Contact us</span>
            <h2 className="section-title contact-title">Tell us the workflow</h2>
            <p className="contact-lede">
              One paragraph is enough. An engineer — not a salesperson — replies within two
              working days, usually with questions.
            </p>

            <div className="contact-details">
              <div className="contact-detail">
                <p className="contact-detail-label">Email</p>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </div>
              <div className="contact-detail">
                <p className="contact-detail-label">Web</p>
                <a href={company.siteUrl}>{company.site}</a>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="c-name">Name</label>
              <input className="input" id="c-name" name="name" type="text" placeholder="Your name" required />
            </div>
            <div className="field">
              <label htmlFor="c-email">Work email</label>
              <input className="input" id="c-email" name="email" type="email" placeholder="you@company.com" required />
            </div>
            <div className="field">
              <label htmlFor="c-company">Company</label>
              <input className="input" id="c-company" name="company" type="text" placeholder="Company and industry" />
            </div>
            <div className="field">
              <label htmlFor="c-workflow">The workflow</label>
              <textarea
                className="input"
                id="c-workflow"
                name="workflow"
                rows="4"
                placeholder="What runs badly today, and who feels it"
              />
            </div>
            <div className="contact-submit">
              <button type="submit" className="btn btn-primary">
                Send it over
              </button>
              {sent && (
                <span className="contact-sent" role="status">
                  Thanks — we will reply within two working days.
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
