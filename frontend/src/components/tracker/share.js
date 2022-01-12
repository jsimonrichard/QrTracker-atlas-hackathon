import { Button, ControlGroup, Dialog, TagInput, FormGroup, Classes } from "@blueprintjs/core";
import { useState, useContext } from "react";
import { AppContext } from "../..";
import { EMAIL_REGEX } from "../form";

export default function Share({trackerId}) {
  const app = useContext(AppContext);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        large={true}
        outlined={true}
        icon="share"
        intent="danger"
        onClick={() => setIsOpen(true)}>
          Share
      </Button>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}

        title="Share"
        icon="share">
        
          <div className="dialog-content-wrapper">
            <SendEmailList label="Invite Subscribers"
              onSubmit={(emails, setLoading, setErrorMessage) => {
                // Send subscriber emails
                app.currentUser.functions.sendInvite(emails, trackerId, "subscribe")
                .then(() => {
                  setLoading(false);
                }).catch(error => {
                  setLoading(false);

                  console.log(error);
                  setErrorMessage(error.message);
                });
              }}/>


            <SendEmailList label="Invite Collaborators" labelInfo="(they will have full access)"
              onSubmit={(emails, setLoading, setErrorMessage) => {
                // Send collaborator emails
                app.currentUser.functions.sendInvite(emails, trackerId, "collaborate")
                  .then(() => {
                    setLoading(false);
                  }).catch(error => {
                    setLoading(false);

                    console.log(error);
                    setErrorMessage(error.message);
                  });
              }}/>

            <h2>Links</h2>
          </div>
      </Dialog>
    </>
  );
}


function SendEmailList({ label, labelInfo, onSubmit }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleSubmit = () => {
    let filtered_emails = emails.filter(email => EMAIL_REGEX.test(email));
    if(filtered_emails.length) {
      onSubmit(filtered_emails, setLoading, setErrorMessage);
      setEmails([]);
    }
  }

  return (
    <FormGroup label={label} labelInfo={labelInfo} large={true}
      intent={errorMessage ? "danger" : ""}
      helperText={errorMessage}>
        <ControlGroup fill={true}>
          <TagInput
            large={true}
            values={emails}
            onAdd={values => setEmails(emails => emails.concat(values))}
            onRemove={(_, index) => setEmails(emails => emails.filter((_,i) => i != index))}
            tagProps={value => {
              if(EMAIL_REGEX.test(value)) {
                return {intent: "primary"}
              } else {
                return {intent: "danger"}
              }
            }}
            placeholder='Type their email address here...'/>
          
          <Button
            icon="send-message"
            large={true}
            className={Classes.FIXED}
            loading={loading}
            onClick={handleSubmit}/>
        </ControlGroup>
    </FormGroup>
  );
}