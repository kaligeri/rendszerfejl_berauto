using System.ComponentModel.DataAnnotations;

namespace BerAuto.Backend.Entities;

public class Rental
{
    public int Id { get; set; }
    public Guid? UserId { get; set; }
    public User? User { get; set; }

    public string? GuestName { get; set; }
    public string? GuestContact { get; set; }

    [Required]
    public int CarId { get; set; }
    public Car? Car { get; set; }

    [Required]
    public DateTime StartDate { get; set; }
    
    [Required]
    public DateTime EndDate { get; set; }

    [Required]
    public RentalStatus Status { get; set; } = RentalStatus.Pending;

    public DateTime? ActualReturnDate { get; set; }
    
    public decimal TotalCost { get; set; }
}