using Microsoft.AspNetCore.Identity;

namespace FSU600_LAB3_API.Models
{
    public class User:IdentityUser
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public virtual ICollection<Order> Orders { get; set; }

    }
}
