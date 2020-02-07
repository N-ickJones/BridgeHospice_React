const ApiHost = process.env.REACT_APP_APIHOST;

export const Api = {
    Host: ApiHost,
    Key: "undefined",
    Encoding: "UTF8",
    ContentType: "application/json",
    Account: {
        Controller: "/Account",
        Register: "/Account/Register",
        Login: "/Account/Login",
        Logout: "/Account/Logout",
        ForgotPassword: "/Account/ForgotPassword",
        ResetPassword: "/Account/ResetPassword",
        Settings: {
            Controller: "/Account/Settings",
            User: "/Account/Settings/User",
            Change: {
                UserName: "/Account/Settings/Change/UserName",
                FirstName: "/Account/Settings/Change/FirstName",
                LastName: "/Account/Settings/Change/LastName",
                PhoneNumber: "/Account/Settings/Change/PhoneNumber",
                Password: "/Account/Settings/Change/Password",
                Email: "/Account/Settings/Change/Email",
                Redirects: {
                    ConfirmChangeEmail: {
                        Index: "/Account/Settings/Change/Email/Confirm/",
                        InvalidLink: "/Account/Settings/Change/Email/Confirm/InvalidLink",
                        InvalidUser: "/Account/Settings/Change/Email/Confirm/invalidUser",
                        Success: "/Account/Settings/Change/Email/Confirm/Success",
                        CouldNotConfirm: "/Account/Settings/Change/Email/Confirm/CouldNotConfirm",
                        BadRequest: "/Account/Settings/Change/Email/Confirm/BadRequest",
                    }
                },
            },
        },
        Redirects: {
            ConfirmEmail: {
                Index: "/Account/Confirm/Email",
                InvalidLink: "/Account/Confirm/Email/InvalidLink",
                InvalidUser: "/Account/Confirm/Email/invalidUser",
                Success: "/Account/Confirm/Email/Success",
                CouldNotConfirm: "/Account/Confirm/Email/CouldNotConfirm",
                BadRequest: "/Account/Confirm/Email/BadRequest",
            },
            PasswordRecovery: {
                Index: "/Account/Recovery/Password",
                InvalidLink: "/Account/Recovery/Password/InvalidLink",
                InvalidUser: "/Account/Recovery/Password/invalidUser",
                Success: "/Account/Recovery/Password/ResetPassword/Success",
                Reset: "/Account/Recovery/Password/ResetPassword",
                BadRequest: "/Account/Recovery/Password/BadRequest",
            },
        },
    },
    
    Configuration: {
        Controller: "/Configuration",
    },
    Volunteer: {
        Controller: "/Volunteers",
    },
}

export async function postItem(apiName, data) {
    try {
        let response = await fetch(Api.Host+apiName, {
            method: 'POST',
            headers: {
                'Accept': Api.ContentType,
                'Content-Type': Api.ContentType,
            },
            credentials: 'include',
            body: data && JSON.stringify(data)
        });
        let json = await response.json();
        return json;
    }
    catch(error) {
        console.log("MyUtils/postItem: " + error);
        return error;
    }
}

export async function getItem(apiName) {
    try {
        let response = await fetch(Api.Host+apiName, {
            method: 'GET',
            headers: {
                'Accept': Api.ContentType,
                'Content-Type': Api.ContentType,
            },
            credentials: 'include',
        });
        return await response.json();
    }
    catch(error) {
        console.log("MyUtils/postItem: " + error);
        return error;
    }
}

//update these
export function putItem(apiName, data, setStatus) {
    fetch(Api.Host+apiName, {
        method: 'PUT',
        headers: {
            'Accept': Api.ContentType,
            'Content-Type': Api.ContentType,
            'Api.Key': Api.Key
        },
        body: data ? JSON.stringify(data) : ''
    })
    .then(response => {
        if (response.status === 204) {
            setStatus(true);
        }
        else {
            throw new Error('Bad Response');
        }
    })
    .catch(error => {
        setStatus(false);
    })
}

export function deleteItem(apiName, setStatus) {
    fetch(Api.Host+apiName, {
        method: 'DELETE',
        headers: {
            'Accept': Api.ContentType,
            'Content-Type': Api.ContentType,
            'Api.Key': Api.Key
        },
        body: ''
    })
    .then(response => {
        if (response.status === 200) {
            setStatus(true);
        }
        else {
            throw new Error('Bad Response');
        }
    })
    .catch(error => {
        setStatus(false);
    })
}

//Finished
export function getItemSession(apiName, setValue, setStatus) {
    if (sessionStorage.getItem(apiName) === null) 
    {
        fetch(Api.Host+apiName, {
            method: 'GET',
            headers: { 'Api.Key': Api.Key}
        })
        .then(response => {
            if (response.status === 200) 
                return response.json(); 
            else 
                throw new Error('Bad Response');
        })
        .then(json => {
            sessionStorage.setItem(apiName, JSON.stringify(json)); 
            return json;
        })
        .then(json => {
            setValue([json]);
            setStatus(true);
        })
        .catch(error => {
            setStatus(false);
        });
    }
    else 
    {
        const raw = sessionStorage.getItem(apiName);
        setValue(raw ? [JSON.parse(raw)] : []);
        setStatus(true);
    }
}

export function getAll(apiName, setValue, setStatus) {
    fetch(Api.Host+apiName, {
        method: 'GET',
        headers: { 'Api.Key': Api.Key}
    })
    .then(response => {
        if (response.status === 200) 
            return response.json(); 
        else 
            throw new Error('Bad Response');
    })
    .then(json => {
        setValue(json);
        setStatus(true);
    })
    .catch(error => {
        setStatus(false);
    });
}

export function getAllSession(apiName, setValue, setStatus) {
    if (sessionStorage.getItem(apiName) === null) 
    {
        fetch(Api.Host+apiName, {
            method: 'GET',
            headers: { 'Api.Key': Api.Key}
        })
        .then(response => {
            if (response.status === 200) 
                return response.json(); 
            else 
                throw new Error('Bad Response');
        })
        .then(json => {
            sessionStorage.setItem(apiName, JSON.stringify(json)); 
            return json;
        })
        .then(json => {
            setValue(json);
            setStatus(true);
        })
        .catch(error => {
            setStatus(false);
        });
    }
    else {
        const raw = sessionStorage.getItem(apiName);
        setValue(raw ? JSON.parse(raw) : []);
        setStatus(true);
    }
}
