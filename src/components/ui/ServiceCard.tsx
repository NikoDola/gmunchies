import "./ServiceCard.css";
import Image from "next/image";
import Link from "next/link";

export default function ServiceCard({
  img,
  headline,
  bodyText,
  href,
}: {
  img: string;
  headline: string;
  bodyText: string;
  href: string;
}) {
  return (
    <div className="srvCardWrapper">
      <Image className="srvImg" src={img} width={230} height={230} alt={headline} />
      <div className="srvTextWrapper">
        <h3 className="h3">{headline}</h3>
        <p>{bodyText}</p>
        <Link className="view-more mt-4" href={href}>
          Read More
        </Link>
      </div>
    </div>
  );
}
