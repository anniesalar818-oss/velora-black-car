import { ArrowRight, Droplets, ShieldCheck, Smartphone, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import FleetCard from "../components/FleetCard";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { fleet } from "../data/siteData";

const amenities = [
  { icon: Wifi, title: "Complimentary Wi-Fi", text: "Stay connected while you travel." },
  { icon: Droplets, title: "Premium water", text: "Refreshments prepared before pickup." },
  { icon: Smartphone, title: "Device charging", text: "Charging support for modern devices." },
  { icon: ShieldCheck, title: "Fully insured", text: "Commercial coverage for every journey." },
];

export default function FleetPage() {
  return (
    <main>
      <PageHero
        eyebrow="The Velora fleet"
        title="The right vehicle for every journey"
        text="From refined sedans to executive coaches, select a fleet category designed around your passengers, luggage, and occasion."
        image="/images/fleet-luxury-sedan.webp"
        imagePosition="center"
        badge="Sedan · SUV · Sprinter · Coach"
      />

      <section className="section">
        <div className="container fleet-grid fleet-page-grid">
          {fleet.map((vehicle, index) => (
            <FleetCard key={vehicle.id} vehicle={vehicle} index={index} />
          ))}
        </div>
      </section>

      <section className="section section-dark amenities-section">
        <div className="container amenities-showcase">
          <Reveal className="amenities-photo" direction="left">
            <img src="/images/luxury-interior.webp" alt="Premium leather vehicle interior" loading="lazy" />
            <div className="amenities-photo-shade" />
            <div>
              <span className="eyebrow">Inside the experience</span>
              <h3>Quiet comfort, prepared personally.</h3>
            </div>
          </Reveal>

          <div>
            <Reveal className="amenities-heading" direction="right">
              <span className="eyebrow">Prepared for the journey</span>
              <h2>Comfort is considered before you arrive</h2>
            </Reveal>
            <div className="amenities-grid">
              {amenities.map(({ icon: Icon, title, text }, index) => (
                <Reveal as="article" key={title} className="amenity-card" delay={index * 95} direction="right">
                  <Icon />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section final-cta-section final-cta-page-section">
        <Reveal className="container final-cta">
          <div className="final-cta-media" aria-hidden="true">
            <img src="/images/hero-car.webp" alt="" />
          </div>
          <div className="final-cta-shade" />
          <div className="final-cta-copy">
            <span className="eyebrow">Not sure which vehicle?</span>
            <h2>We will match the fleet to your trip.</h2>
            <p>Share passenger and luggage details and our concierge will recommend the best fit.</p>
          </div>
          <Link className="button" to="/booking">
            Build your reservation <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
