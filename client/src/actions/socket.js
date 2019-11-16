import { USER_SOCKET } from './types';


export const user_socket = (socket) => async dispatch => {
    dispatch({
        type: USER_SOCKET,
        payload: socket
    });
};