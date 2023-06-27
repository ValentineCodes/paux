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
import KeyPair from './reducers/KeyPairs';

const persistConfig = {
  key: 'pocket.root.storage',
  version: 1,
  storage: AsyncStorage,
  blacklist: ['keyPair', 'auth'],
};

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
};
const keyPairPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
};

const reducers = combineReducers({
  auth: persistReducer(authPersistConfig, Auth),
  keyPair: persistReducer(keyPairPersistConfig, KeyPair),
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
