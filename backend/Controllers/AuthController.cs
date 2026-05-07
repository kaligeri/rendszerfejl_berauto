using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BerAuto.Backend.Entities;
using BerAuto.Backend.Services;
using backend.Services.Auth;
using backend.Data;

namespace BerAuto.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ApplicationDbContext _context;

    public AuthController(IAuthService authService, IPasswordHasher passwordHasher, ApplicationDbContext context)
    {
        _authService = authService;
        _passwordHasher = passwordHasher;
        _context = context;
    }

    [HttpPost("register")]
    public async Task<ActionResult<User>> Register(RegisterDto request)
    {
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
        {
            return BadRequest("Ez a felhasználónév már foglalt.");
        }

        string passwordHash = _passwordHasher.HashPassword(request.Password);

        var newUser = new User
        {
            Id = Guid.NewGuid(), 
            Username = request.Username,
            Email = request.Email,
            PasswordHash = passwordHash,
            Role = request.Role,
            Address = request.Address,
            PhoneNumber = request.PhoneNumber
        };

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Sikeres regisztráció!", user = newUser.Username });
    }

    [HttpPost("login")]
    public async Task<ActionResult<string>> Login(LoginDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

        if (user == null) return BadRequest("Felhasználó nem található.");

        if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            return BadRequest("Hibás jelszó.");
        }

        string token = _authService.CreateToken(user);
        return Ok(new { token = token });
    }
}

public record RegisterDto(string Username, string Email, string Password, Role Role, string? Address, string? PhoneNumber);
public record LoginDto(string Username, string Password);