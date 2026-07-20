import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";

const bookingServiceMap = {
  group: "event",
  coach: "event",
  hotel: "point-to-point",
};

export default function ServiceCard({ service, compact = false, index = 0 }) {
  const Icon = service.icon;
  const bookingService = bookingServiceMap[service.id] || service.id;

  return (
    <Reveal
      as="article"
      className={`service-card ${compact ? "service-card-compact" : ""}`}
      delay={Math.min(index * 90, 450)}
    >
      <div className="service-card-media">
        <img
          src={service.image}
          alt=""
          loading="lazy"
          style={{ objectPosition: service.imagePosition || "center" }}
        />
        <div className="service-card-media-shade" />
        <div className="icon-orb">
          <Icon />
        </div>
        <span className="service-card-index">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <div className="service-card-content">
        <span className="card-kicker">{service.short}</span>
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        {!compact && (
          <div className="tag-row">
            {service.highlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        )}
        <Link className="card-link" to={`/booking?service=${bookingService}`}>
          Reserve service <ArrowUpRight size={17} />
        </Link>
      </div>
    </Reveal>
  );
}
