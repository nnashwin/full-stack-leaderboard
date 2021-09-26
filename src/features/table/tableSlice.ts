// @ts-nocheck
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useAppSelector } from '../../app/hooks';

export const fetchPlayers = createAsyncThunk(
    'table/fetchPlayers',
    async (_params, thunkAPI) => {
        try {
            const response = await fetch(
                'http://localhost:3001/graphql',
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
    "query": `
    {
        players {
            name
            wins
            losses
            gamesPlayed
            rating
        }
}`}),
                }
            );

            let data = await response.json();

            if (response.status === 200) {
                return { ...data };
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (e: any) {
            console.error('Error: ', e);
            return thunkAPI.rejectWithValue(e.response.data);
        }
    });

export const tableSlice = createSlice({
    name: "table",
    initialState: {
        data: {},
        isFetching: false,
        isSuccess: false,
        isError: false,
        errorMessage: ""
    },
    reducers: {
        clearState: (state) => {
            state.isFetching = false;
            state.isSuccess = false;
            state.isError = false;

            return state;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlayers.fulfilled, (state, {payload}) => {
                state.data = payload.data.players;
                state.isFetching = false;
                state.isSuccess = true;
            });
    },
});

export const { clearState } = tableSlice.actions;

export const tableSelector: typeof useAppSelector = state => state.table;