import { ApolloConsumer } from "@apollo/client";
import { Alert, Button } from "@blueprintjs/core";
import { useContext, useState } from "react";
import { useLocation } from "wouter";
import { AppContext } from "../..";

export default function SubscribeButton({isSubscribed, trackerId, trackerName}) {
  const app = useContext(AppContext);

  const [_, setLocation] = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = client => {
    setLoading(true);

    if(isSubscribed) {
      // Unsubscribe
      app.currentUser.functions.removeSubscription(trackerId).then(()=>{

          client.refetchQueries({
            include: "all"
          }).then(() => {
            setLoading(false);
            setLocation("/dashboard");
          }).catch(error => {
            console.log(error);
          });
      
      }).catch(error => {
        setLoading(false);
        setErrorMessage(error.error);
      });

    } else {
      app.currentUser.functions.subscribe(trackerId).then(()=>{
        client.refetchQueries({
          include: "all"
        }).then(() => {
          setLoading(false);
        }).catch(error => {
          console.log(error);
        })

      }).catch(error => {
        setLoading(false);
        setErrorMessage(error.error);
      })
    }
  }

  return (
    <ApolloConsumer>
      {client => <>
        <Button
          onClick={() => {
            if(isSubscribed) {
              setIsOpen(true);
            } else {
              onSubmit(client);
            }
          }}
          loading={loading}
          intent={isSubscribed ? "danger": "primary"}
          icon={isSubscribed ? "cross" : "send-message"}>
          {isSubscribed ? "Unsubscribe" : "Subscribe"}
        </Button>

        <Alert
          isOpen={isOpen}
          onClose={()=>setIsOpen(false)}
          onConfirm={()=>onSubmit(client)}
          intent="danger"
          icon="warning-sign"
          canOutsideClickCancel={true}
          cancelButtonText="Cancel"
          confirmButtonText="Unsubscribe">
            Are you sure you want to unsubscribe to {trackerName}?
        </Alert>

        <Alert isOpen={errorMessage} onClose={() => setErrorMessage("")} intent="danger">
          {errorMessage}
        </Alert>
      </>}
    </ApolloConsumer>
  );
}