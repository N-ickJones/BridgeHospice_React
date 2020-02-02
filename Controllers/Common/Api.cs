
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using BridgeHospiceApi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BridgeHospiceApi.Controllers
{
    /// <summary>
    /// Response Formatting
    /// </summary>
    public static class Api
    {
        public static Encoding Encoding => Encoding.UTF8;

        public static Dictionary<string, object> GenerateUserJson(ApplicationUser appUser, string status, string message)
        {
            return new Dictionary<string, object>() {
                { "status", status },
                { "message", message },
                { "data",  new Dictionary<string, object>() {
                        { "UserName", appUser.UserName },
                        { "Email", appUser.Email },
                        { "FirstName", appUser.FirstName },
                        { "LastName", appUser.LastName },
                        { "PhoneNumber", appUser.PhoneNumber }
                }}
            };
        }

        public static Dictionary<string, object> GenerateErrorJson(IdentityResult result)
        {
            return new Dictionary<string, object>() {
                    { "status", "Failure" },
                    { "message", result.Errors.FirstOrDefault().Description},
                };
        }

        public static string Encode(string code)
        {
            return WebEncoders.Base64UrlEncode(Encoding.GetBytes(code));
        }
        public static string Decode(string code)
        {
            return Encoding.GetString(WebEncoders.Base64UrlDecode(code));
        }

        public static class Register
        {
            public static string Page => "Api/Account/Register";
            public static Dictionary<string, object> Success => new Dictionary<string, object>() {
                { "status", "Success" },
                { "action", "Login" },
                { "message", "Account has been created" },
            };
            public static Dictionary<string, object> ConfirmEmail => new Dictionary<string, object>() {
                { "status", "Success" },
                { "action", "Confirm" },
                { "message", "Account has been created" },
            };

            public static Dictionary<string, object> Failure => new Dictionary<string, object>() {
                { "status", "Failure" },
                { "action", "none" },
                { "message", "Unable to create account" },
            };
        }
        public static class Login
        {
            public static Dictionary<string, object> Success => new Dictionary<string, object>() {
                { "status", "Success" },
                { "action", "none" },
                { "message", "Login successful" },
            };
            public static Dictionary<string, object> ConfirmEmail => new Dictionary<string, object>() {
                { "status", "Failure" },
                { "action", "none" },
                { "message", "Confirm your email" },
            };
            public static Dictionary<string, object> TwoFactor => new Dictionary<string, object>() {
                { "status", "Failure" },
                { "action", "none" },
                { "message", "Two factor authentication enabled" },
            };
            public static Dictionary<string, object> LockedOut => new Dictionary<string, object>() {
                { "status", "Failure" },
                { "action", "none" },
                { "message", "Account is locked out" },
            };
            public static Dictionary<string, object> NotAllowed => new Dictionary<string, object>() {
                { "status", "Failure" },
                { "action", "none" },
                { "message", "Account not allowed to authenticate" },
            };
            public static Dictionary<string, object> DoesNotExist => new Dictionary<string, object>() {
                { "status", "Failure" },
                { "action", "none" },
                { "message", "The account does not exist" },
            };
        }
        public static class ForgotPassword
        {
            public static string Page => "Api/Account/ForgotPassword";
            public static Dictionary<string, object> EmailSent => new Dictionary<string, object>() {
                { "status", "Success" },
                { "action", "none" },
                { "message", "Recovery instructions have been sent to your email" },
            };
            public static Dictionary<string, object> ConfirmAccount => new Dictionary<string, object>() {
                { "status", "Failure" },
                { "action", "none" },
                { "message", "Please confirm your account" },
            };
            public static Dictionary<string, object> DoesNotExist => new Dictionary<string, object>() {
                { "status", "Failure" },
                { "action", "none" },
                { "message", "That account does not exist" },
            };
        }
        public static class ResetPassword
        {
            public static Dictionary<string, object> Success => new Dictionary<string, object>() {
                { "status", "Success" },
                { "action", "none" },
                { "message", "Your password has been updated." },
            };
            public static Dictionary<string, object> Failure => new Dictionary<string, object>() {
                { "status", "Failure" },
                { "action", "none" },
                { "message", "Unable to reset password" },
            };
            public static Dictionary<string, object> DoesNotExist => new Dictionary<string, object>() {
                { "status", "Failure" },
                { "action", "none" },
                { "message", "Could not process the request" },
            };
        }
        public static class Logout
        {
            public static Dictionary<string, object> Success => new Dictionary<string, object>() {
                { "status", "Success" },
                { "action", "none" },
                { "message", "You have been logged out." },
            };
        }
        public static class Change
        {
            public static Dictionary<string, object> Success => new Dictionary<string, object>() {
                    { "status", "Success" },
                    { "message", "The field has been changed successfuly" },
            };
            public static Dictionary<string, object> Failure => new Dictionary<string, object>() {
                    { "status", "Failure" },
                    { "message", "Change has failed" },
            };

            public static class Email
            {
                public static string Page => "Api/Account/Settings/Change/Email";
                public static Dictionary<string, object> Success => new Dictionary<string, object>() {
                    { "status", "Success" },
                    { "action", "none" },
                    { "message", "A confirmation email has been sent to your new email" },
                };
                public static Dictionary<string, object> Failure => new Dictionary<string, object>() {
                    { "status", "Failure" },
                    { "action", "none" },
                    { "message", "Unable to send verification to new email" },
                };
            }
            
        }
    }

    /// <summary>
    /// Direct connections between api and client
    /// </summary>
    public static class Redirects
    {
        public static string GenerateOrigin(HttpRequest request, string redirect)
        {
            return request.Headers["Origin"].ToString() + redirect;
        }

        public static class ConfirmEmail
        {
            public static string Index => $"/Account/Confirm/Email";
            public static string InvalidLink => $"{Index}/InvalidLink";
            public static string InvalidUser => $"{Index}/InvalidUser";
            public static string Success => $"{Index}/Success";
            public static string CouldNotConfirm => $"{Index}/CouldNotConfirm";
            public static string BadRequest => $"{Index}/BadRequest";
        }

        public static class ChangeEmail
        {
            public static string Index => $"/Account/Settings/Change/Email/Confirm";
            public static string InvalidLink => $"{Index}/InvalidLink";
            public static string InvalidUser => $"{Index}/InvalidUser";
            public static string Success => $"{Index}/Success";
            public static string CouldNotConfirm => $"{Index}/CouldNotConfirm";
            public static string BadRequest => $"{Index}/BadRequest";
        }

        public static class PasswordRecovery
        {
            public static string Index => $"/Account/Recovery/Password";
            public static string InvalidLink => $"{Index}/InvalidLink";
            public static string InvalidUser => $"{Index}/InvalidUser";
            public static string Success => $"{Index}/Success";
            public static string Reset => $"{Index}/ResetPassword";
            public static string BadRequest => $"{Index}/BadRequest";
        }

        public static class ExternalLogin
        {
            public static string Index => $"/Account/ExternalLogin";
            public static string Callback => $"{Index}/ExternalLoginCallback";
            public static string Confirmation => $"{Index}/ExternalLoginConfirmation";
        }
        
    }

}
