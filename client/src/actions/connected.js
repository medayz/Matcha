import { USER_STATE } from './types';


export const user_state = (msg) => dispatch => {
    dispatch({
        type: USER_STATE,
        payload: msg
    });
};