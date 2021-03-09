import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {One} from "./steps/01Suspense";
import {Two} from "./steps/02UseTransition";
import { Three } from './steps/03UseDeferredValue';
import {Four} from "./steps/04SuspenseList";

function App() {
  return (
    <Router>
      <section className="section">
        <div className="container">
          <ul>
            <li>
              <Link to="/">01 Suspense</Link>
            </li>
            <li>
              <Link to="/02">02 useTransition</Link>
            </li>
            <li>
              <Link to="/03">03 useDeferredValue</Link>
            </li>
            <li>
              <Link to="/04">04 SuspenseList</Link>
            </li>
          </ul>

          <hr/>

          {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        </div>
        <div className="content">
          <Switch>
            <Route exact path="/">
              <One />
            </Route>
            <Route path="/02">
              <Two />
            </Route>
            <Route path="/03">
              <Three />
            </Route>
            <Route path="/04">
              <Four />
            </Route>
          </Switch>
        </div>
      </section>
    </Router>
  );
}

export default App;
