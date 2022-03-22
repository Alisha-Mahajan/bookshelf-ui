import {createAsyncThunk} from '@reduxjs/toolkit';
import {batch} from 'react-redux';

import axios from '../../core/axios';
import environment from '../../Environment/environment';
import {cartActions} from '../slices';

export const getCartItems = createAsyncThunk(
  'cart/getItems',
  async (_, {dispatch, fulfillWithValue, rejectWithValue}) => {
    try {
      dispatch(cartActions.setLoading(true));
      const {data} = await axios.get(`${environment.API_URL}/cart`);
      batch(() => {
        dispatch(cartActions.setLoaded());
        dispatch(cartActions.setItems(data.orderDetails));
      });
      return fulfillWithValue(data as any);
    } catch (err) {
      throw rejectWithValue(err);
    } finally {
      dispatch(cartActions.setLoading(false));
    }
  },
);

export const CartThunks = {getCartItems};
