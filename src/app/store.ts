import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { tableSlice } from '../features/table/tableSlice';

export const store = configureStore({
    reducer: {
        table: tableSlice.reducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;