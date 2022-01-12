import { useContext } from "react";
import { AppContext } from "../..";

export default function InviteCollaborators() {
    const app = useContext(AppContext);
    
    // Send collaborator emails
    let emails = collaborators.filter(email => EMAIL_REGEX.test(email));
    if(emails.length) {
      app.currentUser.functions.inviteCollaborators(emails, id)
        .then(() => {
          //setLoading(false);
          
          // Go to tracker page
          //setLocation(`/t/${id}`);
  
        }).catch(error => {
          //setLoading(false);
  
          console.log(error);
          //setErrorMessage(error.message);
        });
    }
  
    return (
      <FormGroup label="Add Collaborators" labelInfo="(they will have full access)">
          <TagInput
            large={true}
            values={collaborators}
            onAdd={values => setCollaborators(collabs => collabs.concat(values))}
            onRemove={(_, index) => setCollaborators(collabs => collabs.filter((_,i) => i != index))}
            tagProps={value => {
              if(EMAIL_REGEX.test(value)) {
                return {intent: "primary"}
              } else {
                return {intent: "danger"}
              }
            }}
            placeholder='Type their email address here...'/>
        </FormGroup>
    );
  }