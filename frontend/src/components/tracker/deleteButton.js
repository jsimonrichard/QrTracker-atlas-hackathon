import { ApolloConsumer, useMutation } from "@apollo/client";
import { Alert, Button } from "@blueprintjs/core";
import { loader } from "graphql.macro";
import { useContext, useState } from "react";
import { useLocation } from "wouter";
import { AppContext } from "../..";

export default function DeleteButton({trackerId, trackerName, large, style, outlined}) {
  const app = useContext(AppContext);

  const [_, setLocation] = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [deleteTracker] = useMutation(loader("../../graphql/deleteTracker.graphql"), {
    variables: {
      id: trackerId
    }
  });

  const onSubmit = client => {
    setLoading(true);

    deleteTracker().then(()=>{

        client.refetchQueries({
          include: ["GetDashboardInfo"]
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
  }

  return (
    <ApolloConsumer>
      {client => <>
        <Button
          onClick={() => {
            setIsOpen(true)
          }}
          loading={loading}
          intent="danger"
          icon="cross"
          large={large}
          outlined={outlined}
          style={style}>

          Delete
        </Button>

        <Alert
          isOpen={isOpen}
          onClose={()=>setIsOpen(false)}
          onConfirm={()=>onSubmit(client)}
          intent="danger"
          icon="warning-sign"
          canOutsideClickCancel={true}
          cancelButtonText="Cancel"
          confirmButtonText="Delete">
            Are you sure you want to delete {trackerName}?
        </Alert>

        <Alert isOpen={errorMessage} onClose={() => setErrorMessage("")} intent="danger">
          {errorMessage}
        </Alert>
      </>}
    </ApolloConsumer>
  );
}