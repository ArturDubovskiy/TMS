import React, { useCallback, useEffect, useState } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { ResendForm } from '../components/ResendForm/ResendForm';

export const ConfirmationCheck = () => {
    const token = useParams().token;
    const history = useHistory();
    const [fetched, setFetch] = useState({});
    const { loading, request, error, clearError, type } = useHttp();

    const handleResendToken = useCallback(async (email) => {
        try {
            const resp = await request('/api/auth/resend', 'POST', { email });
            if (resp) {
                history.push({
                    pathname: '/',
                    state: { email }
                });
            }
            clearError();
        } catch (e) {};
    }, [history, request, clearError]);

    const confirmToken = useCallback(async () => {
        try {
            const fetched = await request(`/api/auth/confirmation/${token}`, 'GET');
            setFetch(fetched);
        } catch (e) {};
    }, [token, request]);

    useEffect(() => {
        confirmToken();
    }, [confirmToken]);

    if (fetched?.type === 'verified' || type === 'already-verified') {
        return (
            <Redirect to={{
                pathname: '/',
                state: { success: true }
            }} />
        );
    };

    if(type === 'no-user') {
        return (
            <Redirect to={{
                pathname: '/',
                state: { errorUser: true }
            }} />
        );
    };

    if (loading) {
        return (
            <div className='loader'>
                <Dimmer active inverted>
                    <Loader content='Loading' />
                </Dimmer>
            </div>
        );
    };

    return (
        <div>
            {type === 'not-verified' && < ResendForm handleResendToken={handleResendToken} error={error} ></ResendForm >}
        </div>
    );
};