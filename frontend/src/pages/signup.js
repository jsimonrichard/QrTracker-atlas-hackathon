import { useForm } from "react-hook-form";
import { FormGroup, Alert } from '@blueprintjs/core';
import { useContext, useState } from 'react';
import { AppContext } from "..";
import { Confirmation, EmailInput, PasswordInput, Submit } from "../components/form";


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
          <EmailInput name="email"
            label="Email"
            placeholder="johndoe1234@gmail.com"
            labelInfo="(required)"
            required={true}
            register={register}
            errors={errors} />
          
          <PasswordInput name="password"
            label="Password"
            placeholder="Enter your password..."
            labelInfo="(required)"
            required={true}
            minLength={6}
            maxLength={128}
            register={register}
            errors={errors} />
          
          <Confirmation name="password_confirmation"
            label="Password Confirmation"
            type="password"
            labelInfo="(required)"
            placeholder="Enter the same password again..."
            required={true}
            register={register}
            errors={errors}
            watch={watch}
            watching={"password"}
            watchingLabel="Password" />


          <div className="text-center">
            <Submit text="Sign Up" loading={loading} />
          </div>
        </form>
      </div>

      <Alert isOpen={alertMessage} onClose={() => {setAlertMessage("")}} intent={alertIntent}>
        {alertMessage}
      </Alert>
    </div>
  );
}