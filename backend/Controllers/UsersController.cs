using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.Data;
using backend.DTOs.Auth;
using backend.Services.Auth; 

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasher _passwordHasher; // Új változó a jelszóhoz

        // Konstruktor frissítve
        public UsersController(ApplicationDbContext context, IPasswordHasher passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.Address,
                    u.PhoneNumber,
                    u.Role
                })
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound("Felhasználó nem található.");

            return Ok(user);
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("Felhasználó nem található.");

            // 1. Felhasználónév frissítése és ellenőrzése
            if (!string.IsNullOrWhiteSpace(dto.Username) && dto.Username != user.Username)
            {
                // Megnézzük, van-e MÁSIK felhasználó ezzel a névvel
                if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
                {
                    return BadRequest("Ez a felhasználónév már foglalt.");
                }
                user.Username = dto.Username;
            }

            // 2. Email frissítése és ellenőrzése
            if (!string.IsNullOrWhiteSpace(dto.Email) && dto.Email != user.Email)
            {
                if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                {
                    return BadRequest("Ez az email cím már foglalt.");
                }
                user.Email = dto.Email;
            }

            // 3. Új jelszó titkosítása és mentése
            if (!string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                user.PasswordHash = _passwordHasher.HashPassword(dto.NewPassword);
            }

            // 4. Cím és telefonszám frissítése
            if (dto.Address != null) user.Address = dto.Address;
            if (dto.PhoneNumber != null) user.PhoneNumber = dto.PhoneNumber;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Profil adatok sikeresen frissítve!" });
        }
    }
}