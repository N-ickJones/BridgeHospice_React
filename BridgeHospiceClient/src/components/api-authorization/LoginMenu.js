import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import authService from './AuthorizeService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from 'react-bootstrap';
import { AppPaths } from '../common/Constants';


export class LoginMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            userName: null
        };
    }

    componentDidMount() {
        this._subscription = authService.subscribe(() => this.populateState());
        this.populateState();
    }

    componentWillUnmount() {
        authService.unsubscribe(this._subscription);
    }

    async populateState() {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
        this.setState({
            isAuthenticated,
            userName: user && user.name,
            firstName: user && user.firstName
        });
    }

    render() {
        const { isAuthenticated } = this.state;
        if (!isAuthenticated) { //AppPaths.Pages.Account.Index
            return (
                <Fragment>
                    <Link id="accountBtn" to={AppPaths.Identity.Login} {...this.props}>
                    Account&nbsp;<FontAwesomeIcon icon='user' className="anonymous" />
                    </Link>
                </Fragment>
            );
        } else {
            const logoutPath = { pathname: `${AppPaths.Identity.LogOut}`, state: { local: true } };
            return (
                <Fragment>
                    <Dropdown alignRight>
                        <Dropdown.Toggle id="accountBtn" {...this.props}>
                        Account&nbsp;<FontAwesomeIcon icon='user-circle' className="authenticated" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Link to={AppPaths.Pages.Dashboard.Index} className="dropdown-item">Dashboard</Link>
                            <Link to={AppPaths.Identity.Profile} className="dropdown-item">Settings</Link>
                            <Link to={logoutPath} className="dropdown-item">Logout</Link>
                        </Dropdown.Menu>
                    </Dropdown>

                </Fragment>
            );
        }
    }

}
