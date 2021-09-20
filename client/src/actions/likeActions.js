import datingBase from "../APIs/datingBase"
import { GET_LOVER, GET_POTENTIALS, GET_SYMPHATIES } from "./types";

export const getLover = () => {
    return async (dispatch, getState) => {
        const res = await datingBase.get('/api/likes/getDatingUser');
        dispatch({
            type: GET_LOVER,
            payload: res.data
        })
    }
}

export const like = (id) => {
    return async (dispatch, getState) => {
        const res = await datingBase.get(`/api/likes/like/${id}`)
        dispatch(await getLover())
        dispatch(await getPotentials())
        dispatch(await getSymphaties())
        return res;
    }
}

export const dislike = (id) => {
    return async (dispatch, getState) => {
        const res = await datingBase.get(`/api/likes/dislike/${id}`)
        dispatch(await getLover())
        dispatch(await getPotentials())
        dispatch(await getSymphaties())
        return res;
    }
}

export const getSymphaties = () => {
    return async (dispatch, getState) => {
        const res = await datingBase.get(`/api/likes/getSymphaties`);
        dispatch({
            type: GET_SYMPHATIES,
            payload: res.data
        })
    }
}

export const getPotentials = () => {
    return async (dispatch, getState) => {
        const res = await datingBase.get('/api/likes/getPotentials');
        dispatch({
            type: GET_POTENTIALS,
            payload: res.data
        })
    }
}