import { useForm } from 'react-hook-form';
import { Switch, Button, Dialog, InputGroup, FormGroup, TagInput, Collapse } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { useEffect, useState } from 'react';
import { EMAIL_REGEX, TextArea, TextInput } from '../../components/form';

import ShortString from '../../components/status/types/short_string';
import LongString from '../../components/status/types/long_string';
import Location from '../../components/status/types/location';
import { TYPES_LIST } from '../../components/status/types/types';


function PageOne({
  isVisible, register, errors, public_, setPublic, trigger, setPage
}) {
  return (
    <div style={{display: isVisible ? "inherit" : "none"}}>
      <h1>Create a Tracker</h1>

      <TextInput name="title"
        label="Title"
        placeholder="Write a descriptive title here..."
        formHook={register("title", {
          required: true
        })}
        errors={errors}/>
      
      <TextArea name="description"
        label="Description"
        placeholder="Add some more details..."
        formHook={register("description")}
        errors={errors}/>
      
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
            trigger(["title", "description"]).then(result => {
              if(result) {
                setPage(2);
              }
            })
          }}>
          Next
        </Button>
      </div>
    </div>
  );
}


function AddCustom({included, setIncluded}) {
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
                if(included.filter(({fieldName}) => fieldName === name).length !== 0) {
                  setNameError("Field name already exists");
                } else {
                  setIncluded(included.concat({
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
  isVisible, updateStatusWithLink, setUpdateStatusWithLink,
  includedFields, setIncludedFields,
  atAGlanceField, setAtAGlanceField,
  setPage
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
              {includedFields.length == 0 ? 
              <tr><td className='text-center' colSpan="3">None</td></tr> :
              includedFields.map(({fieldName, fieldType}, index) => {
                return <tr key={index}>
                  <td>{fieldName}</td>
                  <td>{fieldType}</td>

                  <td style={{textAlign: "right"}}>
                    <Button icon='minus' outlined={true} onClick={() => {
                      // Remove from included
                      setIncludedFields(includedFields => includedFields.filter((_, i) => i != index));

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

          <AddCustom included={includedFields} setIncluded={setIncludedFields}/>
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
                        includedFields.push({fieldName, fieldType});
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
            items={includedFields}
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
            disabled={!includedFields.length}>
              <Button
                large={true}
                text={atAGlanceField ? atAGlanceField.fieldName : "Select"}
                style={{width: "100%"}}
                rightIcon="double-caret-vertical"
                disabled={!includedFields.length}/>
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


/* TODO: Write first status */
function PageThree({
  isVisible, setPage, updateStatusWithLink, setUpdateStatusWithLink, collaborators,
  setCollaborators, loading, submit
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
            style={{float: "right"}}
            onClick={()=>{
              submit();
            }}>
            Submit
          </Button>
      </div>
    </div>
  );
}


export default function CreateTracker({ user }) {
  const [page, setPage] = useState(1);

  const { register, trigger, handleSubmit, formState: { errors } } = useForm();
  const [public_, setPublic] = useState(true);

  const [includedFields, setIncludedFields] = useState([]);
  const [atAGlanceField, setAtAGlanceField] = useState("");
  const [updateStatusWithLink, setUpdateStatusWithLink] = useState(false);
  const [collaborators, setCollaborators] = useState([]);

  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const onSubmit = data => {
    // Call apollo api

    // Send collaborator emails

    // Go to tracker page
  }

  return (
    <div className="content">
      <div className="center-content">
        <form>
          <PageOne isVisible={page==1}
            register={register}
            errors={errors}
            public_={public_}
            setPublic={setPublic}
            trigger={trigger}
            setPage={setPage}/>

          <PageTwo isVisible={page==2}
            register={register}
            errors={errors}
            includedFields={includedFields}
            setIncludedFields={setIncludedFields}
            atAGlanceField={atAGlanceField}
            setAtAGlanceField={setAtAGlanceField}
            trigger={trigger}
            setPage={setPage}/>
          
          <PageThree isVisible={page==3}
            register={register}
            errors={errors}
            setPage={setPage}
            collaborators={collaborators}
            setCollaborators={setCollaborators}
            updateStatusWithLink={updateStatusWithLink}
            setUpdateStatusWithLink={setUpdateStatusWithLink}
            submit={handleSubmit(onSubmit)}
            loading={loading}/>
        </form>
      </div>
    </div>
  )
}