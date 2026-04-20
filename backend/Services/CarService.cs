using backend.Data;
using BerAuto.Backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System;

namespace backend.Services
{
    public class CarService : ICarService
    {
        private readonly ApplicationDbContext _context;

        public CarService(ApplicationDbContext context)
        {
            _context = context;
        }

        
        public async Task<IEnumerable<Car>> GetAllAsync() => await _context.Cars.ToListAsync();

        public async Task<Car?> GetByIdAsync(int id) => await _context.Cars.FindAsync(id);

        public async Task<Car> CreateAsync(Car car)
        {
            _context.Cars.Add(car);
            await _context.SaveChangesAsync();
            return car;
        }

        public async Task<bool> UpdateAsync(int id, Car car)
        {
            var existingCar = await _context.Cars.FindAsync(id);
            if (existingCar == null) return false;

            existingCar.Brand = car.Brand;
            existingCar.LicensePlate = car.LicensePlate;
            existingCar.FuelType = car.FuelType;
            existingCar.Transmission = car.Transmission;
            existingCar.PassengerCapacity = car.PassengerCapacity;
            existingCar.DailyRate = car.DailyRate;
            existingCar.IsAvailable = car.IsAvailable;
            existingCar.ImageUrl = car.ImageUrl;
            existingCar.Description = car.Description;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null) return false;

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
