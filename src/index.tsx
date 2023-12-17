import './index.css';
import './reset.css';
/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';
import { Router, Route } from '@solidjs/router';

render(
    () => (
        <Router>
            <Route path="/" component={App} />
        </Router>
    ),
    document.body!
);
