// @ts-nocheck
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useAppSelector } from '../../app/hooks';
import Constants from '../../common/constants';
import { playerColumns, matchColumns } from './columnDefinitions';

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

export const fetchMatches = createAsyncThunk(
    'table/fetchMatches',
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
        matches {
            matchTime
            location
            opponent_id
            player_id
            finalPlayerScore
            finalOpponentScore
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
        columns: [],
        currentTable: '',
        data: {},
        errorMessage: "",
        isFetching: false,
        isSuccess: false,
        isError: false,
        previousTable: ''
    },
    reducers: {
        clearState: (state) => {
            state.isFetching = false;
            state.isSuccess = false;
            state.isError = false;
            state.data = {};
            state.columns = [];

            return state;
        },
    },
    extraReducers: (builder) => {
        // TODO: add error cases when the promises fail for fetch players and fetch matches through the api.
        builder
            .addCase(fetchPlayers.fulfilled, (state, {payload}) => {
                state.columns = playerColumns;
                state.data = payload.data.players;
                state.isFetching = false;
                state.isSuccess = true;
                state.previousTable = state.currentTable;
                state.currentTable = Constants.PLAYER_ENTITY;
            })
            .addCase(fetchPlayers.pending, (state, {payload}) => {
                state.isFetching = true;
            })
            .addCase(fetchMatches.fulfilled, (state, {payload}) => {
                state.columns = matchColumns;
                state.data = payload.data.matches;
                state.isFetching = false;
                state.isSuccess = true;
                state.previousTable = state.currentTable;
                state.currentTable = Constants.MATCHES_ENTITY;
            })
            .addCase(fetchMatches.pending, (state, {payload}) => {
                state.isFetching = true;
            });
    },
});

export const { clearState } = tableSlice.actions;

export const tableSelector: typeof useAppSelector = state => state.table;