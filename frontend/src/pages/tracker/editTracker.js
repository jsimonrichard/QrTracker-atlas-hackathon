import { Button, FormGroup, InputGroup, NonIdealState, Spinner, TextArea, Switch, Alert } from "@blueprintjs/core";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Link } from "wouter";
import { loader } from "graphql.macro";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../..";
import DeleteButton from "../../components/tracker/deleteButton";

export default function EditTracker({ trackerId }) {
  const app = useContext(AppContext);

  const [loadData, { called, loading, error, data }] = useLazyQuery(loader("../../graphql/viewTracker.graphql"), {
    variables: {
      id: trackerId
    }
  });

  // Load data on mount
  useEffect(loadData, []);

  useEffect(()=>{
    if(data) {
      setIsOwner(app.currentUser.id === data.tracker.ownerId);
    }
  }, [data])

  // Flag for owners and collaborators
  const [isOwner, setIsOwner] = useState(undefined);

  // Render
  if(!called || loading) {
    return (
      <div className="content">
        <Spinner className="tall-spinner" />
      </div>
    );

  } else if(error) {
    console.log(error);
    return (
      <div className="content">
        <NonIdealState
          className="tall-spinner"
          icon="error"
          title="An error occured"
          description={error.error}/>
      </div>
    );

  } else {
    return (
      <div className="content">
        <Link href={`/t/${trackerId}`}>
          <Button
            large={true}
            outlined={true}
            icon="arrow-left"
            intent="primary">
              Back
          </Button>
        </Link>

        <DeleteButton
          trackerId={trackerId}
          trackerName={data.tracker.title}
          large={true}
          outlined={true}
          style={{float: "right"}}/>
        
        <div className="center-content">
          <EditTrackerSettings
            trackerId={trackerId}
            data={data}
            loadData={loadData}
            isOwner={isOwner}/>
        </div>        
      </div>
    )
  }
}

function EditTrackerSettings({ trackerId, loadData, data, isOwner }) {
  const [loading, setLoading] = useState(false);

  // Fields and error messages
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [statusIncludeDetails, setStatusIncludeDetails] = useState(true);
  const [statusIncludeLocation, setStatusIncludeLocation] = useState(true);
  const [public_, setPublic] = useState(true);
  const [updateStatusWithLink, setUpdateStatusWithLink] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // update values
  useEffect(() => {
    if(data) {
      setTitle(data.tracker.title);
      setDescription(data.tracker.description);
      setStatusIncludeDetails(data.tracker.statusTemplateIncludes.details);
      setStatusIncludeLocation(data.tracker.statusTemplateIncludes.location);
      setPublic(data.tracker.public);
      setUpdateStatusWithLink(data.tracker.updateStatusWithLink);
    }
  }, [data]);


  // Mutation
  const [updateTracker] = useMutation(loader("../../graphql/updateTracker.graphql"), {
    variables: {
      id: trackerId,

      tracker: {
        title: isOwner ? title : undefined,
        description,
        statusTemplateIncludes: isOwner ? {
          details: statusIncludeDetails,
          location: statusIncludeLocation
        } : undefined,
        public: isOwner ? public_ : undefined,
        updateStatusWithLink: isOwner ? updateStatusWithLink : undefined
      }
    }
  });

  const onSubmit = () => {
    setLoading(true);

    updateTracker().then(result => {
      setErrorMessage("");
      setLoading(false);
      loadData();
    }).catch(error => {
      console.log(error);
      setErrorMessage(error.error);
    });
  }

  return (
    <form onSubmit={event => {
      event.preventDefault();

      if(title) {
        setTitleError("");
        onSubmit();
      } else {
        setTitleError("Title is required")
      }
    }}>
      <FormGroup label="Title" labelInfo="(required)"
        intent={titleError ? "danger": ""}
        helperText={isOwner ? titleError : "Only owners can edit this field"}
        disabled={!isOwner}>
        <InputGroup
          large={true}
          placeholder="Write a descriptive title here..."
          value={title}
          disabled={!isOwner}
          onChange={event => setTitle(event.target.value)}/>
      </FormGroup>

      <FormGroup label="Description">
        <TextArea placeholder='Add some more details...'
          large={true}
          value={description}
          onChange={event => setDescription(event.target.value)}/>
      </FormGroup>


      {isOwner &&
        <>
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
            <Switch checked={public_}
                  large={true}
                  label="Public"
                  onChange={()=>setPublic(!public_)}/>
            <Switch checked={updateStatusWithLink}
              large={true}
              label="Allow anyone with a link (that will be generated later) to update status"
              onChange={()=>setUpdateStatusWithLink(!updateStatusWithLink)}/>
          </FormGroup>
        </>
      }

      <Button
        intent="primary"
        outlined={true}
        large={true}
        loading={loading}
        style={{float: "right"}}
        type="submit">
        Update Tracker
      </Button>

      <Alert isOpen={errorMessage} onClose={() => setErrorMessage("")} intent="danger">
        {errorMessage}
      </Alert>
    </form>
  );
}