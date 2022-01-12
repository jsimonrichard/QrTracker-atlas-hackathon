import {
  Switch,
  Button,
  Dialog,
  InputGroup,
  FormGroup,
  TagInput,
  TextArea,
  Alert
} from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { useContext, useState } from 'react';
import { loader } from "graphql.macro";
import { useMutation } from '@apollo/client';
import { EMAIL_REGEX } from '../../components/form';
import { useLocation } from 'wouter';
import { AppContext } from '../..';


export default function CreateTracker({ user }) {
  const app = useContext(AppContext);
  const [_, setLocation] = useLocation();

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [public_, setPublic] = useState(true);

  const [statusIncludeDetails, setStatusIncludeDetails] = useState(true);
  const [statusIncludeLocation, setStatusIncludeLocation] = useState(true);
  const [updateStatusWithLink, setUpdateStatusWithLink] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [createTracker] = useMutation(loader("../../graphql/createTracker.graphql"), {
    variables: {
      tracker: {
        title,
        description,
        statusTemplateIncludes: {
          details: statusIncludeDetails,
          location: statusIncludeLocation
        },
        public: public_,
        updateStatusWithLink,
        ownerId: app.currentUser.id
      }
    }
  });

  const onSubmit = data => {
    setLoading(true);

    // Call apollo api
    createTracker().then(result => {
      let id = result.data.insertOneTracker._id;

      setLoading(false);
      setLocation(`/t/${id}`);

    }).catch(error => {
      setLoading(false);

      console.log(error);
      setErrorMessage(error.message);
    });
  }

  return (
    <div className="content">
      <div className="center-content">
        <form onSubmit={event => {
          event.preventDefault()
          if(title) {
            setTitleError("");
            onSubmit();
          } else {
            setTitleError("Title is required")
          }}}>

          <h1>Create a Tracker</h1>

          <FormGroup label="Title" labelInfo="(required)"
            intent={titleError ? "danger": ""}
            helperText={titleError}>
            <InputGroup
              large={true}
              placeholder="Write a descriptive title here..."
              value={title}
              onChange={event => setTitle(event.target.value)}/>
          </FormGroup>

          <FormGroup label="Description">
            <TextArea placeholder='Add some more details...'
              large={true}
              value={description}
              onChange={event => setDescription(event.target.value)}/>
          </FormGroup>

          <FormGroup>
            <Switch checked={public_}
              large={true}
              label="Public"
              onChange={()=>setPublic(!public_)}/>
          </FormGroup>

          <FormGroup label="Status Fields">
            <Switch checked={true}
              large={true}
              disabled
              label="Message (required)"/>

            <Switch checked={statusIncludeDetails}
              large={true}
              label="Details"
              onChange={()=>setStatusIncludeDetails(!statusIncludeDetails)}/>

              <Switch checked={statusIncludeLocation}
                large={true}
                label="Location (with support for auto-complete and google maps)"
                onChange={()=>setStatusIncludeLocation(!statusIncludeLocation)}/>
          </FormGroup>

          <FormGroup label="Permissions">
            <Switch checked={updateStatusWithLink}
              large={true}
              label="Allow anyone with a link (that will be generated later) to update status"
              onChange={()=>setUpdateStatusWithLink(!updateStatusWithLink)}/>
          </FormGroup>

          <Button
            intent="primary"
            outlined={true}
            large={true}
            loading={loading}
            style={{float: "right"}}
            type="submit">
            Submit
          </Button>
        </form>


        <Alert isOpen={errorMessage} onClose={() => setErrorMessage("")} intent="danger">
            {errorMessage}
          </Alert>
      </div>
    </div>
  )
}