import { useEffect, useState } from "react";
import { Redirect } from "wouter";
import { ButtonLink } from "../../components/basic";
import { Spinner, Alert } from "@blueprintjs/core";

export default function AcceptInvitation({ user }) {
  const [trackerId, setTrackerId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if(user) {
      const urlParams = new URLSearchParams(window.location.search);
      user.functions.acceptInvitation(urlParams.get("invite"))
        .then(setTrackerId)
        .catch(error => {
          console.log(error);
          setErrorMessage(error.error);
        });
    }
  }, []);

  return (
    <div className="content">
      <div className="center-content">
        {user ?
          <div>
            {trackerId ? <Redirect to={`/t/${trackerId}`}/> : <Spinner className="tall-spinner" />}
          </div>
        :
          <div>
            <h1>You need to login in first</h1>
            <p>
              Please login (or create an account) and then go back to your email
              and click this link again.
            </p>
    
            <div className="button-row">
              <ButtonLink path="/signup" color="brand3">Sign Up</ButtonLink>
              <ButtonLink path="/login" color="brand1">Log In</ButtonLink>
            </div>
          </div>
        }
      </div>

      <Alert isOpen={errorMessage} onClose={() => setErrorMessage("")} intent="danger">
        {errorMessage}
      </Alert>
    </div>
  );
}