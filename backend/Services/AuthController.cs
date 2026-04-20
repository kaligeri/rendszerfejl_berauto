using Microsoft.AspNetCore.Mvc;
using BerAuto.Backend.Entities;
using BerAuto.Backend.Services;
using backend.Services.Auth;


namespace BerAuto.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private static List<User> Users = new();
    private readonly IAuthService _authService;
    private readonly IPasswordHasher _passwordHasher;

    public AuthController(IAuthService authService, IPasswordHasher passwordHasher)
    {
        _authService = authService;
        _passwordHasher = passwordHasher;
    }

    [HttpPost("register")]
    public ActionResult<User> Register(RegisterDto request)
    {

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

        Users.Add(newUser);
        return Ok(new { message = "Sikeres regisztráció!", user = newUser.Username });
    }

    [HttpPost("login")]
    public ActionResult<string> Login(LoginDto request)
    {
        var user = Users.FirstOrDefault(u => u.Username == request.Username);

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