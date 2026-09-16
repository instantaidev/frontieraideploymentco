import OfferingsPage from '../components/OfferingsPage.jsx'
import { products } from '../data/products.js'

function Products() {
  return (
    <OfferingsPage
      eyebrow="Applications & Products"
      title="Applications & Products"
      intro="AI-native products built for the specific workflows, data, and compliance realities of each industry we serve."
      items={products}
    />
  )
}

export default Products
