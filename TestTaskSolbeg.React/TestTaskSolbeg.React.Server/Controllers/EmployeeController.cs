using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestTaskSolbeg.Entities;
using TestTaskSolbeg.Entities.Entities;

namespace TestTaskSolbeg.React.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly List<Employee> _employees = new List<Employee>
    {
        new Employee { Id = 1, FirstName = "John", LastName = "Doe", Age = 30, Sex = EmployeeSex.MALE },
        new Employee { Id = 2, FirstName = "Jane", LastName = "Smith", Age = 25, Sex = EmployeeSex.FEMALE }
    };

        // GET: api/employees
        [HttpGet]
        public IActionResult GetEmployees()
        {
            return Ok(_employees);
        }

        // GET: api/employees/1
        [HttpGet("{id}")]
        public IActionResult GetEmployee(int id)
        {
            var employee = _employees.FirstOrDefault(e => e.Id == id);
            if (employee == null)
            {
                return NotFound();
            }
            return Ok(employee);
        }

        // POST: api/employees
        [HttpPost]
        public IActionResult CreateEmployee([FromBody] Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Assign a unique ID (in a real-world scenario, you'd typically use a database-generated ID)
            employee.Id = _employees.Count + 1;

            _employees.Add(employee);

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }

        // PUT: api/employees/1
        [HttpPut("{id}")]
        public IActionResult UpdateEmployee(int id, [FromBody] Employee updatedEmployee)
        {
            var employee = _employees.FirstOrDefault(e => e.Id == id);
            if (employee == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Update employee properties
            employee.FirstName = updatedEmployee.FirstName;
            employee.LastName = updatedEmployee.LastName;
            employee.Age = updatedEmployee.Age;
            employee.Sex = updatedEmployee.Sex;

            return NoContent();
        }

        // DELETE: api/employees/1
        [HttpDelete("{id}")]
        public IActionResult DeleteEmployee(int id)
        {
            var employee = _employees.FirstOrDefault(e => e.Id == id);
            if (employee == null)
            {
                return NotFound();
            }

            _employees.Remove(employee);

            return NoContent();
        }
    }
}
