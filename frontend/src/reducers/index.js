import { combineReducers } from 'redux';

import authReducer from './authReducer';
import errorReducer from './errorReducer';
import notificationsReducer from './notificationsReducer';

export default combineReducers({
    auth:authReducer,
    error:errorReducer,
    notification:notificationsReducer
})
