using BerAuto.Backend.Entities;

namespace BerAuto.Backend.Services;

public interface IRentalService
{

    Task<IEnumerable<Rental>> GetAllRentalsAsync();


    Task<IEnumerable<Rental>> GetUserRentalsAsync(Guid userId);

    Task<Rental?> CreateRentalAsync(Rental rental);

    Task<bool> UpdateStatusAsync(int rentalId, RentalStatus newStatus);
}