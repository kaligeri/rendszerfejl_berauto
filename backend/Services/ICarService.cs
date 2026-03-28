using BerAuto.Backend.Entities;

namespace backend.Services
{
    public interface ICarService
    {
        Task<IEnumerable<Car>> GetAllAsync();
        Task<Car?> GetByIdAsync(int id);
        Task<Car> CreateAsync(Car car);
        Task<bool> UpdateAsync(int id, Car car);
        Task<bool> DeleteAsync(int id);
    }
}
