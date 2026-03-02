using System.ComponentModel.DataAnnotations;

namespace BerAuto.Backend.Entities;

public class User
{
    public int Id { get; set; }

    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;


    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }

    [Required]
    public string Role { get; set; } = "User";

    public List<Rental> Rentals { get; set; } = new();
}