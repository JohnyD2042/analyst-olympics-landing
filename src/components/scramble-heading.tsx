import { useEffect, useState } from "react";
import { CONTEST_2027 } from "@/lib/contest-2027";

const BASE = "Сделаем финансовую аналитику";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>";

export function ScrambleHeading() {
  const [endingIndex, setEndingIndex] = useState(0);
  const [frame, setFrame] = useState<{ letters: string[]; settled: boolean[] } | null>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let currentEnding = 0;
    let timer: ReturnType<typeof setInterval> | undefined;
    const decode = (advance = false) => {
      if (motion.matches || document.hidden) return;
      if (advance) currentEnding = (currentEnding + 1) % CONTEST_2027.headlineEndings.length;
      setEndingIndex(currentEnding);
      const text = `${BASE} ${CONTEST_2027.headlineEndings[currentEnding]}`;
      if (timer) clearInterval(timer);
      const start = performance.now();
      const deadlines = Array.from(text, (_, index) => 180 + index * 24 + Math.random() * 180);
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
    const repeat = setInterval(() => decode(true), CONTEST_2027.scrambleInterval);
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
  const text = `${BASE} ${CONTEST_2027.headlineEndings[endingIndex]}`;
  return (
    <h1 className="contest-scramble mt-6 mx-auto max-w-5xl font-extrabold">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, wordIndex, words) => {
          const start = index;
          index += word.length + 1;
          return (
            <span key={word} className={wordIndex === 3 ? "contest-ending-start" : undefined}>
              <span className={`contest-scramble-word ${wordIndex === 1 || wordIndex === 2 ? "text-gradient-primary" : ""}`}>
                {Array.from(word, (letter, offset) => (
                  <span key={offset} className={`contest-scramble-letter ${frame && !frame.settled[start + offset] ? "text-muted-foreground" : wordIndex === 1 || wordIndex === 2 ? "text-inherit" : "text-foreground"}`}>
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