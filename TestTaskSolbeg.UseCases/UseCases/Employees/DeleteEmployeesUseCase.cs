
using TestTaskSolbeg.Entities.Interfaces.Repositories;
using TestTaskSolbeg.UseCases.Interfaces.Employees;

namespace TestTaskSolbeg.UseCases.UseCases.Employees
{
    public class DeleteEmployeesUseCase : IDeleteEmployees
    {
        private IEmployeeRepository _employeeRepository;

        public DeleteEmployeesUseCase(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public void Execute(IEnumerable<int> employeesIds)
        {
            _employeeRepository.Delete(employeesIds);
        }
    }
}
