﻿using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class Users: IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName => $"{FirstName} {LastName}";
        public string? Address { get; set; }
        public bool IsUserActive { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}
