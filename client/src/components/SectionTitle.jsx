import Reveal from "./Reveal";

export default function SectionTitle({ eyebrow, title, text, align = "left" }) {
  return (
    <Reveal className={`section-title section-title-${align}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  );
}
