import "./Heading.css"
import { CSSProperties } from "react";

type HeadingProps = {
  text: string;
  style?: CSSProperties;
};
import "./Heading.css"
export default function Heading({text, style}: HeadingProps){
  return(
    <h1 style={style} className="h1">{text}</h1>
  )
}