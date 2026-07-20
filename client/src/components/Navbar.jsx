import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/fleet", label: "Fleet" },
  { to: "/booking-lookup", label: "My Booking" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [location.pathname]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
      <div className="container navbar-shell">
        <Link className="brand" to="/" aria-label="Velora home">
          <span className="brand-mark">V</span>
          <span>
            <strong>VELORA</strong>
            <small>Premium Black Car Service</small>
          </span>
        </Link>

        <nav className={`desktop-nav ${open ? "mobile-open" : ""}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {link.label}
            </NavLink>
          ))}
          <a className="mobile-phone-link" href="tel:+923121538569">
            <Phone size={18} /> 0312 1538569
          </a>
        </nav>

        <div className="nav-actions">
          <a className="nav-phone" href="tel:+923121538569" aria-label="Call Velora">
            <Phone size={18} />
          </a>
          <Link className="button button-small" to="/booking">
            Reserve a Ride
          </Link>
          <button
            className="menu-button"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
