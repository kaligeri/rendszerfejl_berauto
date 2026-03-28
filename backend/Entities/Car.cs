using System.ComponentModel.DataAnnotations;

namespace BerAuto.Backend.Entities;

public class Car
{
    public int Id { get; set; }

    [Required]
    public string Brand { get; set; } = string.Empty; // Pl: "BMW 320d"

    [Required]
    public string LicensePlate { get; set; } = string.Empty;

    public string? FuelType { get; set; } // Benzin, Dízel, Elektromos
    public string? Transmission { get; set; } // Manuális, Automata

    public int PassengerCapacity { get; set; }

    [Required]
    public decimal DailyRate { get; set; }

    public bool IsAvailable { get; set; } = true;

    // Itt a kért kép elérhetõsége
    public string? ImageUrl { get; set; }

    public string? Description { get; set; }
}
