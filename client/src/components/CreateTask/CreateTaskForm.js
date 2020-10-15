import '../CreateTask/CreateTask.css';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import React, { useContext, useEffect, useState } from 'react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import { Button, Form, Icon, Message, Segment } from 'semantic-ui-react';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';


export const CreateTaskForm = props => {
    const auth = useContext(AuthContext);
    const { loading, error, request, clearError } = useHttp();

    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 1,
        dueDate: ''
    });

    useEffect(() => {
        setForm(props.form);
    }, [props]);

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

    const submitForm = async () => {
        clearError();
        if (props.type === 'create') {
            const data = await request('/api/tasks', 'POST', { ...form }, {
                Authorization: `Bearer ${auth.token}`
            });
            if (data) {
                props.handleUpdate();
                props.handleClose();
            }
        } else {
            const data = await request(`/api/tasks/${props.id}`, 'PATCH', { ...form }, {
                Authorization: `Bearer ${auth.token}`
            });
            if (data) {
                props.handleUpdate();
                props.handleClose();
            }
        }
    }

    const dateHandler = () => {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        return date;
    }

    const changeHandler = (event, node) => {
        if (node) {
            setForm({ ...form, [node.name]: node.value })
        } else {
            setForm({ ...form, [event.target.name]: event.target.value })
        };
    };

    return (
        <div>
            <Form size='large' id='create-form' onSubmit={submitForm}>
                <Segment stacked>
                    <Form.Input
                        required
                        name='title'
                        label='Title'
                        defaultValue={props.form.title}
                        placeholder='Title'
                        maxLength='300'
                        onChange={changeHandler}>

                    </Form.Input>
                    <Form.TextArea
                        required
                        name='description'
                        label='Description'
                        defaultValue={props.form.description}
                        placeholder='Description'
                        maxLength='3000'
                        onChange={changeHandler}>

                    </Form.TextArea>
                    <Form.Dropdown
                        required
                        name='priority'
                        placeholder='Priority'
                        label='Priority'
                        defaultValue={props.form.priority}
                        selection
                        options={priorityOptions}
                        onChange={(e, el) => changeHandler(e, el)}>

                    </Form.Dropdown>
                    <Form.Input label='DueDate' required>
                        <div className='datepicker'>
                            <SemanticDatepicker
                                minDate={dateHandler()}
                                value={props.form.dueDate}
                                showToday={false}
                                name='dueDate'
                                autoComplete='off'
                                onChange={(e, el) => changeHandler(e, el)} />
                        </div>
                    </Form.Input>
                </Segment>
            </Form>
            {error && <Message
                error
                header='Action Forbidden'
                content={error}
            />}
            <div className='modal-btn'>
                <Button
                    icon
                    labelPosition='left'
                    color='teal'
                    loading={loading}
                    disabled={loading}
                    type='submit'
                    form='create-form'>
                    <Icon name='send' />
                    Send
                </Button>
                <Button icon labelPosition='left' color='red' onClick={() => props.handleClose()}>
                    <Icon name='window close outline' />
                    Close
                </Button>
            </div>
        </div>
    );
};