import datingBase from "../APIs/datingBase"
import { GET_CONVERSATIONS, GET_UNREADMESSAGESCOUNT, GET_CONVERSATIONUSER, GET_MESSAGES, SET_ACTIVECONVERSATION, SEND_ARRIVAL_MESSAGE } from './types';

export const getConversations = () => {
    return async (dispatch, getState) => {
        const res = await datingBase.get('/api/conversations/');
        dispatch({
            type: GET_CONVERSATIONS,
            payload: res.data
        })
    }
}

export const getUnreadMessageCount = () => {
    return async (dispatch, getState) => {
        const res = await datingBase.get('/api/messages/countUnread')
        dispatch({
            type: GET_UNREADMESSAGESCOUNT,
            payload: res.data
        })
    }
}

export const getConversationUser = (id) => {
    return async (dispatch, getState) => {
        const user = await datingBase.get(`/api/users/${id}`)
        dispatch({
            type: GET_CONVERSATIONUSER,
            payload: user.data
        })
    }
}
//[userId, getState().auth.userId].every(i => el.members.includes(i))
export const setActiveConversationByUserId = (userId) => {
    return (dispatch, getState) => {
        const conversations = getState().messages.conversations;
        const arr = [userId, getState().auth.userId];
        const conversation = conversations.find(el => arr.every(i => el.members.includes(i)))
        dispatch(setActiveConversation(conversation ? conversation : {}))
    }
}

export const setActiveConversation = (conv) => {
    return {
        type: SET_ACTIVECONVERSATION,
        payload: conv
    }
}

export const getMessages = (convId) => {
    return async (dispatch, getState) => {
        const messages = await datingBase.get(`/api/messages/byConversation/${convId}`);
        dispatch({
            type: GET_MESSAGES,
            payload: messages.data
        })
        dispatch(getUnreadMessageCount());
    }
}

export const sendMessage = (message) => {
    return async (dispatch, getState) => {
        await datingBase.post('/api/messages', message)
        const recieverId = getState().messages.activeConversation.members.find(el => el !== getState().auth.userId)
        getState().auth.socket.emit("sendMessage", { recieverId, userId: getState().auth.userId, text: message.text, conversationId: message.conversationId})
        dispatch(getMessages(getState().messages.activeConversation._id))
    }
}

export const sendArrivalMessage = (message) => {
    return async (dispatch, getState) => {
        if(getState().messages.activeConversation._id === message.conversationId) {
            dispatch({
                type: SEND_ARRIVAL_MESSAGE,
                payload: message
            })
        }
    }
}