import { combineReducers } from 'redux';
import alert from './alert';
import user from './user';
import connected from './connected';

export default combineReducers({
    alert,
    user,
    connected
});