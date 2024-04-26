
using TestTaskSolbeg.Entities.Entities;

namespace TestTaskSolbeg.UseCases.Interfaces.Employees
{
    public interface IGetAllEmployees
    {
        IEnumerable<Employee> Execute();
    }
}
