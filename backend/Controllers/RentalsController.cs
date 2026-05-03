using Microsoft.AspNetCore.Mvc;
using BerAuto.Backend.Entities;
using BerAuto.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers;

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

    // 1. Ügyintéző listázza a bérléseket (pl. állapot szerinti szűréssel)
    [Authorize(Roles = "Agent, Admin")]
    [HttpGet("manage")]
    public async Task<ActionResult<IEnumerable<Rental>>> GetAllRentalsForManagement([FromQuery] RentalStatus? status = null)
    {
        var rentals = await _rentalService.GetAllRentalsAsync();

        // Ha a frontend kér egy adott státuszt (pl. csak a Pendingeket), akkor leszűrjük
        if (status.HasValue)
        {
            rentals = rentals.Where(r => r.Status == status.Value);
        }

        return Ok(rentals);
    }

    // 2. Igény jóváhagyása vagy elutasítása
    [Authorize(Roles = "Agent, Admin")]
    [HttpPut("manage/{id}/decide")]
    public async Task<IActionResult> DecideRental(int id, [FromQuery] bool approve)
    {
        // Ha approve == true, akkor Approved, különben Rejected
        RentalStatus newStatus = approve ? RentalStatus.Approved : RentalStatus.Rejected;

        var success = await _rentalService.UpdateStatusAsync(id, newStatus);

        if (!success) return NotFound("A bérlés nem található.");
        return Ok(new { message = $"A bérlés állapota módosítva: {newStatus}" });
    }

    // 3. Autó átadása (Kölcsönzés elindítása)
    [Authorize(Roles = "Agent, Admin")]
    [HttpPut("manage/{id}/handover")]
    public async Task<IActionResult> HandoverCar(int id)
    {
        // Ideálisan itt ellenőrizni kéne, hogy "Approved" állapotban van-e a bérlés
        var success = await _rentalService.UpdateStatusAsync(id, RentalStatus.Active);

        if (!success) return NotFound("A bérlés nem található.");
        return Ok(new { message = "Az autó átadása sikeresen rögzítve. A bérlés mostantól aktív!" });
    }

    // 4. Autó visszavétele (Kölcsönzés lezárása)
    [Authorize(Roles = "Agent, Admin")]
    [HttpPut("manage/{id}/return")]
    public async Task<IActionResult> ReturnCar(int id)
    {
        // Ez fogja beállítani a Completed státuszt és a visszavétel dátumát (ActualReturnDate)
        var success = await _rentalService.UpdateStatusAsync(id, RentalStatus.Completed);

        if (!success) return NotFound("A bérlés nem található.");
        return Ok(new { message = "Az autó visszavétele sikeresen rögzítve. A bérlés lezárult." });
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