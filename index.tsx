/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/screens/App';
import {name as appName} from './app.json';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import { store } from './src/store';

function Application() {
    return (
        <Provider store={store}>
            <NativeBaseProvider>
                <App />
            </NativeBaseProvider>
        </Provider>
    );
}
AppRegistry.registerComponent(appName, () => Application);