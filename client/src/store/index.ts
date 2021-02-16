import { combineReducers, createStore } from 'redux';
import user from './user';

const rootReducer = combineReducers({
    user
});

export type RootReducer = ReturnType<typeof rootReducer>;

const store = createStore(combineReducers({
    user
}));

export default store;