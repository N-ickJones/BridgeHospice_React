const ApiHost = process.env.REACT_APP_APIHOST;
//export const AppName = 'BridgeHospice';
export const AppName = 'MyVenvClient';

export const QueryParams = {
  ReturnUrl: 'returnUrl',
  Message: 'message'
};

export const LogoutActions = {
  LogoutCallback: 'logout-callback',
  Logout: 'logout',
  LoggedOut: 'logged-out'
};

export const LoginActions = {
  Login: 'login',
  LoginCallback: 'login-callback',
  LoginFailed: 'login-failed',
  Profile: 'profile',
  Register: 'register'
};

const authPrefix = '/authentication';

export const AppPaths = {
  Identity: {
    DefaultLoginRedirectPath: '/',
    ApiAuthorizationClientConfigurationUrl: `${ApiHost}/Configuration/${AppName}`,
    ApiAuthorizationPrefix: authPrefix,
    Login: `${authPrefix}/${LoginActions.Login}`,
    LoginFailed: `${authPrefix}/${LoginActions.LoginFailed}`,
    LoginCallback: `${authPrefix}/${LoginActions.LoginCallback}`,
    Register: `${authPrefix}/${LoginActions.Register}`,
    Profile: `${authPrefix}/${LoginActions.Profile}`,
    LogOut: `${authPrefix}/${LogoutActions.Logout}`,
    LoggedOut: `${authPrefix}/${LogoutActions.LoggedOut}`,
    LogOutCallback: `${authPrefix}/${LogoutActions.LogoutCallback}`,
    RegisterPath: '/Identity/Account/Register',
    ManagePath: '/Identity/Account/Manage',
  },

  Pages: {
    Cart: {
        Index: "/Cart",
    },
    Home:  {
        Index: "/Home",
    },
    Services:  {
        Index: "/Services",
    },
    Bereavement:  {
        Index: "/Bereavement",
    },
    Volunteer:  {
        Index: "/Volunteer",
    },
    Employment:  {
        Index: "/Employment",
    },
    About:  {
        Index: "/About",
    },
    Contact:  {
        Index: "/Contact",
    },
    Donations:  {
        Index: "/Donations",
    },
    Testimonials:  {
        Index: "/Testimonials",
    },
    Help:  {
        Index: "/Help",
    },
    Search:  {
        Index: "/Search",
    },
    Account: {
        Index: "/Account",
        Dashboard: {
            Index: "/Account/Dashboard",
        },
        Settings: {
            Index: "/Account/Settings",
        },
        TwoFactor: {
            Index: "/Account/TwoFactorAuthentication",
        }
    },
    Veterans: {
        Index: "/Veterans"
    }
  },

  Legal: {
      PrivacyPolicy: {
        Index: "/Legal/PrivacyPolicy"
      },
      TermsOfService: {
        Index: "/Legal/TermsOfService"
      }
  }

};