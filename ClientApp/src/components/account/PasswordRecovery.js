import React from 'react';
import { Switch, Route } from "react-router-dom";
import PasswordResetForm from './PasswordResetForm';
import { Api } from '../common/Api';

export default function PasswordReset() {

  return (
    <div className="container shadow">
      <h3 className="text-center text-primary">Password Reset</h3>
      <Switch>
        <Route path={Api.Account.Redirects.PasswordRecovery.InvalidLink}>
          <h4 className="text-center my-4 text-danger">Unable to process the request (The link supplied was invalid).</h4>
          <h5 className="text-center my-4 text-secondary">To recieve a new password reset. Return to password recovery under account.</h5>
        </Route>
        <Route path={Api.Account.Redirects.PasswordRecovery.InvalidUser}>
          <h4 className="text-center my-4 text-danger">Unable to process the request (could not find that user).</h4>
          <h5 className="text-center my-4 text-secondary">To recieve a new password reset. Return to password recovery under account.</h5>
        </Route>
        <Route path={Api.Account.Redirects.PasswordRecovery.Success}>
          <h4 className="text-center my-4 text-success">The password has successfully been updated.</h4>
          <h5 className="text-center my-4 text-secondary">You can now login using your credentials.</h5>
        </Route>
        <Route path={Api.Account.Redirects.PasswordRecovery.Reset}>
          <PasswordResetForm />
        </Route>
        <Route path={Api.Account.Redirects.PasswordRecovery.BadRequest}>
          <h4 className="text-center my-4 text-danger">Unable to process the request (bad request recieved).</h4>
          <h5 className="text-center my-4 text-secondary">To recieve a new password reset. Return to password recovery under account.</h5>
        </Route>
        <Route path={Api.Account.Redirects.PasswordRecovery.Index}>
          <h4 className="text-center my-4 text-success">Please Check Your Email for a link to confirm your account.</h4>
          <h5 className="text-center my-4 text-secondary">To recieve a new password reset. Return to password recovery under account.</h5>
        </Route>
      </Switch>
    </div>
  );

}


