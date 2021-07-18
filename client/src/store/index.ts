import { combineReducers, createStore } from 'redux';
import user from './user';
import locale from './locale';

const rootReducer = combineReducers({
    user, locale
});

export type RootReducer = ReturnType<typeof rootReducer>;

const store = createStore(combineReducers({
    user, locale
}));

export default store;