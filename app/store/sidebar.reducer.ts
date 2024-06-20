import { createSlice } from '@reduxjs/toolkit';

// Define the initial state for the sidebar
const initialState = {
    isSidebarOpen: false,
};

// Create a Redux slice for managing the sidebar
const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        openSidebar: (state) => {
            state.isSidebarOpen = true;
        },
        closeSidebar: (state) => {
            state.isSidebarOpen = false;
        },
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
    },
});

// Export the actions and reducer
export const { openSidebar, closeSidebar, toggleSidebar } =
    sidebarSlice.actions;
export default sidebarSlice.reducer;
