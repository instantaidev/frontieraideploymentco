import { company, footerLinks } from '../data/site.js'

function Footer() {
  return (
    <footer className="site-footer">
      <span>
        {company.name} — {company.site}
      </span>
      <span className="footer-links">
        {footerLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </span>
    </footer>
  )
}

export default Footer
