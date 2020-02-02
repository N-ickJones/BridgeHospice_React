using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Cors;

using BridgeHospiceApi.Models;
using BridgeHospiceApi.Services;

namespace BridgeHospiceApi.Controllers
{
    //[EnableCors("Origins")]
    [Authorize]
    [Route("api/account/[controller]")]
    [ApiController]
    public class SettingsController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;

        public SettingsController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IEmailSender emailSender,
        ISmsSender smsSender,
        ILoggerFactory loggerFactory)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _smsSender = smsSender;
            _logger = loggerFactory.CreateLogger<SettingsController>();
        }

        [HttpGet("User")]
        public async Task<IActionResult> GetUserAsyncGet()
        {
            if (User != null)
            {
                ApplicationUser appUser = await _userManager.GetUserAsync(User);
                if (appUser != null)
                {
                    _logger.LogInformation("User data sent to client", appUser);
                    return Ok(Api.GenerateUserJson(appUser, "Success", "User fetch was successful"));
                }
            }
            _logger.LogInformation("Invalid user request");
            return Ok(Api.GenerateUserJson(null, "Failure", "Unable to retrieve user data"));
        }

        [HttpPost("Change/UserName")]
        public async Task<IActionResult> ChangeUserNameAsyncPost(ChangeValueInput input)
        {
            if (!string.IsNullOrWhiteSpace(input.Value))
            {
                ApplicationUser appUser = await _userManager.GetUserAsync(User);

                appUser.UserName = input.Value;
                var result = await _userManager.UpdateAsync(appUser);

                if (result.Succeeded)
                    return Ok(Api.Change.Success);
                else
                    return Ok(Api.GenerateErrorJson(result));
            }
            else
                return Ok(Api.Change.Failure);
        }

        //Used For Testing Email..
        /*
        [HttpPost("Change/Email")]
        public async Task<IActionResult> ChangeEmail2AsyncPost(ChangeValueInput input)
        {
            if (!string.IsNullOrWhiteSpace(input.Value))
            {
                ApplicationUser appUser = await _userManager.GetUserAsync(User);

                appUser.Email = input.Value;
                var result = await _userManager.UpdateAsync(appUser);

                if (result.Succeeded)
                    return Ok(Api.Change.Success);
                else
                    return Ok(Api.GenerateErrorJson(result));
            }
            else
                return Ok(Api.Change.Failure);
        }
        */

        [HttpPost("Change/Email")]
        public async Task<IActionResult> ChangeEmailAsyncPost(ChangeValueInput input)
        {
            if (!string.IsNullOrWhiteSpace(input.Value))
            {
                ApplicationUser appUser = await _userManager.GetUserAsync(User);
                if (appUser != null)
                {
                    string code = Api.Encode(await _userManager.GenerateChangeEmailTokenAsync(appUser, input.Value));
                    var userId = await _userManager.GetUserIdAsync(appUser);
                    string callbackUrl = _emailSender.GenerateCallbackWithNewEmail(Request, Api.Change.Email.Page, userId, code, input.Value);
                    await _emailSender.SendWithNewEmailAsync(appUser, input.Value, _emailSender.ChangeEmailSubject, _emailSender.ChangeEmailBody(callbackUrl));
                    return Ok(Api.Change.Email.Success);
                }
                else
                    return Ok(Api.Change.Failure);
            }
            else
                return Ok(Api.Change.Failure);
        }

        [AllowAnonymous]
        [HttpGet("Change/Email")]
        public async Task<IActionResult> ChangeEmailAsyncGet(string userId, string code, string newEmail)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(code) || string.IsNullOrWhiteSpace(code))
            {
                _logger.LogInformation("Redirect Email-Change: Invalid Link Used.");
                return Redirect(Redirects.GenerateOrigin(Request, Redirects.ChangeEmail.InvalidLink));
            }

            ApplicationUser user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _logger.LogInformation("Redirect Email-Change: Invalid User.");
                return Redirect(Redirects.GenerateOrigin(Request, Redirects.ChangeEmail.InvalidUser));
            }

            IdentityResult result = await _userManager.ChangeEmailAsync(user, newEmail, Api.Decode(code));
            if (result.Succeeded)
            {
                _logger.LogInformation("Redirect Email-Change: Successful.");
                //FUTURE: send additional assurance email
                return Redirect(Redirects.GenerateOrigin(Request, Redirects.ChangeEmail.Success));
            }
            else
            {
                _logger.LogInformation("Redirect Email-Change: Could Not Confirm.");
                return Redirect(Redirects.GenerateOrigin(Request, Redirects.ChangeEmail.CouldNotConfirm));
            }
        }

        [HttpPost("Change/FirstName")]
        public async Task<IActionResult> ChangeFirstNameAsyncPost(ChangeValueInput input)
        {
            if (!string.IsNullOrWhiteSpace(input.Value))
            {
                ApplicationUser appUser = await _userManager.GetUserAsync(User);

                appUser.FirstName = input.Value;
                var result = await _userManager.UpdateAsync(appUser);

                if (result.Succeeded)
                    return Ok(Api.Change.Success);
                else
                    return Ok(Api.GenerateErrorJson(result));
            }
            else
                return Ok(Api.Change.Failure);
        }

        [HttpPost("Change/LastName")]
        public async Task<IActionResult> ChangeLastNameAsyncPost(ChangeValueInput input)
        {
            if (!string.IsNullOrWhiteSpace(input.Value))
            {
                ApplicationUser appUser = await _userManager.GetUserAsync(User);

                appUser.LastName = input.Value;
                var result = await _userManager.UpdateAsync(appUser);

                if (result.Succeeded)
                    return Ok(Api.Change.Success);
                else
                    return Ok(Api.GenerateErrorJson(result));
            }
            else
                return Ok(Api.Change.Failure);
        }

        [HttpPost("Change/PhoneNumber")]
        public async Task<IActionResult> ChangePhoneNumberAsyncPost(ChangeValueInput input)
        {
            if (!string.IsNullOrWhiteSpace(input.Value))
            {
                ApplicationUser appUser = await _userManager.GetUserAsync(User);

                appUser.PhoneNumber = input.Value;
                var result = await _userManager.UpdateAsync(appUser);

                if (result.Succeeded)
                    return Ok(Api.Change.Success);
                else
                    return Ok(Api.GenerateErrorJson(result));
            }
            else
                return Ok(Api.Change.Failure);
        }

        [HttpPost("Change/Password")]
        public async Task<IActionResult> ChangePasswordAsyncPost(ChangePasswordInput input)
        {
            if (!string.IsNullOrWhiteSpace(input.CurrentPassword))
            {
                if (!string.IsNullOrWhiteSpace(input.NewPassword))
                {
                    ApplicationUser appUser = await _userManager.GetUserAsync(User);

                    var result = await _userManager.ChangePasswordAsync(appUser, input.CurrentPassword, input.NewPassword);

                    if (result.Succeeded)
                        //Re authenticate
                        return Ok(Api.Change.Success);
                    else
                        return Ok(Api.GenerateErrorJson(result));
                }
            }
            return Ok(Api.Change.Failure);
        }




        #region Archives
        //Start Phone Number
        /*
       // POST: /Manage/AddPhoneNumber
       [HttpPost]
       [ValidateAntiForgeryToken]
       public async Task<IActionResult> AddPhoneNumber(AddPhoneNumberViewModel model)
       {
           if (!ModelState.IsValid)
           {
               return View(model);
           }
           // Generate the token and send it
           var user = await GetCurrentUserAsync();
           var code = await _userManager.GenerateChangePhoneNumberTokenAsync(user, model.PhoneNumber);
           await _smsSender.SendSmsAsync(model.PhoneNumber, "Your security code is: " + code);
           return RedirectToAction(nameof(VerifyPhoneNumber), new { PhoneNumber = model.PhoneNumber });
       }
       */

        /*
        // GET: /Manage/VerifyPhoneNumber
        [HttpGet]
        public async Task<IActionResult> VerifyPhoneNumber(string phoneNumber)
        {
            var code = await _userManager.GenerateChangePhoneNumberTokenAsync(await GetCurrentUserAsync(), phoneNumber);
            // Send an SMS to verify the phone number
            return phoneNumber == null ? View("Error") : View(new VerifyPhoneNumberViewModel { PhoneNumber = phoneNumber });
        }
        */

        /*
        // POST: /Manage/VerifyPhoneNumber
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> VerifyPhoneNumber(VerifyPhoneNumberViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var user = await GetCurrentUserAsync();
            if (user != null)
            {
                var result = await _userManager.ChangePhoneNumberAsync(user, model.PhoneNumber, model.Code);
                if (result.Succeeded)
                {
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    return RedirectToAction(nameof(Index), new { Message = ManageMessageId.AddPhoneSuccess });
                }
            }
            // If we got this far, something failed, redisplay the form
            ModelState.AddModelError(string.Empty, "Failed to verify phone number");
            return View(model);
        }
        */

        /*
        // GET: /Manage/RemovePhoneNumber
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RemovePhoneNumber()
        {
            var user = await GetCurrentUserAsync();
            if (user != null)
            {
                var result = await _userManager.SetPhoneNumberAsync(user, null);
                if (result.Succeeded)
                {
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    return RedirectToAction(nameof(Index), new { Message = ManageMessageId.RemovePhoneSuccess });
                }
            }
            return RedirectToAction(nameof(Index), new { Message = ManageMessageId.Error });
        }
        */

        //Start two factor

        /*
        // POST: /Manage/ResetAuthenticatorKey  //TWOFACTOR
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetAuthenticatorKey()
        {
            var user = await GetCurrentUserAsync();
            if (user != null)
            {
                await _userManager.ResetAuthenticatorKeyAsync(user);
                _logger.LogInformation(1, "User reset authenticator key.");
            }
            return RedirectToAction(nameof(Index), "Manage");
        }
        */

        /*
        // POST: /Manage/GenerateRecoveryCode  //TWOFACTOR
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GenerateRecoveryCode()
        {
            var user = await GetCurrentUserAsync();
            if (user != null)
            {
                var codes = await _userManager.GenerateNewTwoFactorRecoveryCodesAsync(user, 5);
                _logger.LogInformation(1, "User generated new recovery code.");
                return View("DisplayRecoveryCodes", new DisplayRecoveryCodesViewModel { Codes = codes });
            }
            return View("Error");
        }
        */

        /*
        // POST: /Manage/EnableTwoFactorAuthentication //TWOFACTOR
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EnableTwoFactorAuthentication()
        {
            var user = await GetCurrentUserAsync();
            if (user != null)
            {
                await _userManager.SetTwoFactorEnabledAsync(user, true);
                await _signInManager.SignInAsync(user, isPersistent: false);
                _logger.LogInformation(1, "User enabled two-factor authentication.");
            }
            return RedirectToAction(nameof(Index), "Manage");
        }
        */

        /*
        // POST: /Manage/DisableTwoFactorAuthentication //TWOFACTOR
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DisableTwoFactorAuthentication()
        {
            var user = await GetCurrentUserAsync();
            if (user != null)
            {
                await _userManager.SetTwoFactorEnabledAsync(user, false);
                await _signInManager.SignInAsync(user, isPersistent: false);
                _logger.LogInformation(2, "User disabled two-factor authentication.");
            }
            return RedirectToAction(nameof(Index), "Manage");
        }
        */

        // start external
        /*
       // POST: /Manage/RemoveLogin //EXTERNAL
       [HttpPost]
       [ValidateAntiForgeryToken]
       public async Task<IActionResult> RemoveLogin(RemoveLoginViewModel account)
       {
           ManageMessageId? message = ManageMessageId.Error;
           var user = await GetCurrentUserAsync();
           if (user != null)
           {
               var result = await _userManager.RemoveLoginAsync(user, account.LoginProvider, account.ProviderKey);
               if (result.Succeeded)
               {
                   await _signInManager.SignInAsync(user, isPersistent: false);
                   message = ManageMessageId.RemoveLoginSuccess;
               }
           }
           return RedirectToAction(nameof(ManageLogins), new { Message = message });
       }
       */

        /*
        //GET: /Manage/ManageLogins //EXTERNAL
        [HttpGet]
        public async Task<IActionResult> ManageLogins(ManageMessageId? message = null)
        {
            ViewData["StatusMessage"] =
                message == ManageMessageId.RemoveLoginSuccess ? "The external login was removed."
                : message == ManageMessageId.AddLoginSuccess ? "The external login was added."
                : message == ManageMessageId.Error ? "An error has occurred."
                : "";
            var user = await GetCurrentUserAsync();
            if (user == null)
            {
                return View("Error");
            }
            var userLogins = await _userManager.GetLoginsAsync(user);
            var schemes = await _signInManager.GetExternalAuthenticationSchemesAsync();
            var otherLogins = schemes.Where(auth => userLogins.All(ul => auth.Name != ul.LoginProvider)).ToList();
            ViewData["ShowRemoveButton"] = user.PasswordHash != null || userLogins.Count > 1;
            return View(new ManageLoginsViewModel
            {
                CurrentLogins = userLogins,
                OtherLogins = otherLogins
            });
        }
        */

        /*
        // POST: /Manage/LinkLogin //EXTERNAL
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult LinkLogin(string provider)
        {
            // Request a redirect to the external login provider to link a login for the current user
            var redirectUrl = Url.Action("LinkLoginCallback", "Manage");
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl, _userManager.GetUserId(User));
            return Challenge(properties, provider);
        }
        */

        /*
        // GET: /Manage/LinkLoginCallback //EXTERNAL
        [HttpGet]
        public async Task<ActionResult> LinkLoginCallback()
        {
            var user = await GetCurrentUserAsync();
            if (user == null)
            {
                return View("Error");
            }
            var info = await _signInManager.GetExternalLoginInfoAsync(await _userManager.GetUserIdAsync(user));
            if (info == null)
            {
                return RedirectToAction(nameof(ManageLogins), new { Message = ManageMessageId.Error });
            }
            var result = await _userManager.AddLoginAsync(user, info);
            var message = result.Succeeded ? ManageMessageId.AddLoginSuccess : ManageMessageId.Error;
            return RedirectToAction(nameof(ManageLogins), new { Message = message });
        }
        */

        //Start helpers
        /*
        private void AddErrors(IdentityResult result) //HELPER
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
        }

        public enum ManageMessageId //HELPER
        {
            AddPhoneSuccess,
            AddLoginSuccess,
            ChangePasswordSuccess,
            SetTwoFactorSuccess,
            SetPasswordSuccess,
            RemoveLoginSuccess,
            RemovePhoneSuccess,
            Error
        }

        private Task<ApplicationUser> GetCurrentUserAsync() //HELPER
        {
            return _userManager.GetUserAsync(HttpContext.User);
        }
        */
        #endregion Archives
    }
}
