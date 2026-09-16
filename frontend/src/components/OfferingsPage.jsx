function OfferingsPage({ eyebrow, title, intro, items }) {
  return (
    <div className="offerings-page">
      <div className="page-header">
        <span className="badge">
          <span className="dot" />
          {eyebrow}
        </span>
        <h1 className="page-title">{title}</h1>
        <p className="page-intro">{intro}</p>
      </div>

      <div className="offerings-grid">
        {items.map((item) => (
          <article className="offering-card" key={item.slug} id={item.slug}>
            <h2>{item.title}</h2>
            <p className="offering-description">{item.description}</p>
            <ul className="offering-highlights">
              {item.highlights.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}

export default OfferingsPage
