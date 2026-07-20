import { Briefcase, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import VehicleArt from "./VehicleArt";

function FleetCardContent({ vehicle, selectable, selected }) {
  return (
    <>
      <div className="fleet-art-shell">
        <img
          className="fleet-photo"
          src={vehicle.image}
          alt=""
          loading="lazy"
          style={{ objectPosition: vehicle.imagePosition || "center" }}
        />
        <div className="fleet-photo-shade" />
        <VehicleArt kind={vehicle.kind} />
        <span className="fleet-category-label">Velora collection</span>
      </div>
      <div className="fleet-card-body">
        <div className="fleet-title-row">
          <div>
            <span className="card-kicker">{vehicle.model}</span>
            <h3>{vehicle.name}</h3>
          </div>
          <strong className="fleet-price">From ${vehicle.from}</strong>
        </div>
        <div className="fleet-capacity">
          <span><Users size={17} /> {vehicle.passengers} passengers</span>
          <span><Briefcase size={17} /> {vehicle.luggage} luggage</span>
        </div>
        <p>{vehicle.tagline}</p>
        {selectable ? (
          <span className="button button-outline button-full">
            {selected ? "Selected" : "Choose vehicle"}
          </span>
        ) : (
          <Link className="button button-outline button-full" to={`/booking?vehicle=${vehicle.id}`}>
            Book this vehicle
          </Link>
        )}
      </div>
    </>
  );
}

export default function FleetCard({
  vehicle,
  selectable = false,
  selected = false,
  onSelect,
  index = 0,
}) {
  if (selectable) {
    return (
      <button
        type="button"
        className={`fleet-card selectable-card ${selected ? "selected" : ""}`}
        onClick={() => onSelect?.(vehicle.id)}
      >
        <FleetCardContent vehicle={vehicle} selectable selected={selected} />
      </button>
    );
  }

  return (
    <Reveal
      as="article"
      className="fleet-card"
      delay={Math.min(index * 100, 500)}
    >
      <FleetCardContent vehicle={vehicle} selectable={false} selected={false} />
    </Reveal>
  );
}
