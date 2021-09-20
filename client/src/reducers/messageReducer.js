import { GET_CONVERSATIONS, GET_UNREADMESSAGESCOUNT, 
    GET_CONVERSATIONUSER, GET_MESSAGES, SET_ACTIVECONVERSATION, SEND_ARRIVAL_MESSAGE } from "../actions/types"


const INITIAL_STATE = {
    conversations: [],
    unReadMessageCount: 0,
    conversationUser: {},
    messages: [],
    activeConversation: {}
}

const messageReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case GET_CONVERSATIONS:
            return { ...state, conversations: action.payload}
        case GET_UNREADMESSAGESCOUNT:
            return { ...state, unReadMessageCount: action.payload}
        case GET_CONVERSATIONUSER:
            return { ...state, conversationUser: action.payload}
        case GET_MESSAGES:
            return { ...state, messages: action.payload }
        case SET_ACTIVECONVERSATION:
            return { ...state, activeConversation: action.payload}
        case SEND_ARRIVAL_MESSAGE: 
            return {...state, messages: [...state.messages, action.payload]}
        default:
            return state; 
    }
}

export default messageReducer;