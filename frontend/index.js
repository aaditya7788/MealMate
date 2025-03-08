import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { polyfillReadableStream } from 'node-fetch';

if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = polyfillReadableStream;
}

AppRegistry.registerComponent(appName, () => App);