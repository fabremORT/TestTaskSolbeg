using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestTaskSolbeg.Entities;
using TestTaskSolbeg.Entities.Entities;
using TestTaskSolbeg.UseCases.Interfaces.Employees;

namespace TestTaskSolbeg.React.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly ICreateEmployee _createEmployee;
        private readonly IEditEmployee _editEmployee;
        private readonly IDeleteEmployees _deleteEmployees;
        private readonly IGetEmployee _getEmployee;
        private readonly IGetAllEmployees _getAllEmployees;

        public EmployeesController(ICreateEmployee createEmployee, IEditEmployee editEmployee, IDeleteEmployees deleteEmployees, IGetEmployee getEmployee, IGetAllEmployees getAllEmployees)
        {
            _createEmployee = createEmployee;
            _editEmployee = editEmployee;
            _deleteEmployees = deleteEmployees;
            _getEmployee = getEmployee;
            _getAllEmployees = getAllEmployees;
        }

        // GET: employees/GetEmployees
        [HttpGet]
        [Route("GetEmployees")]
        public IActionResult GetEmployees()
        {
            try
            {
                var allEmployees = _getAllEmployees.Execute();

                return Ok(allEmployees);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching employees: " + ex.Message);
            }
        }

        // GET: employees/GetEmployees/1
        [HttpGet("GetEmployee/{id}")]
        public IActionResult GetEmployee(int id)
        {
            try
            {
                var employee = _getEmployee.Execute(id);

                if (employee == null)
                {
                    return NotFound();
                }

                return Ok(employee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // POST: employees/CreateEmployee
        [HttpPost("CreateEmployee")]
        public IActionResult CreateEmployee([FromBody] Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newEmployee = new Employee
            {
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                Age = employee.Age,
                Sex = employee.Sex,
            };

            _createEmployee.Execute(newEmployee);

            return CreatedAtAction(nameof(GetEmployee), new { id = newEmployee.Id }, newEmployee);
        }

        // PUT: employees/EditEmployee/1
        [HttpPut("EditEmployee/{id}")]
        public IActionResult UpdateEmployee(int id, [FromBody] Employee updatedEmployee)
        {
            var employee = _getEmployee.Execute(id);

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

            _editEmployee.Execute(employee);

            return NoContent();
        }

        // DELETE: employees/DeleteEmployee/1
        [HttpPost("DeleteEmployees")]
        public IActionResult DeleteEmployee(IEnumerable<int> ids)
        {
            _deleteEmployees.Execute(ids);

            return NoContent();
        }
    }
}
