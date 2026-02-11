"use client";

import { useEffect, useRef, useState } from "react";
import "./Hero.css";
import Image from "next/image";

export default function Hero() {
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



  return (
    <section className="section-full heroWrapper">
      <div
        ref={imgRef}
        className={`parallaxWrapper ${isLoaded ? "loaded" : ""}`}
      >
        <Image
          className="heroImg"
          src="/uploads/hero.webp"
          alt="vending store"
          fill
          priority
          quality={65}
          onLoadingComplete={() => setIsLoaded(true)}
        />
      </div>

      <div className="CTA_Wrapper">
        <h1 className="heroHeading">
          Your <span>Trusted</span> <br />Vending <span>Partner</span>
        </h1>
        <p className="heroDescription">
          We deliver smart, reliable vending solutions for offices and public
          spaces, handling installation, restocking, and support so everything
          runs smoothly. Quality products, fast service, zero hassle.
        </p>
        <button className="ctaButton text-black">request services</button>
      </div>

      <div className="scrollContent"></div>
    </section>
  );
}
