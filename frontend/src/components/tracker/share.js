import { ApolloConsumer } from "@apollo/client";
import { Button, ControlGroup, Dialog, TagInput, FormGroup, Classes, InputGroup } from "@blueprintjs/core";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../..";
import { EMAIL_REGEX } from "../form";
import copy from 'copy-text-to-clipboard';

export default function Share({trackerId, data, large}) {
  const app = useContext(AppContext);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        large={large}
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
                setLoading(true);
                setErrorMessage("");

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
                setLoading(true);
                setErrorMessage("");

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

            <GetShareLink
              trackerId={trackerId}
              label="For Subscribers"
              link={data.subscriberLink}
              type="subscribe"
              large={true}/>
            

            <GetShareLink
              trackerId={trackerId}
              label="For Collaborators"
              link={data.collaboratorLink}
              type="collaborate"
              large={true}/>
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
            intent="primary"
            onClick={handleSubmit}/>
        </ControlGroup>
    </FormGroup>
  );
}

function GetShareLink({trackerId, link, label, type, large}) {
  const app = useContext(AppContext);

  const [domainName, setDomainName] = useState("");

  const [message, setMessage] = useState("");
  const [messageIntent, setMessageIntent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    app.currentUser.functions.getDomainName().then(dn => {
      setLoading(false);
      setDomainName(dn);
    }).catch(console.log);
  }, []);
  
  const formatLink = link => `https://${domainName}/acceptInvitation?invite=${link._id}&key=${link.key}`;

  const copyToClipBoard = () => {
    setLoading(true);
    setMessage("");
    setMessageIntent("");

    copy(formatLink(link));
    setLoading(false);
    setMessage("Copied!");
    setMessageIntent("success");
  }

  const createLink = client => {
    setLoading(true);
    setMessage("");
    setMessageIntent("");

    app.currentUser.functions.createInviteLink(trackerId, type).then(() => {
      // Reload queries
      client.refetchQueries({
        include: "active"
      }).then(() => {
        setLoading(false);
      }).catch(error => {
        setLoading(false);
        setMessage(error.error);
        setMessageIntent("danger");

        console.log(error);
      })

    }).catch(error => {
      setLoading(false);
      setMessage(error.error);
      setMessageIntent("danger");

      console.log(error);
    });
  }

  return (
    <ApolloConsumer>
      {client => 
        <FormGroup label={label} large={large}
          intent={messageIntent}
          helperText={message}>
    
          <InputGroup large={large} value={link ? formatLink(link) : ""} rightElement={
            <Button intent="primary" outlined={true} loading={loading}
              onClick={() => {
                if(link) {
                  copyToClipBoard();
                } else {
                  createLink(client);
                }
              }}>
              {link ? "Copy" : "Generate"}
            </Button>
          }
          placeholder="No links have been generated..."/>
        </FormGroup>
      }
    </ApolloConsumer>
    
  );
}