import { useForm } from 'react-hook-form';
import { Alert, Icon, Switch, Button } from '@blueprintjs/core';
import { useContext, useState } from 'react';
import { TextArea, TextInput } from '../../components/form';

function PageOne({
  isVisible, register, errors, public_, setPublic,
  allowAnyoneToUpdateStatus, setAllowAnyoneToUpdateStatus,
  trigger, setPage
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

      <Switch checked={allowAnyoneToUpdateStatus}
        large={true}
        label="Allow anyone to update status"
        onChange={()=>setAllowAnyoneToUpdateStatus(!allowAnyoneToUpdateStatus)}/>
      
      <div className='text-right'>
        <Button
          intent="primary"
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

/* TODO: Add collaborators */
function PageTwo({
  isVisible
}) {
  return (
    <div style={{display: isVisible ? "inherit" : "none"}}>
    
    </div>
  );
}


/* TODO: Write first status */
function PageThree({
  isVisible
}) {
  return (
    <div style={{display: isVisible ? "inherit" : "none"}}>
      
    </div>
  );
}


export default function CreateTracker({ user }) {
  const [page, setPage] = useState(1);

  const { register, trigger, handleSubmit, formState: { errors } } = useForm();
  const [public_, setPublic] = useState(true);
  const [allowAnyoneToUpdateStatus, setAllowAnyoneToUpdateStatus] = useState(false);

  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const onSubmit = data => {

  }

  return (
    <div className="content">
      <div className="center-content">
        <form onSubmit={handleSubmit(onSubmit)}>
          <PageOne isVisible={page==1}
            register={register}
            errors={errors}
            public_={public_}
            setPublic={setPublic}
            allowAnyoneToUpdateStatus={allowAnyoneToUpdateStatus}
            setAllowAnyoneToUpdateStatus={setAllowAnyoneToUpdateStatus}
            trigger={trigger}
            setPage={setPage}/>

          <PageTwo isVisible={page==2}
            register={register}
            errors={errors}
            trigger={trigger}
            setPage={setPage}/>
          
          <PageThree isVisible={page==3}
            register={register}
            errors={errors}/>
        </form>
      </div>
    </div>
  )
}