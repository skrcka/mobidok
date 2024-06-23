import { combineReducers, configureStore } from '@reduxjs/toolkit';

import offlineReducer from './offline.reducer';
import sidebarReducer from './sidebar.reducer';

const rootReducer = combineReducers({
    sidebar: sidebarReducer,
    offline: offlineReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default store;
