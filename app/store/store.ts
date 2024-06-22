import { combineReducers, configureStore } from '@reduxjs/toolkit';

import bleReducer from './ble.reducer';
import sidebarReducer from './sidebar.reducer';

const rootReducer = combineReducers({
    sidebar: sidebarReducer,
    ble: bleReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default store;
