import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isSidebarOpen: false,
};

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

export const { openSidebar, closeSidebar, toggleSidebar } =
    sidebarSlice.actions;
export default sidebarSlice.reducer;
