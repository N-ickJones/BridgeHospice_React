import React, { Component, Fragment } from 'react';
import { Route } from 'react-router';
import { Login } from './Login'
import { Logout } from './Logout'
import { AppPaths, LoginActions, LogoutActions } from '../common/Constants';

export default class ApiAuthorizationRoutes extends Component {

  render () {
    return(
      <Fragment>
        <Route path={AppPaths.Identity.Login} render={() => loginAction(LoginActions.Login)} />
        <Route path={AppPaths.Identity.LoginFailed} render={() => loginAction(LoginActions.LoginFailed)} />
        <Route path={AppPaths.Identity.LoginCallback} render={() => loginAction(LoginActions.LoginCallback)} />
        <Route path={AppPaths.Identity.Profile} render={() => loginAction(LoginActions.Profile)} />
        <Route path={AppPaths.Identity.Register} render={() => loginAction(LoginActions.Register)} />
        <Route path={AppPaths.Identity.LogOut} render={() => logoutAction(LogoutActions.Logout)} />
        <Route path={AppPaths.Identity.LogOutCallback} render={() => logoutAction(LogoutActions.LogoutCallback)} />
        <Route path={AppPaths.Identity.LoggedOut} render={() => logoutAction(LogoutActions.LoggedOut)} />
      </Fragment>);
  }
}

function loginAction(name){
  return (<Login action={name}></Login>);
}

function logoutAction(name) {
  return (<Logout action={name}></Logout>);
}
