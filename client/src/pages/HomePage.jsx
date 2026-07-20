import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Headphones,
  MapPin,
  PlaneTakeoff,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import FleetCard from "../components/FleetCard";
import Reveal from "../components/Reveal";
import SectionTitle from "../components/SectionTitle";
import ServiceCard from "../components/ServiceCard";
import { fleet, processSteps, services } from "../data/siteData";

export default function HomePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-media" aria-hidden="true">
          <img src="/images/hero-car.webp" alt="" />
        </div>
        <div className="hero-media-shade" />
        <div className="hero-grid-overlay" />
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow hero-enter hero-enter-1">
              <Sparkles size={16} /> New York · Tri-State · Worldwide coordination
            </span>
            <h1 className="hero-enter hero-enter-2">
              Luxury travel,
              <em> thoughtfully driven.</em>
            </h1>
            <p className="hero-enter hero-enter-3">
              Premium black car service for airport transfers, corporate travel,
              private events, and every journey that deserves a higher standard.
            </p>
            <div className="hero-actions hero-enter hero-enter-4">
              <Link className="button" to="/booking">
                Reserve your ride <ArrowRight size={18} />
              </Link>
              <Link className="button button-ghost" to="/fleet">
                Explore the fleet
              </Link>
            </div>
            <div className="hero-proof hero-enter hero-enter-5">
              <span><BadgeCheck size={18} /> Licensed & insured</span>
              <span><Clock3 size={18} /> 24/7 concierge</span>
              <span><ShieldCheck size={18} /> Private & secure</span>
            </div>
          </div>

          <div className="hero-visual hero-enter hero-enter-4">
            <div className="hero-image-frame">
              <img src="/images/luxury-interior.webp" alt="Luxury vehicle interior" />
              <div className="hero-image-frame-shade" />
              <span className="hero-image-caption">A quieter standard of travel</span>
            </div>
            <div className="hero-floating-card hero-floating-top">
              <PlaneTakeoff size={21} />
              <div>
                <span>Airport service</span>
                <strong>JFK · LGA · EWR · TEB</strong>
              </div>
            </div>
            <div className="hero-floating-card hero-floating-bottom">
              <Headphones size={22} />
              <div>
                <span>Concierge</span>
                <strong>Always on call</strong>
              </div>
            </div>
            <div className="hero-route-card">
              <div><MapPin size={17} /><span>Manhattan</span></div>
              <i />
              <div><PlaneTakeoff size={17} /><span>JFK Airport</span></div>
            </div>
          </div>
        </div>

        <div className="hero-scroll-cue" aria-hidden="true">
          <span />
          Discover Velora
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-grid">
          {[
            ["24/7", "Reservations"],
            ["4", "NYC airports served"],
            ["6–56", "Passenger options"],
            ["100%", "Professional chauffeurs"],
          ].map(([number, label], index) => (
            <Reveal key={label} delay={index * 90}>
              <strong>{number}</strong><span>{label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section signature-section">
        <div className="container signature-layout">
          <div>
            <SectionTitle
              eyebrow="The Velora standard"
              title={<>Where elegance meets <em>the horizon.</em></>}
              text="Every journey is orchestrated with precision, discretion, and an unwavering commitment to excellence."
            />
            <div className="signature-points">
              {[
                ["01", "Punctual by design", "Live trip monitoring and proactive dispatch keep every pickup on schedule."],
                ["02", "Concierge-level care", "From special requests to itinerary changes, a real person is always available."],
                ["03", "A fleet without compromise", "Meticulously presented sedans, SUVs, Sprinters, and executive coaches."],
              ].map(([number, title, text], index) => (
                <Reveal key={number} delay={index * 100} direction="left">
                  <span>{number}</span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="signature-panel" direction="right">
            <div className="signature-panel-media" aria-hidden="true">
              <img src="/images/nyc-skyline.webp" alt="" />
            </div>
            <div className="signature-panel-shade" />
            <div className="signature-panel-content">
              <div className="signature-panel-number">15+</div>
              <h3>Years of hospitality-led transportation</h3>
              <p>
                Built for executives, families, hotels, event planners, and guests
                who expect every detail to be handled before they need to ask.
              </p>
            </div>
            <div className="signature-panel-footer">
              <span>JFK</span><span>LGA</span><span>EWR</span><span>TEB</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <SectionTitle
            eyebrow="Signature services"
            title="Transportation for every occasion"
            text="One trusted team for airport arrivals, executive schedules, private celebrations, and complex group movements."
          />
          <div className="service-grid home-service-grid">
            {services.slice(0, 6).map((service, index) => (
              <ServiceCard key={service.id} service={service} compact index={index} />
            ))}
          </div>
          <Reveal className="center-action" delay={120}>
            <Link className="button button-outline" to="/services">
              View all services <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section fleet-preview-section">
        <div className="container">
          <SectionTitle
            eyebrow="The fleet"
            title="Choose your level of comfort"
            text="Every category is professionally chauffeured, climate controlled, and prepared to Velora standards."
          />
          <div className="fleet-grid home-fleet-grid">
            {fleet.slice(0, 3).map((vehicle, index) => (
              <FleetCard key={vehicle.id} vehicle={vehicle} index={index} />
            ))}
          </div>
          <Reveal className="center-action" delay={120}>
            <Link className="text-button" to="/fleet">
              Explore the complete fleet <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="cinematic-band">
        <div className="cinematic-band-media" aria-hidden="true">
          <img src="/images/contact-office.webp" alt="" />
        </div>
        <div className="cinematic-band-shade" />
        <Reveal className="container cinematic-band-content">
          <span className="eyebrow">Beyond transportation</span>
          <h2>Every detail, already considered.</h2>
          <p>Quiet cabins, real-time coordination, and a concierge who stays one step ahead.</p>
          <Link className="button button-ghost" to="/contact">Speak with concierge <ArrowRight size={18} /></Link>
        </Reveal>
      </section>

      <section className="section process-section">
        <div className="container">
          <SectionTitle
            eyebrow="Simple process"
            title="From request to arrival"
            text="A clear booking experience, backed by a concierge team whenever you need us."
          />
          <div className="process-grid">
            {processSteps.map((step, index) => (
              <Reveal as="article" key={step.number} className="process-card" delay={index * 110}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section testimonial-section">
        <Reveal className="container testimonial-shell">
          <span className="eyebrow">Client experience</span>
          <div className="stars" aria-label="5 out of 5 stars">
            {[1, 2, 3, 4, 5].map((item) => <Star key={item} fill="currentColor" />)}
          </div>
          <blockquote>
            “Velora handled a four-stop executive itinerary flawlessly. The car
            was immaculate, the chauffeur was early, and every schedule change
            was managed before it became a problem.”
          </blockquote>
          <div className="testimonial-author">
            <strong>Jonathan Reyes</strong>
            <span>Corporate Counsel · Manhattan</span>
          </div>
        </Reveal>
      </section>

      <section className="section final-cta-section">
        <Reveal className="container final-cta">
          <div className="final-cta-media" aria-hidden="true">
            <img src="/images/hero-car.webp" alt="" />
          </div>
          <div className="final-cta-shade" />
          <div className="final-cta-copy">
            <span className="eyebrow">Your journey, elevated</span>
            <h2>Ready to experience Velora?</h2>
            <p>Request your ride in minutes. Our concierge team is available around the clock.</p>
          </div>
          <Link className="button" to="/booking">
            Start your reservation <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
