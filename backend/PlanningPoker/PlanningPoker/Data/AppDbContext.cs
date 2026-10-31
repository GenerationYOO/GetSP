using Microsoft.EntityFrameworkCore;
using PlanningPoker.Models;

namespace PlanningPoker.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> dbContextOptions) : base(dbContextOptions)
        { }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
    }
}
