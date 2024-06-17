using Microsoft.EntityFrameworkCore;

namespace Backend.Entities
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        // public virtual DbSet<User> Users => Set<User>();
        public virtual DbSet<Scenery> Sceneries => Set<Scenery>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Scenery>().ToTable("Sceneries");
        }
    }
}