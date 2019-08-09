const getUserReducer = (state = {}, action) => {
    switch(action.type){
        case 'GET':
            return state = action.payload;
        case 'SET':
            return state = action.payload;
        default:
            return state;
    }
}
export default getUserReducer;