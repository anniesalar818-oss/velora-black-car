export default function PageHero({
  eyebrow,
  title,
  text,
  image = "/images/nyc-skyline.webp",
  imagePosition = "center",
  badge,
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-media" aria-hidden="true">
        <img src={image} alt="" style={{ objectPosition: imagePosition }} />
      </div>
      <div className="page-hero-shade" />
      <div className="page-hero-grid" />
      <div className="page-hero-glow" />
      <div className="container page-hero-content">
        <span className="eyebrow page-hero-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
        {badge && <span className="page-hero-badge">{badge}</span>}
      </div>
      <div className="page-hero-scroll-cue" aria-hidden="true">
        <span />
        Scroll to explore
      </div>
    </section>
  );
}
