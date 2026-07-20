import { AtSign, Clock3, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand-column">
          <Link className="brand footer-brand" to="/">
            <span className="brand-mark">V</span>
            <span>
              <strong>VELORA</strong>
              <small>Premium Black Car Service</small>
            </span>
          </Link>
          <p>
            Private transportation shaped around punctuality, discretion, and
            the details that make every journey feel effortless.
          </p>
          <Link className="text-link" to="/admin/login">
            Admin portal
          </Link>
        </div>

        <div>
          <h3>Concierge & Reservations</h3>
          <ul className="footer-list">
            <li>
              <Phone size={18} /> <a href="tel:+923121538569">0312 1538569</a>
            </li>
            <li>
              <Mail size={18} /> <a href="mailto:anniesalar818@gmail.com">anniesalar818@gmail.com</a>
            </li>
            <li>
              <MapPin size={18} /> Karachi, Pakistan
            </li>
          </ul>
          <div className="footer-social-links" aria-label="Social links">
            <a href="https://www.linkedin.com/in/anam-fatima-948bab407" target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
              <ExternalLink size={18} /> LinkedIn
            </a>
            <a href="https://x.com/AnnieSalar68256" target="_blank" rel="noreferrer" aria-label="X profile">
              <AtSign size={18} /> @AnnieSalar68256
            </a>
          </div>
        </div>

        <div>
          <h3>Fleet Availability</h3>
          <ul className="footer-list">
            <li>
              <Clock3 size={18} /> Monday – Sunday, 24 hours
            </li>
            <li>Luxury sedans · SUVs · Sprinters · Coaches</li>
            <li>Airport · Corporate · Events · Leisure</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Velora. All rights reserved.</span>
        <div>
          <Link to="/services">Services</Link>
          <Link to="/fleet">Fleet</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
