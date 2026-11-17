import { useEffect, useRef, useState } from "react";
import metalTexture from "@/assets/award-brushed-metal.jpg";

const PLACE_NAMES = ["Первое место", "Второе место", "Третье место"];

type Prize = { rank: number; amount: string };

/** Fan of metal prize cards: stacked at rest, fans out on hover; hovered card lifts to the front. */
export function PrizeFan({ prizes }: { prizes: Prize[] }) {
  // podium order: silver, gold, bronze
  const order = [prizes[1], prizes[0], prizes[2]].filter(Boolean);
  const [open, setOpen] = useState(false);
  const [hot, setHot] = useState<number | null>(null);
  const user = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(true);
      return;
    }
    const seq: Array<() => void> = [
      () => setOpen(true),
      () => setHot(1),
      () => setHot(0),
      () => setHot(2),
      () => setHot(null),
      () => setOpen(false),
    ];
    let n = 0;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (!user.current) seq[n++ % seq.length]();
      t = setTimeout(tick, n % seq.length === 0 ? 1600 : 900);
    };
    t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="prize-fan-wrap">
      <div
        className="prize-fan"
        data-open={open || undefined}
        onPointerEnter={() => { user.current = true; setOpen(true); }}
        onPointerLeave={() => { setOpen(false); setHot(null); setTimeout(() => { user.current = false; }, 2000); }}
      >
        {order.map((p, i) => {
          const d = i - 1;
          const isHot = hot === i;
          return (
            <article
              key={p.rank}
              tabIndex={0}
              className={`contest-prize contest-prize-${p.rank} prize-fan-card font-display`}
              style={{ ["--d" as string]: d, zIndex: isHot ? 5 : i === 1 ? 3 : 2 }}
              data-hot={isHot || undefined}
              onPointerEnter={() => setHot(i)}
              onFocus={() => { user.current = true; setOpen(true); setHot(i); }}
              onBlur={() => { user.current = false; }}
            >
              <img src={metalTexture} alt="" aria-hidden="true" loading="lazy" width={1024} height={1024} className="contest-prize-texture" />
              <div className="contest-prize-content">
                <h4 className="contest-prize-place">{PLACE_NAMES[p.rank - 1]}</h4>
                <CupIcon rank={p.rank} />
                <p className="contest-prize-amount">{p.amount}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/** Classic championship cup: bowl with rim, side handles, knotted stem, two-tier plinth with plaque. */
function CupIcon({ rank }: { rank: number }) {
  const id = `cup-grad-${rank}`;
  const fill = rank === 1 ? `url(#${id})` : "currentColor";
  return (
    <svg className="prize-fan-trophy" viewBox="0 0 64 72" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--contest-gold-hi)" />
          <stop offset=".45" stopColor="var(--contest-gold-mid)" />
          <stop offset="1" stopColor="var(--contest-gold-deep)" />
        </linearGradient>
      </defs>
      <g fill={fill}>
        {/* handles */}
        <path d="M14 10H6.5C5 10 4 11 4 12.6c0 7.4 5 13.6 12.4 15l.9-4C12 22.4 8.6 18.4 8.2 14H14z" />
        <path d="M50 10h7.5c1.5 0 2.5 1 2.5 2.6 0 7.4-5 13.6-12.4 15l-.9-4c5.3-1.2 8.7-5.2 9.1-9.6H50z" />
        {/* rim + bowl */}
        <rect x="11" y="4" width="42" height="4" rx="1.2" />
        <path d="M13 9h38v7c0 11-7.6 19.6-19 20.6C20.6 35.6 13 27 13 16z" />
        {/* stem with knot */}
        <path d="M28.5 36.5h7v4h-7z" />
        <ellipse cx="32" cy="42.5" rx="6" ry="2.4" />
        <path d="M29 44.5h6l1.6 7h-9.2z" />
        {/* plinth */}
        <rect x="21" y="52" width="22" height="3.2" rx="1" />
        <path d="M18 56h28l2 12H16z" />
      </g>
      {/* engraved details */}
      <path d="M19 12v4c0 7 3.6 12.6 9 15" fill="none" stroke="var(--contest-metal-light)" strokeOpacity=".45" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="24" y="59.5" width="16" height="5" rx=".8" fill="none" stroke="var(--contest-metal-light)" strokeOpacity=".4" strokeWidth="1" />
    </svg>
  );
}
