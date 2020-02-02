/// <summary>
/// Json Representations of Request Body
/// </summary>
namespace BridgeHospiceApi.Controllers
{
    public class LoginInput
    {
        public string UserName { get; set; }

        public string Email { get; set; } = null;

        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }

    public class RegisterInput
    {
        public string UserName { get; set; }

        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string PhoneNumber { get; set; }

        public string Password { get; set; }
    }

    public class KeyInput
    {
        public string Key { get; set; }
    }

    public class PasswordResetInput
    {
        public string UserId { get; set; }

        public string Code { get; set; }

        public string Password { get; set; }

    }

    public class ChangeValueInput
    {
        public string Value { get; set; }
    }

    public class ChangePasswordInput
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }

    public class ExternalLoginInput
    {
        public string Provider { get; set; }
        public string ReturnUrl { get; set; }
    }

}
