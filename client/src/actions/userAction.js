import uuid from 'uuid';
import { SET_USER } from './types';


export const setUser = (user) => dispatch => {
    const id = uuid.v4();
    dispatch({
        type: SET_USER,
        payload: { msg, id }
    });
};