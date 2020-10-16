import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Dimmer, Dropdown, Grid, Loader, Modal, Pagination } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { CreateTaskForm } from '../components/CreateTask/CreateTaskForm';
import { TaskList } from '../components/TaskList/TaskList';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';

export const TasksPage = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const { loading, request } = useHttp();
    const [tasks, setTasks] = useState([]);
    const [totalPages, setTotoalPages] = useState(1);
    const [openCreate, setOpenCreate] = useState(false);
    const [showPagination, setShowPagination] = useState(false);
    const [queryParams, setQueryParams] = useState({ sortBy: 1, page: 1 });

    const sortOptions = [
        {
            key: '1',
            text: 'Active',
            value: 1
        },
        {
            key: '2',
            text: 'Compleated',
            value: 2
        },
        {
            key: '3',
            text: 'Duration',
            value: 3
        },
        {
            key: '4',
            text: 'Priority',
            value: 4
        }
    ];

    const fetchTasks = useCallback(async () => {
        const query = Object.keys(queryParams).map(el => `${el}=${queryParams[el]}`).join('&');
        try {
            const fetched = await request(`/api/tasks?${query}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            });
            setTasks(fetched.tasks);
            setTotoalPages(fetched.totalPages);
            fetched.tasks.length ? setShowPagination(true) : setShowPagination(false);
        } catch (e) { };
    }, [auth.token, request, queryParams]);

    const deleteTask = useCallback(async (id) => {
        try {
            await request(`/api/tasks/${id}`, 'DELETE', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setQueryParams({ ...queryParams, page: 1 });
        } catch (e) { };
    }, [auth.token, request, setQueryParams, queryParams]);

    const changeTaskStatus = useCallback(async (id, isDone) => {
        try {
            await request(`/api/tasks/${id}`, 'PUT', { isDone }, {
                Authorization: `Bearer ${auth.token}`
            })
            fetchTasks();
        } catch (e) { };
    }, [request, auth.token, fetchTasks]);

    const logoutHandler = () => {
        auth.logout();
        history.push('/');
    };

    const handleClose = () => {
        setOpenCreate(false);
    };

    const handleChangePage = node => {
        setQueryParams({ ...queryParams, page: parseInt(node.activePage) });
    };

    const handleSortChange = node => {
        setQueryParams({ ...queryParams, sortBy: parseInt(node.value) });
    };

    const handleTaskStatusToggle = useCallback(async (isDone) => {
        try {
            await request('/api/tasks', 'PUT', { isDone }, {
                Authorization: `Bearer ${auth.token}`
            })
            fetchTasks();
        } catch (e) { };
    }, [request, auth.token, fetchTasks]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks, queryParams]);

    return (
        <Grid style={{ padding: '20px' }} >
            <Grid.Row style={{ padding: '20px' }} >
                <Grid.Column>
                    <Button onClick={() => setOpenCreate(true)} color='teal'>Create a task</Button>
                    <Button color='teal' onClick={() => handleTaskStatusToggle(true)}>All done</Button>
                    <Button color='teal' onClick={() => handleTaskStatusToggle(false)}>All undone</Button>
                    <Dropdown onChange={(_, node) => handleSortChange(node)}
                        placeholder='Sort by'
                        selection
                        defaultValue={1}
                        options={sortOptions}
                    />
                    <Button floated='right' onClick={logoutHandler} color='red'>Logout</Button>
                </Grid.Column>
            </Grid.Row >
            <Grid.Row style={{ padding: '20px' }}>
                <Grid.Column >
                    {loading ?
                        <Dimmer active inverted>
                            <Loader inverted>Loading tasks</Loader>
                        </Dimmer> :
                        <>
                        <TaskList
                            tasks={tasks}
                            deleteTask={deleteTask}
                            changeStatus={changeTaskStatus}
                            editTask={fetchTasks}>
                        </TaskList>
                            {showPagination && <div className='pagination-buttons'>
                                <Pagination
                                    boundaryRange={0}
                                    defaultActivePage={queryParams.page}
                                    ellipsisItem={null}
                                    firstItem={null}
                                    lastItem={null}
                                    siblingRange={1}
                                    totalPages={totalPages}
                                    onPageChange={(e, node) => handleChangePage(node)}
                                />
                            </div>}
                        </>
                    }
                </Grid.Column>
            </Grid.Row>
            <Modal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onOpen={() => setOpenCreate(true)}>
                <Modal.Header id='create-modal-header'>Create task</Modal.Header>
                <Modal.Content>
                    <CreateTaskForm type='create' handleClose={handleClose} handleUpdate={fetchTasks}></CreateTaskForm>
                </Modal.Content>
            </Modal>
        </Grid>
    );
};