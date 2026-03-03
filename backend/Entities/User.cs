using System.ComponentModel.DataAnnotations;
namespace BerAuto.Backend.Entities;

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
}