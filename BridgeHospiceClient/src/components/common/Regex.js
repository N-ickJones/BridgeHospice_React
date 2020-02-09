import React from 'react';

export const userNameRegex = /^[a-zA-Z0-9-._+]*$/;
// eslint-disable-next-line
export const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
export const phoneRegex = /^[0-9]*$/;
export const passwordRegex = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    digit: /\d/,
    special: /\W/,
}

export function vPassword(name, value, setError) {
    let errorValue = "needs a "
    let hasError = false;

    if (!passwordRegex.lowercase.test(value)){
      errorValue += "lowercase, ";
      hasError = true;
    }

    if (!passwordRegex.uppercase.test(value)){
      errorValue += "uppercase, ";
      hasError = true;
    }

    if (!passwordRegex.digit.test(value)){
      errorValue += "digit, ";
      hasError = true;
    }

    if (!passwordRegex.special.test(value)){
      errorValue += "special character, ";
      hasError = true;
    }

    if (hasError) {
      setError(name, "notMatch", errorValue);
      return false;
    }
    else {
      return true;
    }
  }

  export function vEmail(name, value, setError) {
    if (!emailRegex.test(value)) {
      setError(name, "notMatch", "eg: youraddress@mail.com");
      return false;
    }
    else return true;
  }

  export function vUsername(name, value, setError) {
    let isUsername = userNameRegex.test(value);
    if (!isUsername) {
      setError(name, "notMatch", "Invalid username character");
      return false;
    }
    else return true
  }

  export function vPhoneNumber(name, value, setError) {
    if (!phoneRegex.test(value)) {
      setError(name, "notMatch", "use digits only");
      return false;
    } 
    else return true;
  }

  export function vClass(error, init) {
    if (error) {
        return "is-invalid";
    }
    else {
        return  init ? "is-valid" : null;
    }
  }
  export function vError(error, alertOptions) {
    if (error) {
        switch (error.type) {
        case "required": return (<span {...alertOptions}>{error.message ? error.message : 'This field is required'}</span>);
        case "minLength": return (<span {...alertOptions}>{error.message ? error.message : 'Mininum length unsatisfied'}</span>);
        case "maxLength": return (<span {...alertOptions}>{error.message ? error.message : 'Max length exceeded'}</span>);
        case "notMatch": return (<span {...alertOptions}>{error.message ? error.message : 'Condition not met'}</span>);
        default: return null;
        }
    }
    else return null;
  }