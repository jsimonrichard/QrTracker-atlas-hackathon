import { Link } from 'wouter';

export function ButtonLink(props) {
  return (
    <Link href={props.path} className={`button ${props.color} ${props.slim ? "button-slim" : ""} ${props.className ? props.className : ""}`}>
      {props.children}
    </Link>
  );
}

export function Button({onClick, brand="brand2", className="", children}) {
  return (
    <button onClick={onClick} className={["button", brand, className].join(" ")}>
      {children}
    </button>
  )
}