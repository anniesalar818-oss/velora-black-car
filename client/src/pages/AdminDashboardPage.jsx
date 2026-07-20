import { supabase } from "../supabase";
import {
  Banknote,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import StatusBadge from "../components/StatusBadge";

const currency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));

const formatDateTime = (date) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(date))
    : "—";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState("bookings");
  const [mobileNav, setMobileNav] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0, paid: 0, revenue: 0 });
  const [messages, setMessages] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "", paymentStatus: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadBookings = useCallback(async () => {
  setLoading(true);
  setError("");

  try {
    let request = supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters.status) {
      request = request.eq("booking_status", filters.status);
    }

    if (filters.paymentStatus) {
      request = request.eq("payment_status", filters.paymentStatus);
    }

    if (filters.search) {
      const search = filters.search.trim();

      request = request.or(
        `booking_reference.ilike.%${search}%,customer_name.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    const { data, error: supabaseError } = await request;

    if (supabaseError) throw supabaseError;

    const formattedBookings = (data || []).map((booking) => ({
      ...booking,
      bookingReference: booking.booking_reference,
      serviceType: booking.service_type,
      vehicleType: booking.vehicle_type,
      distanceKm: booking.distance_km,
      durationHours: booking.duration_hours,
      pickupAddress: booking.pickup_address,
      dropoffAddress: booking.dropoff_address,
      pickupDate: booking.pickup_date,
      pickupTime: booking.pickup_time,
      returnTrip: booking.return_trip,
      returnDate: booking.return_date,
      returnTime: booking.return_time,
      flightNumber: booking.flight_number,
      specialRequests: booking.special_requests,
      customerName: booking.customer_name,
      estimatedPrice: booking.estimated_price,
      bookingStatus: booking.booking_status,
      paymentStatus: booking.payment_status,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
    }));

    setBookings(formattedBookings);

    setStats({
      total: formattedBookings.length,
      pending: formattedBookings.filter(
        (booking) => booking.bookingStatus === "pending"
      ).length,
      confirmed: formattedBookings.filter(
        (booking) => booking.bookingStatus === "confirmed"
      ).length,
      completed: formattedBookings.filter(
        (booking) => booking.bookingStatus === "completed"
      ).length,
      revenue: formattedBookings.reduce(
        (total, booking) =>
          total +
          (booking.paymentStatus === "paid"
            ? Number(booking.estimatedPrice || 0)
            : 0),
        0
      ),
    });
  } catch (requestError) {
    setError(requestError.message);
  } finally {
    setLoading(false);
  }
}, [filters]);

  const loadMessages = useCallback(async () => {
  setLoading(true);
  setError("");

  try {
    const { data, error: supabaseError } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (supabaseError) throw supabaseError;

    const formattedMessages = (data || []).map((message) => ({
      ...message,
      createdAt: message.created_at,
      updatedAt: message.updated_at,
    }));

    setMessages(formattedMessages);
  } catch (requestError) {
    setError(requestError.message);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    apiFetch("/auth/me")
      .then((data) => {
        setAdmin(data.admin);
        setAuthLoading(false);
      })
      .catch(() => navigate("/admin/login"));
  }, [navigate]);

  useEffect(() => {
    if (!admin) return;
    if (tab === "bookings") loadBookings();
    else loadMessages();
  }, [admin, tab, loadBookings, loadMessages]);

  const updateBooking = async (id, updates) => {
    try {
      await apiFetch(`/admin/bookings/${id}`, { method: "PATCH", body: updates });
      await loadBookings();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const deleteBooking = async (id, reference) => {
    if (!window.confirm(`Delete booking ${reference}? This cannot be undone.`)) return;
    try {
      await apiFetch(`/admin/bookings/${id}`, { method: "DELETE" });
      await loadBookings();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const updateMessage = async (id, status) => {
    try {
      await apiFetch(`/admin/contacts/${id}`, { method: "PATCH", body: { status } });
      await loadMessages();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } finally {
      navigate("/admin/login");
    }
  };

  if (authLoading) {
    return <main className="admin-loading"><RefreshCw className="spin-icon" /><span>Loading operations console...</span></main>;
  }

  const statCards = [
    { label: "Total bookings", value: stats.total, icon: LayoutDashboard },
    { label: "Pending requests", value: stats.pending, icon: CalendarClock },
    { label: "Confirmed", value: stats.confirmed, icon: CheckCircle2 },
    { label: "Paid revenue", value: currency(stats.revenue), icon: CircleDollarSign },
  ];

  return (
    <main className="admin-dashboard">
      <aside className={`admin-sidebar ${mobileNav ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="brand admin-brand"><span className="brand-mark">V</span><span><strong>VELORA</strong><small>Operations</small></span></div>
          <button type="button" className="admin-close-menu" onClick={() => setMobileNav(false)}><X /></button>
        </div>
        <nav className="admin-nav">
          <button className={tab === "bookings" ? "active" : ""} onClick={() => { setTab("bookings"); setMobileNav(false); }}><LayoutDashboard /> Bookings</button>
          <button className={tab === "messages" ? "active" : ""} onClick={() => { setTab("messages"); setMobileNav(false); }}><Inbox /> Enquiries <span>{messages.filter((item) => item.status === "new").length || ""}</span></button>
        </nav>
        <div className="admin-user-card"><div className="admin-avatar">{admin?.name?.slice(0, 1) || "A"}</div><div><strong>{admin?.name}</strong><span>{admin?.email}</span></div></div>
        <button className="admin-logout" onClick={logout}><LogOut /> Log out</button>
      </aside>

      {mobileNav && <button className="admin-overlay" aria-label="Close menu" onClick={() => setMobileNav(false)} />}

      <section className="admin-content">
        <header className="admin-topbar">
          <button className="admin-menu-button" onClick={() => setMobileNav(true)}><Menu /></button>
          <div><span className="eyebrow">Velora operations</span><h1>{tab === "bookings" ? "Booking management" : "Customer enquiries"}</h1></div>
          <button className="icon-button" onClick={tab === "bookings" ? loadBookings : loadMessages} aria-label="Refresh"><RefreshCw className={loading ? "spin-icon" : ""} /></button>
        </header>

        {error && <div className="admin-alert">{error}</div>}

        {tab === "bookings" ? (
          <>
            <div className="admin-stats-grid">
              {statCards.map(({ label, value, icon: Icon }) => <article key={label} className="admin-stat-card"><div><span>{label}</span><strong>{value}</strong></div><Icon /></article>)}
            </div>

            <div className="admin-panel">
              <div className="admin-panel-header">
                <div><h2>Reservations</h2><p>Search, confirm, complete, and manage payment status.</p></div>
                <span className="record-count">{bookings.length} records</span>
              </div>
              <div className="admin-filters">
                <label className="admin-search"><Search /><input placeholder="Reference, customer, email, phone..." value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} /></label>
                <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">All statuses</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="assigned">Assigned</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>
                <select value={filters.paymentStatus} onChange={(event) => setFilters({ ...filters, paymentStatus: event.target.value })}><option value="">All payments</option><option value="unpaid">Unpaid</option><option value="paid">Paid</option><option value="refunded">Refunded</option></select>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Reference / customer</th><th>Journey</th><th>Schedule / vehicle</th><th>Fare</th><th>Status</th><th>Payment</th><th /></tr></thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td><strong>{booking.reference}</strong><span>{booking.customerName}</span><small>{booking.email}<br />{booking.phone}</small></td>
                        <td><strong>{booking.pickupAddress}</strong><span>to {booking.dropoffAddress || "Hourly service"}</span><small>{booking.serviceType.replaceAll("-", " ")}</small></td>
                        <td><strong>{booking.pickupDate} · {booking.pickupTime}</strong><span>{booking.price?.vehicleLabel || booking.vehicleType}</span><small>Created {formatDateTime(booking.createdAt)}</small></td>
                        <td><strong>{currency(booking.price?.total)}</strong><span>{booking.passengers} passenger(s)</span><small>{booking.specialRequests || "No special requests"}</small></td>
                        <td><select className={`status-select status-${booking.status}`} value={booking.status} onChange={(event) => updateBooking(booking.id, { status: event.target.value })}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="assigned">Assigned</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></td>
                        <td><select className={`status-select status-${booking.paymentStatus}`} value={booking.paymentStatus} onChange={(event) => updateBooking(booking.id, { paymentStatus: event.target.value })}><option value="unpaid">Unpaid</option><option value="paid">Paid</option><option value="refunded">Refunded</option></select></td>
                        <td><button className="danger-icon-button" onClick={() => deleteBooking(booking.id, booking.reference)} title="Delete booking"><Trash2 /></button></td>
                      </tr>
                    ))}
                    {!loading && bookings.length === 0 && <tr><td colSpan="7"><div className="admin-empty"><UsersRound /><h3>No bookings found</h3><p>New reservation requests will appear here.</p></div></td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="admin-panel">
            <div className="admin-panel-header"><div><h2>Customer enquiries</h2><p>Messages submitted through the website contact form.</p></div><span className="record-count">{messages.length} messages</span></div>
            <div className="message-list">
              {messages.map((message) => (
                <article key={message.id} className={`message-card message-${message.status}`}>
                  <div className="message-card-header"><div><span className="card-kicker">{message.subject}</span><h3>{message.name}</h3><p>{message.email} · {message.phone || "No phone"}</p></div><StatusBadge value={message.status} /></div>
                  <p className="message-body">{message.message}</p>
                  <div className="message-card-footer"><span>{formatDateTime(message.createdAt)}</span><select value={message.status} onChange={(event) => updateMessage(message.id, event.target.value)}><option value="new">New</option><option value="read">Read</option><option value="resolved">Resolved</option></select></div>
                </article>
              ))}
              {!loading && messages.length === 0 && <div className="admin-empty"><Inbox /><h3>No enquiries yet</h3><p>Contact-form messages will appear here.</p></div>}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
