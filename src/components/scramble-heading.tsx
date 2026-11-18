import { useEffect, useState } from "react";
import { CONTEST_2027 } from "@/lib/contest-2027";

const TEXT = "СРОЧКА И ТОЧКА";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>";

export function ScrambleHeading() {
  const [frame, setFrame] = useState<{ letters: string[]; settled: boolean[] } | null>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const decode = () => {
      if (motion.matches || document.hidden) return;
      const text = TEXT;
      if (timer) clearInterval(timer);
      const start = performance.now();
      const deadlines = Array.from(text, (letter, index) => letter === " " ? 0 : 120 + index * 45 + Math.random() * 160);
      setFrame({
        settled: deadlines.map((end) => end === 0),
        letters: Array.from(text, (letter) => letter === " " ? letter : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]),
      });
      timer = setInterval(() => {
        const elapsed = performance.now() - start;
        const settled = deadlines.map((end) => elapsed >= end);
        setFrame({
          settled,
          letters: Array.from(text, (letter, index) => settled[index] || letter === " " ? letter : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]),
        });
        if (settled.every(Boolean)) {
          clearInterval(timer);
          setFrame(null);
        }
      }, 55);
    };
    decode();
    const repeat = setInterval(decode, CONTEST_2027.scrambleInterval);
    const onMotionChange = () => {
      if (motion.matches) {
        clearInterval(timer);
        setFrame(null);
      }
    };
    motion.addEventListener("change", onMotionChange);
    return () => {
      clearInterval(timer);
      clearInterval(repeat);
      motion.removeEventListener("change", onMotionChange);
    };
  }, []);

  let index = 0;
  const text = TEXT;
  return (
    <h1 className="contest-scramble mt-6 mx-auto max-w-5xl font-display font-extrabold tracking-normal">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, wordIndex, words) => {
          const start = index;
          index += word.length + 1;
          return (
            <span key={word}>
              <span className="contest-scramble-word text-gradient-primary">
                {Array.from(word, (letter, offset) => (
                  <span key={offset} className={`contest-scramble-letter ${frame && !frame.settled[start + offset] ? "text-muted-foreground" : "text-inherit"}`}>
                    {frame?.letters[start + offset] ?? letter}
                  </span>
                ))}
                {wordIndex === words.length - 1 && <span className="contest-caret" />}
              </span>
              {wordIndex < words.length - 1 && " "}
            </span>
          );
        })}
      </span>
    </h1>
  );
}