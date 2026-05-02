namespace backend.DTOs.Auth
{
    public class UpdateProfileDto
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? NewPassword { get; set; } // Opcionális
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
    }
}