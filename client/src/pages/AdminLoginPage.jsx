import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@velora.local", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiFetch("/auth/login", { method: "POST", body: form });
      navigate("/admin");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-auth-page">
      <div className="admin-auth-glow" />
      <section className="admin-auth-card">
        <Link className="brand admin-brand" to="/">
          <span className="brand-mark">V</span>
          <span><strong>VELORA</strong><small>Operations Console</small></span>
        </Link>
        <div className="admin-auth-icon"><LockKeyhole /></div>
        <span className="eyebrow">Secure access</span>
        <h1>Admin login</h1>
        <p>Manage reservations, payment status, and customer enquiries.</p>

        <form onSubmit={submit}>
          <label><span>Email address</span><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
          <label><span>Password</span><input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
          {error && <div className="form-feedback error">{error}</div>}
          <button className="button button-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"} <ArrowRight size={18} />
          </button>
        </form>
        <div className="admin-security-note"><ShieldCheck /><span>JWT session stored in a secure HTTP-only cookie.</span></div>
        <Link className="text-link" to="/">Return to website</Link>
      </section>
    </main>
  );
}
