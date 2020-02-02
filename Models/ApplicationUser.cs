using Microsoft.AspNetCore.Identity;

namespace BridgeHospiceApi.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
