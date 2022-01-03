import { useForm } from 'react-hook-form';
import { FormGroup, Alert } from '@blueprintjs/core';
import { useContext, useState } from 'react';
import { Link, useLocation } from 'wouter';
import * as Realm from 'realm-web';
import { AppContext } from '..';
import { EmailInput, PasswordInput, Submit } from '../components/form';

export default function Login({ setUser }) {
  const app = useContext(AppContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [_, setLocation] = useLocation();

  const onSubmit = data => {
    setLoading(true);

    const creds = Realm.Credentials.emailPassword(data.email, data.password);

    app.logIn(creds).then(result => {
      setLoading(false);
      setUser(app.currentUser);
      setLocation("/dashboard");
    }).catch(error => {
      setLoading(false);
      console.log("Something went wrong...", error);
      
      setAlertMessage(error.error);
    });
  }

  return (
    <div className="content">
      <div className="center-content">
        <h1>Log In</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <EmailInput
            name="email"
            label="Email"
            placeholder="johndoe1234@gmail.com"
            required={true}
            register={register}
            errors={errors}/>

          <PasswordInput
            name="password"
            label="Password"
            placeholder="Enter your password..."
            required={true}
            register={register}
            errors={errors}/>

          <Link href="/resetPassword" style={{fontSize: "0.9rem"}}>Forgot your password? Reset it here</Link>

          <Submit text="Log In" loading={loading} />
        </form>
      </div>

      <Alert isOpen={alertMessage} onClose={() => {setAlertMessage("")}} intent="danger">
        {alertMessage}
      </Alert>
    </div>
  );
}
