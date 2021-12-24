import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormGroup, Alert } from "@blueprintjs/core";
import { useLocation } from "wouter";

export default function HandlePasswordReset({ app }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [location, setLocation] = useLocation();

  const resetPassword = data => {
    setLoading(true);

    const urlParams = new URLSearchParams(window.location.search);
    app.emailPasswordAuth.resetPassword(
      urlParams.get("token"),
      urlParams.get("tokenId"),
      data.password
    ).then(()=>{
      setLoading(false);
      setLocation("/login");
    }).catch(error => {
      setLoading(false);
      setAlertMessage(error.error);
      console.log(error);
    });
  }
  
  return (
    <div className="content">
      <div className="center-content">
        <h1>Reset your Password</h1>

        <form onSubmit={handleSubmit(resetPassword)}>
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

      <Alert isOpen={alertMessage} onClose={() => {setAlertMessage("")}} intent="danger">
        {alertMessage}
      </Alert>
    </div>
  )
}