using System.ComponentModel.DataAnnotations;

namespace BerAuto.Backend.Entities;

public class Car
{
    public int Id { get; set; }
    
    [Required]
    public string Brand { get; set; } = string.Empty;
    
    [Required]
    public string LicensePlate { get; set; } = string.Empty; 
    
    public int Mileage { get; set; } 
    
    public decimal DailyRate { get; set; }
    
    public bool IsAvailable { get; set; } 

    public string? TechnicalNotes { get; set; } 
}