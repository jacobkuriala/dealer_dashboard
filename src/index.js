import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

// Reducers
import dealerReducer from "./store/reducers/dealers";
import orderReducer from "./store/reducers/orders";

import indexRoutes from "routes/index.jsx";

import "assets/scss/material-dashboard-pro-react.css?v=1.1.0";

const hist = createBrowserHistory();

const combinedReducer = combineReducers({
   dealerInfo: dealerReducer,
    ordersInfo: orderReducer
});

const store = createStore(combinedReducer, compose(applyMiddleware(thunk)));
ReactDOM.render(
    <Provider store={store}>
      <Router history={hist}>
        <Switch>
          {indexRoutes.map((prop, key) => {
            return <Route path={prop.path} component={prop.component} key={key} render={prop.render} />;
          })}
        </Switch>
      </Router>
    </Provider>,

  document.getElementById("root")
);
