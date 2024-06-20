import { configureStore } from '@reduxjs/toolkit';

import sidebarReducer from './sidebar.reducer'; // Import your sidebar reducer

// Create the Redux store
const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
    },
});
export default store;
