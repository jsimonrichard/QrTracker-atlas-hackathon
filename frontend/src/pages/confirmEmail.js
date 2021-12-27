import { ButtonLink } from "../components/basic";
import { useState, useEffect, useContext } from 'react';
import { AppContext } from "..";

export default function ConfirmEmail() {
  const app = useContext(AppContext);
  const urlParams = new URLSearchParams(window.location.search);
  const [message, setMessage] = useState("Loading...");

  // Run only once
  useEffect(() => {
    app.emailPasswordAuth.confirmUser({ 
      token: urlParams.get("token"),
      tokenId: urlParams.get("tokenId")
    }).then(() => {
      setMessage("Your email has been confirmed");
    }).catch(error => {
      setMessage("There was an error");
      console.log(error);
    })
  }, []);

  return (
    <div className="content">
      <div className="center">
        <h1>{message}</h1>
        <ButtonLink path="/login" color="brand1">Log In</ButtonLink>
      </div>
    </div>
  );
}