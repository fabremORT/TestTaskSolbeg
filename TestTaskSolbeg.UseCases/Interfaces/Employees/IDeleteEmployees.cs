
namespace TestTaskSolbeg.UseCases.Interfaces.Employees
{
    public interface IDeleteEmployees
    {
        void Execute(IEnumerable<int> employeesIds);
    }
}
