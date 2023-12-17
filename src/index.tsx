import './index.css';
import './reset.css';
/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';
import Tuner from './Tuner';
import { Router, Route } from '@solidjs/router';

render(
    () => (
        <Router>
            <Route path="/" component={App} />
            <Route path="/jons-tuner" component={Tuner} />
        </Router>
    ),
    document.body!
);
