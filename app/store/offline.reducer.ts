import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    typ_ids: null as string[] | null,
    user_id: null as string | null,
};

const offlineSlice = createSlice({
    name: 'offline',
    initialState,
    reducers: {
        setState: (state, action) => {
            state.typ_ids = action.payload.typ_ids;
            state.user_id = action.payload.user_id;
        },
    },
});

export const { setState } = offlineSlice.actions;
export default offlineSlice.reducer;
