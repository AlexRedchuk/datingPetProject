import { GET_LOVER, GET_POTENTIALS, GET_SYMPHATIES } from "../actions/types"

const INITIAL_STATE = {
    datingUser: null,
    symphaties: [],
    potentials: []
}

const poolReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case GET_LOVER:
            return {...state, datingUser: action.payload};
        case GET_SYMPHATIES:
            return {...state, symphaties: action.payload};
        case GET_POTENTIALS:
            return {...state, potentials: action.payload}
        default:
            return state
    }
}

export default poolReducer;