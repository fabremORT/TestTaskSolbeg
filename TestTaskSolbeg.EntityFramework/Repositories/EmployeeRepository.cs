using TestTaskSolbeg.Entities.Entities;
using TestTaskSolbeg.Entities.Interfaces.Repositories;

namespace TestTaskSolbeg.EntityFramework.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private TestTaskDbContext _dbContext;

        public EmployeeRepository(TestTaskDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Create(Employee entity)
        {
            entity.Validate();

            Employee? employee = _dbContext.Employees.FirstOrDefault(e => e.Equals(entity));

            if (employee != null) {
                throw new Exception($"The employee {entity.FirstName} {entity.LastName}, {entity.Sex}, already exists");
            }

            _dbContext.Add(entity);
            _dbContext.SaveChanges();
        }

        public void Delete(IEnumerable<int> entitiesIds)
        {
            IEnumerable<Employee> employeesToDelete = _dbContext.Employees.Where(e => entitiesIds.Contains(e.Id));

            _dbContext.RemoveRange(employeesToDelete);
            _dbContext.SaveChanges();
        }

        public void Edit(Employee entity)
        {
            entity.Validate();

            Employee? employee = _dbContext.Employees.FirstOrDefault(e => e.Equals(entity));

            if (employee == null)
            {
                throw new Exception($"The employee {entity.FirstName} {entity.LastName}, id: {entity.Id}, was not found");
            }

            employee.FirstName = entity.FirstName;
            employee.LastName = entity.LastName;
            employee.Age = entity.Age;
            employee.Sex = entity.Sex;

            _dbContext.Employees.Update(employee);
            _dbContext.SaveChanges();
        }

        public Employee Get(int id)
        {
            Employee? employee = _dbContext.Employees.FirstOrDefault(e => e.Id == id);

            if (employee == null)
            {
                throw new Exception($"The employee with id: {id}, was not found");
            }

            return employee;
        }

        public IEnumerable<Employee> GetAll()
        {
            return _dbContext.Employees;
        }
    }
}
