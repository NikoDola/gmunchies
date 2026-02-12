"use client";
import "./NavBar.css";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
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

  return (
    <header className="nav">
      <div className="nav-top">
        <Link href="/" className="logo">
          <Image
            src="/branding/logo.svg"
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
        <Link className="navLink" href="/" onClick={() => setOpen(false)}>
          Home
        </Link>
        <Link className="navLink" href="/about-us" onClick={() => setOpen(false)}>
          About
        </Link>
        <Link className="navLink" href="/services" onClick={() => setOpen(false)}>
          Services
        </Link>
        <Link className="navLink" href="/contact" onClick={() => setOpen(false)}>
          Contact
        </Link>
        <button className="ctaButton">request services</button>
      </nav>
    </header>
  );
}
