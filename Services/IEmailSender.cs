using Microsoft.AspNetCore.Http;
using BridgeHospiceApi.Models;
using System.Threading.Tasks;

namespace BridgeHospiceApi.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(ApplicationUser user, string subject, string message);
        Task SendWithNewEmailAsync(ApplicationUser user, string newEmail, string subject, string message);

        public string ChangeEmailSubject => "Confirm your new email";
        public string ChangeEmailBody(string callbackUrl);
        public string RegisterSubject => "Confirm your email";
        public string RegisterBody(string callbackUrl);
        public string ForgotPasswordSubject => "Confirm your email";
        public string ForgotPasswordBody(string callbackUrl);
        public string GenerateCallback(HttpRequest request, string page, string userId, string code);
        public string HtmlEncode(string callbackUrl);
        public string GenerateCallbackWithNewEmail(HttpRequest request, string page, string userId, string code, string newEmail);

    }
}