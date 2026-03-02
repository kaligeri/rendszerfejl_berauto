using System.ComponentModel.DataAnnotations;

namespace BerAuto.Backend.Entities;

public class Invoice
{
    public int Id { get; set; }

    [Required]
    public int RentalId { get; set; }
    
    public Rental? Rental { get; set; }

    [Required]
    public decimal TotalAmount { get; set; }

    public DateTime IssuedAt { get; set; } = DateTime.Now;

    public bool IsPaid { get; set; } = false;
}