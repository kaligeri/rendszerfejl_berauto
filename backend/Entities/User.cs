using backend.Entities;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Security.Cryptography;

namespace BerAuto.Backend.Entities;

public enum Role
{
    User,
    Agent,
    Admin
}

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;


    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }

    [Required]
    public Role Role { get; set; }

    public List<Rental> Rentals { get; set; } = new();

    public static string HashPassword(string password)
    {
        using (SHA256 sha256 = SHA256.Create())
        {
            byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }

    public bool VerifyPassword(string password)
    {
        return PasswordHash == HashPassword(password);
    }

}