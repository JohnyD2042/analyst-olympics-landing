import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { shouldHintBenefitPull, toggleBenefitLight, type BenefitLights } from "@/lib/benefit-lights";

type Benefit = { title: string; text: string };

function CordCard({ benefit, index, on, hint, onToggle }: {
  benefit: Benefit; index: number; on: boolean; hint: boolean; onToggle: () => void;
}) {
  const id = useId();
  const lamp = useRef<HTMLDivElement>(null);
  const motion = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);
  const [busy, setBusy] = useState(false);
  const held = useRef<{ id: number; x: number; y: number; moved: number; flipped: boolean } | null>(null);
  const showHint = index === 0 && hint && !busy;

  useEffect(() => () => animation.current?.cancel(), []);

  function settle() {
    animation.current?.cancel();
    if (!motion.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBusy(false);
      return;
    }
    setBusy(true);
    const swing = motion.current.animate([
      { transform: "rotate(0deg) translateY(12px)" },
      { transform: "rotate(12deg) translateY(-5px)" },
      { transform: "rotate(-9deg) translateY(3px)" },
      { transform: "rotate(6deg) translateY(-2px)" },
      { transform: "rotate(-3deg) translateY(1px)" },
      { transform: "rotate(1deg)" },
      { transform: "rotate(0deg)" },
    ], { duration: 1500, easing: "ease-in-out" });
    animation.current = swing;
    swing.onfinish = () => { animation.current = null; setBusy(false); };
  }

  function reset() {
    held.current = null;
    lamp.current?.removeAttribute("data-held");
    lamp.current?.style.setProperty("--pull-y", "0px");
    lamp.current?.style.setProperty("--pull-x", "0px");
    lamp.current?.style.setProperty("--lamp-lean", "0deg");
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    const drag = held.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    drag.moved = Math.max(drag.moved, Math.hypot(dx, dy));
    lamp.current?.style.setProperty("--pull-y", `${Math.max(0, Math.min(62, dy * .6))}px`);
    lamp.current?.style.setProperty("--pull-x", `${Math.max(-32, Math.min(32, dx * .4))}px`);
    lamp.current?.style.setProperty("--lamp-lean", `${Math.max(-9, Math.min(9, -dx * .12))}deg`);
    if (dy > 28 && !drag.flipped) {
      drag.flipped = true;
      onToggle();
    }
  }

  return (
    <article className={`benefit-light benefit-light-${index + 1}`} data-on={on ? "true" : "false"} aria-label={benefit.title}>
      <Button type="button" variant="ghost" className="benefit-card-toggle" role="switch"
        aria-checked={on} aria-controls={id} aria-label={`${on ? "Выключить" : "Включить"} свет: ${benefit.title}`}
        onClick={() => { onToggle(); settle(); }} />
      <div className="benefit-light-flood" aria-hidden="true" />
      <span className="benefit-light-index font-display" aria-hidden="true">0{index + 1}</span>
      <div className="benefit-lamp" ref={lamp} data-hint={showHint ? "true" : undefined}>
        <div className="benefit-lamp-fixture" aria-hidden="true">
          <div className="benefit-lamp-wire" />
          <div className="benefit-lamp-cap" />
          <div className="benefit-lamp-shade" />
          <div className="benefit-lamp-bulb"><span /></div>
        </div>
        <div className="benefit-cord-motion" ref={motion}>
        <div className="benefit-cord" aria-hidden="true"><svg viewBox="0 0 40 110" preserveAspectRatio="none"><path d="M20 0 C18 35 22 68 20 110" /></svg></div>
        <Button
          type="button"
          variant="ghost"
          className="benefit-cord-grab"
          aria-controls={id}
          aria-label={`Шнурок: ${benefit.title}`}
          title={`${on ? "Выключить" : "Включить"} свет`}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            animation.current?.cancel();
            setBusy(true);
            held.current = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: 0, flipped: false };
            event.currentTarget.setPointerCapture(event.pointerId);
            lamp.current?.setAttribute("data-held", "true");
          }}
          onPointerMove={move}
          onPointerUp={(event) => {
            const drag = held.current;
            if (!drag || drag.id !== event.pointerId) return;
            const tap = drag.moved < 5 && !drag.flipped;
            reset();
            if (tap) onToggle();
            settle();
          }}
          onPointerCancel={() => { reset(); settle(); }}
          onLostPointerCapture={() => { if (held.current) { reset(); settle(); } }}
          onClick={(event) => { if (event.detail === 0) { onToggle(); settle(); } }}
        ><span className="benefit-cord-bead" aria-hidden="true" /></Button>
        </div>
      </div>
      <div id={id} className="benefit-light-copy" aria-hidden={!on}>
        <h4 className="font-display font-semibold">{benefit.title}</h4>
        <p>{benefit.text}</p>
      </div>
      <span className="benefit-light-status" aria-hidden="true"><span /></span>
    </article>
  );
}

export function BenefitLightCards({ benefits }: { benefits: readonly Benefit[] }) {
  const [lights, setLights] = useState<BenefitLights>([false, false, false]);
  return (
    <div className="benefit-lights-grid">
      {benefits.map((benefit, index) => (
        <CordCard key={benefit.title} benefit={benefit} index={index} on={lights[index] ?? false} hint={shouldHintBenefitPull(lights)}
          onToggle={() => setLights((current) => toggleBenefitLight(current, index))} />
      ))}
    </div>
  );
}