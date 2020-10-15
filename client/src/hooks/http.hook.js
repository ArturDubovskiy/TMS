import { useState, useCallback } from 'react';
import { useAuth } from './auth.hook';

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const {logout} = useAuth();
    const [error, setError] = useState(null);
    const [type, setType] = useState(null);
    const wrongMessage = 'Something went wrong. Try again later.';

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);
        try {

            if(body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(url, { method, body, headers });
            const data = await response.json();

            if (response.status === 401) {
                logout();
            }

            if (!response.ok) {
                if(data.type) setType(data.type);
                throw new Error(data.message || wrongMessage);
            }
            setLoading(false);
            return data
        } catch (e) {
            setLoading(false);
            setError(e.message);
        }
    }, [logout]);

    const clearError = useCallback(() => {
        setError(null);
        setType(null);
    }, []);

    return { loading, request, error, type, clearError };
}