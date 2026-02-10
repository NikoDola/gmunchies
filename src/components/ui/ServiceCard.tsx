import "./ServiceCard.css";
import Image from "next/image";

export default function ServiceCard({img, headline, bodyText}: {img:string, headline:string, bodyText:string}) {
  return (
    <div className="srvCardWrapper">
      <Image src={img} width={230} height={230} alt="vending "/>
      <div className="srvTextWrapper">
        <h3 className="h3">{headline}</h3>
        <p>
         {bodyText}
        </p>
        <button className="view-more mt-4">Read More</button>
      </div>
    </div>
  );
}
