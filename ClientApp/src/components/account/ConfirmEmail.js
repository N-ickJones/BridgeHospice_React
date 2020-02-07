import React from 'react';
import { Switch, Route } from "react-router-dom";
import { Api } from '../common/Api';

export default function MonfirmEmail() {

  return (
    <div className="container shadow">
      <h3 className="text-center text-primary">Email Verfication Status</h3>
      <Switch>
        <Route path={`${Api.Account.Redirects.ConfirmEmail.InvalidLink}`}>
          <h4 className="text-center my-4 text-danger">Unable to process the request (The link supplied was invalid).</h4>
          <h5 className="text-center my-4 text-secondary">To recieve a new verification email. Please attempt to log in using your credentials.</h5>
        </Route>
        <Route path={Api.Account.Redirects.ConfirmEmail.InvalidUser}>
          <h4 className="text-center my-4 text-danger">Unable to process the request (could not find that user).</h4>
          <h5 className="text-center my-4 text-secondary">To recieve a new verification email. Please attempt to log in using your credentials.</h5>
        </Route>
        <Route path={Api.Account.Redirects.ConfirmEmail.Success}>
          <h4 className="text-center my-4 text-success">The account has successfully been confirmed.</h4>
          <h5 className="text-center my-4 text-secondary">You can now login using your credentials.</h5>
        </Route>
        <Route path={Api.Account.Redirects.ConfirmEmail.CouldNotConfirm}>
          <h4 className="text-center my-4 text-danger">Unable to process the request (could not confirm that account).</h4>
          <h5 className="text-center my-4 text-secondary">To recieve a new verification email. Please attempt to log in using your credentials.</h5>
        </Route>
        <Route path={Api.Account.Redirects.ConfirmEmail.BadRequest}>
          <h4 className="text-center my-4 text-danger">Unable to process the request (bad request recieved).</h4>
          <h5 className="text-center my-4 text-secondary">To recieve a new verification email. Please attempt to log in using your credentials.</h5>
        </Route>
        <Route path={Api.Account.Redirects.ConfirmEmail.Index}>
          <h4 className="text-center my-4 text-success">Please Check Your Email for a link to confirm your account.</h4>
          <h5 className="text-center my-4 text-secondary">To recieve a new verification email. Please attempt to log in using your credentials.</h5>
        </Route>
      </Switch>
    </div>
  );
}