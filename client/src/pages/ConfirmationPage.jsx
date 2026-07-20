import { CalendarDays, CheckCircle2, Mail, MapPin, Search } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";

export default function ConfirmationPage() {
  const { reference } = useParams();
  const location = useLocation();
  const booking = location.state?.booking;
  const warning = location.state?.warning;

  return (
    <main className="confirmation-page">
      <section className="section confirmation-section">
        <div className="container confirmation-shell">
          <div className="success-icon"><CheckCircle2 /></div>
          <span className="eyebrow">Reservation received</span>
          <h1>Thank you for choosing Velora.</h1>
          <p className="confirmation-lead">
            Your request is now with our concierge team. We will confirm vehicle
            availability and final trip details shortly.
          </p>
          {warning && <div className="form-feedback warning">{warning}</div>}

          <div className="reference-card">
            <span>Booking reference</span>
            <strong>{booking?.reference || reference}</strong>
            <small>Save this reference to check your booking status.</small>
          </div>

          {booking && (
            <div className="confirmation-details">
              <div><MapPin /><span>Pickup</span><strong>{booking.pickupAddress}</strong></div>
              <div><MapPin /><span>Drop-off</span><strong>{booking.dropoffAddress || "Hourly service"}</strong></div>
              <div><CalendarDays /><span>Date & time</span><strong>{booking.pickupDate} · {booking.pickupTime}</strong></div>
              <div><Mail /><span>Status</span><strong><StatusBadge value={booking.status} /></strong></div>
              <div className="confirmation-price"><span>Estimated total</span><strong>${Number(booking.price?.total || 0).toFixed(2)} USD</strong></div>
            </div>
          )}

          <div className="confirmation-actions">
            <Link className="button" to="/booking-lookup"><Search size={18} /> Check booking status</Link>
            <Link className="button button-ghost" to="/">Return home</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
