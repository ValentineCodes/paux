/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/screens/App';
import {name as appName} from './app.json';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/store';

function Application() {
    return (
        <NativeBaseProvider>
            <NavigationContainer>
                <Provider store={store}>
                    <App />
                </Provider>
            </NavigationContainer>
        </NativeBaseProvider>
    );
}
AppRegistry.registerComponent(appName, () => Application);
