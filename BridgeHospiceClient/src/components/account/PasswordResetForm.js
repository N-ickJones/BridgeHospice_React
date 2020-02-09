import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import useForm from 'react-hook-form';
import { useLocation, useHistory } from "react-router-dom";
import { postItem, Api } from '../common/Api';
import { vPassword, vClass, vError } from '../common/Regex';

export default function PasswordResetForm() {
    const query = new URLSearchParams(useLocation().search);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const history = useHistory();

    const [init, setInit] = useState({
        password: false,
        confirm: false,
    });
    const { register, errors, watch, setError, triggerValidation, getValues } = useForm();
    const alertOptions = {className: "ml-2 text-danger font-weight-bold"}

    return (
        <Form>
            <span className="ml-2 text-danger">{submitError}</span>
            <span className="ml-2 text-success">{submitSuccess}</span>

            <Form.Group controlId="password" className='p-2 m-0'>
                <Form.Label>New Password{vError(errors.password, alertOptions)}</Form.Label>
                <Form.Control name="password" type="password" placeholder="Enter Password" 
                    className={vClass(errors.password, init.password)}
                    onChange={ async () => init.password && await triggerValidation({ name: 'password' }) }
                    ref={register({ 
                        required: true, 
                        minLength: 8,
                        validate: {
                            Pattern: (value) => { return vPassword("password", value, setError) }
                          }
                        })}
                />
            </Form.Group>
            
            <Form.Group controlId="confirm" className='p-2 m-0'>
                <Form.Label>Confirm New Password{vError(errors.confirm, alertOptions)}</Form.Label>
                <Form.Control name="confirm" type="password" placeholder="Enter Password" 
                    className={vClass(errors.confirm, init.password)}
                    onChange={ async () => init.confirm && await triggerValidation({ name: 'confirm' }) }
                    onKeyUp={(event) => {if (event.keyCode === 13) handleReset();}}
                    ref={register({ 
                        required: true,
                        validate: {
                          Matches: (value) => { return value === watch('password')}
                        }
                    })}
                />
            </Form.Group>

            <div className="d-flex px-2 py-4 m-0">
                <Button type="button" className="px-4 ml-auto" variant="primary" onClick={(event) => handleReset(event)}>
                    Reset Password
                </Button>
            </div>

        </Form>
    );

    async function handleReset(event) {
        event.preventDefault();
        setInit(init => ({ ...init, 
            password: true, 
            confirm: true
        }));
    
        let truth = await triggerValidation([ { name: 'password' }, { name: 'confirm' } ]);
    
        if (truth) {
            setSubmitError('');
            submitChange();
        }
        else {
            setSubmitError('Please enter a valid password combinination')
        }
      }

    async function submitChange() {
        let values = getValues();

        let responseJson = await postItem(Api.Account.ResetPassword, {
            "UserId": query.get("userId"),
            "Code": query.get("code"),
            "Password": values.password
        });

        console.log(responseJson.status);
        //This needs an edit to communicate with server

        if (responseJson.status === "Success") {
            setSubmitSuccess(responseJson.message);
            history.push(Api.Account.Redirects.PasswordRecovery.Success);
        }
        else {
            setSubmitError(responseJson.message || "Password reset failed");
        }




    } 



    
}