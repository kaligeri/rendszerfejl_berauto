using BerAuto.Backend.Entities;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace BerAuto.Backend.Services;

public class RentalService : IRentalService
{
    private readonly ApplicationDbContext _context;

    public RentalService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Rental>> GetAllRentalsAsync()
    {
        return await _context.Rentals
            .Include(r => r.Car)
            .Include(r => r.User)
            .ToListAsync();
    }

    public async Task<IEnumerable<Rental>> GetUserRentalsAsync(Guid userId)
    {
        return await _context.Rentals
            .Where(r => r.UserId == userId)
            .Include(r => r.Car)
            .ToListAsync();
    }

    public async Task<Rental?> CreateRentalAsync(Rental rental)
    {

        var car = await _context.Cars.FindAsync(rental.CarId);
        if (car == null) return null;

        if (rental.StartDate < DateTime.Now.Date || rental.EndDate <= rental.StartDate)
        {
            return null;
        }

        bool isCarBusy = await _context.Rentals.AnyAsync(r =>
            r.CarId == rental.CarId &&
            r.Status != RentalStatus.Cancelled &&
            r.Status != RentalStatus.Rejected &&
            r.StartDate < rental.EndDate &&
            rental.StartDate < r.EndDate
        );

        if (isCarBusy) return null;

        int rentalDays = (rental.EndDate.Date - rental.StartDate.Date).Days;
        if (rentalDays == 0) rentalDays = 1;

        rental.TotalCost = rentalDays * car.DailyRate;

        rental.Status = RentalStatus.Pending;
        _context.Rentals.Add(rental);
        await _context.SaveChangesAsync();

        return rental;
    }

    public async Task<bool> UpdateStatusAsync(int rentalId, RentalStatus newStatus)
    {
        var rental = await _context.Rentals.FindAsync(rentalId);
        if (rental == null) return false;

        rental.Status = newStatus;

        await _context.SaveChangesAsync();
        return true;
    }
}