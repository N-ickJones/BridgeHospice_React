using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.WebUtilities;
using System;
using Microsoft.AspNetCore.Cors;
using System.Collections.Generic;

using BridgeHospiceApi.Models;
using BridgeHospiceApi.Services;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authentication;

namespace BridgeHospiceApi.Controllers
{
    //[EnableCors("Origins")]
    [Route("Api/[controller]")]
    [ApiController]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;

        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, Services.IEmailSender emailSender,
            ISmsSender smsSender, ILoggerFactory loggerFactory)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _smsSender = smsSender;
            _logger = loggerFactory.CreateLogger<AccountController>();
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterAsyncPost(RegisterInput input)
        {
            
            ApplicationUser appUser = new ApplicationUser();

            if (!string.IsNullOrWhiteSpace(input.UserName))
                appUser.UserName = input.UserName;
            if (!string.IsNullOrWhiteSpace(input.Email))
                appUser.Email = input.Email;
            if (!string.IsNullOrWhiteSpace(input.FirstName))
                appUser.FirstName = input.FirstName;
            if (!string.IsNullOrWhiteSpace(input.LastName))
                appUser.LastName = input.LastName;
            if (!string.IsNullOrWhiteSpace(input.PhoneNumber))
                appUser.PhoneNumber = input.PhoneNumber;

            var result = await _userManager.CreateAsync(appUser, input.Password);

            if (result.Succeeded)
            {
                await SendConfirmationEmail(appUser);

                if (_userManager.Options.SignIn.RequireConfirmedAccount)
                {
                    _logger.LogInformation("User requires confirmed account.");
                    return Ok(Api.Register.ConfirmEmail);
                }
                else
                {
                    await _signInManager.SignInAsync(appUser, isPersistent: false);
                    _logger.LogInformation("User logged-in after creation.");
                    return Ok(Api.Register.Success);
                }
            }
            else
            {
                _logger.LogInformation($"User unable to create account Error: {result.Errors.FirstOrDefault()}.");
                return Ok(Api.GenerateErrorJson(result));
            }
        }
        
        [HttpGet("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> EmailVerificationAsyncGet(string userId, string code)
        {
            try
            {
                if (userId == null || code == null)
                {
                    _logger.LogInformation("Redirect Email-Confirmation: Invalid Link Used.");
                    return Redirect(Redirects.GenerateOrigin(Request, Redirects.ConfirmEmail.InvalidLink));
                }

                ApplicationUser user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    _logger.LogInformation("Redirect Email-Confirmation: Invalid User.");
                    return Redirect(Redirects.GenerateOrigin(Request, Redirects.ConfirmEmail.InvalidUser));
                }

                IdentityResult result = await _userManager.ConfirmEmailAsync(user, Api.Decode(code));

                if (result.Succeeded)
                {
                    _logger.LogInformation("Redirect Email-Confirmation: Successful.");
                    return Redirect(Redirects.GenerateOrigin(Request, Redirects.ConfirmEmail.Success));
                }
                else
                {
                    _logger.LogInformation("Redirect Email-Confirmation: Could Not Confirm.");
                    return Redirect(Redirects.GenerateOrigin(Request, Redirects.ConfirmEmail.CouldNotConfirm));
                }
            }
            catch 
            {
                _logger.LogInformation("Redirect Email-Confirmation: Bad Request Url.");
                return Redirect(Redirects.GenerateOrigin(Request, Redirects.ConfirmEmail.BadRequest));
            }
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> LoginAsyncPost(LoginInput input)
        {
            bool email = !string.IsNullOrWhiteSpace(input.Email);
            ApplicationUser appUser = email ? await _userManager.FindByEmailAsync(input.Email) : 
                await _userManager.FindByNameAsync(input.UserName);

            if (appUser != null) 
            {
                await _signInManager.SignOutAsync(); 

                if (!appUser.EmailConfirmed)
                {
                    await SendConfirmationEmail(appUser);
                    _logger.LogInformation("Login", Api.Login.ConfirmEmail);
                    return Ok(Api.Login.ConfirmEmail);
                }

                var result = await _signInManager.PasswordSignInAsync(appUser, input.Password, input.RememberMe, lockoutOnFailure: true);

                if (result.Succeeded)
                {
                    _logger.LogInformation("Login", Api.Login.Success);
                    return Ok(Api.Login.Success);
                }
                else if (result.RequiresTwoFactor)
                {
                    _logger.LogInformation("Login", Api.Login.TwoFactor);
                    return Ok(Api.Login.TwoFactor);
                }
                else if (result.IsLockedOut)
                {
                    _logger.LogInformation("Login", Api.Login.LockedOut);
                    return Ok(Api.Login.LockedOut);
                }
                else if (result.IsNotAllowed)
                {
                    _logger.LogInformation("Login", Api.Login.NotAllowed);
                    return Ok(Api.Login.NotAllowed);
                }
            }
            _logger.LogInformation("Login", Api.Login.DoesNotExist);
            return Ok(Api.Login.DoesNotExist);
        }

        [HttpPost("Logout")]
        public async Task<IActionResult> LogoutAsyncPost()
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation(4, "User logged out.");
            return Ok(Api.Logout.Success);
        }

        [HttpPost("ForgotPassword")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPasswordAsyncPost(KeyInput input)
        {
            ApplicationUser appUser;

            if (input.Key.Contains('@'))
                appUser = await _userManager.FindByEmailAsync(input.Key);
            else
                appUser = await _userManager.FindByNameAsync(input.Key);

            if (appUser != null)
            {
                if (await _userManager.IsEmailConfirmedAsync(appUser))
                {
                    string code = Api.Encode(await _userManager.GeneratePasswordResetTokenAsync(appUser));
                    var userId = await _userManager.GetUserIdAsync(appUser);
                    var callbackUrl = _emailSender.GenerateCallback(Request, Api.ForgotPassword.Page, userId, code);
                    await _emailSender.SendEmailAsync(appUser, _emailSender.ForgotPasswordSubject, _emailSender.ForgotPasswordBody(callbackUrl));
                    _logger.LogInformation($"ForgotPassword {appUser.UserName}", Api.ForgotPassword.EmailSent);
                    return Ok(Api.ForgotPassword.EmailSent);
                }
                else
                {
                    _logger.LogInformation($"ForgotPassword {appUser.UserName}", Api.ForgotPassword.EmailSent);
                    return Ok(Api.ForgotPassword.ConfirmAccount);
                }
            }
            else
            {
                _logger.LogInformation($"ForgotPassword {input.Key}", Api.ForgotPassword.EmailSent);
                return Ok(Api.ForgotPassword.DoesNotExist);
            }
        }
        
        [HttpGet("ForgotPassword")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPasswordAsyncGet(string userId, string code)
        {
            try
            {
                if (userId == null || code == null)
                {
                    _logger.LogInformation("Redirect ForgotPassword-Confirmation: Invalid Link Used.");
                    return Redirect(Redirects.GenerateOrigin(Request, Redirects.PasswordRecovery.InvalidLink));
                }

                ApplicationUser user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    _logger.LogInformation("Redirect ForgotPassword-Confirmation: User is null.");
                    return Redirect(Redirects.GenerateOrigin(Request, Redirects.PasswordRecovery.InvalidUser));
                }

                var parameters = new Dictionary<string, string> { { "userId", userId }, { "code", code } };
                var link = QueryHelpers.AddQueryString(Redirects.GenerateOrigin(Request, Redirects.PasswordRecovery.Reset), parameters);
                _logger.LogInformation("Redirecting to Password Reset Link");
                return Redirect(link);
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"Unable to Send Password Recovery Link. Exception: {ex.Message}");
                return Redirect(Redirects.GenerateOrigin(Request, Redirects.PasswordRecovery.BadRequest));
            }
        }

        [HttpPost("ResetPassword")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPasswordAsyncPost(PasswordResetInput input)
        {
            ApplicationUser user = await _userManager.FindByIdAsync(input.UserId);

            if (user != null)
            {
                var result = await _userManager.ResetPasswordAsync(user, Api.Decode(input.Code), input.Password);

                if (result.Succeeded)
                {
                    _logger.LogInformation("Reset password attempt: Reset was successful.");
                    //FUTURE: also send additional assurance email
                    return Ok(Api.ResetPassword.Success);
                }
                else
                {
                    return Ok(Api.ResetPassword.Failure);
                }
            }
            else
            {
                _logger.LogInformation("Reset password attempt: Failure user is null.");
                return Ok(Api.ResetPassword.DoesNotExist); // Don't reveal that the user does not exist
            }
        }
        
        // POST: /Account/ExternalLogin   'OnPost[Razor]'
        [HttpPost("ExternalLogin")]
        [AllowAnonymous]
        //[ValidateAntiForgeryToken]
        public IActionResult ExternalLogin(ExternalLoginInput input)
        {
            // Request a redirect to the external login provider.
            //$"https://localhost:5001/Api/Account/ExternalLoginCallback?returnUrl={input.ReturnUrl}";
            var redirectUrl = Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = input.ReturnUrl }); //Action instead of Page
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(input.Provider, redirectUrl);
            //var props = new AuthenticationProperties
            //{
            //    RedirectUri = "https://localhost:5001/signin-google",
            //    Items =
            //   {
            //        { "scheme", input.Provider },
            //        { "returnUrl", redirectUrl }
            //    }
            //};
            //_logger.LogWarning(properties.RedirectUri);
           // _logger.LogWarning(properties.);

            //return Ok("yay");

            return Challenge(properties, input.Provider);
        }

        // GET: /Account/ExternalLoginCallback  'OneGetCallbackAsync[Razor]'
        [HttpGet("ExternalLoginCallback")]
        [AllowAnonymous]
        public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null, string remoteError = null)
        {

            _logger.LogWarning("Made it to callback");
            returnUrl = returnUrl ?? Url.Content("~/"); //Razor Page Added
            if (remoteError != null)
            {
                //ModelState.AddModelError(string.Empty, $"Error from external provider: {remoteError}");
                //return View(nameof(Login));
                return Ok("Remote Error");
            }


            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                //return RedirectToAction(nameof(Login));
                return Ok("Info null");
            }

            // Sign in the user with this external login provider if the user already has a login.
            var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: true);
            if (result.Succeeded)
            {
                _logger.LogInformation("{Name} logged in with {LoginProvider} provider.", info.Principal.Identity.Name, info.LoginProvider);
                await _signInManager.UpdateExternalAuthenticationTokensAsync(info);
                return Ok("success");//RedirectToLocal(returnUrl) MVC //LocalRedirect Razor
            }
            if (result.RequiresTwoFactor)
            {
                return Ok("twoFactor");//RedirectToAction(nameof(SendCode), new { ReturnUrl = returnUrl });
            }
            if (result.IsLockedOut)
            {
                return Ok("Lockout");// View("Lockout");
            }
            else
            {
                // If the user does not have an account, then ask the user to create an account.
                //ViewData["ReturnUrl"] = returnUrl;
                //ViewData["ProviderDisplayName"] = info.ProviderDisplayName;
                //var email = info.Principal.FindFirstValue(ClaimTypes.Email);
                //return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { Email = email });
                return Ok("Create an Account");
            }
        }
        
        // POST: /Account/ExternalLoginConfirmation   'OnPostConfirmationAsync[Razor]'
        [HttpPost("ExternalLoginConfirmation")]
        [AllowAnonymous]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model, string returnUrl = null)
        {
            //if (ModelState.IsValid)
            //{
                // Get the information about the user from the external login provider
                var info = await _signInManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    return Ok("ExternalLoginFailure"); //View("ExternalLoginFailure");
                }
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                var result = await _userManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    result = await _userManager.AddLoginAsync(user, info);
                    if (result.Succeeded)
                    {
                        await _signInManager.SignInAsync(user, isPersistent: false);
                        _logger.LogInformation(6, "User created an account using {Name} provider.", info.LoginProvider);

                        // Update any authentication tokens as well
                        await _signInManager.UpdateExternalAuthenticationTokensAsync(info);

                        return Ok("success");//RedirectToLocal(returnUrl);
                    }
                }
                //AddErrors(result);
                //return 
            //}

            //ViewData["ReturnUrl"] = returnUrl;
            return Ok("error");//View(model);
        }

        #region Helpers
        public class ExternalLoginConfirmationViewModel
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; }
        }

        private async Task SendConfirmationEmail(ApplicationUser appUser)
        {
            string code = Api.Encode(await _userManager.GenerateEmailConfirmationTokenAsync(appUser));
            var userId = await _userManager.GetUserIdAsync(appUser);
            var callbackUrl = _emailSender.GenerateCallback(Request, Api.Register.Page, userId, code);
            await _emailSender.SendEmailAsync(appUser, _emailSender.RegisterSubject, _emailSender.RegisterBody(callbackUrl));
        }

        #endregion Helpers

        #region Archives

        /*
        //
        // GET: /Account/SendCode
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> SendCode(string returnUrl = null, bool rememberMe = false)
        {
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
            if (user == null)
            {
                return View("Error");
            }
            var userFactors = await _userManager.GetValidTwoFactorProvidersAsync(user);
            var factorOptions = userFactors.Select(purpose => new SelectListItem { Text = purpose, Value = purpose }).ToList();
            return View(new SendCodeViewModel { Providers = factorOptions, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }
        */

        /*
        //
        // POST: /Account/SendCode
        [HttpPost("sendcode")]
        [AllowAnonymous]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SendCode(SendCodeViewModel model)
        {
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
            if (user == null)
            {
                return View("Error");
            }

            if (model.SelectedProvider == "Authenticator")
            {
                return RedirectToAction(nameof(VerifyAuthenticatorCode), new { ReturnUrl = model.ReturnUrl, RememberMe = model.RememberMe });
            }

            // Generate the token and send it
            var code = await _userManager.GenerateTwoFactorTokenAsync(user, model.SelectedProvider);
            if (string.IsNullOrWhiteSpace(code))
            {
                return View("Error");
            }

            var message = "Your security code is: " + code;
            if (model.SelectedProvider == "Email")
            {
                await _emailSender.SendEmailAsync(await _userManager.GetEmailAsync(user), "Security Code", message);
            }
            else if (model.SelectedProvider == "Phone")
            {
                await _smsSender.SendSmsAsync(await _userManager.GetPhoneNumberAsync(user), message);
            }

            return RedirectToAction(nameof(VerifyCode), new { Provider = model.SelectedProvider, ReturnUrl = model.ReturnUrl, RememberMe = model.RememberMe });
        }
        */

        /*
        //
        // GET: /Account/VerifyCode
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyCode(string provider, bool rememberMe, string returnUrl = null)
        {
            // Require that the user has already logged in via username/password or external login
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
            if (user == null)
            {
                return View("Error");
            }
            return View(new VerifyCodeViewModel { Provider = provider, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }
        */

        /*
        //
        // POST: /Account/VerifyCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> VerifyCode(VerifyCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // The following code protects for brute force attacks against the two factor codes.
            // If a user enters incorrect codes for a specified amount of time then the user account
            // will be locked out for a specified amount of time.
            var result = await _signInManager.TwoFactorSignInAsync(model.Provider, model.Code, model.RememberMe, model.RememberBrowser);
            if (result.Succeeded)
            {
                return RedirectToLocal(model.ReturnUrl);
            }
            if (result.IsLockedOut)
            {
                _logger.LogWarning(7, "User account locked out.");
                return View("Lockout");
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Invalid code.");
                return View(model);
            }
        }
        */

        /*
        //
        // GET: /Account/VerifyAuthenticatorCode
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyAuthenticatorCode(bool rememberMe, string returnUrl = null)
        {
            // Require that the user has already logged in via username/password or external login
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
            if (user == null)
            {
                return View("Error");
            }
            return View(new VerifyAuthenticatorCodeViewModel { ReturnUrl = returnUrl, RememberMe = rememberMe });
        }
        */

        /*
        //
        // POST: /Account/VerifyAuthenticatorCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> VerifyAuthenticatorCode(VerifyAuthenticatorCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // The following code protects for brute force attacks against the two factor codes.
            // If a user enters incorrect codes for a specified amount of time then the user account
            // will be locked out for a specified amount of time.
            var result = await _signInManager.TwoFactorAuthenticatorSignInAsync(model.Code, model.RememberMe, model.RememberBrowser);
            if (result.Succeeded)
            {
                return RedirectToLocal(model.ReturnUrl);
            }
            if (result.IsLockedOut)
            {
                _logger.LogWarning(7, "User account locked out.");
                return View("Lockout");
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Invalid code.");
                return View(model);
            }
        }
        */

        /*
        //
        // GET: /Account/UseRecoveryCode
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> UseRecoveryCode(string returnUrl = null)
        {
            // Require that the user has already logged in via username/password or external login
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
            if (user == null)
            {
                return View("Error");
            }
            return View(new UseRecoveryCodeViewModel { ReturnUrl = returnUrl });
        }
        */

        /*
        //
        // POST: /Account/UseRecoveryCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UseRecoveryCode(UseRecoveryCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var result = await _signInManager.TwoFactorRecoveryCodeSignInAsync(model.Code);
            if (result.Succeeded)
            {
                return RedirectToLocal(model.ReturnUrl);
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Invalid code.");
                return View(model);
            }
        }
        */
        //
        #endregion Archives

    }
}