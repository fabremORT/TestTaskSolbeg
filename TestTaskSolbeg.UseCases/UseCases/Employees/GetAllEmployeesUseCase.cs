using TestTaskSolbeg.Entities.Entities;
using TestTaskSolbeg.Entities.Interfaces.Repositories;
using TestTaskSolbeg.UseCases.Interfaces.Employees;

namespace TestTaskSolbeg.UseCases.UseCases.Employees
{
    public class GetAllEmployeesUseCase : IGetAllEmployees
    {
        private IEmployeeRepository _employeeRepository;

        public GetAllEmployeesUseCase(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public IEnumerable<Employee> Execute()
        {
            return _employeeRepository.GetAll();
        }
    }
}
