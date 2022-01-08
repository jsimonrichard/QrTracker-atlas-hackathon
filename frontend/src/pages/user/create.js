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

import ShortString from '../../components/status/types/short_string';
import LongString from '../../components/status/types/long_string';
import Location from '../../components/status/types/location';
import { TYPES_LIST } from '../../components/status/types/types';
import { useLocation } from 'wouter';
import { AppContext } from '../..';


function PageOne({
  isVisible, title, setTitle, description, setDescription,
  public_, setPublic, setPage
}) {
  const [titleError, setTitleError] = useState("");

  return (
    <div style={{display: isVisible ? "inherit" : "none"}}>
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
      
      <Switch checked={public_}
        large={true}
        label="Public"
        onChange={()=>setPublic(!public_)}/>
      
      <div className='text-right'>
        <Button
          intent="primary"
          outlined={true}
          large={true}
          rightIcon='arrow-right'
          onClick={()=>{
            if(title) {
              setTitleError("");
              setPage(2);
            } else {
              setTitleError("Title is required")
            }
          }}>
          Next
        </Button>
      </div>
    </div>
  );
}


function AddCustom({fields, setFields}) {
  const [isOpen, setIsOpen] = useState(false);
  const [nameError, setNameError] = useState("");

  const [name, setName] = useState("");
  const [typeName, setTypeName] = useState(ShortString.NAME);

  return (
    <>
      <Button icon="plus" large={true} outlined={true} intent="primary" style={{width: "100%"}}
        onClick={()=>setIsOpen(true)}>
          Add Custom Field
      </Button>
      <Dialog
        title="Add Custom Field"
        icon="plus"
        isOpen={isOpen}
        onClose={()=>setIsOpen(false)}>
        
        <div className='dialog-content-wrapper'>
          <div className='horizontal-grid-wrapper'>
            <FormGroup label="Name" helperText={nameError} intent={nameError ? "danger" : ""}>
              <InputGroup large={true} value={name} onChange={event => setName(event.target.value)}/>
            </FormGroup>

            <FormGroup label="Type">
              <Select
                items={TYPES_LIST}
                
                itemRenderer={(item, {handleClick}) => (
                  <Button
                    onClick={event => {
                      setTypeName(item.NAME);
                      handleClick(event);
                    }}
                    className="popover-select-button"
                    minimal={true}>
                      {item.NAME}
                  </Button>
                )}
                filterable={false}>
                <Button
                  large={true}
                  text={typeName}
                  style={{width: "100%"}}
                  rightIcon="double-caret-vertical" />
              </Select>
            </FormGroup>
          </div>

          <div className='button-wrapper'>
            <Button
              icon="plus"
              outlined={true}
              intent="primary"
              large={true}
              onClick={() => {
                if(fields.filter(({fieldName}) => fieldName === name).length !== 0) {
                  setNameError("Field name already exists");
                } else {
                  setFields(fields.concat({
                    fieldName: name,
                    fieldType: typeName
                  }));

                  setIsOpen(false);
                }
              }}>
              Add
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}


function PageTwo({
  isVisible, statusFields, setStatusFields,
  atAGlanceField, setAtAGlanceField, setPage
}) {
  const DEFAULT_FIELDS = [
    {fieldName: "Title", fieldType: ShortString.NAME},
    {fieldName: "Description", fieldType: LongString.NAME},
    {fieldName: "Location", fieldType: Location.NAME}
  ]
  const [excluded, setExcluded] = useState(DEFAULT_FIELDS);
  const [atAGlanceError, setAtAGlanceError] = useState("");

  return (
    <div style={{display: isVisible ? "inherit" : "none"}}>
      <h1>Status Settings</h1>
    
      <div className='field-chooser'>

        <p className="small-paragraph">
          Choose the fields you'd like to include as a part of the status of your tracker.
        </p>

        <div className='table-wrapper'>
          <h3>Included</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
              </tr>
            </thead>

            <tbody>
              {statusFields.length == 0 ? 
              <tr><td className='text-center' colSpan="3">None</td></tr> :
              statusFields.map(({fieldName, fieldType}, index) => {
                return <tr key={index}>
                  <td>{fieldName}</td>
                  <td>{fieldType}</td>

                  <td style={{textAlign: "right"}}>
                    <Button icon='minus' outlined={true} onClick={() => {
                      // Remove from included
                      setStatusFields(fields => fields.filter((_, i) => i != index));

                      // Check if it's the at a glance field
                      if(atAGlanceField.fieldName == fieldName) {
                        setAtAGlanceField("");
                      }

                      // Add to excluded
                      excluded.push({ fieldName, fieldType });
                    }} />
                  </td>
                </tr>
              })}
            </tbody>
          </table>

          <AddCustom field={statusFields} setField={setStatusFields}/>
        </div>

        <div className='table-wrapper'>
          <h3>Excluded</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
              </tr>
            </thead>

            <tbody>
              {excluded.length == 0 ? 
              <tr><td className='text-center' colSpan="3">None</td></tr> :
              excluded.map(({fieldName, fieldType}, index) => {
                return <tr key={index}>
                  <td>{fieldName}</td>
                  <td>{fieldType}</td>

                  <td style={{textAlign: "right"}}>
                    <Button
                      icon='plus'
                      outlined={true}
                      intent="primary"
                      onClick={()=>{
                        // Remove from excluded
                        setExcluded(excluded => excluded.filter((_, i) => i != index))

                        // Add to included
                        statusFields.push({fieldName, fieldType});
                      }} />
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </div>

      </div>

      <FormGroup label='The "at a glance" field'
        labelInfo="The field to reference when space is limited (required)"
        helperText={atAGlanceError}
        intent={atAGlanceError ? "danger" : ""}>
          <Select
            items={statusFields}
            itemRenderer={(item, {handleClick}) => (
              <Button
                onClick={event => {
                  setAtAGlanceField(item);
                  handleClick(event);
                }}
                className="popover-select-button"
                minimal={true}>
                  {item.fieldName}
              </Button>
            )}
            filterable={false}
            disabled={!statusFields.length}>
              <Button
                large={true}
                text={atAGlanceField ? atAGlanceField.fieldName : "Select"}
                style={{width: "100%"}}
                rightIcon="double-caret-vertical"
                disabled={!statusFields.length}/>
          </Select>
      </FormGroup>

      <div>

        <Button
            intent="warning"
            outlined={true}
            large={true}
            icon='arrow-left'
            onClick={()=>{
              setPage(1);
            }}>
            Back
          </Button>

        <Button
            intent="primary"
            outlined={true}
            large={true}
            rightIcon='arrow-right'
            style={{float: "right"}}
            onClick={()=>{
              if(atAGlanceField) {
                setAtAGlanceError("");
                setPage(3);
              } else {
                setAtAGlanceError('The "at a glance" field is required');
              }
            }}>
            Next
          </Button>
      </div>
    </div>
  );
}


function PageThree({
  isVisible, setPage, updateStatusWithLink, setUpdateStatusWithLink, collaborators,
  setCollaborators, loading, onSubmit
}) {
  return (
    <div style={{display: isVisible ? "inherit" : "none"}}>

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
      
      <FormGroup label="Other Permissions">
        <Switch checked={updateStatusWithLink}
          large={true}
          label="Allow anyone with a link (that will be generated later) to update status"
          onChange={()=>setUpdateStatusWithLink(!updateStatusWithLink)}/>
      </FormGroup>

      <div>
        <Button
            intent="warning"
            outlined={true}
            large={true}
            icon='arrow-left'
            onClick={()=>{
              setPage(2);
            }}>
            Back
          </Button>

        <Button
            intent="primary"
            outlined={true}
            large={true}
            loading={loading}
            style={{float: "right"}}
            onClick={()=>{
              onSubmit();
            }}>
            Submit
          </Button>
      </div>
    </div>
  );
}


export default function CreateTracker({ user }) {
  const app = useContext(AppContext);

  const [page, setPage] = useState(1);
  const [_, setLocation] = useLocation();

  const [public_, setPublic] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusFields, setStatusFields] = useState([]);
  const [atAGlanceField, setAtAGlanceField] = useState("");
  const [updateStatusWithLink, setUpdateStatusWithLink] = useState(false);
  const [collaborators, setCollaborators] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [createTracker] = useMutation(loader("../../graphql/createTracker.graphql"), {
    variables: {
      tracker: {
        title,
        description,
        statusFields,
        atAGlanceField,
        updateStatusWithLink,
        ownerId: app.currentUser.id
      }
    }
  });

  const onSubmit = data => {
    setLoading(true);

    // Call apollo api
    createTracker().then(_id => {
      console.log(_id);

      // Send collaborator emails
      app.currentUser.functions.inviteCollaborators(
        collaborators.filter(email => EMAIL_REGEX.text(email)),
        _id
      ).then(() => {
        setLoading(false);
        
        // Go to tracker page
        setLocation(`/tracker/${_id}`);

      }).catch(error => {
        setLoading(false);

        console.log(error);
        setErrorMessage(error.error);
      });
    }).catch(error => {
      setLoading(false);
      
      console.log(error);
      setErrorMessage(error.error);
    });
  }

  return (
    <div className="content">
      <div className="center-content">
        <form>
          <PageOne isVisible={page==1}
            public_={public_}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            setPublic={setPublic}
            setPage={setPage}/>

          <PageTwo isVisible={page==2}
            statusFields={statusFields}
            setStatusFields={setStatusFields}
            atAGlanceField={atAGlanceField}
            setAtAGlanceField={setAtAGlanceField}
            setPage={setPage}/>
          
          <PageThree isVisible={page==3}
            setPage={setPage}
            collaborators={collaborators}
            setCollaborators={setCollaborators}
            updateStatusWithLink={updateStatusWithLink}
            setUpdateStatusWithLink={setUpdateStatusWithLink}
            onSubmit={onSubmit}
            loading={loading}/>
          
          <Alert isOpen={errorMessage} onClose={() => setErrorMessage("")}/>
        </form>
      </div>
    </div>
  )
}