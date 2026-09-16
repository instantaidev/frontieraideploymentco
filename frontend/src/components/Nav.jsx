import { NavLink } from 'react-router-dom'

const links = [
  { to: '/services', label: 'Services' },
  { to: '/products', label: 'Applications & Products' },
  { to: '/deployment-os', label: 'DeploymentOS' },
]

function Nav() {
  return (
    <header className="nav">
      <NavLink to="/" className="nav-brand" end>
        Frontier AI
      </NavLink>
      <nav className="nav-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <a className="nav-cta" href="mailto:hello@frontierdeploy.co">
        Get in touch
      </a>
    </header>
  )
}

export default Nav
