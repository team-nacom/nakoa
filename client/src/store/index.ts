import { combineReducers, createStore } from 'redux';
import locale from './locale';

const rootReducer = combineReducers({
    locale
});

export type RootReducer = ReturnType<typeof rootReducer>;

const store = createStore(combineReducers({
    locale
}));

export default store;