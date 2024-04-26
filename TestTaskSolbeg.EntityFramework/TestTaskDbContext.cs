
using Microsoft.EntityFrameworkCore;
using TestTaskSolbeg.Entities.Entities;

namespace TestTaskSolbeg.EntityFramework
{
    public class TestTaskDbContext : DbContext
    {
        public DbSet<Employee> Employees { get; set; }

        public TestTaskDbContext(DbContextOptions<TestTaskDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure unique constraint for the combination of FirstName and LastName
            modelBuilder.Entity<Employee>()
                .HasIndex(e => new { e.FirstName, e.LastName })
                .IsUnique();

            base.OnModelCreating(modelBuilder);
        }
    }
}
