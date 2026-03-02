using System.ComponentModel.DataAnnotations;

namespace BerAuto.Backend.Entities;

public class Car
{
    public int _id { get; set; }
    
    [Required]
    public string _brand { get; set; } = string.Empty;
    
    [Required]
    public string _licensePlate { get; set; } = string.Empty;

    public string _engine { get; set; }

    public string _fuelType { get; set; }

    public int _performance { get; set; } //HP

    public int _torque { get; set; } //Nm

    public double _fuelConsumption { get; set; } // l/100km

    public string _transmission { get; set; } // The car is: manual/ electric - 5 speed, 4 speed etc 

    public bool _ac { get; set; }

    public int _doors { get; set; }
    public int _passengerCapacity { get; set; }

    public int _ownWeight { get; set; }

    public int _trunkCapacity { get; set; }

    public int _kilometer { get; set; } 
    
    public decimal _dailyRate { get; set; }
    
    public bool _isAvailable { get; set; } 

    public string? _technicalNotes { get; set; } 
}
