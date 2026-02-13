"use client";
import "./NavBar.css";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type NavLink = { label: string; href: string };
type NavbarProps = {
  logoSrc: string;
  logoHref: string;
  links: NavLink[];
  ctaLabel: string;
};

export default function Navbar({ logoSrc, logoHref, links, ctaLabel }: NavbarProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  const scrollToForm = () => {
    setOpen(false); // Close menu when clicking
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
    <header className="nav">
      <div className="nav-top">
        <Link href={logoHref} className="logo" onClick={() => setOpen(false)}>
          <Image
            src={logoSrc}
            alt="gmunchies logo"
            width={180}
            height={100}
            priority
            fetchPriority="high"
            sizes="180px"
          />
        </Link>

        <button
          className="burger"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      <nav className={`nav-menu ${open ? "open" : ""}`}>
        {links.map((l) => (
          <Link key={l.href} className="navLink" href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}

        <button className="ctaButton" onClick={scrollToForm}>
          {ctaLabel}
        </button>
      </nav>
    </header>
  );
}
