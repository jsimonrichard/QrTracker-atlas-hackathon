import { Dialog, Button, FormGroup, TextArea, InputGroup, Alert } from "@blueprintjs/core";
import { useContext, useState } from "react";
import { AppContext } from "../..";
import GeocodedInput from "./geocodedInput";
import { useMutation } from "@apollo/client";
import { loader } from "graphql.macro";

function formatLocation({
  formatted_address,
  geometry: {
    location: {
      lat,
      lng
    }
  }
}) {
  return {
    formatted_address,
    geometry: {
      location: {
        lat, lng
      }
    }
  };
}

export default function UpdateStatus({ trackerId, statusTemplateIncludes, loadData, large }) {
  const app = useContext(AppContext);

  const [isOpen, setIsOpen] = useState(false);

  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Mutation
  const [updateStatus] = useMutation(loader("../../graphql/updateStatus.graphql"), {
    variables: {
      id: trackerId,

      status: {
        message,
        details: details ? details : undefined,
        location: location ? formatLocation(location) : undefined,
        editorId: app.currentUser.id
      }
    }
  });

  const onSubmit = () => {
    setLoading(true);

    updateStatus().then(result => {
      setErrorMessage("");
      setLoading(false);

      // Clear data for next time
      setMessage("");
      setDetails("");
      setLocation(null);

      setIsOpen(false);
      loadData()

    }).catch(error => {
      setLoading(false);

      console.log(error);
      setErrorMessage(error.error);
    });
  }

  return (
    <>
      <Button
        large={large}
        outlined={true}
        icon="notifications"
        intent="success"
        onClick={()=>setIsOpen(true)}>
          Update Status
      </Button>


      <Dialog
        isOpen={isOpen}
        onClose={()=>setIsOpen(false)}
        title="Update Status"
        icon="notifications">

          <form className="dialog-content-wrapper"
            onSubmit={event => {
            event.preventDefault();

            if(message) {
              setMessageError("");
              onSubmit();
            } else {
              setMessageError("Message is required");
            }
          }}>
            <FormGroup label="Message" labelInfo="(required)"
              intent={messageError ? "danger": ""}
              helperText={messageError}>
                <InputGroup
                  large={true}
                  placeholder="Write a short message here..."
                  value={message}
                  onChange={event => setMessage(event.target.value)}/>
            </FormGroup>

            {statusTemplateIncludes.details &&
              <FormGroup label="Details">
                <TextArea placeholder='Add some more details...'
                  large={true}
                  value={details}
                  onChange={event => setDetails(event.target.value)}/>
              </FormGroup>
            }

            {statusTemplateIncludes.location &&
              <FormGroup label="Location" large={true}>
                <GeocodedInput value={location} setValue={setLocation} large={true}/>
              </FormGroup>
            }


            <Button
              intent="primary"
              outlined={true}
              large={true}
              loading={loading}
              style={{float: "right"}}
              type="submit">
              Update Status
            </Button>
          </form>
      </Dialog>


      <Alert isOpen={errorMessage} onClose={() => setErrorMessage("")} intent="danger">
        {errorMessage}
      </Alert>
    </>
  );
}