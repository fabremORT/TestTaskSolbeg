
using Microsoft.EntityFrameworkCore;
using TestTaskSolbeg.Entities.Interfaces.Repositories;
using TestTaskSolbeg.EntityFramework;
using TestTaskSolbeg.EntityFramework.Repositories;
using TestTaskSolbeg.UseCases.Interfaces.Employees;
using TestTaskSolbeg.UseCases.UseCases.Employees;

namespace TestTaskSolbeg.React.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<TestTaskDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("TaskTestDb")));

            // Add services to the container.

            builder.Services.AddControllers();

            // Repositories
            builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();

            // UseCases
            // Employees
            builder.Services.AddScoped<ICreateEmployee, CreateEmployeeUseCase>();
            builder.Services.AddScoped<IEditEmployee, EditEmployeeUseCase>();
            builder.Services.AddScoped<IDeleteEmployees, DeleteEmployeesUseCase>();
            builder.Services.AddScoped<IGetEmployee, GetEmployeeUseCase>();
            builder.Services.AddScoped<IGetAllEmployees, GetAllEmployeesUseCase>();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
