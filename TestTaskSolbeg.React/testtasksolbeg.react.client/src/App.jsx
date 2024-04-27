import { useMemo, useState } from 'react';
import {
    MRT_EditActionButtons,
    MaterialReactTable,
    // createRow,
    useMaterialReactTable,
} from 'material-react-table';
import {
    Text,
    Group
} from '@mantine/core';
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
} from '@mui/material';
import { ModalsProvider, modals } from '@mantine/modals';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
                Edit: () => null
            },
            {
                accessorKey: 'fullName',
                header: 'Full Name',
                enableEditing: false,
                Cell: ({ row }) => {
                    return (
                        <>
                            {row.original.firstName} {row.original.lastName}
                        </>
                    )
                },
                Edit: () => null,
                muiEditTextFieldProps: {
                    type: 'text',
                },
            },
            {
                accessorKey: 'firstName',
                header: 'First Name',
                enableHiding: false,
                visibleInShowHideMenu: false,
                muiEditTextFieldProps: {
                    type: 'text',
                    required: true,
                    error: validationErrors?.firstName,
                    helperText: validationErrors?.firstName,
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
                enableHiding: false,
                visibleInShowHideMenu: false,
                muiEditTextFieldProps: {
                    type: 'text',
                    required: true,
                    error: validationErrors?.lastName,
                    helperText: validationErrors?.lastName,
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
                Cell: ({ cell }) => (
                    <>
                        {cell.getValue()} years
                    </>
                )
                ,
                muiEditTextFieldProps: {
                    type: 'number',
                    required: true,
                    error: validationErrors?.age,
                    helperText: validationErrors?.age,
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
                editSelectOptions: [
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                ],
                muiEditTextFieldProps: {
                    type: 'select',
                    required: true,
                    error: validationErrors?.sex,
                    helperText: validationErrors?.sex,
                    data: [
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
    const openDeleteConfirmModal = (rows) =>
        modals.openConfirmModal({
            title: rows.length == 1 ? 'Are you sure you want to delete this employee?' : '',
            children: (
                <>
                    {
                        rows.length == 1 && 
                        <Text>
                            Are you sure you want to delete {rows[0].original.firstName}{' '}
                            {rows[0].original.lastName}? This action cannot be undone.
                        </Text>
                    }
                    {
                        rows.length > 1 &&
                        <Text>
                            Are you sure you want to delete {rows.length} employees? This action cannot be undone.
                        </Text>
                    }
                    
                </>
            )
            ,
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => {
                const employeesIds = rows.map(r => r.id)
                deleteEmployee(employeesIds)
            },
        });

    const table = useMaterialReactTable({
        columns,
        data: fetchedEmployees,
        createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
        editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
        enableEditing: true,
        enableRowSelection: true,
        getRowId: (row) => row.id,
        initialState: {
            columnVisibility: {
                firstName: false,
                lastName: false
            }
        },
        positionActionsColumn: 'last',
        muiToolbarAlertBannerProps: isLoadingEmployeesError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        muiTableContainerProps: {
            sx: {
                minHeight: '500px',
            },
        },
        muiTableBodyProps: {
            sx: {
                //stripe the rows, make odd rows a darker color
                '& tr:nth-of-type(odd) > td': {
                    backgroundColor: '#f5f5f5',
                },
            },
        },
        autoResetPageIndex: false,
        muiPaginationProps: {
            rowsPerPageOptions: [5, 10, 20],
        },
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateEmployee,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveEmployee,
        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => {
            return (
                <>
                    <DialogTitle variant="h3">Create New Employee</DialogTitle>
                    <DialogContent
                        sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    >
                        {internalEditComponents} {/* or render custom edit components here */}
                    </DialogContent>
                    <DialogActions>
                        <MRT_EditActionButtons variant="text" table={table} row={row} />
                    </DialogActions>
                </>
            )
        },
        renderEditRowDialogContent: ({ table, row, internalEditComponents }) => {
            return (
                <>
                    <DialogTitle variant="h3">Edit Employee</DialogTitle>
                    <DialogContent
                        sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                    >
                        {internalEditComponents} {/* or render custom edit components here */}
                    </DialogContent>
                    <DialogActions>
                        <MRT_EditActionButtons variant="text" table={table} row={row} />
                    </DialogActions>
                </>
            )
        },
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Edit">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => openDeleteConfirmModal([row])}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
        renderTopToolbarCustomActions: ({ table }) => {
            console.log(table.getState().rowSelection);
            console.log(table.getSelectedRowModel().rows);
            return (
                <Group>
                    <Button
                        variant="contained"
                        onClick={() => {
                            table.setCreatingRow(true); 
                        }}
                    >
                        Create New Employee
                        </Button>
                    {table.getSelectedRowModel().rows.length > 0 &&
                        <Tooltip title="Delete Selected Employees">
                            <IconButton color="error" onClick={() => openDeleteConfirmModal(table.getSelectedRowModel().rows)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    }
                </Group>
            )
        },
        //renderToolbarAlertBannerContent: ({ table }) => (
        //    <Tooltip title="Delete Selected Employees">
        //        <IconButton color="error" onClick={() => openDeleteConfirmModal(table.getSelectedRowModel().rows)}>
        //            <DeleteIcon />
        //        </IconButton>
        //    </Tooltip>
        //),
        state: {
            isLoading: isLoadingEmployees,
            isSaving: isCreatingEmployee || isUpdatingEmployee || isDeletingEmployee,
            showAlertBanner: isLoadingEmployeesError,
            showProgressBars: isFetchingEmployees,
        },
    });

    return <MaterialReactTable table={table} />;
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
            employee.id = Number(employee.id);
            employee.age = Number(employee.age)
            const response = await fetch(`employees/editEmployee/${employee.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employee),
            });

            if (!response.ok) {
                throw new Error('Failed to update employee');
            }
        },
        //client side optimistic update
        onMutate: (newEmployeeInfo) => {
            queryClient.setQueryData(['employees'], (prevEmployees) =>
                prevEmployees?.map((prevEmployee) =>
                    prevEmployee.id === newEmployeeInfo.id ? newEmployeeInfo : prevEmployee,
                ),
            );
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['employees'] }), //refetch employees after mutation
    });
}

//DELETE hook (delete employee in api)
function useDeleteEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (employeesIds) => {
            const response = await fetch(`employees/deleteEmployees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeesIds)
            });

            if (!response.ok) {
                throw new Error('Failed to delete employee');
            }
        },
        //client side optimistic update
        onMutate: (employeeId) => {
            queryClient.setQueryData(['employees'], (prevEmployees) =>
                prevEmployees?.filter((employee) => employee.id !== employeeId),
            );
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['employees'] }), //refetch employees after mutation
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

const validateRequired = (value) => value;
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

//TODO: multiple delete