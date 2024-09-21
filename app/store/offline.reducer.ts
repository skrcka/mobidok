import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import State from './states';
import { OFFLINE_URL } from '../constants/const';

export const loadOfflineMode = createAsyncThunk(
    'offline/loadOfflineMode',
    async () => {
        const offlinePage = AsyncStorage.getItem('offlinePage');
        try {
            const result = await axios.get(OFFLINE_URL);
            const newOfflinePage = result.data;
            console.log('Offline page loaded', newOfflinePage);
            AsyncStorage.setItem('offlinePage', newOfflinePage);
            return newOfflinePage;
        } catch (e) {
            console.error('Error loading offline mode', e);
            return offlinePage;
        }
    }
);

const initialState = {
    offlinePage: null as string | null,
    state: State.Idle,
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
    extraReducers: (builder) => {
        builder
            .addCase(loadOfflineMode.fulfilled, (state, action) => {
                state.state = State.Success;
                state.offlinePage = action.payload;
            })
            .addCase(loadOfflineMode.pending, (state) => {
                state.state = State.Loading;
            })
            .addCase(loadOfflineMode.rejected, (state) => {
                state.state = State.Error;
            });
    },
});

export const { setState } = offlineSlice.actions;
export default offlineSlice.reducer;
