import React, { useState } from 'react';
import { Button, Header, Icon, List, ListContent, Modal, Segment } from 'semantic-ui-react';
import { CreateTaskForm } from '../CreateTask/CreateTaskForm';
import './TaskList.css';


export const TaskList = ({ tasks, deleteTask, changeStatus, editTask }) => {
    const [open, setOpen] = useState({});
    const [editModal, setOpenEditModal] = useState({});
    const [show, setShow] = useState({});

    const openTaskModal = task => {
        setOpen({ ...open, [task]: true });
    };

    const closeTaskModal = task => {
        setOpen({ ...open, [task]: false });
    };

    const openEditModal = task => {
        setOpenEditModal({ ...editModal, [task]: true });
    };

    const closeEditModal = task => {
        setOpenEditModal({ ...editModal, [task]: false });
    };

    const handleUpdate = () => {
        editTask();
    };

    const priorityOptions = [
        {
            key: '1',
            text: 'Low',
            value: 1
        },
        {
            key: '2',
            text: 'Medium',
            value: 2
        },
        {
            key: '3',
            text: 'High',
            value: 3
        },
        {
            key: '4',
            text: 'Very high',
            value: 4
        },
        {
            key: '5',
            text: 'Critical',
            value: 5
        },
    ];

    const normalizeTitle = title => {
        if (title.length > 30) {
            return `${title.substring(0, 30)}...`;
        };
        return title;
    };

    if (!tasks.length) {
        return (
            <Segment placeholder>
                <Header icon>
                    <Icon name='search' />
                    You don`t have any tasks yet.
                </Header>
            </Segment>
        );
    };

    const mouseEnter = (task) => {
        setShow({[task]: true });
    };
    const mouseLeave = (task) => {
        setShow({[task]: false });
    };

    return (
        <Segment color='teal'>
            <List divided className='task-list'>
                {tasks.map(task => {
                    return (
                        <List.Item
                            onMouseEnter={() => mouseEnter(task._id)}
                            onMouseLeave={() => mouseLeave(task._id)}
                            key={task._id}
                            className={task.isDone ? 'done-task' : 'undone-task'} >
                            {show[task._id] &&
                                <ListContent
                                    verticalAlign='middle'
                                    floated='right'>
                                    <Button
                                        icon
                                        color={task.isDone ? 'yellow' : 'green'}
                                        onClick={() => changeStatus(task._id, !task.isDone)}>
                                        {task.isDone ? <Icon name='undo' /> : <Icon name='checkmark' />}
                                    </Button>
                                    <Button
                                        icon
                                        color='teal'
                                        onClick={() => openEditModal(task._id)}>
                                        <Icon name='edit' />
                                    </Button>
                                    <Button
                                        icon
                                        color='red'
                                        onClick={() => deleteTask(task._id)}>
                                        <Icon name='delete' />
                                    </Button>
                                </ListContent>}
                            <List.Content
                                onClick={() => openTaskModal(task._id)}>
                                <div className='list-item'>{task.isDone ? <del>{normalizeTitle(task.title)}</del> : normalizeTitle(task.title)}</div>
                            </List.Content>
                            <Modal
                                size='tiny'
                                open={open[task._id]}
                                onClose={() => closeTaskModal(task._id)}
                                onOpen={() => openTaskModal(task._id)}>
                                <Modal.Header id='detail-modal-header'>Task details</Modal.Header>
                                <Modal.Content id='modal-content'>
                                    <div className='detail-modal-content'>
                                        <h3>Title: {task.title}</h3>
                                        <hr />
                                        <h3>Description: {task.description}</h3>
                                        <hr />
                                        <h3>Priority: {priorityOptions.find(el => el.value === task.priority).text}</h3>
                                        <hr />
                                        <h3>Due date: {new Intl.DateTimeFormat("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "2-digit"
                                        }).format(new Date(task.dueDate))}</h3>
                                    </div>
                                </Modal.Content>
                            </Modal>
                            <Modal
                                size='tiny'
                                open={editModal[task._id]}
                                onClose={() => closeEditModal(task._id)}
                                onOpen={() => openEditModal(task._id)}>
                                <Modal.Header id='detail-modal-header'>Edit task</Modal.Header>
                                <Modal.Content>
                                    <CreateTaskForm
                                        form={{
                                            title: task.title,
                                            description: task.description,
                                            priority: task.priority,
                                            dueDate: new Date(task.dueDate)
                                        }}
                                        id={task._id}
                                        type='edit'
                                        handleClose={() => closeEditModal(task._id)}
                                        handleUpdate={handleUpdate}></CreateTaskForm>
                                </Modal.Content>
                            </Modal>
                        </List.Item>
                    )
                })}
            </List>
        </Segment>
    );
};