import { USER_SOCKET } from './types';


export const user_socket = (socket) => dispatch => {
    dispatch({
        type: USER_SOCKET,
        payload: socket
    });
};