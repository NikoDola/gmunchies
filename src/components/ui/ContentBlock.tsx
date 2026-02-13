import "./ContentBlock.css";
import Image from "next/image";

export type ContentBlockData = {
  layout: "left" | "right" | "center";
  eyebrow?: string;
  heading: string;
  body?: string;
  imageSrc?: string;
};

export default function ContentBlock({ layout, eyebrow, heading, body, imageSrc }: ContentBlockData) {
  const hasImage = Boolean(imageSrc);

  return (
    <section className={`contentBlock contentBlock--${layout}`}>
      <div className="contentBlockInner">
        <div className="contentBlockText">
          {eyebrow ? <p className="beforeHeading">{eyebrow}</p> : null}
          <h2 className="h2Left contentBlockHeading">{heading}</h2>
          {body ? <p className="contentBlockBody">{body}</p> : null}
        </div>

        {hasImage ? (
          <div className="contentBlockMedia" aria-hidden={!hasImage}>
            <Image
              src={imageSrc!}
              alt={heading}
              width={900}
              height={600}
              className="contentBlockImage"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

