import { useForm } from 'react-hook-form';
import { FormGroup, Alert } from '@blueprintjs/core';
import { useState } from 'react';
import * as Realm from 'realm-web';

export default function ResetPassword({ app }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertIntent, setAlertIntent] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = data => {
    setLoading(true);

    app.emailPasswordAuth.callResetPasswordFunction({
      email: data.email,
      password: 'dummypassword'
    }).then(() => {
      setLoading(false);
      setAlertMessage("A password reset link will be sent to you inbox")
      setAlertIntent("primary");
    }).catch(error => {
      setLoading(false);
      setAlertMessage(error.error);
      setAlertIntent("danger");
      console.log(error);
    });
  }

  return (
    <div className="content">
      <div className="center-content">
        <h1>Reset your password</h1>

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

          <div className="text-center">
            <input type="submit" className="button brand2" value={loading ? "Loading..." : "Send Password Reset Email"}/>
          </div>
        </form>
      </div>

      <Alert isOpen={alertMessage} onClose={() => {setAlertMessage("")}} intent={alertIntent}>
        {alertMessage}
      </Alert>
    </div>
  )
}