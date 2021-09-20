import { combineReducers } from "redux";
import { reducer as formReducer } from 'redux-form';
import authReducer from "./authReducer";
import likeReducer from "./likeReducer";
import messageReducer from "./messageReducer";

export default combineReducers({
    auth: authReducer,
    like: likeReducer,
    messages: messageReducer,
    form: formReducer
});