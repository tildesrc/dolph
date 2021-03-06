import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import PuttCounter from './PuttCounter';
import PuttHistory from './PuttHistory';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import PATHS from './paths';

ReactDOM.render(
  <React.StrictMode>
    <Router basename="/dolph">
      <Switch>
        <Route exact path="/">
          <Redirect to={PATHS.PUTTS.COUNTER} />
        </Route>
        <Route exact path={PATHS.PUTTS.COUNTER}>
          <PuttCounter />
        </Route>
        <Route exact path={PATHS.PUTTS.HISTORY}>
          <PuttHistory />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
