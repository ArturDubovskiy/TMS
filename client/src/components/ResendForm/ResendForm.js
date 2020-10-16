import React, { useState } from 'react';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';


export const ResendForm = ({ handleResendToken }) => {
    const [email, setEmail] = useState('');
    const emailRegExp = /^[^@\s]+@[^@\s.]+\.[^@.\s]+$/;
    const [errorEmail, setErrorEmail] = useState(null);

    const handleSubmitForm = () => {
        let check = validateEmail();
        if (check) handleResendToken(email);

    };

    const handleChange = event => {
        setEmail(event.target.value);
        setErrorEmail(null);
    };

    const validateEmail = () => {
        if (!emailRegExp.test(email) || !email) {
            setErrorEmail({
                content: 'Enter valid email.',
                pointing: 'above',
            })
            return false;
        };
        setErrorEmail(null);
        return true;
    };

    return (
        <Grid
            textAlign='center'
            style={{ height: '100vh' }}
            verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Segment color='teal' stacked>
                    <Header as='h4' color='teal' textAlign='center'>
                        Not valid or expired token
                    </Header>
                    <Form onSubmit={handleSubmitForm}>
                        <Form.Field>
                            <Form.Input
                                placeholder='Email'
                                iconPosition='left'
                                maxLength='150'
                                icon='envelope outline'
                                error={errorEmail}
                                onChange={handleChange} />

                        </Form.Field>
                        <Button color='teal' type='submit'>Resend token</Button>
                    </Form>
                </Segment>
            </Grid.Column>
        </Grid>
    );
};