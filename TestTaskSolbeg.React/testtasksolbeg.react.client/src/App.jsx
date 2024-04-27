/* eslint-disable react/prop-types */
//import { useEffect, useState } from 'react';
//import './App.css';

//function App() {
//    const [employees, setEmployees] = useState();

//    useEffect(() => {
//        populateEmployeeData();
//    }, []);

//    const contents = employees === undefined
//        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
//        : <table className="table table-striped" aria-labelledby="tabelLabel">
//            <thead>
//                <tr>
//                    <th>Id</th>
//                    <th>Name</th>
//                    <th>Age</th>
//                    <th>Sex</th>
//                </tr>
//            </thead>
//            <tbody>
//                {employees.map(employee =>
//                    <tr key={employee.id}>
//                        <td>{employee.id}</td>
//                        <td>{employee.firstName} {employee.lastName}</td>
//                        <td>{employee.age} years</td>
//                        <td>{employee.sex}</td>
//                    </tr>
//                )}
//            </tbody>
//        </table>;

//    return (
//        <div>
//            <h1 id="tabelLabel">Employees</h1>
//            <p>This component demonstrates fetching data from the server.</p>
//            {contents}
//        </div>
//    );

//    async function populateEmployeeData() {
//        const response = await fetch('employees/GetEmployees');
//        const data = await response.json();
//        setEmployees(data);
//    }
//}

//export default App;

import { useMemo, useState } from 'react';
import {
    MRT_EditActionButtons,
    MantineReactTable,
    // createRow,
    useMantineReactTable,
} from 'mantine-react-table';
import {
    ActionIcon,
    Button,
    Flex,
    Stack,
    Text,
    Title,
    Tooltip,
} from '@mantine/core';
import { ModalsProvider, modals } from '@mantine/modals';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

const Example = () => {
    const [validationErrors, setValidationErrors] = useState({});

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                enableEditing: false,
                size: 80,
            },
            {
                accessorKey: 'firstName',
                header: 'First Name',
                mantineEditTextInputProps: {
                    type: 'text',
                    required: true,
                    error: validationErrors?.firstName,
                    //remove any previous validation errors when employee focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            firstName: undefined,
                        }),
                    //optionally add validation checking for onBlur or onChange
                },
            },
            {
                accessorKey: 'lastName',
                header: 'Last Name',
                mantineEditTextInputProps: {
                    type: 'text',
                    required: true,
                    error: validationErrors?.lastName,
                    //remove any previous validation errors when employee focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            lastName: undefined,
                        }),
                },
            },
            {
                accessorKey: 'age',
                header: 'Age',
                mantineEditTextInputProps: {
                    type: 'number',
                    required: true,
                    error: validationErrors?.age,
                    //remove any previous validation errors when employee focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            age: undefined,
                        }),
                },
            },
            {
                accessorKey: 'sex',
                header: 'Sex',
                editVariant: 'select',
                mantineEditSelectProps: {
                    type: 'select',
                    required: true,
                    error: validationErrors?.sex,
                    data:[
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' },
                    ],
                    //remove any previous validation errors when employee focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            sex: undefined,
                        }),
                },
                //Edit: ({ row, column }) => <Select
                //    label={column.header}
                //    required
                //    value={row.original.sex}
                //    error={validationErrors?.sex}
                //    data={[
                //        { value: 'Male', label: 'Male' },
                //        { value: 'Female', label: 'Female' },
                //    ]}
                //    onFocus={() =>
                //        setValidationErrors({
                //            ...validationErrors,
                //            sex: undefined,
                //        })
                //    }
                ///>,
            },
        ],
        [validationErrors],
    );

    //call CREATE hook
    const { mutateAsync: createEmployee, isLoading: isCreatingEmployee } =
        useCreateEmployee();
    //call READ hook
    const {
        data: fetchedEmployees = [],
        isError: isLoadingEmployeesError,
        isFetching: isFetchingEmployees,
        isLoading: isLoadingEmployees,
    } = useGetEmployees();
    //call UPDATE hook
    const { mutateAsync: updateEmployee, isLoading: isUpdatingEmployee } =
        useUpdateEmployee();
    //call DELETE hook
    const { mutateAsync: deleteEmployee, isLoading: isDeletingEmployee } =
        useDeleteEmployee();

    //CREATE action
    const handleCreateEmployee = async ({ values, exitCreatingMode }) => {
        const newValidationErrors = validateEmployee(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        values.id
        await createEmployee(values);
        exitCreatingMode();
    };

    //UPDATE action
    const handleSaveEmployee = async ({ values, table }) => {
        const newValidationErrors = validateEmployee(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await updateEmployee(values);
        table.setEditingRow(null); //exit editing mode
    };

    //DELETE action
    const openDeleteConfirmModal = (row) =>
        modals.openConfirmModal({
            title: 'Are you sure you want to delete this employee?',
            children: (
                <Text>
                    Are you sure you want to delete {row.original.firstName}{' '}
                    {row.original.lastName}? This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => deleteEmployee(row.original.id),
        });

    const table = useMantineReactTable({
        columns,
        data: fetchedEmployees,
        createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
        editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
        enableEditing: true,
        getRowId: (row) => row.id,
        mantineToolbarAlertBannerProps: isLoadingEmployeesError
            ? {
                color: 'red',
                children: 'Error loading data',
            }
            : undefined,
        mantineTableContainerProps: {
            sx: {
                minHeight: '500px',
            },
        },
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateEmployee,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveEmployee,
        renderCreateRowModalContent: ({ table, row, internalEditComponents }) => {
            return (
                <Stack>
                    <Title order={3}>Create New Employee</Title>
                    {internalEditComponents}
                    <Flex justify="flex-end" mt="xl">
                        <MRT_EditActionButtons variant="text" table={table} row={row} />
                    </Flex>
                </Stack>
            )
        },
        renderEditRowModalContent: ({ table, row, internalEditComponents }) => {
            return (
                <Stack>
                    <Title order={3}>Edit Employee</Title>
                    {internalEditComponents}
                    <Flex justify="flex-end" mt="xl">
                        <MRT_EditActionButtons variant="text" table={table} row={row} />
                    </Flex>
                </Stack>
            )
        },
        renderRowActions: ({ row, table }) => (
            <Flex gap="md">
                <Tooltip label="Edit">
                    <ActionIcon onClick={() => table.setEditingRow(row)}>
                        <IconEdit />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Delete">
                    <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
                        <IconTrash />
                    </ActionIcon>
                </Tooltip>
            </Flex>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Button
                onClick={() => {
                    table.setCreatingRow(true); //simplest way to open the create row modal with no default values
                    //or you can pass in a row object to set default values with the `createRow` helper function
                    // table.setCreatingRow(
                    //   createRow(table, {
                    //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
                    //   }),
                    // );
                }}
            >
                Create New Employee
            </Button>
        ),
        state: {
            isLoading: isLoadingEmployees,
            isSaving: isCreatingEmployee || isUpdatingEmployee || isDeletingEmployee,
            showAlertBanner: isLoadingEmployeesError,
            showProgressBars: isFetchingEmployees,
        },
    });

    return <MantineReactTable table={table} />;
};

//CREATE hook (post new employee to api)
function useCreateEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (employee) => {
            employee.id = 0;
            employee.age = Number(employee.age)
            const response = await fetch('employees/CreateEmployee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employee),
            });

            if (!response.ok) {
                throw new Error('Failed to create employee');
            }

            // If the response is successful, return the data (if any)
            return response.json();
        },
        //client side optimistic update
        onMutate: (newEmployeeInfo) => {
            queryClient.setQueryData(['employees'], (prevEmployees) => [
                ...prevEmployees,
                {
                    ...newEmployeeInfo,
                },
            ]);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['employees'] }), //refetch employees after mutation
    });
}

