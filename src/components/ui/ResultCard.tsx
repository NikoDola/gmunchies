"use client";

import "./ResultCard.css";
import type { IconType } from "react-icons";

import { useEffect, useRef, useState } from "react";
type ResultCardProps = {
  headline: string;
  target: number;
  Icon: IconType;
};

export default function Counter({ headline, target, Icon }: ResultCardProps) {
  const TARGET = target;

  const countRef = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef<boolean>(false);
  const [value, setValue] = useState<number>(0);

  const startCounting = () => {
    if (startedRef.current) return;
    startedRef.current = true;

    const duration = 2600; // longer tail slowdown
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // super fast start, crawl at the end
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const current = Math.floor(eased * TARGET);
      setValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setValue(TARGET);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!countRef.current) return;
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startCounting();
      },
      { threshold: 0.6 },
    );

    observer.observe(countRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="rsCard">
      <Icon className="react-icon" size={140} />
      <h3 className="cardHeadline">{headline}</h3>
      <span ref={countRef} onMouseEnter={startCounting} className="counter">
        {value}
      </span>
    </div>
  );
}
