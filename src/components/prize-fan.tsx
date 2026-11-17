import { useEffect, useRef, useState } from "react";
import metalTexture from "@/assets/award-brushed-metal.jpg";

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
              className={`contest-prize contest-prize-${p.rank} prize-fan-card`}
              style={{ ["--d" as string]: d, zIndex: isHot ? 5 : i === 1 ? 3 : 2 }}
              data-hot={isHot || undefined}
              onPointerEnter={() => setHot(i)}
              onFocus={() => { user.current = true; setOpen(true); setHot(i); }}
              onBlur={() => { user.current = false; }}
            >
              <img src={metalTexture} alt="" aria-hidden="true" loading="lazy" width={1024} height={1024} className="contest-prize-texture" />
              <div className="contest-prize-content">
                <h4 className="contest-prize-place">{p.rank}-е место</h4>
                <p className="contest-prize-amount">{p.amount}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
