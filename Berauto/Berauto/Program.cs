using Berauto;

class Program
{
    static void Main(string[] args)
    {
        UserService userService = new UserService();

        // Regisztráció
        bool success = userService.Register("admin", "admin@car.hu", "Admin123", Role.Admin);
        Console.WriteLine(success ? "Sikeres regisztráció" : "Sikertelen regisztráció");

        // Bejelentkezés
        var user = userService.Login("admin", "Admin123");

        if (user != null)
        {
            Console.WriteLine($"Sikeres bejelentkezés: {user.Username}");
            Console.WriteLine($"Szerepkör: {user.Role}");
        }
        else
        {
            Console.WriteLine("Hibás felhasználónév vagy jelszó");
        }
    }
}