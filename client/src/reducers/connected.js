import { USER_STATE } from '../actions/types';

const initialState = '';

export default function(state = initialState, action){
    const { type, payload } = action;
    switch(type) {
        case USER_STATE:
            return payload;
        default:
            return state;
    }
}