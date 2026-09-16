import OfferingsPage from '../components/OfferingsPage.jsx'
import { deploymentOS } from '../data/deploymentOS.js'

function DeploymentOS() {
  return (
    <OfferingsPage
      eyebrow="DeploymentOS"
      title="DeploymentOS"
      intro="The AI infrastructure layer underneath everything we build — finetuning, inferencing, evals, observability, and the deployment platform that ties it all together."
      items={deploymentOS}
    />
  )
}

export default DeploymentOS
