import { Link } from 'react-router-dom'

function TeaserCard({ to, title, summary }) {
  return (
    <Link to={to} className="teaser-card">
      <h3>{title}</h3>
      <p>{summary}</p>
      <span className="teaser-link">Learn more →</span>
    </Link>
  )
}

export default TeaserCard
