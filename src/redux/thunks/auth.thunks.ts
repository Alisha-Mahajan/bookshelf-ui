import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {GoogleLoginResponse} from 'react-google-login';
import {batch} from 'react-redux';
import {toast} from 'react-toastify';
import {AnyObject} from 'yup/lib/types';

import appAxios from '../../core/axios';
import environment from '../../Environment/environment';
import {User} from '../../shared/models';
import {TokenService} from '../../shared/services/auth.service';
import {AuthCreds} from '../../shared/types';
import {authActions} from '../slices';

export const me = createAsyncThunk(
  'auth/me',
  async (_, {fulfillWithValue, rejectWithValue}) => {
    return (
      appAxios
        .get(`${environment.API_URL}/me`)
        // TODO alisha: fetch cart count too
        .then(({data}) => fulfillWithValue(data as User))
        .catch(error => rejectWithValue(error))
    );
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (payload: AuthCreds, {dispatch, fulfillWithValue, rejectWithValue}) => {
    return new Promise((resolve, reject) => {
      appAxios
        .post(`${environment.API_URL}/login`, {
          email: payload.email,
          password: payload.password,
        })
        .then(({data}) => {
          TokenService.setTokenPayload(data);
          batch(() => {
            dispatch(authActions.setLoading(false));
            dispatch(me())
              .unwrap()
              .then((user: AnyObject) => {
                resolve(fulfillWithValue(data) as any);
                toast.success(`Welcome ${user.username}`);
              });
          });
        })
        .catch(error => reject(rejectWithValue(error)))
        .finally(() => {
          dispatch(authActions.finalizeAuth());
        });
    });
  },
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (
    payload: GoogleLoginResponse,
    {dispatch, fulfillWithValue, rejectWithValue},
  ) => {
    return new Promise((resolve, reject) => {
      dispatch(authActions.setLoading(true));
      appAxios
        .post(`${environment.API_URL}/google-login`, {
          token: payload.tokenId,
        })
        .then(({data}) => {
          TokenService.setTokenPayload(data);
          dispatch(me())
            .unwrap()
            .then((user: AnyObject) => {
              resolve(fulfillWithValue(data) as any);
              toast.success(`Welcome ${user.username}`);
            });
        })
        .catch(error => reject(rejectWithValue(error)))
        .finally(() => {
          dispatch(authActions.finalizeAuth());
        });
    });
  },
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (
    payload: AuthCreds & {name: string},
    {dispatch, fulfillWithValue, rejectWithValue},
  ) => {
    return appAxios
      .post(`${environment.API_URL}/signup`, {
        name: payload.name,
        email: payload.email,
        password: payload.password,
      })
      .then(() => {
        dispatch(login({email: payload.email, password: payload.password}))
          .unwrap()
          .then(data => fulfillWithValue(data));
      })
      .catch(error => rejectWithValue(error));
  },
);

export const refresh = createAsyncThunk(
  'auth/refresh',
  async (_, {dispatch, fulfillWithValue}) => {
    return new Promise(resolve => {
      const refreshToken = TokenService.getRefreshToken();
      if (refreshToken) {
        axios
          .post(`${environment.API_URL}/refresh`, {refreshToken})
          .then(({data}) => {
            TokenService.setTokenPayload(data);
            dispatch(me())
              .unwrap()
              .then(() => resolve(fulfillWithValue({}) as any));
          })
          .catch(() => {
            dispatch(authActions.logout);
            return resolve(fulfillWithValue({}) as any);
          });
      }
      resolve(fulfillWithValue({}) as any);
    });
  },
);

export const AuthThunks = {me, login, googleLogin, signUp, refresh};
