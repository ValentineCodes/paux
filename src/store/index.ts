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
import Networks from './reducers/Networks';

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
};
const networksConfig = {
  key: 'networks',
  storage: AsyncStorage,
};

const reducers = combineReducers({
  auth: persistReducer(authPersistConfig, Auth),
  networks: persistReducer(networksConfig, Networks),
});

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
