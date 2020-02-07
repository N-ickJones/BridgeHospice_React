using System;

namespace BridgeHospiceApi.Models
{
    public class Volunteer
    {
        public int VolunteerID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string City { get; set; }
        public string Zip { get; set; }
        public DateTime SubmitDate { get; set; }
        public DateTime OpenDate { get; set; }
        public DateTime CompleteDate { get; set; }
    }
}
