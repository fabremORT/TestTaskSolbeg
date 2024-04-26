using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TestTaskSolbeg.EntityFramework.Migrations
{
    /// <inheritdoc />
    public partial class InsertEmployees : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                INSERT INTO Employees (FirstName, LastName, Age, Sex)
                VALUES
                    ('John', 'Doe', 30, 'Male'),
                    ('Jane', 'Smith', 25, 'Female'),
                    ('Alice', 'Johnson', 28, 'Female'),
                    ('Bob', 'Williams', 35, 'Male'),
                    ('Eva', 'Brown', 40, 'Female'),
                    ('Michael', 'Davis', 45, 'Male'),
                    ('Emily', 'Wilson', 33, 'Female'),
                    ('David', 'Martinez', 29, 'Male'),
                    ('Sophia', 'Taylor', 38, 'Female'),
                    ('James', 'Jones', 42, 'Male'),
                    ('Olivia', 'White', 27, 'Female'),
                    ('Daniel', 'Garcia', 31, 'Male'),
                    ('Chloe', 'Anderson', 36, 'Female'),
                    ('William', 'Miller', 39, 'Male'),
                    ('Ava', 'Thompson', 34, 'Female'),
                    ('Alexander', 'Harris', 32, 'Male'),
                    ('Mia', 'Clark', 37, 'Female'),
                    ('Benjamin', 'Lewis', 41, 'Male'),
                    ('Harper', 'King', 26, 'Female'),
                    ('Jacob', 'Lee', 44, 'Male');
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
