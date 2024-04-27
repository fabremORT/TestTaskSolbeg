using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using TestTaskSolbeg.Entities.Interfaces.Validation;

namespace TestTaskSolbeg.Entities.Entities
{
    public class Employee : IEquatable<Employee>
    {
        public int Id { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        [Range(18, 100, ErrorMessage = "Age must be between 18 and 100.")]
        public int Age { get; set; }
        [Required]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public EmployeeSex Sex { get; set; }

        public bool Equals(Employee? other)
        {
            if (other == null)
                throw new ArgumentNullException($"The argument for comparing an {this.GetType()} cannot be null");

            return FirstName.Equals(other.FirstName) && LastName.Equals(other.LastName) && Sex.Equals(other.Sex);
        }
    }
}
