import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { TasksPage } from './pages/TasksPage';
import { AuthPage } from './pages/AuthPage';
import { RegisterPage } from './pages/RegisterPage';
import { ConfirmationCheck } from './pages/ConfirmationCheck';

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/tasks" exact>
                    <TasksPage />
                </Route>
                <Redirect to="/tasks" />
            </Switch>
        );
    };
    return (
        <Switch>
            <Route path="/" exact component={AuthPage}>
            </Route>
            <Route path="/signup" exact component={RegisterPage}>
            </Route>
            <Route path="/confirmation/:token" exact component={ConfirmationCheck}>
            </Route>
            <Redirect to="/" />
        </Switch>
    );
};