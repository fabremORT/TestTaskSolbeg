
using Microsoft.EntityFrameworkCore;
using TestTaskSolbeg.Entities;
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
            modelBuilder.Entity<Employee>()
            .Property(e => e.Sex)
            .HasConversion(
                v => v.ToString(),  // Convert enum to string
                v => (EmployeeSex)Enum.Parse(typeof(EmployeeSex), v) // Convert string to enum
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}
