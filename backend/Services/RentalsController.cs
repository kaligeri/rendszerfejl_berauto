using Microsoft.AspNetCore.Mvc;
using BerAuto.Backend.Entities;
using BerAuto.Backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace BerAuto.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RentalsController : ControllerBase
{
    private readonly IRentalService _rentalService;

    public RentalsController(IRentalService rentalService)
    {
        _rentalService = rentalService;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<Rental>>> GetRentals()
    {
        return Ok(await _rentalService.GetAllRentalsAsync());
    }

    [HttpPost]
    public async Task<ActionResult<Rental>> Create([FromBody] RentalDto request)
    {
        var rental = new Rental
        {
            CarId = request.CarId,
            UserId = request.UserId,
            GuestName = request.GuestName,
            GuestContact = request.GuestContact,
            StartDate = request.StartDate,
            EndDate = request.EndDate
        };

        var result = await _rentalService.CreateRentalAsync(rental);

        if (result == null)
        {
            return BadRequest("Az autó nem elérhető az adott időszakban, vagy hibás dátumokat adtál meg.");
        }

        return Ok(result);
    }
}

public record RentalDto(
    int CarId,
    Guid? UserId,
    string? GuestName,
    string? GuestContact,
    DateTime StartDate,
    DateTime EndDate
);