import { Classes, FormGroup } from "@blueprintjs/core";
import { useEffect } from "react";

function classNames(...classes) {
  return classes.join(" ");
}


export function TextInput({name, type, label, labelInfo, placeholder, formHook, errors,
  getHelperText = (errors) => {
    if(errors[name]) {
      if(errors[name].type === "required") {
        return `${label} is required`;
      } else {
        return `Invalid ${label}`;
      }
    }
  }
}) {
  return (
    <FormGroup label={label} labelInfo={labelInfo}
      intent={errors[name] ? "danger" : ""}
      helperText={getHelperText(errors)}>
      <div className={classNames(Classes.INPUT_GROUP, Classes.LARGE)}>
        <input type={type}
          className={Classes.INPUT} {...formHook}
          placeholder={placeholder}/>
      </div>
    </FormGroup>
  )
}

export const EMAIL_REGEX = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/i;

export function EmailInput({
  name, type, label, labelInfo, placeholder,
  register, required, errors, getHelperText
}) {
  return (
    <TextInput
      name={name}
      type={type}
      label={label}
      labelInfo={labelInfo}
      placeholder={placeholder}
      errors={errors}
      getHelperText={getHelperText}
      
      formHook={register(name, {
        required,
        pattern: EMAIL_REGEX
      })}/>
  )
}


export function PasswordInput({
  name, label, labelInfo, placeholder, register, required,
  minLength, maxLength, errors, getHelperText = (errors) => {
    if(errors[name]) {
      if(errors[name].type === "required") {
        return `${label} is required`;
      } else {
        return `${label} must be between ${minLength} and ${maxLength} characters`;
      }
    }
  }
}) {
  return (
    <TextInput
      name={name}
      type="password"
      label={label}
      labelInfo={labelInfo}
      placeholder={placeholder}
      errors={errors}
      getHelperText={getHelperText}
      formHook={register(name, { required, minLength, maxLength })}/>
  )
}


export function Confirmation({
  name, type, label, labelInfo, placeholder, register, watch, watching,
  watchingLabel, required, errors, getHelperText = (errors) => {
    if(errors[name]) {
      if(errors[name].type === "required") {
        return `${label} is required`;
      } else {
        return `${watchingLabel ? watchingLabel : label} must match`;
      }
    }
  }
}) {
  return (
    <TextInput
      name={name}
      type={type}
      label={label}
      labelInfo={labelInfo}
      placeholder={placeholder}
      errors={errors}
      getHelperText={getHelperText}
      formHook={register(name, {
        required,
        validate: value => value === watch(watching)
      })}/>
  )
}


export function Submit(props) {
  return (
    <input {...props}
      type="submit"
      className={classNames("button", "brand1", props.className)}
      value={props.loading ? "Loading..." : props.text}/>
  )
}


export function TextArea({name, label, labelInfo, placeholder, formHook, errors,
  getHelperText = (errors) => {
    if(errors[name]) {
      if(errors[name].type === "required") {
        return `${label} is required`;
      } else {
        return `Invalid ${label}`;
      }
    }
  }
}) {
  return (
    <FormGroup label={label} labelInfo={labelInfo}
      intent={errors[name] ? "danger" : ""}
      helperText={getHelperText(errors)}>
        <div className={Classes.LARGE}>
          <textarea className={Classes.INPUT} placeholder={placeholder} {...formHook} />
        </div>
    </FormGroup>
  )
}