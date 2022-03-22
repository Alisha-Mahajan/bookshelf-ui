import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {toast} from 'react-toastify';
import {AnyObject} from 'yup/lib/types';
import {UserEntryState} from '../../components/UserEntry';
import {User} from '../../shared/models';
import {TokenService} from '../../shared/services/auth.service';

import {RootState} from '../store';
import {AuthThunks} from '../thunks';

type AuthState = {
  user: User;
  isLoading: boolean;
  userEntryState: UserEntryState;
};

const initialState: AuthState = {
  user: null,
  isLoading: false,
  userEntryState: UserEntryState.Closed,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    finalizeAuth: state => {
      state.userEntryState = UserEntryState.Closed;
      state.isLoading = false;
    },
    setModalStateOpen: (state, action: PayloadAction<UserEntryState>) => {
      state.userEntryState = action.payload;
    },
    logout: state => {
      const username = state.user.username;
      state.user = null;
      TokenService.clearTokenPayload();
      toast.success(`${username} logged out successfully`);
    },
  },
  extraReducers: builder =>
    builder.addCase(AuthThunks.me.fulfilled, (state, {payload}: AnyObject) => {
      state.user = new User(payload);
    }),
});

export const authReducer = authSlice.reducer;

export const authSelector = (state: RootState) => state.auth;

export const authActions = authSlice.actions;
