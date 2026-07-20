import { Clock3, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { supabase } from "../supabase";

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
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const { error } = await supabase.from("enquiries").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        subject: form.subject,
        message: form.message.trim(),
      });

      if (error) {
        throw error;
      }

      setFeedback({
        type: "success",
        message: "Message sent successfully.",
      });

      setForm(initialForm);
    } catch (error) {
      console.error("Contact form error:", error);

      setFeedback({
        type: "error",
        message: error.message || "Unable to send your message.",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    {
      icon: Phone,
      title: "Call us",
      content: (
        <a href="tel:+923121538569">
          0312 1538569
        </a>
      ),
    },
    {
      icon: Mail,
      title: "Email us",
      content: (
        <a href="mailto:anniesalar818@gmail.com">
          anniesalar818@gmail.com
        </a>
      ),
    },
    {
      icon: MapPin,
      title: "Visit us",
      content: <p>Karachi, Pakistan</p>,
    },
    {
      icon: Clock3,
      title: "Availability",
      content: <p>Available around the clock</p>,
    },
  ];

  return (
    <main>
      <PageHero
        eyebrow="Send a message"
        title="How may we assist?"
        description="Share your itinerary or question. For urgent same-day requests, calling our reservation line is recommended."
        image="/images/contact-office.webp"
      />

      <section className="section contact-section">
        <div className="container contact-layout">
          <Reveal>
            <div className="contact-information">
              <div className="contact-cards">
                {contactCards.map(({ icon: Icon, title, content }) => (
                  <article className="contact-card" key={title}>
                    <div className="contact-card-icon">
                      <Icon size={22} />
                    </div>

                    <div>
                      <h3>{title}</h3>
                      {content}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <form className="contact-form" onSubmit={submit}>
              <div className="form-grid">
                <label>
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={update}
                    placeholder="Your name"
                    required
                  />
                </label>

                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={update}
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label>
                  <span>Phone</span>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={update}
                    placeholder="Your phone number"
                  />
                </label>

                <label>
                  <span>Subject</span>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={update}
                    required
                  >
                    <option value="Reservation enquiry">
                      Reservation enquiry
                    </option>
                    <option value="Corporate account">
                      Corporate account
                    </option>
                    <option value="Airport transfer">
                      Airport transfer
                    </option>
                    <option value="Event transportation">
                      Event transportation
                    </option>
                    <option value="General enquiry">
                      General enquiry
                    </option>
                  </select>
                </label>
              </div>

              <label>
                <span>Message</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={update}
                  placeholder="How may we assist you?"
                  rows={7}
                  required
                />
              </label>

              {feedback && (
                <div className={`form-feedback ${feedback.type}`}>
                  {feedback.message}
                </div>
              )}

              <button
                className="button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send message"}
                <Send size={19} />
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
  );
}