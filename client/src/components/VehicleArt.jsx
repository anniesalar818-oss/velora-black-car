export default function VehicleArt({ kind = "sedan", className = "" }) {
  const isVan = kind === "van";
  const isCoach = kind === "coach";
  const isSuv = kind.includes("suv");
  const isPremium = kind.includes("premium");

  return (
    <div className={`vehicle-art ${className}`} aria-hidden="true">
      <svg viewBox="0 0 720 300" role="img">
        <defs>
          <linearGradient id={`body-${kind}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={isPremium ? "#3b3938" : "#282827"} />
            <stop offset="0.55" stopColor="#090909" />
            <stop offset="1" stopColor="#1b1816" />
          </linearGradient>
          <linearGradient id={`glass-${kind}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#887969" stopOpacity="0.7" />
            <stop offset="1" stopColor="#171d21" stopOpacity="0.95" />
          </linearGradient>
          <filter id={`shadow-${kind}`} x="-30%" y="-50%" width="160%" height="200%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        <ellipse
          cx="360"
          cy="247"
          rx={isCoach ? "300" : "260"}
          ry="28"
          fill="#000"
          opacity="0.55"
          filter={`url(#shadow-${kind})`}
        />

        {isCoach ? (
          <g>
            <path
              d="M80 84 Q82 60 116 56 H580 Q625 58 641 96 L660 213 H58 L64 112 Q66 91 80 84Z"
              fill={`url(#body-${kind})`}
              stroke="#795c43"
              strokeWidth="3"
            />
            <path d="M103 79 H574 Q600 82 611 109 L619 129 H96Z" fill={`url(#glass-${kind})`} />
            {[135, 205, 275, 345, 415, 485, 555].map((x) => (
              <path key={x} d={`M${x} 83 V129`} stroke="#201d1b" strokeWidth="5" />
            ))}
            <rect x="76" y="145" width="558" height="55" rx="16" fill="#111" />
          </g>
        ) : isVan ? (
          <g>
            <path
              d="M94 102 Q102 67 143 61 H505 Q551 62 581 101 L625 178 Q638 198 620 220 H75 Q58 208 70 187Z"
              fill={`url(#body-${kind})`}
              stroke="#795c43"
              strokeWidth="3"
            />
            <path d="M147 77 H489 Q526 79 551 111 L567 135 H124Z" fill={`url(#glass-${kind})`} />
            {[227, 314, 401, 488].map((x) => (
              <path key={x} d={`M${x} 78 V136`} stroke="#201d1b" strokeWidth="5" />
            ))}
          </g>
        ) : (
          <g>
            <path
              d={
                isSuv
                  ? "M90 169 Q104 135 145 123 L201 74 Q218 60 246 59 H470 Q502 60 526 84 L583 140 Q618 149 641 173 L655 207 Q656 222 637 225 H76 Q57 219 67 197Z"
                  : "M89 172 Q102 143 141 134 L224 80 Q242 67 270 66 H436 Q470 68 493 91 L554 143 Q598 151 632 176 L648 207 Q649 221 630 224 H77 Q59 219 68 197Z"
              }
              fill={`url(#body-${kind})`}
              stroke="#795c43"
              strokeWidth="3"
            />
            <path
              d={
                isSuv
                  ? "M208 118 L247 75 H458 Q482 77 505 99 L545 137 H188Z"
                  : "M218 123 L269 79 H425 Q454 80 476 100 L520 137 H190Z"
              }
              fill={`url(#glass-${kind})`}
            />
            <path d="M361 79 V137" stroke="#1b1b1a" strokeWidth="6" />
            {isPremium && (
              <path d="M112 181 Q357 205 622 177" fill="none" stroke="#c99a68" strokeWidth="3" opacity="0.5" />
            )}
          </g>
        )}

        <g>
          <circle cx={isCoach ? 175 : 185} cy="219" r="43" fill="#080808" stroke="#5e4b3c" strokeWidth="5" />
          <circle cx={isCoach ? 175 : 185} cy="219" r="24" fill="#272421" stroke="#b78a60" strokeWidth="3" />
          <circle cx={isCoach ? 560 : 548} cy="219" r="43" fill="#080808" stroke="#5e4b3c" strokeWidth="5" />
          <circle cx={isCoach ? 560 : 548} cy="219" r="24" fill="#272421" stroke="#b78a60" strokeWidth="3" />
        </g>
        <path d="M80 205 H112" stroke="#e8d7c4" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
        <path d="M616 200 H649" stroke="#d39d68" strokeWidth="8" strokeLinecap="round" opacity="0.9" />
      </svg>
    </div>
  );
}
