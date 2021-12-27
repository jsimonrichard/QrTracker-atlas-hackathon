import { useForm } from "react-hook-form";
import { FormGroup, Alert } from '@blueprintjs/core';
import { useContext, useState } from 'react';
import { AppContext } from "..";


export default function SignUp() {
  const app = useContext(AppContext);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertIntent, setAlertIntent] = useState("");

  const onSubmit = data => {
    setLoading(true);

    app.emailPasswordAuth.registerUser({
      email: data.email,
      password: data.password
    }).then(result => {
      setLoading(false);
      
      setAlertMessage("In a few moments you should recieve an email asking to confirm your email address. Please close this tab and do that now.");
      setAlertIntent("primary");

    }).catch(error => {
      setLoading(false);
      console.log("Something went wrong...", error);
      
      setAlertMessage(error.error);
      setAlertIntent("danger");
    });
  }

  return (
    <div className="content">
      <div className="center-content">
        <h1>Sign Up</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup label="Email" labelInfo="(required)"
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

          <FormGroup label="Password" labelInfo="(required)"
            intent={errors.password ? "danger": ""}
            helperText={errors.password ? 
              (errors.password.type === "required" ? "Password is required" : "Password must be between 6 and 128 characters")
              : ""}>
            <div className="bp3-input-group bp3-large">
              <input
                className="bp3-input"
                {...register("password", {
                  required: true,
                  maxLength: 128,
                  minLength: 6
                })}
                placeholder="Enter your password..."
              type="password"/>
            </div>
          </FormGroup>

          <FormGroup label="Password Confirmation" labelInfo="(required)"
            intent={errors.password_confirmation ? "danger" : ""}
            helperText={errors.password_confirmation ?
              (errors.password?.type === "required" ? "Password Confirmation is required" : "Passwords don't match")
              : ""}>
            <div className="bp3-input-group bp3-large">
              <input
                className="bp3-input"
                {...register("password_confirmation", {
                  required: true,
                  validate: value => value === watch("password")
                })}
                placeholder="Enter the same password again..."
                type="password"/>
            </div>
          </FormGroup>

          <div className="text-center">
            <input type="submit" className="button brand2" value={loading ? "Loading..." : "Sign Up"}/>

          </div>
        </form>
      </div>

      <Alert isOpen={alertMessage} onClose={() => {setAlertMessage("")}} intent={alertIntent}>
        {alertMessage}
      </Alert>
    </div>
  );
}