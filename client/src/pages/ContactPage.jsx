import { Clock3, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { apiFetch } from "../api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "Reservation enquiry",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const data = await apiFetch("/contact", { method: "POST", body: form });
      setFeedback({ type: "success", message: data.message });
      setForm(initialForm);
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    { icon: Phone, title: "Call us", content: <a href="tel:+923121538569">0312 1538569</a>, note: "24/7 reservations & support" },
    { icon: Mail, title: "Email us", content: <a href="mailto:anniesalar818@gmail.com">anniesalar818@gmail.com</a>, note: "Prompt concierge response" },
    { icon: MapPin, title: "Visit us", content: <p>Karachi, Pakistan</p>, note: "By appointment only" },
    { icon: Clock3, title: "Availability", content: <p>Monday – Sunday<br />24 hours / 7 days</p>, note: "Advance booking recommended" },
  ];

  return (
    <main>
      <PageHero
        eyebrow="Contact Velora"
        title="A concierge is always within reach"
        text="For reservations, fleet questions, recurring corporate service, or special requests, contact our team at any hour."
        image="/images/contact-office.webp"
        imagePosition="center 54%"
        badge="24/7 reservations & live support"
      />

      <section className="section contact-section">
        <div className="container contact-info-grid">
          {contactCards.map(({ icon: Icon, title, content, note }, index) => (
            <Reveal as="article" key={title} className="contact-info-card" delay={index * 90}>
              <Icon /><h3>{title}</h3>{content}<span>{note}</span>
            </Reveal>
          ))}
        </div>

        <div className="container contact-form-layout">
          <Reveal className="contact-copy" direction="left">
            <span className="eyebrow">Send a message</span>
            <h2>How may we assist?</h2>
            <p>
              Share your itinerary or question. For urgent same-day requests,
              calling our reservation line is recommended.
            </p>
            <div className="contact-copy-photo">
              <img src="/images/nyc-skyline.webp" alt="Karachi city skyline at night" loading="lazy" />
              <div className="contact-copy-photo-shade" />
              <span>Karachi · Available around the clock</span>
            </div>
          </Reveal>

          <Reveal as="form" className="form-card" direction="right" onSubmit={submit}>
            <div className="form-grid form-grid-two">
              <label><span>Name</span><input name="name" value={form.name} onChange={update} required /></label>
              <label><span>Email</span><input type="email" name="email" value={form.email} onChange={update} required /></label>
              <label><span>Phone</span><input name="phone" value={form.phone} onChange={update} /></label>
              <label><span>Subject</span><select name="subject" value={form.subject} onChange={update}><option>Reservation enquiry</option><option>Corporate account</option><option>Group transportation</option><option>Existing booking</option><option>General question</option></select></label>
            </div>
            <label><span>Message</span><textarea name="message" rows="6" value={form.message} onChange={update} required /></label>
            {feedback && <div className={`form-feedback ${feedback.type}`}>{feedback.message}</div>}
            <button className="button" disabled={loading} type="submit">
              {loading ? "Sending..." : "Send message"} <Send size={18} />
            </button>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
