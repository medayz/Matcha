
import { USER_SOCKET } from '../actions/types';

const initialState = [];

export default function(state = initialState, action){
    const { type, payload } = action;
    switch(type) {
        case USER_SOCKET:
            return payload;
        default:
            return state;
    }
}