using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Backend.Entities
{
    public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        // Constructor to initialize DbContext with options
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }
        // DbSet representing Scenery entities in the database
        public DbSet<Scenery> Sceneries { get; set; }

        // DbSet representing Collection entities in the database
        public DbSet<Collection> Collections { get; set; }

        // Method to configure relationships and constraints between entities
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure primary key for Collection entity
            modelBuilder.Entity<Collection>()
                .HasKey(c => new { c.UserId, c.SceneryId });

            // Configure relationship between Collection and User entities
            modelBuilder.Entity<Collection>()
                .HasOne(c => c.User)
                .WithMany(u => u.Collection)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure relationship between Collection and Scenery entities
            modelBuilder.Entity<Collection>()
                .HasOne(c => c.Scenery)
                .WithMany()
                .HasForeignKey(c => c.SceneryId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure relationship between User and Scenery entities for uploads
            modelBuilder.Entity<User>()
                .HasMany(u => u.Uploads)
                .WithOne(s => s.User)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete for user uploads

            // Configure table names for entities
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Scenery>().ToTable("Sceneries");
            modelBuilder.Entity<Collection>().ToTable("Collections");
        }
    }
}