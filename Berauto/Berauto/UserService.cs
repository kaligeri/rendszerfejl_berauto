namespace Berauto
{
    public class UserService
    {
        private List<User> _users = new List<User>();

        public bool Register(string username, string email, string password, Role role = Role.User)
        {
            if (_users.Any(u => u.Username == username || u.Email == email))
                return false;

            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = User.HashPassword(password),
                Role = role
            };

            _users.Add(user);
            return true;
        }

        public User Login(string username, string password)
        {
            var user = _users.FirstOrDefault(u => u.Username == username);
            if (user != null && user.VerifyPassword(password))
                return user;

            return null;
        }
    }
}
