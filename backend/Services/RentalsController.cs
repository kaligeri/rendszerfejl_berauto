using Microsoft.AspNetCore.Mvc;
using BerAuto.Backend.Entities;
using BerAuto.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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
    // Az [AllowAnonymous] jelzi a rendszernek (és a frontendnek is), hogy ide nem kell token
    [AllowAnonymous]
    public async Task<ActionResult<Rental>> Create([FromBody] RentalDto request)
    {
        // ÚJ LOGIKA: Validáció a nem regisztrált userek miatt
        if (request.UserId == null)
        {
            // Ha nincs UserId, akkor kötelező a GuestName és GuestContact!
            if (string.IsNullOrWhiteSpace(request.GuestName) || string.IsNullOrWhiteSpace(request.GuestContact))
            {
                return BadRequest("Nem regisztrált felhasználó esetén a név (GuestName) és elérhetőség (GuestContact) megadása kötelező!");
            }
        }

        var rental = new Rental
        {
            CarId = request.CarId,
            UserId = request.UserId, // Ha regisztrált, ide bejön a Guid
            GuestName = request.GuestName, // Ha vendég, ide bejön a neve
            GuestContact = request.GuestContact, // És a telefonszáma
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
    [Authorize]
    [HttpGet("my-rentals")]
    public async Task<ActionResult<IEnumerable<Rental>>> GetMyRentals()
    {
        // A tokenből kiolvassuk a bejelentkezett user ID-ját
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
        {
            return Unauthorized();
        }

        var rentals = await _rentalService.GetUserRentalsAsync(userId);
        return Ok(rentals);
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