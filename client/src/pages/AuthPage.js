import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';

export const AuthPage = () => {
    const emailRegExp = /^[^@\s]+@[^@\s.]+\.[^@.\s]+$/;
    const auth = useContext(AuthContext);
    const history = useHistory();
    const location = useLocation();
    const { loading, error, request, clearError } = useHttp();

    const [errorFields, setError] = useState({
        email: '',
        password: ''
    })
    const [form, setForm] = useState({
        email: '',
        password: ''
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
                if (errorFields.password) {
                    return {
                        content: errorFields.password,
                        pointing,
                    };
                };
                break;
            default:
                return null;
        };
    };

    const loginHandler = async () => {
        try {
            let check = fieldsValidate();
            if (check) {
                clearError();
                const data = await request('/api/auth/login', 'POST', { ...form });
                auth.login(data.token, data.userId);
            }
        } catch (e) { };
    };

    useEffect(() => {
        setTimeout(() => {
            history.replace();
        }, 5000)
    }, [history]);

    const fieldsValidate = () => {
        let formData = { ...form };
        let errorsList = {};
        if (!emailRegExp.test(formData.email)) errorsList = { ...errorsList, email: 'Please enter valid email' };
        if (!formData.email.length) errorsList = { ...errorsList, email: 'Please enter email adress' };
        if (!formData.password.length) errorsList = { ...errorsList, password: 'Please enter password' };
        if (formData.password.length < 6) errorsList = { ...errorsList, password: 'Cannot be less than 6 characters' };
        setError(errorsList);
        if (errorsList.password) {
            return false;
        };
        return true;
    };

    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    Log-in to your account
                </Header>
                <Form size='large'>
                    <Segment stacked>
                        <Form.Input
                            fluid icon='user'
                            name='email'
                            maxLength='150'
                            iconPosition='left'
                            onChange={changeHandler}
                            error={errorsHandler(0)}
                            placeholder='E-mail or username' />
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            maxLength='50'
                            placeholder='Password'
                            name='password'
                            type='password'
                            error={errorsHandler(1)}
                            onChange={changeHandler}
                        />
                        <Button
                            disabled={loading}
                            color='teal'
                            fluid
                            size='large'
                            onClick={loginHandler}>
                            Login
                        </Button>
                    </Segment>
                </Form>
                {error && <Message
                    error
                    header='Error occurred'
                    content={error}
                />}
                <Message>
                    New to us? <Link to="/signup">Sign Up</Link>
                </Message>
                {location.state?.success && <Message
                    positive
                    header='Email confirmed.'
                    content='Please log in.'
                />}
                {location.state?.email && <Message
                    positive
                    header='Verify your email'
                    content={`Link was send to ${location.state?.email}`}
                />}
                {location.state?.errorUser && <Message
                    error
                    header='Error occured'
                    content={'Cant find user'}
                />}
            </Grid.Column>
        </Grid>
    );
};