import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CreditCard,
  Info,
  MapPin,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";
import FleetCard from "../components/FleetCard";
import PageHero from "../components/PageHero";
import { fleet } from "../data/siteData";

const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

const initialForm = {
  serviceType: "airport",
  pickupAddress: "",
  dropoffAddress: "",
  pickupDate: tomorrow(),
  pickupTime: "10:00",
  returnTrip: false,
  returnDate: "",
  returnTime: "",
  flightNumber: "",
  vehicleType: "luxury-sedan",
  passengers: 1,
  luggage: 1,
  distanceKm: 25,
  durationHours: 2,
  customerName: "",
  email: "",
  phone: "",
  specialRequests: "",
  paymentMethod: "pay-later",
};

const serviceOptions = [
  ["airport", "Airport transfer"],
  ["point-to-point", "Point-to-point"],
  ["hourly", "Hourly chauffeur"],
  ["corporate", "Corporate travel"],
  ["event", "Wedding or event"],
  ["city-tour", "City tour & leisure"],
];

const validServiceTypes = new Set(serviceOptions.map(([value]) => value));
const pricingFields = new Set([
  "serviceType",
  "pickupTime",
  "returnTrip",
  "vehicleType",
  "distanceKm",
  "durationHours",
]);

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => ({
    ...initialForm,
    serviceType: validServiceTypes.has(searchParams.get("service"))
      ? searchParams.get("service")
      : initialForm.serviceType,
    vehicleType: fleet.some((item) => item.id === searchParams.get("vehicle"))
      ? searchParams.get("vehicle")
      : initialForm.vehicleType,
  }));
  const [quote, setQuote] = useState(null);
  const [config, setConfig] = useState({ stripeEnabled: false });
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedVehicle = useMemo(
    () => fleet.find((item) => item.id === form.vehicleType),
    [form.vehicleType],
  );

  useEffect(() => {
    apiFetch("/public/config")
      .then((data) => setConfig(data.config))
      .catch(() => {});
  }, []);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (pricingFields.has(name)) setQuote(null);
    setError("");
  };

  const chooseVehicle = (vehicleType) => {
    setForm((current) => ({ ...current, vehicleType }));
    setQuote(null);
  };

  const validateStepOne = () => {
    if (!form.pickupAddress || !form.pickupDate || !form.pickupTime) {
      setError("Pickup address, date, and time are required.");
      return false;
    }
    if (form.serviceType !== "hourly" && !form.dropoffAddress) {
      setError("Drop-off address is required for this service.");
      return false;
    }
    if (form.returnTrip && (!form.returnDate || !form.returnTime)) {
      setError("Please add return date and time.");
      return false;
    }
    return true;
  };

  const getQuote = async () => {
    setLoadingQuote(true);
    setError("");
    try {
      const data = await apiFetch("/bookings/quote", {
        method: "POST",
        body: {
          serviceType: form.serviceType,
          vehicleType: form.vehicleType,
          distanceKm: Number(form.distanceKm || 0),
          durationHours: Number(form.durationHours || 0),
          pickupTime: form.pickupTime,
          returnTrip: Boolean(form.returnTrip),
        },
      });
      setQuote(data.quote);
      return data.quote;
    } catch (requestError) {
      setError(requestError.message);
      return null;
    } finally {
      setLoadingQuote(false);
    }
  };

  const nextStep = async () => {
    setError("");
    if (step === 1) {
      if (!validateStepOne()) return;
      setStep(2);
      return;
    }
    if (step === 2) {
      const result = quote || (await getQuote());
      if (result) setStep(3);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.customerName || !form.email || !form.phone) {
      setError("Name, email, and phone are required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const bookingResponse = await apiFetch("/bookings", {
        method: "POST",
        body: {
          ...form,
          passengers: Number(form.passengers),
          luggage: Number(form.luggage),
          distanceKm: Number(form.distanceKm || 0),
          durationHours: Number(form.durationHours || 0),
          returnTrip: Boolean(form.returnTrip),
        },
      });

      const booking = bookingResponse.booking;

      if (form.paymentMethod === "card" && config.stripeEnabled) {
        try {
          const payment = await apiFetch("/payments/checkout", {
            method: "POST",
            body: { bookingId: booking.id },
          });
          window.location.assign(payment.checkoutUrl);
          return;
        } catch (paymentError) {
          navigate(`/confirmation/${booking.reference}`, {
            state: {
              booking,
              warning: `Booking saved, but card checkout could not start: ${paymentError.message}`,
            },
          });
          return;
        }
      }

      navigate(`/confirmation/${booking.reference}`, { state: { booking } });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <PageHero
        eyebrow="Reserve your ride"
        title="A premium journey begins here"
        text="Share your trip details, choose your vehicle, and receive an immediate estimated fare before submitting your request."
        image="/images/luxury-interior.webp"
        imagePosition="center 60%"
        badge="Secure booking · Instant estimate · 24/7 support"
      />

      <section className="section booking-section">
        <div className="container booking-layout">
          <div className="booking-main">
            <div className="booking-progress">
              {[1, 2, 3].map((number) => (
                <div key={number} className={`progress-step ${step >= number ? "active" : ""}`}>
                  <span>{step > number ? <Check size={16} /> : number}</span>
                  <strong>{number === 1 ? "Journey" : number === 2 ? "Vehicle" : "Contact & payment"}</strong>
                </div>
              ))}
            </div>

            <form className="booking-form-card" onSubmit={submit}>
              {step === 1 && (
                <div className="form-step">
                  <div className="step-heading"><MapPin /><div><span>Step 1</span><h2>Tell us about the journey</h2></div></div>
                  <div className="form-grid form-grid-two">
                    <label><span>Service type</span><select name="serviceType" value={form.serviceType} onChange={update}>{serviceOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                    <label><span>Flight number <small>(optional)</small></span><input name="flightNumber" value={form.flightNumber} onChange={update} placeholder="e.g. AA 102" /></label>
                    <label className="form-span-two"><span>Pickup address</span><input name="pickupAddress" value={form.pickupAddress} onChange={update} placeholder="Airport, hotel, residence, or full address" required /></label>
                    {form.serviceType !== "hourly" && <label className="form-span-two"><span>Drop-off address</span><input name="dropoffAddress" value={form.dropoffAddress} onChange={update} placeholder="Destination address" required /></label>}
                    <label><span>Pickup date</span><input type="date" min={tomorrow()} name="pickupDate" value={form.pickupDate} onChange={update} required /></label>
                    <label><span>Pickup time</span><input type="time" name="pickupTime" value={form.pickupTime} onChange={update} required /></label>
                    <label><span>Passengers</span><input type="number" min="1" max="56" name="passengers" value={form.passengers} onChange={update} /></label>
                    <label><span>Luggage pieces</span><input type="number" min="0" max="56" name="luggage" value={form.luggage} onChange={update} /></label>
                  </div>
                  <label className="checkbox-field"><input type="checkbox" name="returnTrip" checked={form.returnTrip} onChange={update} /><span><strong>Add a return trip</strong><small>Estimate both directions in one request.</small></span></label>
                  {form.returnTrip && <div className="form-grid form-grid-two return-fields"><label><span>Return date</span><input type="date" name="returnDate" min={form.pickupDate} value={form.returnDate} onChange={update} /></label><label><span>Return time</span><input type="time" name="returnTime" value={form.returnTime} onChange={update} /></label></div>}
                </div>
              )}

              {step === 2 && (
                <div className="form-step">
                  <div className="step-heading"><WalletCards /><div><span>Step 2</span><h2>Choose the right vehicle</h2></div></div>
                  <div className="booking-fleet-grid">
                    {fleet.map((vehicle) => <FleetCard key={vehicle.id} vehicle={vehicle} selectable selected={form.vehicleType === vehicle.id} onSelect={chooseVehicle} />)}
                  </div>
                  <div className="form-grid form-grid-two estimate-inputs">
                    {form.serviceType === "hourly" ? (
                      <label><span>Hours required</span><input type="number" min="1" step="0.5" name="durationHours" value={form.durationHours} onChange={update} /></label>
                    ) : (
                      <label><span>Estimated distance (km)</span><input type="number" min="0" step="1" name="distanceKm" value={form.distanceKm} onChange={update} /></label>
                    )}
                    <div className="estimate-note"><Info size={18} /><span>Distance is used for an initial estimate. The concierge confirms the final route and any tolls.</span></div>
                  </div>
                  <button type="button" className="button button-outline" onClick={getQuote} disabled={loadingQuote}>{loadingQuote ? "Calculating..." : "Calculate estimate"}</button>
                </div>
              )}

              {step === 3 && (
                <div className="form-step">
                  <div className="step-heading"><UserRound /><div><span>Step 3</span><h2>Contact and payment preference</h2></div></div>
                  <div className="form-grid form-grid-two">
                    <label><span>Full name</span><input name="customerName" value={form.customerName} onChange={update} required /></label>
                    <label><span>Phone number</span><input name="phone" value={form.phone} onChange={update} required /></label>
                    <label className="form-span-two"><span>Email address</span><input type="email" name="email" value={form.email} onChange={update} required /></label>
                    <label className="form-span-two"><span>Special requests <small>(optional)</small></span><textarea rows="4" name="specialRequests" value={form.specialRequests} onChange={update} placeholder="Child seats, meet-and-greet sign, extra stops, accessibility needs..." /></label>
                  </div>
                  <div className="payment-choice-grid">
                    <label className={`payment-choice ${form.paymentMethod === "pay-later" ? "selected" : ""}`}><input type="radio" name="paymentMethod" value="pay-later" checked={form.paymentMethod === "pay-later"} onChange={update} /><WalletCards /><span><strong>Pay later</strong><small>Concierge confirms the reservation and payment details.</small></span></label>
                    <label className={`payment-choice ${form.paymentMethod === "card" ? "selected" : ""} ${!config.stripeEnabled ? "disabled" : ""}`}><input type="radio" name="paymentMethod" value="card" checked={form.paymentMethod === "card"} onChange={update} disabled={!config.stripeEnabled} /><CreditCard /><span><strong>Pay by card</strong><small>{config.stripeEnabled ? "Secure Stripe checkout after booking." : "Enable Stripe keys in server/.env."}</small></span></label>
                  </div>
                  <div className="security-note"><ShieldCheck /><span>Your reservation details are sent securely and used only to manage your journey.</span></div>
                </div>
              )}

              {error && <div className="form-feedback error">{error}</div>}

              <div className="booking-form-actions">
                {step > 1 ? <button type="button" className="button button-ghost" onClick={() => setStep((value) => value - 1)}><ArrowLeft size={18} /> Back</button> : <span />}
                {step < 3 ? <button type="button" className="button" onClick={nextStep} disabled={loadingQuote}>Continue <ArrowRight size={18} /></button> : <button className="button" type="submit" disabled={submitting}>{submitting ? "Submitting..." : form.paymentMethod === "card" ? "Reserve & pay" : "Submit reservation"} <ArrowRight size={18} /></button>}
              </div>
            </form>
          </div>

          <aside className="booking-summary-card">
            <span className="eyebrow">Journey summary</span>
            <h3>{selectedVehicle?.name || "Select a vehicle"}</h3>
            <div className="summary-list">
              <div><span>Service</span><strong>{serviceOptions.find(([value]) => value === form.serviceType)?.[1]}</strong></div>
              <div><span>Pickup</span><strong>{form.pickupAddress || "Not added"}</strong></div>
              <div><span>Destination</span><strong>{form.serviceType === "hourly" ? "Hourly reservation" : form.dropoffAddress || "Not added"}</strong></div>
              <div><span>Date</span><strong>{form.pickupDate} · {form.pickupTime}</strong></div>
              <div><span>Passengers</span><strong>{form.passengers}</strong></div>
            </div>
            {quote ? (
              <div className="quote-box">
                <div><span>Base fare</span><strong>${quote.baseFare.toFixed(2)}</strong></div>
                {quote.distanceCharge > 0 && <div><span>Distance</span><strong>${quote.distanceCharge.toFixed(2)}</strong></div>}
                {quote.hourlyCharge > 0 && <div><span>Hourly service</span><strong>${quote.hourlyCharge.toFixed(2)}</strong></div>}
                {quote.surcharges > 0 && <div><span>Surcharges</span><strong>${quote.surcharges.toFixed(2)}</strong></div>}
                <div className="quote-total"><span>Estimated total</span><strong>${quote.total.toFixed(2)} USD</strong></div>
                <small>{quote.note}</small>
              </div>
            ) : (
              <div className="quote-placeholder"><CalendarDays /><p>Your fare estimate will appear after the vehicle step.</p></div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
