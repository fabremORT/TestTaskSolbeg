import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [employees, setEmployees] = useState();

    useEffect(() => {
        populateEmployeeData();
    }, []);

    const contents = employees === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Sex</th>
                </tr>
            </thead>
            <tbody>
                {employees.map(employee =>
                    <tr key={employee.id}>
                        <td>{employee.id}</td>
                        <td>{employee.firstName} {employee.lastName}</td>
                        <td>{employee.age} years</td>
                        <td>{employee.sex}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
            <h1 id="tabelLabel">Employees</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );
    
    async function populateEmployeeData() {
        const response = await fetch('employees/GetEmployees');
        const data = await response.json();
        setEmployees(data);
    }
}

export default App;