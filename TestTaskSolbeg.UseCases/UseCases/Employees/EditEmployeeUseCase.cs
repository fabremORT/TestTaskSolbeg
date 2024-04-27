using TestTaskSolbeg.Entities.Entities;
using TestTaskSolbeg.Entities.Interfaces.Repositories;
using TestTaskSolbeg.UseCases.Interfaces.Employees;

namespace TestTaskSolbeg.UseCases.UseCases.Employees
{
    public class EditEmployeeUseCase : IEditEmployee
    {
        private IEmployeeRepository _employeeRepository;

        public EditEmployeeUseCase(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public void Execute(Employee employee)
        {
            _employeeRepository.Edit(employee);
        }
    }
}
