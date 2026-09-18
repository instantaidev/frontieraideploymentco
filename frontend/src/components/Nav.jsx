import { useEffect, useRef, useState } from 'react'
import { company, industries, osLayers, services } from '../data/site.js'

const menus = [
  {
    key: 'services',
    label: 'Services',
    items: services,
    allLink: { href: '#services', label: 'All services' },
  },
  { key: 'industries', label: 'Industries', items: industries, columns: 2 },
  { key: 'os', label: 'DeploymentOS', items: osLayers },
]

function Chevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function Nav() {
  const [open, setOpen] = useState(null)
  const navRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) setOpen(null)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(null)
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const toggle = (key) => setOpen((current) => (current === key ? null : key))

  return (
    <header className="site-nav" ref={navRef}>
      <a className="nav-brand" href="#top">
        {company.name}
      </a>

      {menus.map((menu) => (
        <div className="nav-menu" key={menu.key}>
          <button
            type="button"
            className="nav-menu-trigger"
            aria-expanded={open === menu.key}
            onClick={() => toggle(menu.key)}
          >
            {menu.label}
            <Chevron />
          </button>
          {open === menu.key && (
            <div
              className={
                'nav-dropdown' + (menu.columns === 2 ? ' nav-dropdown-grid' : '')
              }
            >
              {menu.items.map((item) => (
                <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(null)}>
                  {item.title}
                </a>
              ))}
              {menu.allLink && (
                <a
                  className="nav-dropdown-all"
                  href={menu.allLink.href}
                  onClick={() => setOpen(null)}
                >
                  {menu.allLink.label}
                </a>
              )}
            </div>
          )}
        </div>
      ))}

      <a className="nav-link" href="#model">How we work</a>
      <a className="nav-link" href="#about">About</a>
      <a className="nav-link" href="#contact">Contact</a>
      <a className="btn btn-primary" href="#contact">
        {company.ctaLabel}
      </a>
    </header>
  )
}

export default Nav
