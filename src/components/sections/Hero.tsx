"use client";

import { useEffect, useRef, useState } from "react";
import "./Hero.css";
import Image from "next/image";

type HeroProps = {
  headline: string;
  body: string;
  ctaLabel: string;
  imageSrc: string;
};

export default function Hero({ headline, body, ctaLabel, imageSrc }: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const handleScroll = () => {
      if (!imgRef.current) return;

      const scrollY = window.scrollY;
      imgRef.current.style.transform = `translateY(${scrollY * 0.55}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoaded]);

  const scrollToForm = () => {
    const formElement = document.getElementById("request-services-form");
    if (!formElement) return;

    const startPosition = window.pageYOffset;
    const targetPosition = formElement.getBoundingClientRect().top + startPosition - 80; // 80px offset for navbar
    const distance = targetPosition - startPosition;
    const duration = 800; // 800ms
    let start: number | null = null;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };



  return (
    <section className="section-full heroWrapper">
      <div
        ref={imgRef}
        className={`parallaxWrapper ${isLoaded ? "loaded" : ""}`}
      >
        <Image
          className="heroImg"
          src={imageSrc}
          alt="vending store"
          fill
          priority
          quality={65}
          onLoadingComplete={() => setIsLoaded(true)}
        />
      </div>

      <div className="CTA_Wrapper">
        <h1 className="heroHeading">{headline}</h1>
        <p className="heroDescription">{body}</p>
        <button className="ctaButton text-black" onClick={scrollToForm}>
          {ctaLabel}
        </button>
      </div>

      <div className="scrollContent"></div>
    </section>
  );
}