//READ hook (get employees from api)
function useGetEmployees() {
    return useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            try {
                const response = await fetch('employees/GetEmployees');
                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }
                const data = await response.json();
                return data;
            } catch (error) {
                throw new Error('An error occurred while fetching employees: ' + error.message);
            }
        },
        refetchOnWindowFocus: false,
    });
}

//UPDATE hook (put employee in api)
function useUpdateEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (employee) => {
            employee
            //send api update request here
            await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
            return Promise.resolve();
        },
        //client side optimistic update
        onMutate: (newEmployeeInfo) => {
            queryClient.setQueryData(['employees'], (prevEmployees) =>
                prevEmployees?.map((prevEmployee) =>
                    prevEmployee.id === newEmployeeInfo.id ? newEmployeeInfo : prevEmployee,
                ),
            );
        },
        // onSettled: () => queryClient.invalidateQueries({ queryKey: ['employees'] }), //refetch employees after mutation, disabled for demo
    });
}

//DELETE hook (delete employee in api)
function useDeleteEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (employeeId) => {
            employeeId
            //send api update request here
            await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
            return Promise.resolve();
        },
        //client side optimistic update
        onMutate: (employeeId) => {
            queryClient.setQueryData(['employees'], (prevEmployees) =>
                prevEmployees?.filter((employee) => employee.id !== employeeId),
            );
        },
        // onSettled: () => queryClient.invalidateQueries({ queryKey: ['employees'] }), //refetch employees after mutation, disabled for demo
    });
}

const queryClient = new QueryClient();

const App = () => (
    //Put this with your other react-query providers near root of your app
    <QueryClientProvider client={queryClient}>
        <ModalsProvider>
            <Example />
        </ModalsProvider>
    </QueryClientProvider>
);

export default App;

const validateRequired = (value) => !!value.length;
const validateAgeRange = (value) => value >= 18 && value <= 100;

function validateEmployee(employee) {
    const errors = {
        firstName: '',
        lastName: '',
        age: '',
        sex: ''
    };

    // Validate first name
    if (!validateRequired(employee.firstName)) {
        errors.firstName = 'First Name is Required';
    }

    // Validate last name
    if (!validateRequired(employee.lastName)) {
        errors.lastName = 'Last Name is Required';
    }

    // Validate age
    if (!validateRequired(employee.age)) {
        errors.age = 'Age is required';
    }

    // Validate age range
    else if (!validateAgeRange(employee.age)) {
        errors.age = 'Age must be between 18 and 100';
    }

    /// Validate sex
    if (!validateRequired(employee.sex)) {
        errors.sex = 'Sex is required';
    }

    return errors;
}