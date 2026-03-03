using BerAuto.Backend.Entities;
using Microsoft.EntityFrameworkCore;
using System;

namespace backend.Data
{
    
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Car> Cars { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Rental> Rentals { get; set; }
        public DbSet<Invoice> Invoices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Car>()
                .HasKey(c => c._id);

            // User - Rental kapcsolat (Egy felhasználónak sok bérlése lehet)
            modelBuilder.Entity<Rental>()
                .HasOne(r => r.User)
                .WithMany(u => u.Rentals)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Car - Rental kapcsolat
            modelBuilder.Entity<Rental>()
                .HasOne(r => r.Car)
                .WithMany()
                .HasForeignKey(r => r.CarId)
                .OnDelete(DeleteBehavior.Restrict);

            // Rental - Invoice kapcsolat (1:1 kapcsolat)
            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.Rental)
                .WithOne()
                .HasForeignKey<Invoice>(i => i.RentalId);

            // Role Enum tárolása szövegként az adatbázisban (opcionális, de olvashatóbb)
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            // Pénzügyi mezők pontossága
            modelBuilder.Entity<Car>().Property(c => c._dailyRate).HasPrecision(18, 2);
            modelBuilder.Entity<Rental>().Property(r => r.TotalCost).HasPrecision(18, 2);
            modelBuilder.Entity<Invoice>().Property(i => i.TotalAmount).HasPrecision(18, 2);
        }
    }
    
}
