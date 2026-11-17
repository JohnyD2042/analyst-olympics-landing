import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { toggleBenefitLight, type BenefitLights } from "@/lib/benefit-lights";

type Benefit = { title: string; text: string };

function CordCard({ benefit, index, on, onToggle }: {
  benefit: Benefit; index: number; on: boolean; onToggle: () => void;
}) {
  const id = useId();
  const lamp = useRef<HTMLDivElement>(null);
  const [hint, setHint] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const held = useRef<{ id: number; x: number; y: number; moved: number; flipped: boolean } | null>(null);

  useEffect(() => {
    const target = lamp.current;
    if (index !== 0 || interacted || !target) return;
    const observer = new IntersectionObserver(([entry]) => setHint(entry?.isIntersecting ?? false), { threshold: .6 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [index, interacted]);

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
      <div className="benefit-light-flood" aria-hidden="true" />
      <span className="benefit-light-index font-display" aria-hidden="true">0{index + 1}</span>
      <div className="benefit-lamp" ref={lamp} data-hint={hint && !interacted ? "true" : undefined}>
        <div className="benefit-lamp-fixture" aria-hidden="true">
          <div className="benefit-lamp-wire" />
          <div className="benefit-lamp-cap" />
          <div className="benefit-lamp-shade" />
          <div className="benefit-lamp-bulb"><span /></div>
        </div>
        <div className="benefit-cord" aria-hidden="true"><svg viewBox="0 0 40 110" preserveAspectRatio="none"><path d="M20 0 C18 35 22 68 20 110" /></svg></div>
        <Button
          type="button"
          variant="ghost"
          className="benefit-cord-grab"
          role="switch"
          aria-checked={on}
          aria-controls={id}
          aria-label={`${on ? "Выключить" : "Включить"} свет: ${benefit.title}`}
          title={`${on ? "Выключить" : "Включить"} свет`}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            setInteracted(true);
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
          }}
          onPointerCancel={reset}
          onLostPointerCapture={reset}
          onClick={(event) => { if (event.detail === 0) { setInteracted(true); onToggle(); } }}
        ><span className="benefit-cord-bead" aria-hidden="true" /></Button>
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
        <CordCard key={benefit.title} benefit={benefit} index={index} on={lights[index] ?? false}
          onToggle={() => setLights((current) => toggleBenefitLight(current, index))} />
      ))}
    </div>
  );
}