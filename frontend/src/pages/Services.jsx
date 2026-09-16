import OfferingsPage from '../components/OfferingsPage.jsx'
import { services } from '../data/services.js'

function Services() {
  return (
    <OfferingsPage
      eyebrow="Services"
      title="Services"
      intro="End-to-end services to take AI from strategy to production — and keep it running once it's there."
      items={services}
    />
  )
}

export default Services
