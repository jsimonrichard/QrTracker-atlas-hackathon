import { useForm } from 'react-hook-form';
import { FormGroup, Alert } from '@blueprintjs/core';
import { useState } from 'react';
import { useLocation } from 'wouter';
import * as Realm from 'realm-web';

export default function Login({ app }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [location, setLocation] = useLocation();

  const onSubmit = data => {
    setLoading(true);

    const creds = Realm.Credentials.emailPassword(data.email, data.password);

    app.logIn(creds).then(result => {
      setLoading(false);
      setLocation("/home");
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
          <FormGroup label="Email"
              intent={errors.email ? "danger" : ""}
              helperText={errors.email ?
                (errors.email.type === "required" ? "Email is required" : "Invalid Email")
                : ""}>
            <div className="bp3-input-group bp3-large">
              <input className="bp3-input"
                {...register("email", {
                  required: true,
                  pattern: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/i
                })}
                placeholder="johndoe1234@gmail.com"/>
            </div>
          </FormGroup>

          <FormGroup label="Password"
            intent={errors.password ? "danger": ""}
            helperText={errors.password ? 
              (errors.password.type === "required" ? "Password is required" : "Password must be between 6 and 128 characters")
              : ""}>
            <div className="bp3-input-group bp3-large">
              <input
                className="bp3-input"
                {...register("password", {
                  required: true
                })}
                placeholder="Enter your password..."
              type="password"/>
            </div>
          </FormGroup>

          <div className="text-center">
            <input type="submit" className="button brand2" value={loading ? "Loading..." : "Log In"}/>
          </div>
        </form>
      </div>

      <Alert isOpen={alertMessage} onClose={() => {setAlertMessage("")}} intent="danger">
        {alertMessage}
      </Alert>
    </div>
  );
}