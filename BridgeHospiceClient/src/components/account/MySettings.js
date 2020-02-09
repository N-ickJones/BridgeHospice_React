import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap'
import useForm from 'react-hook-form';
import { useRouteMatch, Switch, Route, Link } from 'react-router-dom';
import {  vUsername, vEmail, vPhoneNumber, vPassword } from '../common/Regex';
import { postItem, getItem, Api } from '../common/Api';

export default function Settings() {
  const match = useRouteMatch();
  const [error, setError] = useState("");
  const userName = useRef('');
  const email = useRef('');
  const firstName= useRef('');
  const lastName = useRef('');
  const phoneNumber = useRef('');

  useEffect(() => {
    async function GetUser() {
      let responseJson = await getItem(Api.Account.Settings.User, null);
      if (responseJson.status === "Success") {
        userName.current=responseJson.data.UserName;
        email.current=responseJson.data.Email;
        firstName.current=responseJson.data.FirstName;
        lastName.current=responseJson.data.LastName;
        phoneNumber.current=responseJson.data.PhoneNumber;
      }
      else {
        setError(responseJson.message);
      }
      
    }
    GetUser();
  }, []);

  
  return (
    <div className="container shadow" style={{maxWidth: 620}}>
      <h5>{<span className={`text-danger`}>{error}</span>}</h5>
      <div className="row">
        <div className="col-5 p-0 m-0">
          <SettingsNavigation />
        </div>
        <div className="col-7">
          <Switch>
          <Route path={match.path + "/userName"}>
              <ChangeField 
                name="UserName"
                text="Username"
                validation={{ 
                  required: { value: true, message: "required" },
                  minLength: { value: 5, message: "Minimum length unsatisfied" }, 
                  maxLength: { value: 50, message: "Max length exceeded" }
                }}
                pattern={vUsername}
                value={userName || ''}
              />
            </Route>
            <Route path={match.path + "/email"}>
              <ChangeField 
                name="Email"
                text="Email"
                validation={{ 
                  required: { value: true, message: 'required' },
                  minLength: { value: 5, message: "Minimum length unsatisfied" }, 
                  maxLength: { value: 254, message: "Max length exceeded" }
                }}
                pattern={vEmail}
                value={email || ''}
              />
            </Route>
            <Route path={match.path + "/firstName"}>
              <ChangeField 
                name="FirstName"
                text="First Name"
                validation={{ 
                  required: { value: true, message: 'required' },
                  maxLength: { value: 50, message: "Max length exceeded" }
                }}
                value={firstName || ''}
              />
            </Route>
            <Route path={match.path + "/lastName"}>
              <ChangeField 
                name="LastName"
                text="Last Name"
                validation={{ 
                  required: { value: true, message: 'required' },
                  maxLength: { value: 50, message: "Max length exceeded" }
                }}
                value={lastName || ''}
              />
            </Route>
            <Route path={match.path + "/phoneNumber"}>
              <ChangeField 
                name="PhoneNumber"
                text="Phone Number"
                validation={{ 
                  required: { value: true, message: 'required' },
                  minLength: { value: 10, message: "Invalid Length" }, 
                  maxLength: { value: 10, message: "Invalid Length" }
                }}
                pattern={vPhoneNumber}
                value={phoneNumber || ''}
              />
            </Route>
            <Route path={match.path + "/password"}>
              <ChangePasswordField 
                name="Password"
                text="Password"
                validation={{ 
                  required: { value: true, message: 'required' },
                  minLength: { value: 8, message: "Minimum length unsatisfied" }, 
                }}
                value=""
                pattern={vPassword}
                confirm={true}
              />
            </Route>
            <Route path={match.path}>
              <h6>Please choose a setting to change</h6>
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );

  function SettingsNavigation() {
    const controller = "/account/settings";
    return (
      <div>
        <ListGroup>
          <Link to={`${controller}/userName`}>
            <ListGroup.Item action>
              Username
            </ListGroup.Item>
          </Link>
          <Link to={`${controller}/email`}>
            <ListGroup.Item action>
              Email
            </ListGroup.Item>
          </Link>
          <Link to={`${controller}/firstName`}>
            <ListGroup.Item action>
              First Name
            </ListGroup.Item>
          </Link>
          <Link to={`${controller}/lastName`}>
            <ListGroup.Item action>
              Last Name
            </ListGroup.Item>
          </Link>
          <Link to={`${controller}/phoneNumber`}>
            <ListGroup.Item action>
              Phone Number
            </ListGroup.Item>
          </Link>
          <Link to={`${controller}/password`}>
            <ListGroup.Item action>
              Password
            </ListGroup.Item>
          </Link>
        </ListGroup>
      </div>
    );
  }

  // Properties: name(required), text(required), validation, isHidden, buttonName
  function ChangeField(props) {
    const action = 'Change'
    const { register, errors, triggerValidation, getValues, setError } = useForm();
    const [init, setInit] = useState(false);
    const [success, setSuccess] = useState('');
    
    return (
      <div className={`row h-100 text-center align-items-center bg-dark ${props.isHidden && 'hidden'}`}>
        <Form.Group controlId={props.name} className='w-100 p-4'>
          <Form.Label className="text-primary"><h5>{props.text} {!props.value.current && '(Blank)'}</h5></Form.Label>
          <Form.Text className={`mx-auto text-left pl-1 text-success`}>{success}</Form.Text>
          <Form.Text className={`mx-auto text-left pl-1 text-danger`}>{errors[props.name] && errors[props.name].message}</Form.Text>
          <Form.Control 
            name={props.name} 
            type={props.type || 'text'} 
            placeholder={`Enter ${props.text}`}
            defaultValue={props.value.current || ''}
            className={`mx-auto ${init && (errors[props.name] ? 'is-invalid' : 'is-valid')}`}
            onChange={async () => { if (init)  { await triggerValidation({ name: props.name });  } }}
            onKeyUp={(event) => {if (event.keyCode === 13) handleSubmit();}}
            ref={props.pattern ? 
              register({ ...props.validation || null, validate: { Pattern: (value) => { return props.pattern ? props.pattern(props.name, value, setError) : true}}}) : 
              register({ ...props.validation || null })
            } />
            <Button className="w-75 mt-3" variant="primary"
            onClick={async () => handleSubmit() }>
            {props.buttonName || 'Change'}
          </Button>
        </Form.Group>
      </div>
    );

    async function handleSubmit() {
      setInit(true);
      if(await triggerValidation({ name: props.name })) {
        let value = await getValues()[props.name];
        let responseJson = await postItem(`${Api.Account.Settings.Controller}/${action}/${props.name}`, {
          value: value
        });
        if (responseJson.status === "Success") {
          props.value.current = value;
          setSuccess(() => responseJson.message || `${props.text} has been updated`);
        }
        else {
          setError(props.name, "failure", responseJson.message || 'unable to process request');
        }
      }
    }
  }

  // Properties: name(required), text(required), validation, isHidden, buttonName
  function ChangePasswordField(props) {
    const confirmName = `${props.name}Confirm`;
    const action = 'Change'
    const { register, errors, triggerValidation, getValues, setError, watch, reset } = useForm();
    const [init, setInit] = useState(false);
    const [success, setSuccess] = useState('');
    
    return (
      <div className={`row h-100 text-center align-items-center bg-dark ${props.isHidden && 'hidden'}`}>
        <Form.Group controlId={props.name} className='w-100 p-4'>
          <Form.Label className="text-primary"><h5>{props.text} {!props.value.current && '(Blank)'}</h5></Form.Label>
          <Form.Text className={`mx-auto text-left pl-1 text-success`}>{success}</Form.Text>
          <Form.Text className={`mx-auto text-left pl-1 text-danger`}>{errors[props.name] && errors[props.name].message}</Form.Text>

          <Form.Control 
            name="currentPassword"
            type="password" 
            placeholder={`Enter Current ${props.text}`}
            className={`mx-auto ${init && (errors["currentPassword"] ? 'is-invalid' : 'is-valid')}`}
            onChange={async () => init && await triggerValidation({ name: "currentPassword" }, { name: props.name }, { name: props.confirm })}
            ref={register({ ...props.validation, validate: { Pattern: (value) => { return props.pattern ? props.pattern(props.name, value, setError) : true}}})}/>

          <Form.Control 
            name={props.name} 
            type="password" 
            placeholder={`Enter New ${props.text}`}
            className={`mx-auto mt-1 ${init && (errors[props.name] ? 'is-invalid' : 'is-valid')}`}
            onChange={async () => init && await triggerValidation({ name: props.name }, { name: props.confirm }) }
            ref={register({ ...props.validation , validate: { Pattern: (value) => { return props.pattern ? props.pattern(props.name, value, setError) : true}}})} />

            <input
              id={confirmName}
              name={confirmName}
              type="password"  
              placeholder={`Confirm New ${props.text}`}
              className={`form-control mx-auto mt-1 ${init && (errors[confirmName] ? "is-invalid" : "is-valid")}`}
              onChange={async () => init && await triggerValidation({ name: confirmName }) }
              ref={register({ 
                required: { value: true, message: 'required' }, 
                validate: { Matches: (value) => { return value === watch(props.name) } },
              })} />

            <Button className="w-75 mt-3" variant="primary"
            onClick={async () => {
              setInit(true);
              if(await triggerValidation([{ name: "currentPassword" }, { name: props.name }, { name: confirmName }])) {
                let value = getValues();
                let responseJson = await postItem(`${Api.Account.Settings.Controller}/${action}/${props.name}`, {
                  CurrentPassword: value["currentPassword"],
                  NewPassword: value[props.name]
                });
                if (responseJson.status === "Success") {
                  setInit(false);
                  reset();
                  setSuccess(() => responseJson.message || `${props.text} has been updated`);
                }
                else {
                  setError("currentPassword", "failure", responseJson.message);
                  setError(props.name, "failure", responseJson.message);
                  setError(confirmName, "failure", responseJson.message);
                }
              }
            }}>
            {props.buttonName || 'Change'}
          </Button>
        </Form.Group>
      </div>
    );
  }

}