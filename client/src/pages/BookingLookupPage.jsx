import { CalendarDays, CarFront, Mail, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { apiFetch } from "../api";
import PageHero from "../components/PageHero";
import StatusBadge from "../components/StatusBadge";

export default function BookingLookupPage() {
  const [form, setForm] = useState({ reference: "", email: "" });
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setBooking(null);

    try {
      const data = await apiFetch("/bookings/lookup", { method: "POST", body: form });
      setBooking(data.booking);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <PageHero
        eyebrow="My booking"
        title="Check your reservation status"
        text="Enter the confirmation reference and email used for your reservation request."
        image="/images/nyc-skyline.webp"
        imagePosition="center 42%"
        badge="Live reservation status"
      />
      <section className="section lookup-section">
        <div className="container lookup-layout">
          <form className="form-card lookup-form" onSubmit={submit}>
            <label><span>Booking reference</span><input placeholder="VEL-260717-ABC123" value={form.reference} onChange={(event) => setForm({ ...form, reference: event.target.value.toUpperCase() })} required /></label>
            <label><span>Email address</span><input type="email" placeholder="you@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
            {error && <div className="form-feedback error">{error}</div>}
            <button className="button button-full" type="submit" disabled={loading}>
              {loading ? "Searching..." : "Find booking"} <Search size={18} />
            </button>
          </form>

          <div className="lookup-result-shell">
            {!booking ? (
              <div className="empty-state">
                <Search size={42} />
                <h3>Your trip details will appear here</h3>
                <p>Use the reference from your booking confirmation.</p>
              </div>
            ) : (
              <article className="booking-result-card">
                <div className="booking-result-header">
                  <div><span>Booking reference</span><h2>{booking.reference}</h2></div>
                  <StatusBadge value={booking.status} />
                </div>
                <div className="booking-detail-grid">
                  <div><MapPin /><span>Pickup</span><strong>{booking.pickupAddress}</strong></div>
                  <div><MapPin /><span>Drop-off</span><strong>{booking.dropoffAddress || "Hourly service"}</strong></div>
                  <div><CalendarDays /><span>Date & time</span><strong>{booking.pickupDate} · {booking.pickupTime}</strong></div>
                  <div><CarFront /><span>Vehicle</span><strong>{booking.price?.vehicleLabel || booking.vehicleType}</strong></div>
                  <div><Mail /><span>Payment</span><strong><StatusBadge value={booking.paymentStatus} /></strong></div>
                  <div className="price-detail"><span>Estimated fare</span><strong>${Number(booking.price?.total || 0).toFixed(2)} USD</strong></div>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
