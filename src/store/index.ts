import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Auth from './reducers/Auth';
import Account from './reducers/Accounts';

const persistConfig = {
  key: 'pocket.root.storage',
  version: 1,
  storage: AsyncStorage,
  blacklist: ['account', 'auth'],
};

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
};
const accountPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
};

const reducers = combineReducers({
  auth: persistReducer(authPersistConfig, Auth),
  account: persistReducer(accountPersistConfig, Account),
});
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
