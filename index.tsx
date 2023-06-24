/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/screens/App';
import {name as appName} from './app.json';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import { ToastProvider } from 'react-native-toast-notifications'
import { store } from './src/store';

function Application() {
    return (
        <Provider store={store}>
            <ToastProvider>
                <NativeBaseProvider>
                    <App />
                </NativeBaseProvider>
            </ToastProvider>
        </Provider>
    );
}
AppRegistry.registerComponent(appName, () => Application);