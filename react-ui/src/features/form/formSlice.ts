// @ts-nocheck
// TODO: Work out types to redux-specific code
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Constants from '../../common/constants';
const host = process.env.REACT_APP_SERVER_URL;

export const addPlayer = createAsyncThunk(
  'form/addPlayer',
  async (name: string, thunkAPI) => {
    try {
      const response = await fetch(`${host}/graphql`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
    mutation {
        addPlayer(name: "${name}") {
            name
            id
        }
}`,
        }),
      });

      let data = await response.json();

      if (response.status === 200) {
        return { ...data };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
      // currently, typescript 4.4 uses unknown as a type in the catch statements
      // We use any as we don't have specific type guards currently for these types of errors and don't want to use unknown (we just want a normal error)
      // Post covering the implementation of unknown: https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
    } catch (e: any) {
      console.error('Error: ', e);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const addMatch = createAsyncThunk(
  'form/addMatch',
  async (
    {
      playerId,
      playerName,
      opponentId,
      opponentName,
      finalPlayerScore,
      finalOpponentScore,
      matchTime,
      location,
    }: MatchParams,
    thunkAPI
  ) => {
    if (playerId === opponentId) {
      return thunkAPI.rejectWithValue({
        data: 'player and opponent can not be the same.',
      });
    }
    if (finalPlayerScore === finalOpponentScore) {
      return thunkAPI.rejectWithValue({
        data: 'there can be no ties.  player and opponent scores can not be the same.',
      });
    }
    try {
      const response = await fetch(`${host}/graphql`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
    mutation {
        addMatch(player_id: ${playerId}, playerName: "${playerName}", opponent_id: ${opponentId}, opponentName: "${opponentName}", finalPlayerScore: ${finalPlayerScore}, finalOpponentScore: ${finalOpponentScore}, matchTime:"${matchTime}", location:"${location}") {
            id
        }
}`,
        }),
      });

      let data = await response.json();

      if (response.status === 200) {
        return { ...data };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
      // currently, typescript 4.4 uses unknown as a type in the catch statements
      // We use any as we don't have specific type guards currently for these types of errors and don't want to use unknown (we just want a normal error)
      // Post covering the implementation of unknown: https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
    } catch (e: any) {
      console.error('Error: ', e);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const fetchPlayerIds = createAsyncThunk(
  'form/fetchPlayerIds',
  async (_params, thunkAPI) => {
    try {
      const response = await fetch(`${host}/graphql`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
    {
        players {
            name
            id
        }
}`,
        }),
      });

      let data = await response.json();

      if (response.status === 200) {
        return { ...data };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e: any) {
      console.error('Error: ', e);
      if (e && e.response) {
        return thunkAPI.rejectWithValue(e.response.data);
      }
    }
  }
);

interface PlayerId {
  id: string;
  name: string;
}

export interface FormState {
  errorMessage: string;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  submitSuccess: boolean;
  players: PlayerId[];
}

const initialState: FormState = {
  errorMessage: '',
  isFetching: false,
  isSuccess: false,
  submitSuccess: false,
  isError: false,
  players: [],
};

export const formSlice = createSlice({
  name: 'form',
  initialState: initialState,
  reducers: {
    clearState: (state) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = false;
      state.submitSuccess = false;

      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPlayer.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.isSuccess = true;
        state.submitSuccess = true;
      })
      .addCase(addPlayer.pending, (state, { payload }) => {
        state.isFetching = true;
      })
      .addCase(addPlayer.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = payload.data;
      })
      .addCase(addMatch.fulfilled, (state, { payload }) => {
        state.isFetching = false;
        state.isSuccess = true;
        state.submitSuccess = true;
      })
      .addCase(addMatch.pending, (state, { payload }) => {
        state.isFetching = true;
      })
      .addCase(addMatch.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = payload.data;
      })
      .addCase(fetchPlayerIds.pending, (state, { payload }) => {
        state.isFetching = true;
      })
      .addCase(fetchPlayerIds.fulfilled, (state, { payload }) => {
        state.players = payload.data.players;
        state.isFetching = false;
        state.isSuccess = true;
      });
  },
});

export const { clearState } = formSlice.actions;

export default formSlice.reducer;
