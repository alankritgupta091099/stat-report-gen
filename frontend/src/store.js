import { createStore , applyMiddleware , compose } from "redux";
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const initialState={};

const middleware=[thunk];

const composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ 
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ 
        actionsBlacklist: ['REDUX_STORAGE_SAVE']}) 
    : compose;

//Disable the redux extension in production environment

const store = createStore(
    rootReducer, 
    initialState, 
    composeEnhancers(
        applyMiddleware(...middleware)
    )
);

export default store;