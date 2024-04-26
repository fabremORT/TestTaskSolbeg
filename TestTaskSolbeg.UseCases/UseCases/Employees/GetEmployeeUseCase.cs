using TestTaskSolbeg.Entities.Entities;
using TestTaskSolbeg.Entities.Interfaces.Repositories;
using TestTaskSolbeg.UseCases.Interfaces.Employees;

namespace TestTaskSolbeg.UseCases.UseCases.Employees
{
    public class GetEmployeeUseCase : IGetEmployee
    {
        private IEmployeeRepository _employeeRepository;

        public GetEmployeeUseCase(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public Employee Execute(int employeeId)
        {
            return _employeeRepository.Get(employeeId);
        }
    }
}
