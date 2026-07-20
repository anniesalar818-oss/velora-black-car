import { Search } from "lucide-react";
import { useState } from "react";

import { supabase } from "../supabase";

export default function BookingLookupPage() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const findBooking = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setBooking(null);

    try {
      const cleanReference = reference.trim();
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanReference || !cleanEmail) {
        throw new Error("Booking reference aur email dono enter karo.");
      }

      const { data, error: supabaseError } = await supabase
        .from("bookings")
        .select("*")
        .eq("booking_reference", cleanReference)
        .ilike("email", cleanEmail)
        .maybeSingle();

      if (supabaseError) {
        throw supabaseError;
      }

      if (!data) {
        throw new Error(
          "Booking nahi mili. Reference aur email dobara check karo."
        );
      }

      setBooking(data);
    } catch (requestError) {
      setError(
        requestError.message || "Booking search nahi ho saki."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="booking-lookup-page">
      <section className="section">
        <div className="container booking-lookup-layout">
          <form
            className="booking-lookup-form"
            onSubmit={findBooking}
          >
            <h1>Find your booking</h1>

            <p>
              Apni booking confirmation ka reference aur email
              enter karo.
            </p>

            <label>
              <span>Booking reference</span>

              <input
                type="text"
                value={reference}
                onChange={(event) =>
                  setReference(event.target.value)
                }
                placeholder="VEL-123456789"
                required
              />
            </label>

            <label>
              <span>Email address</span>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                required
              />
            </label>

            {error && (
              <div className="form-feedback error">
                {error}
              </div>
            )}

            <button
              className="button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Searching..." : "Find booking"}
              <Search size={19} />
            </button>
          </form>

          <section className="booking-lookup-result">
            {!booking ? (
              <div className="booking-empty-state">
                <Search size={54} />

                <h2>Your trip details will appear here</h2>

                <p>
                  Use the reference from your booking confirmation.
                </p>
              </div>
            ) : (
              <article className="booking-details-card">
                <div className="booking-details-heading">
                  <div>
                    <p className="eyebrow">Booking confirmed</p>

                    <h2>{booking.booking_reference}</h2>
                  </div>

                  <span className="status-badge">
                    {booking.booking_status || "pending"}
                  </span>
                </div>

                <div className="booking-details-grid">
                  <div>
                    <span>Customer</span>
                    <strong>{booking.customer_name}</strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>{booking.email}</strong>
                  </div>

                  <div>
                    <span>Phone</span>
                    <strong>{booking.phone}</strong>
                  </div>

                  <div>
                    <span>Service</span>
                    <strong>{booking.service_type}</strong>
                  </div>

                  <div>
                    <span>Vehicle</span>
                    <strong>{booking.vehicle_type}</strong>
                  </div>

                  <div>
                    <span>Passengers</span>
                    <strong>{booking.passengers}</strong>
                  </div>

                  <div>
                    <span>Pickup</span>
                    <strong>{booking.pickup_address}</strong>
                  </div>

                  <div>
                    <span>Destination</span>
                    <strong>{booking.dropoff_address}</strong>
                  </div>

                  <div>
                    <span>Date</span>
                    <strong>{booking.pickup_date}</strong>
                  </div>

                  <div>
                    <span>Time</span>
                    <strong>{booking.pickup_time}</strong>
                  </div>

                  <div>
                    <span>Estimated price</span>
                    <strong>
                      {booking.estimated_price
                        ? `$${Number(
                            booking.estimated_price
                          ).toFixed(2)}`
                        : "To be confirmed"}
                    </strong>
                  </div>

                  <div>
                    <span>Payment</span>
                    <strong>
                      {booking.payment_status || "unpaid"}
                    </strong>
                  </div>
                </div>
              </article>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}