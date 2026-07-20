import { useEffect, useRef, useState } from "react";

export default function Reveal({
  as: Component = "div",
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 34,
  threshold = 0.12,
  once = true,
  ...props
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -7% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <Component
      ref={ref}
      className={`reveal reveal-${direction} ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={{
        "--reveal-delay": `${delay}ms`,
        "--reveal-distance": `${distance}px`,
        ...props.style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
