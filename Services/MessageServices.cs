using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MimeKit.Text;
using BridgeHospiceApi.Models;
using System.Collections.Generic;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace BridgeHospiceApi.Services
{
    // This class is used by the application to send Email and SMS
    // when you turn on two-factor authentication in ASP.NET Identity.
    // For more details see this link http://go.microsoft.com/fwlink/?LinkID=532713
    public class AuthMessageSender : IEmailSender, ISmsSender
    {
        private readonly IConfigurationSection emailSettings;
        private readonly IConfigurationSection smsSettings;

        public AuthMessageSender(IConfiguration _config)
        {
            emailSettings = _config.GetSection("EmailSettings");
            smsSettings = _config.GetSection("SmsSettings");
        }
        private static readonly SmtpClient smtpClient = new SmtpClient();

        public Task SendEmailAsync(ApplicationUser user, string subject, string message)
        {
            try
            {
                if (!smtpClient.IsConnected)
                    smtpClient.Connect(emailSettings["SmtpServer"], int.Parse(emailSettings["SmtpPort"]), bool.Parse(emailSettings["UseSsl"]));

                if (!smtpClient.IsAuthenticated)
                    smtpClient.Authenticate(emailSettings["SmtpUsername"], emailSettings["SmtpPassword"]);

                if (!smtpClient.IsSecure)
                    return Task.FromResult(false);

                MimeMessage mimeMessage = new MimeMessage();
                mimeMessage.From.Add(new MailboxAddress(emailSettings["SenderName"], emailSettings["SenderAddress"]));
                mimeMessage.To.Add(new MailboxAddress(user.UserName, user.Email));
                mimeMessage.Subject = subject;
                mimeMessage.Body = new TextPart(TextFormat.Html)
                {
                    Text = message
                };

                Task send = smtpClient.SendAsync(mimeMessage);

                return Task.FromResult(send.IsCompletedSuccessfully);
            }
            catch
            {
                return Task.FromResult(false);
            }
        }

        public Task SendWithNewEmailAsync(ApplicationUser user, string newEmail, string subject, string message)
        {
            try
            {
                if (!smtpClient.IsConnected)
                    smtpClient.Connect(emailSettings["SmtpServer"], int.Parse(emailSettings["SmtpPort"]), bool.Parse(emailSettings["UseSsl"]));

                if (!smtpClient.IsAuthenticated)
                    smtpClient.Authenticate(emailSettings["SmtpUsername"], emailSettings["SmtpPassword"]);

                if (!smtpClient.IsSecure)
                    return Task.FromResult(false);

                MimeMessage mimeMessage = new MimeMessage();
                mimeMessage.From.Add(new MailboxAddress(emailSettings["SenderName"], emailSettings["SenderAddress"]));
                mimeMessage.To.Add(new MailboxAddress(user.UserName, newEmail));
                mimeMessage.Subject = subject;
                mimeMessage.Body = new TextPart(TextFormat.Html)
                {
                    Text = message
                };

                Task send = smtpClient.SendAsync(mimeMessage);

                return Task.FromResult(send.IsCompletedSuccessfully);
            }
            catch
            {
                return Task.FromResult(false);
            }
        }

        public string ChangeEmailSubject => "Confirm your new email";
        public string ChangeEmailBody(string callbackUrl)
        {
            return $"Please confirm your email change by <a href='{HtmlEncode(callbackUrl)}'>clicking here</a>.";
        }

        public string RegisterSubject => "Confirm your email";
        public string RegisterBody(string callbackUrl)
        {
            return $"Please confirm your account by <a href='{HtmlEncode(callbackUrl)}'>clicking here</a>.";
        }

        public static string ForgotPasswordSubject => "Reset your password";
        public string ForgotPasswordBody(string callbackUrl)
        {
            return $"Please reset your password by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>";
        }

        public string HtmlEncode(string callbackUrl)
        {
            return HtmlEncoder.Default.Encode(callbackUrl);
        }

        public string GenerateCallback(HttpRequest request, string page, string userId, string code)
        {   
            return QueryHelpers.AddQueryString($"{request.Scheme}://{request.Host}{request.PathBase}/{page}",
                new Dictionary<string, string> { { "userId", userId }, { "code", code } }
            );
        }

        public string GenerateCallbackWithNewEmail(HttpRequest request, string page, string userId, string code, string newEmail)
        {
            return QueryHelpers.AddQueryString($"{request.Scheme}://{request.Host}{request.PathBase}/{page}",
                new Dictionary<string, string> { { "userId", userId }, { "code", code }, { "newEmail", newEmail } }
            );
        }

        public Task SendSmsAsync(string number, string message)
        {
            // Plug in your SMS service here to send a text message.
            return Task.FromResult(0);
        }
    }
}