import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AnyObject} from 'yup/lib/types';

import {RootState} from '../store';

type AuthState = {
  user: AnyObject;
  isLoading: boolean;
};

const initialState: AuthState = {
  user: null,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const authReducer = authSlice.reducer;

export const authSelector = (state: RootState) => state.auth;

export const authActions = authSlice.actions;
