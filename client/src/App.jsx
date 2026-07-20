import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import BookingLookupPage from "./pages/BookingLookupPage";
import BookingPage from "./pages/BookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import ContactPage from "./pages/ContactPage";
import FleetPage from "./pages/FleetPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ServicesPage from "./pages/ServicesPage";

function SiteLayout() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <div key={`${location.pathname}-${location.search}`} className="route-transition">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/fleet" element={<FleetPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/confirmation/:reference" element={<ConfirmationPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/booking-lookup" element={<BookingLookupPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
