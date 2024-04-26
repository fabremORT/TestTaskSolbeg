
using TestTaskSolbeg.Entities.Entities;
using TestTaskSolbeg.Entities.Interfaces.Repositories;
using TestTaskSolbeg.UseCases.Interfaces.Employees;

namespace TestTaskSolbeg.UseCases.UseCases.Employees
{
    public class CreateEmployeeUseCase : ICreateEmployee
    {
        private IEmployeeRepository _employeeRepository;

        public CreateEmployeeUseCase(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public void Execute(Employee employee)
        {
            _employeeRepository.Create(employee);
        }
    }
}
