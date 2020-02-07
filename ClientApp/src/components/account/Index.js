import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Account from './Account';
import PasswordRecovery from './PasswordRecovery';
import ConfirmEmail from './ConfirmEmail';
import DashBoard from './MyDashBoard';
import Settings from './MySettings';
import AuthorizeRoute from '../api-authorization/AuthorizeRoute';
import { AppPaths } from '../common/Constants';
import { Api } from '../common/Api';

export default function MyAccount() {
  return (
    <div >
      <Switch>
        <Route path={Api.Account.Redirects.ConfirmEmail.Index} component={ConfirmEmail} />
        <Route path={Api.Account.Redirects.PasswordRecovery.Index} component={PasswordRecovery} />
        <AuthorizeRoute path={AppPaths.Pages.Account.Dashboard.Index} component={DashBoard} />
        <AuthorizeRoute path={AppPaths.Pages.Account.Settings.Index} component={Settings} />
        <Route path={AppPaths.Pages.Account.Index} component={Account} />
      </Switch>
    </div>
  );
}