import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { useHttp } from '../hooks/http.hook';

export const RegisterPage = () => {
    const emailRegExp = /^[^@\s]+@[^@\s.]+\.[^@.\s]+$/
    const { loading, error, request, clearError } = useHttp();
    const history = useHistory();

    const [form, setForm] = useState({
        email: '',
        username: '',
        password: '',
        passwordConfirm: ''
    });

    const [errorFields, setError] = useState({
        email: '',
        username: '',
        password: '',
        passwordConfirm: ''
    });

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value });
        setError({ ...errorFields, [event.target.name]: '' });
    };

    const errorsHandler = field => {
        const pointing = 'above';
        switch (field) {
            case 0:
                if (errorFields.email) {
                    return {
                        content: errorFields.email,
                        pointing,
                    };
                };
                break;
            case 1:
                if (errorFields.username) {
                    return {
                        content: errorFields.username,
                        pointing,
                    };
                };
                break;
            case 2:
                if (errorFields.password) {
                    return {
                        content: errorFields.password,
                        pointing,
                    };
                };
                break;
            case 3:
                if (errorFields.passwordConfirm) {
                    return {
                        content: errorFields.passwordConfirm,
                        pointing,
                    };
                };
                break;
            default:
                return null;
        }
    }

    const fieldsValidate = () => {
        let formData = { ...form };
        let errorsList = {};
        if (!emailRegExp.test(formData.email)) errorsList = { ...errorsList, email: 'Please enter valid email' };
        if (!formData.email.length) errorsList = { ...errorsList, email: 'Please enter email adress' };
        if (!formData.username.length) errorsList = { ...errorsList, username: 'Please enter username' };
        if (!formData.password.length) errorsList = { ...errorsList, password: 'Please enter password' };
        if (!formData.passwordConfirm.length) errorsList = { ...errorsList, passwordConfirm: 'Please confirm password' };
        if (formData.password && formData.passwordConfirm && formData.password !== formData.passwordConfirm) {
            errorsList = { ...errorsList, passwordConfirm: 'Password do not match' };
        }
        if (formData.password.length < 6) errorsList = { ...errorsList, password: 'Cannot be less than 6 characters' };
        setError(errorsList)
        if (errorsList.email || errorsList.username || errorsList.password || errorsList.passwordConfirm) {
            return false;
        }
        return true;
    }

    const registerHandler = async () => {
        try {
            let check = fieldsValidate();
            let formData = { ...form };
            delete formData.passwordConfirm;
            if (check) {
                clearError();
                const data = await request('/api/auth/register', 'POST', { ...formData });
                if (data) {
                    history.push({
                        pathname: '/',
                        state: { email: form.email }
                    });
                };
            };
        } catch (e) { }
    }

    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    Register your account
                </Header>
                <Form size='large'>
                    <Segment stacked>
                        <Form.Input
                            fluid
                            icon='envelope outline'
                            name='email'
                            iconPosition='left'
                            maxLength='50'
                            onChange={changeHandler}
                            error={errorsHandler(0)}
                            placeholder='E-mail' />
                        <Form.Input
                            fluid
                            icon='user'
                            name='username'
                            iconPosition='left'
                            maxLength='50'
                            onChange={changeHandler}
                            error={errorsHandler(1)}
                            placeholder='Username' />
                        <Form.Input
                            fluid
                            icon='lock'
                            name='password'
                            iconPosition='left'
                            type='password'
                            maxLength='50'
                            onChange={changeHandler}
                            error={errorsHandler(2)}
                            placeholder='Password' />
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Confirm password'
                            name='passwordConfirm'
                            maxLength='50'
                            error={errorsHandler(3)}
                            type='password'
                            onChange={changeHandler}
                        />
                        <Button color='teal' fluid size='large' disabled={loading} onClick={registerHandler}>
                            SIgn up
                        </Button>
                    </Segment>
                </Form>
                {error && <Message
                    error
                    header='Action Forbidden'
                    content={error}
                />}
                <Message>
                    Back to <Link to="/">Login</Link>
                </Message>
            </Grid.Column>
        </Grid>
    );
};