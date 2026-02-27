"use client";

import "./SectionJumpCard.css";
import Image from "next/image";

export default function SectionJumpCard({
  iconSrc,
  title,
  onClick,
}: {
  iconSrc: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className="sectionJumpCard" onClick={onClick}>
      <span className="sectionJumpIconWrap" aria-hidden="true">
        <Image className="sectionJumpIcon" src={iconSrc} alt="" fill sizes="56px" />
      </span>
      <span className="sectionJumpText">
        <span className="sectionJumpTitle">{title}</span>
        <span className="sectionJumpHint">Jump to section</span>
      </span>
    </button>
  );
}

