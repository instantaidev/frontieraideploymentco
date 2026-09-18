import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import Industries from './components/Industries.jsx'
import DeploymentOS from './components/DeploymentOS.jsx'
import HowWeWork from './components/HowWeWork.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import CtaBand from './components/CtaBand.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Industries />
        <DeploymentOS />
        <HowWeWork />
        <About />
        <Contact />
        <CtaBand />
      </main>
      <Footer />
    </>
  )
}

export default App
