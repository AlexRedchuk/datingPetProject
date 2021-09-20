import { LOG_IN, LOG_OUT, LOG_IN_GOOGLE, GET_USER, SET_SOCKET, SET_ONLINE_USERS } from "../actions/types"


const INITIAL_STATE = {
    isSignedIn: null,
    userId: null,
    token: null,
    user: {},
    socket: null,
    onlineUsers: []
}

const authReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case LOG_IN_GOOGLE:
            return { ...state, user: action.payload.user, isSignedIn: false}
        case LOG_IN: 
            return { ...state, isSignedIn: true, userId: action.payload.userId, token: action.payload.token};
        case LOG_OUT: 
            return { ...state, isSignedIn: false, userId: null, token: null, user: {}}
        case GET_USER:
            return { ...state, user: action.payload}
        case SET_SOCKET: 
            return { ...state, socket:  action.payload}
        case SET_ONLINE_USERS: 
            return { ...state, onlineUsers: action.payload}
        default:
            return state; 
    }
}

export default authReducer;