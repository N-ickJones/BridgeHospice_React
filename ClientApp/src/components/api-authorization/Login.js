import React from 'react';
import { Component } from 'react';
import authService from './AuthorizeService';
import { AuthenticationResultStatus } from './AuthorizeService';
import { LoginActions, QueryParams, AppPaths } from '../common/Constants';

// The main responsibility of this component is to handle the user's login process.
// This is the starting point for the login process. Any component that needs to authenticate
// a user can simply perform a redirect to this component with a returnUrl query parameter and
// let the component perform the login and return back to the return url.
export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: undefined
        };
    }

    componentDidMount() {
        const action = this.props.action;
        switch (action) {
            case LoginActions.Login:
                this.login(this.getReturnUrl());
                break;
            case LoginActions.LoginCallback:
                this.processLoginCallback();
                break;
            case LoginActions.LoginFailed:
                const params = new URLSearchParams(window.location.search);
                const error = params.get(QueryParams.Message);
                this.setState({ message: error });
                break;
            case LoginActions.Profile:
                this.redirectToProfile();
                break;
            case LoginActions.Register:
                this.redirectToRegister();
                break;
            default:
                throw new Error(`Invalid action '${action}'`);
        }
    }

    render() {
        const action = this.props.action;
        const { message } = this.state;

        if (!!message) {
            return (<div className="container shadow"><h3 className="text-center">{message}</h3></div>);
        } else {
            switch (action) {
                case LoginActions.Login:
                    return (<div className="container shadow"><h3 className="text-center">Processing login</h3></div>);
                case LoginActions.LoginCallback:
                    return (<div className="container shadow"><h3 className="text-center">Processing login callback</h3></div>);
                case LoginActions.Profile:
                    return (<div className="container shadow"><h3 className="text-center">Processing profile</h3></div>);
                case LoginActions.Register:
                    return (<div className="container shadow"><h3 className="text-center">Processing registrations</h3></div>);
                default:
                    throw new Error(`Invalid action '${action}'`);
            }
        }
    }

    async login(returnUrl) {
        const state = { returnUrl };
        const result = await authService.signIn(state);
        switch (result.status) {
            case AuthenticationResultStatus.Redirect:
                //change here
                //this.navigateToReturnUrl(`${AppPaths.Pages.Account.Index}?${QueryParams.ReturnUrl}=${returnUrl}`);
                break;
            case AuthenticationResultStatus.Success:
                await this.navigateToReturnUrl(returnUrl);
                break;
            case AuthenticationResultStatus.Fail:
                this.setState({ message: result.message });
                break;
            default:
                throw new Error(`Invalid status result ${result.status}.`);
        }
    }

    async processLoginCallback() {
        const url = window.location.href;
        const result = await authService.completeSignIn(url);
        switch (result.status) {
            case AuthenticationResultStatus.Redirect:
                // There should not be any redirects as the only time completeSignIn finishes
                // is when we are doing a redirect sign in flow.
                throw new Error('Should not redirect.');
            case AuthenticationResultStatus.Success:
                await this.navigateToReturnUrl(this.getReturnUrl(result.state));
                break;
            case AuthenticationResultStatus.Fail:
                this.setState({ message: result.message });
                break;
            default:
                throw new Error(`Invalid authentication result status '${result.status}'.`);
        }
    }

    getReturnUrl(state) {
        const params = new URLSearchParams(window.location.search);
        const fromQuery = params.get(QueryParams.ReturnUrl);
        if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
            // This is an extra check to prevent open redirects.
            throw new Error("Invalid return url. The return url needs to have the same origin as the current page.")
        }
        return (state && state.returnUrl) || fromQuery || `${window.location.origin}/`;
    }

    redirectToRegister() {
        this.redirectToApiAuthorizationPath(`${AppPaths.Identity.RegisterPath}?${QueryParams.ReturnUrl}=${encodeURI(AppPaths.Pages.Account.Index)}`);
    }

    redirectToProfile() {
        this.redirectToApiAuthorizationPath(AppPaths.Identity.ManagePath);
    }

    redirectToApiAuthorizationPath(apiAuthorizationPath) {
        console.log("redirecting to authPath")
        const redirectUrl = `${window.location.origin}${apiAuthorizationPath}`;
        // It's important that we do a replace here so that when the user hits the back arrow on the
        // browser he gets sent back to where it was on the app instead of to an endpoint on this
        // component.
        window.location.replace(redirectUrl);
    }

    navigateToReturnUrl(returnUrl) {
        // It's important that we do a replace here so that we remove the callback uri with the
        // fragment containing the tokens from the browser history.
        window.location.replace(returnUrl);
    }
}
