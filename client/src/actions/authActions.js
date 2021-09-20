import datingBase from "../APIs/datingBase";
import history from "../history";
import { setAuthHeader } from "../utils/AuthHeader";
import { LOG_IN, LOG_OUT, LOG_IN_GOOGLE, GET_USER, SET_SOCKET, SET_ONLINE_USERS} from "./types";

const storageName = "userData";
const googleStorage = 'googleUser';


export const logIn = formValues => {
    return async (dispatch, getState) => {
        const response =  await datingBase.post('/api/users/login', formValues);
        const expDate = new Date( new Date().getTime() + response.data.expiresIn * 1000);
        setAuthHeader(response.data.token);
        localStorage.setItem(storageName, JSON.stringify({
            userId: response.data.userId, token: response.data.token,
            expDate
        }))
        
        dispatch({
            type: LOG_IN,
            payload: response.data
        })
        history.push('/home');
    }
}

export const authGoogle = formValues => {
    return async (dispatch, getState) => {
        const response = await datingBase.post('/api/users/googleAuth', { googleId: formValues.googleId});
        if(response.data === 'Unregistered') {
            history.push('/register')
            localStorage.setItem(googleStorage, JSON.stringify(formValues));
            dispatch( {
                type: LOG_IN_GOOGLE,
                payload: { user: formValues}
            })
            return
        }
        const expDate = new Date( new Date().getTime() + response.data.expiresIn * 1000);
        localStorage.setItem(storageName, JSON.stringify({
            userId: response.data.userId, token: response.data.token,
            expDate
        }))
        setAuthHeader(response.data.token);
        
        dispatch({
            type: LOG_IN,
            payload: response.data
        })
        history.push('/home');
    }
}

export const registerGoogle = formValues => {
    return async (dispatch, getState) => {
        await datingBase.post('/api/users/registerGoogle', formValues, { headers: {
            'Content-Type': 'multipart/form-data'
        }}).then( data => {
            dispatch(authGoogle(data.data))
            history.push('/home')
        })
    }

}

export const register = formValues => {
    return async (dispatch, getState) => {
        await datingBase.post('/api/users/register', formValues, { headers: {
            'Content-Type': 'multipart/form-data'
        }}).then( data => {
            dispatch(logIn(data.data))
            history.push('/home')
        })
    }

}


export const checkLogIn = () => {
    const googleData = JSON.parse(localStorage.getItem(googleStorage))
    const data = JSON.parse(localStorage.getItem(storageName))  
    if(data && data.token) {
        if(new Date() > new Date(data.expDate)) {
            localStorage.removeItem(storageName);
            setAuthHeader(null);
            if(googleStorage) {
                localStorage.removeItem(googleStorage);
                if(window.gapi.auth2.getAuthInstance()) {
                    window.gapi.auth2.getAuthInstance().signOut()
                }
                return {
                    type: LOG_OUT
                }
            }
            return {
                type: LOG_OUT
            }
        }
        setAuthHeader(data.token)
        return {
            type: LOG_IN,
            payload: data
        }
    }
    if(googleData) {
        return {
            type: LOG_IN_GOOGLE,
            payload: {user: googleData}
        }
    }
    return {
        type: LOG_OUT
    }
}

export const logOut = () => {
    return async (dispatch, getState) => {
        localStorage.removeItem(storageName)
        localStorage.removeItem(googleStorage)
        setAuthHeader(null);
        getState().auth.socket?.disconnect();
        if(await window.gapi.auth2.getAuthInstance()) {
            await window.gapi.auth2.getAuthInstance().signOut()
        }
        dispatch( {
            type: LOG_OUT
        });
    }
    
}

export const getUser = () => {
    return async (dispatch, getState) => {
        const user = await datingBase.get(`/api/users/${getState().auth.userId}`)
        dispatch({
            type: GET_USER,
            payload: user.data
        })
    }
}

export const deleteUser = () => {
    return async (dispatch, getState) => {
        await datingBase.delete(`/api/users/${getState().auth.userId}`);
        dispatch(logOut());
    }
}

export const setSocket = (io) => {
    return {
        type: SET_SOCKET,
        payload: io
    }
}

export const setOnlineUsers = (users) => {
    return {
        type: SET_ONLINE_USERS,
        payload: users
    }
}
