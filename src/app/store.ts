import { combineReducers, configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { tableSlice } from '../features/table/tableSlice';
import { formSlice } from '../features/form/formSlice';

const reducer = combineReducers({form: formSlice.reducer, table: tableSlice.reducer});
    
export const store = configureStore({
    reducer: reducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;