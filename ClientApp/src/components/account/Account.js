import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import useForm from 'react-hook-form';

import authService from '../api-authorization/AuthorizeService';
import { userNameRegex, emailRegex, vPassword, vEmail, vPhoneNumber } from '../common/Regex';
import { postItem, Api } from '../common/Api';
import { AppPaths, QueryParams } from '../common/Constants';

export default function Account() {
  const history = useHistory();
  const alertOptions = {className: "ml-2 text-danger font-weight-bold"}
  const [toggleQuickCreate, setToggleQuickCreate] = useState(false);
  const [toggleRememberMe, setToggleRememberMe] = useState(false);

  const [init, setInit] = useState({
    accountUserName: false,
    accountEmail: false,
    accountFirstName: false,
    accountLastName: false,
    accountPassword: false,
    accountConfirmPassword: false,
    accountPhoneNumber: false
  });

  const [state, setState] = useState(
    {
      userName: true,
      email: false,
      firstName: false,
      lastName: false,
      password: true,
      forgotPassword: true,
      confirmPassword: false,
      phoneNumber: false,
      signInAccount: true,
      createAccount: false,
      recoverPassword: false,
      accountStatus: 'Account Sign In',
      submissionSuccess: '',
      submissionError: '',
    }
  );

  //React Form Settings and Imports
  const { register, errors, getValues, triggerValidation, reset, watch, setError } = useForm({ 
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {},
    validationSchemaOption: { abortEarly: false },
    validateCriteriaMode: "firstErrorDetected",
    submitFocusError: true,
    nativeValidation: false,
    }
  );

  return (
      <Form className="container shadow" style={{ maxWidth: 580}}>
        
        {/* Form Status Indicators */}
        <h3 id="accountPageTitle" className="text-center py-4 m-0 border-0 rounded-lg">{state.accountStatus}</h3>
        <span id="accountPageSuccess" className="ml-2 text-success">{state.submissionSuccess}</span>
        <span id= "accountPageError" className="ml-2 text-danger">{state.submissionError}</span>

        {/* Full or Quick Switch Create Account */}
        <label id="quickCreateSwitch" className={state.createAccount ? 'switch' : 'hidden'}>
          <input className="switch-input" type="checkbox" 
            onClick={() => {setToggleQuickCreate(!toggleQuickCreate)}} />
          <span className="switch-label" data-on="Quick" data-off="Full"></span> 
          <span className="switch-handle"></span>
        </label>

        {/* Username Input */}
        <Form.Group controlId="accountUserName" className={state.userName ? 'p-2 m-0' : 'hidden'}>
        <Form.Label>Username{!state.createAccount ? ' (or email)' : ''}{handleValidationError(errors.accountUserName)}</Form.Label>
        <Form.Control name="accountUserName" type="text" 
          defaultValue=""
          placeholder={state.createAccount ? 'Enter Username' : 'Enter username (or email)'}
          className={handleValidationClass(errors.accountUserName, init.accountUserName)} 
          onChange={ async () => init.accountUserName && await triggerValidation({ name: 'accountUserName' }) }
          onKeyUp={(event) => {if(event.keyCode === 13) {if(state.recoverPassword) {handleCreateClick(event);}}}}
          ref={register({ required: true, minLength: 5, maxLength: 50,
            validate: { Pattern: (value) => { return handleUsernamePattern(value) }}
          })} />
        </Form.Group>

        {/* Email Input */}
        <Form.Group controlId="accountEmail" className={state.email ? 'p-2 m-0' : 'hidden'}>
        <Form.Label>Email address{handleValidationError(errors.accountEmail)}</Form.Label>
        <Form.Control name="accountEmail" type="email" placeholder="Enter Email" 
          className={handleValidationClass(errors.accountEmail, init.accountEmail)} 
          onChange={ async () => init.accountEmail && await triggerValidation({ name: 'accountEmail' }) }
          ref={register({ required: true, minLength: 5, maxLength: 254, 
            validate: { Pattern: (value) => { return vEmail("accountEmail", value, setError) }}
          })} />
        </Form.Group>

        {/* First-Name Input */}
        <Form.Group controlId="accountFirstName" className={state.firstName && !toggleQuickCreate ? 'p-2 m-0' : 'hidden'}>
          <Form.Label>First Name{handleValidationError(errors.accountFirstName)}</Form.Label>
          <Form.Control name="accountFirstName" type="text" placeholder="Enter First Name" 
            className={handleValidationClass(errors.accountFirstName, init.accountFirstName)}
            onChange={ async () => init.accountFirstName && await triggerValidation({ name: 'accountFirstName' }) }
            ref={register({ required: true, maxLength: 50, 
            })} />
        </Form.Group>

        {/* Last-Name Input */}
        <Form.Group controlId="accountLastName" className={state.lastName && !toggleQuickCreate ? 'p-2 m-0' : 'hidden'}>
          <Form.Label>Last Name{handleValidationError(errors.accountLastName)}</Form.Label>
          <Form.Control name="accountLastName" type="text" placeholder="Enter Last Name" 
            className={handleValidationClass(errors.accountLastName, init.accountLastName)}
            onChange={ async () => init.accountLastName && await triggerValidation({ name: 'accountLastName' }) }
            ref={register({ required: true, maxLength: 50, 
            })} />
        </Form.Group>

        {/* Phone-Number Input */}
        <Form.Group controlId="accountPhoneNumber" className={state.phoneNumber && !toggleQuickCreate ? 'p-2 m-0' : 'hidden'}>
          <Form.Label>Phone Number{handleValidationError(errors.accountPhoneNumber)}</Form.Label>
          <Form.Control name="accountPhoneNumber" type="phone" placeholder="Enter Password" 
            className={handleValidationClass(errors.accountPhoneNumber, init.accountPhoneNumber)}
            onChange={ async () => init.accountPhoneNumber && await triggerValidation({ name: 'accountPhoneNumber' }) }
            ref={register({ required: true, minLength: 10, maxLength: 10, 
              validate: { Pattern: (value) => { return vPhoneNumber("accountPhoneNumber", value, setError) }}
            })} />
        </Form.Group>
        
        {/* Password Input */}
        <Form.Group controlId="accountPassword" className={state.password ? 'p-2 m-0' : 'hidden'}>
          <Form.Label>Password{handleValidationError(errors.accountPassword)}</Form.Label>
          <Form.Control name="accountPassword" type="password" placeholder="Enter Password" 
            className={handleValidationClass(errors.accountPassword, init.accountPassword)}
            defaultValue=""
            onChange={ async () => init.accountPassword && await triggerValidation({ name: 'accountPassword' }) }
            onKeyUp={(event) => {if (event.keyCode === 13) state.signInAccount && handleSignInClick(event);}}
            ref={register({ required: true, minLength: 8,
              validate: { Pattern: (value) => { return vPassword("accountPassword", value, setError) }}
            })} />
          <div className={state.forgotPassword ? 'd-flex mt-1' : 'hidden'}>
            <Button className='ml-auto helpOption' id="forgotPasswordButton"
              onClick={event => handleRecoverPasswordClick(event)}>
                Forgot Password?
            </Button>
          </div>
        </Form.Group>
        
        {/* Confirm-Password Input */}
        <Form.Group controlId="accountConfirmPassword" className={state.confirmPassword ? 'p-2 m-0' : 'hidden'}>
          <Form.Label>Confirm Password{handleValidationError(errors.accountConfirmPassword)}</Form.Label>
          <Form.Control name="accountConfirmPassword" type="password" placeholder="Enter Password" 
            className={handleValidationClass(errors.accountConfirmPassword, init.accountConfirmPassword)}
            onChange={ async () => init.accountConfirmPassword && await triggerValidation({ name: 'accountConfirmPassword' }) }
            onKeyUp={(event) => {if (event.keyCode === 13) state.createAccount && handleCreateClick(event);}}
            ref={register({ required: true, validate: {
              Matches: (value) => { return value === watch('accountPassword')}}
            })} />
        </Form.Group>

        {/* RememberMe Toggle */}
        <div className={state.signInAccount ? 'd-flex mx-2' : 'hidden'}>
          <label id="rememberMeSwitch" className="switch-sm">
            <input className="switch-sm-input" type="checkbox" onClick={() => {setToggleRememberMe(!toggleRememberMe)}} />
            <span className="switch-sm-label" data-on="Yes" data-off="No"></span> 
            <span className="switch-sm-handle"></span> 
          </label>
          <span className="remember-switch text-secondary">Remember Me?</span>
        </div>

        {/* Submission Buttons */}
        <div className="px-2 py-4 m-0 row">
          <Button id="signInButton"
            className="my-2 w-100"
            variant="primary" 
            onClick={event => handleSignInClick(event)}>
              {state.signInAccount ? 'Sign In My Account' : 'Sign In To Account?'}
          </Button>
          <Button id="createAccountButton"
            className={!state.createAccount && !state.recoverPassword ? "my-2 w-100" : "my-2 w-100 order-first"} 
            variant="secondary" 
            onClick={event => handleCreateClick(event)}>
              { handleCreateButtonText() }
          </Button>
        </div>
      </Form>
  );

  async function handleSignInClick(event) {
    event.preventDefault();
    if (state.signInAccount) {
      await SignInSubmit(event);
    } 
    else {
      SignInRedirect(event);
    }
  }

  function SignInRedirect(event) {
    resetForm();
    setState(state => ({ ...state,
      accountStatus: 'Account Sign In',
      userName: true,
      email: false, 
      firstName: false, 
      lastName: false,
      password: true,
      forgotPassword: true,
      confirmPassword: false,
      phoneNumber: false,
      signInAccount: true, 
      createAccount: false, 
      recoverPassword: false,
      submissionSuccess: '',
      submissionError: ''
    }));
  }

  async function SignInSubmit(event) {
    setInitialized(true);
    if (await triggerValidation([ { name: 'accountUserName' }, { name: 'accountPassword' } ])) {
      authenticate();
    }
    else {
      setState(state => ({ ...state, submissionError: "Please correct the form"}));
    }
  }

  async function handleCreateClick(event) {
    event.preventDefault();
    if (!state.recoverPassword) {
      if (state.createAccount) {
        createSubmit();
      }
      else {
        createRedirect();
      }
    }
    else {
      recoverPassword();
    }
  }

  //CREATE REDIRECT
  function createRedirect() {
    resetForm();
    setState(state => ({ ...state, 
      accountStatus: 'Create My Account',
      userName: true,
      email: true, 
      firstName: !toggleQuickCreate,
      lastName: !toggleQuickCreate,
      phoneNumber: !toggleQuickCreate,
      password: true,
      forgotPassword: false,
      confirmPassword: true,
      signInAccount: false, 
      createAccount: true, 
      recoverPassword: false,
      submissionSuccess: '',
      subbmisionWarning: '',
      submissionError: ''
    }));
  }

  //RECOVER PASSWORD REDIRECT
  async function handleRecoverPasswordClick(event) {
    event.preventDefault();
    if (!state.recoverPassword) {
      setInit({
        accountUserName: errors.accountUserName ? true : false,
        accountEmail: false,
        accountFirstName: false,
        accountLastName: false,
        accountPassword: false,                       
        accountConfirmPassword: false,
        accountPhoneNumber: false,
      });
      setState(state => ({ ...state,
        accountStatus: 'Recover Password',
        userName: true,
        email: false, 
        firstName: false, 
        lastName: false,
        password: false,
        forgotPassword: false,
        confirmPassword: false,
        phoneNumber: false,
        signInAccount: false, 
        createAccount: false, 
        recoverPassword: true, 
        submissionSuccess: '',
        subbmisionWarning: '',
        submissionError: ''
      }));
    }
    else {
      setInitialized(true);
    }
  }

  //START HELPERS
  function handleCreateButtonText() {
    if (state.recoverPassword) {
      return "Recover My Account";
    }
    else{
      if (state.createAccount) {
        return "Create My Account";
      }
      else {
        return "Create An Account?";
      }
    }
  }

  function setInitialized(truth) {
    setInit({
      accountUserName: truth,
      accountEmail: truth,
      accountFirstName: truth,
      accountLastName: truth,
      accountPhoneNumber: truth,
      accountPassword: truth,
      accountConfirmPassword: truth,
    });
    setState(state => ({ ...state, submissionSuccess: '', submissionError: ''}));
  }

  function handleValidationClass(error, init) {
    if (error) {
      return "is-invalid";
    }
    else {
      return init ? "is-valid" : null;
    }
  }

  function handleValidationError(error) {
    if (error) {
      switch (error.type) {
        case "required": return (<span {...alertOptions}>{error.message ? error.message : 'This field is required'}</span>);
        case "minLength": return (<span {...alertOptions}>{error.message ? error.message : 'Minimum length unsatisfied'}</span>);
        case "maxLength": return (<span {...alertOptions}>{error.message ? error.message : 'Max length exceeded'}</span>);
        case "notMatch": return (<span {...alertOptions}>{error.message ? error.message : 'Condition not met'}</span>);
        default: return null;
      }
    }
    else return null;
  }

  function resetForm() {
    reset();
    setInit({
      accountUserName: false,
      accountEmail: false,
      accountFirstName: false,
      accountLastName: false,
      accountPhoneNumber: false,
      accountPassword: false,
      accountConfirmPassword: false,
    });
    setToggleRememberMe(false);
    setToggleQuickCreate(false);
  }

  function navigateToUrl(url) {
    window.location.replace(url);
  }

  //START API COMMUNICATIONS

  function getReturnUrl(origin) {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get(QueryParams.ReturnUrl);
    if (fromQuery && fromQuery.startsWith(origin)) {
      return fromQuery;
    }
    else return null;
  }

  //LOGIN SUBMIT
  async function authenticate() {
    let values = getValues();

    let responseJson = await postItem(Api.Account.Login, {
      "Username": values.accountUserName,
      "Password": values.accountPassword,
      "RememberMe": toggleRememberMe,
    });

    if (responseJson.status === "Success") {
      setState(state => ({ ...state, submissionSuccess: responseJson.message || 'Login Successful', submissionError: '' }));
      const authenticated = await authService.signIn();

      if (authenticated) {
        let origin = `${window.location.origin}`;
        let returnUrl = getReturnUrl(origin);
        returnUrl ? navigateToUrl(returnUrl) : history.push(AppPaths.Pages.Account.Dashboard.Index);
      }
      else {
        setState(state => ({ ...state, submissionSuccess: '', submissionError: 'Unable to authenticate' }));
      }
    }
    else {
      setInitialized(false);
      reset();
      setState(state => ({ ...state, submissionSuccess: '', submissionError: responseJson.message || 'Unable to authenticate'}));
    }
  }

  //RECOVER PASSWORD SUBMIT
  async function recoverPassword() {
    setInitialized(true);
    setInit(() => ({ ...init, accountUserName: true}));
    if (await triggerValidation({ name: 'accountUserName' })) {
      let values = getValues();

      let responseJson = await postItem(Api.Account.ForgotPassword, {
        "Key": values.accountUserName
      });
  
      if (responseJson.status === "Success") {
          setState(state => ({ ...state, submissionSuccess: responseJson.message || '', submissionError: '' }));
          history.push(Api.Account.Redirects.PasswordRecovery.Index);
      }
      else {
        setState(state => ({ ...state, submissionSuccess: '', submissionError: responseJson.message || '' }));
      }

    }
    else {
      setState(state => ({ ...state, submissionSuccess: '', submissionError: "Please correct the form" }));
    }
  }

  //CREATE SUBMIT
  async function createSubmit() {
    setInitialized(true);
    let isValid;

    if (toggleQuickCreate) {
      isValid = await triggerValidation([
        { name: 'accountUserName' },
        { name: 'accountEmail' },
        { name: 'accountPassword' }, 
        { name: 'accountConfirmPassword' },
      ]);
    }
    else
    {
      isValid = await triggerValidation([
        { name: 'accountUserName' },
        { name: 'accountEmail' }, 
        { name: 'accountFirstName' }, 
        { name: 'accountLastName' },
        { name: 'accountPhoneNumber' },
        { name: 'accountPassword' }, 
        { name: 'accountConfirmPassword' },
      ]);
    }
    
    if (isValid) {
      let values = getValues();

      let responseJson = await postItem(Api.Account.Register, {
        "UserName": values.accountUserName,
        "Email": values.accountEmail,
        "FirstName": !toggleQuickCreate ? values.accountFirstName : '',
        "LastName": !toggleQuickCreate ? values.accountLastName : '',
        "PhoneNumber": !toggleQuickCreate ? values.accountPhoneNumber : '',
        "Password": values.accountPassword,
      });

      if (responseJson.status === "Success") {
        if (responseJson.action === "Login")
        {
          setState(state => ({ ...state, submissionSuccess: responseJson.message || 'Account Created Successfully', submissionError: '' }));
          history.push(AppPaths.Pages.Account.Dashboard.Index);
        }
        else {
          setState(state => ({ ...state, submissionSuccess: responseJson.message || 'Account Created Successfully', submissionError: '' }));
          history.push(Api.Account.Redirects.ConfirmEmail.Index);
        }
      }
      else {
        setState(state => ({ ...state, submissionSuccess: '', submissionError: responseJson.message || 'Unable to create account' }));
      }
    }
    else {
      setState(state => ({ ...state, submissionSuccess: '', submissionError: 'Please correct the form' }));
    }
  }
  //END API COMMUNICATIONS

  function handleUsernamePattern(value) {
    let isUsername = userNameRegex.test(value);
    if (state.createAccount && !isUsername) {
      setError("accountUserName", "notMatch", "Invalid username character");
      return false;
    }
    else if (!isUsername && !emailRegex.test(value)){
      setError("accountUserName", "notMatch", "Invalid");
      return false;
    } 
    else return true;
  }

}
