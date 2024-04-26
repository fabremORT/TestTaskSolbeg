
using TestTaskSolbeg.Entities.Entities;

namespace TestTaskSolbeg.UseCases.Interfaces.Employees
{
    public interface IGetEmployee
    {
        Employee Execute(int employeeId);
    }
}
