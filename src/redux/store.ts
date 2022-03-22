import {AnyAction, combineReducers, configureStore} from '@reduxjs/toolkit';

import {authReducer, loadingReducer} from './slices';

const combineReducer = combineReducers({
  generic: loadingReducer,
  auth: authReducer,
});

const rootReducer = (state, action: AnyAction) => {
  if (['auth/logout/fulfilled', 'auth/logout/rejected'].includes(action.type)) {
    state = undefined;
  }
  return combineReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}),
});

export type RootState = ReturnType<typeof store.getState>;

export type RootDispatch = typeof store.dispatch;

export default store;
