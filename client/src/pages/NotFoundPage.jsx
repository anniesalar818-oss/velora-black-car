import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <span className="eyebrow">404</span>
      <h1>This road does not lead anywhere.</h1>
      <p>The page may have moved or the address may be incorrect.</p>
      <Link className="button" to="/"><ArrowLeft size={18} /> Return home</Link>
    </main>
  );
}
