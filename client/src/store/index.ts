import { combineReducers, createStore } from 'redux';
import user from './user';

const store = createStore(combineReducers({
    user
}));

export default store;