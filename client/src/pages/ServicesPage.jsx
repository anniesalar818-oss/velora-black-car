import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import ServiceCard from "../components/ServiceCard";
import { services } from "../data/siteData";

const standards = [
  "Uniformed, licensed, and discreet chauffeurs",
  "Complimentary bottled water and phone charging",
  "Clean, late-model vehicles prepared before every trip",
  "24/7 reservations and live trip support",
  "Commercial licensing and insurance",
  "Flexible coordination for individuals and groups",
];

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Velora services"
        title="Private transportation, precisely tailored"
        text="From a single airport transfer to a multi-vehicle corporate program, every service is managed with one consistent standard."
        image="/images/service-airport.webp"
        imagePosition="center 58%"
        badge="Airport · Corporate · Events · Leisure"
      />

      <section className="section">
        <div className="container service-grid services-page-grid">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </section>

      <section className="section section-dark standards-section">
        <div className="container standards-layout">
          <Reveal className="standards-copy" direction="left">
            <span className="eyebrow">Included with every ride</span>
            <h2>The Velora standard</h2>
            <p>
              Premium service is not an upgrade. It is the baseline we build every
              reservation around.
            </p>
            <div className="standards-photo">
              <img src="/images/luxury-interior.webp" alt="Premium vehicle interior" loading="lazy" />
              <div className="standards-photo-shade" />
              <span>Prepared before every pickup</span>
            </div>
          </Reveal>
          <div className="standards-grid">
            {standards.map((item, index) => (
              <Reveal key={item} className="standard-item" delay={index * 85} direction="right">
                <CheckCircle2 />
                <span>{item}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section final-cta-section final-cta-page-section">
        <Reveal className="container final-cta">
          <div className="final-cta-media" aria-hidden="true">
            <img src="/images/service-corporate.webp" alt="" />
          </div>
          <div className="final-cta-shade" />
          <div className="final-cta-copy">
            <span className="eyebrow">Custom requirements welcome</span>
            <h2>Tell us what the journey requires.</h2>
            <p>Our concierge team will recommend the service and vehicle plan that fits.</p>
          </div>
          <Link className="button" to="/booking">
            Request a ride <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
