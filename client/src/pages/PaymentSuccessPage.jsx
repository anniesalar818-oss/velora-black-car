import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState({ loading: true, error: "", booking: null });

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setState({ loading: false, error: "Missing Stripe session ID.", booking: null });
      return;
    }

    apiFetch(`/payments/session/${encodeURIComponent(sessionId)}`)
      .then((data) => setState({ loading: false, error: "", booking: data.booking }))
      .catch((error) => setState({ loading: false, error: error.message, booking: null }));
  }, [searchParams]);

  return (
    <main className="confirmation-page">
      <section className="section confirmation-section">
        <div className="container confirmation-shell">
          {state.loading ? (
            <><LoaderCircle className="spin-icon" /><h1>Confirming your payment...</h1><p>Please keep this page open for a moment.</p></>
          ) : state.error ? (
            <><div className="success-icon error"><XCircle /></div><h1>We could not verify the payment.</h1><p>{state.error}</p><Link className="button" to="/contact">Contact concierge</Link></>
          ) : (
            <><div className="success-icon"><CheckCircle2 /></div><span className="eyebrow">Payment confirmed</span><h1>Your reservation is confirmed.</h1><p>Thank you. A confirmation has been attached to booking <strong>{state.booking?.reference}</strong>.</p><div className="confirmation-actions"><Link className="button" to="/booking-lookup">View booking</Link><Link className="button button-ghost" to="/">Return home</Link></div></>
          )}
        </div>
      </section>
    </main>
  );
}
