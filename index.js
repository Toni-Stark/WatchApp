import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import Orientation from 'react-native-orientation-locker';
import { configure } from 'mobx';

LogBox.ignoreLogs(['new NativeEventEmitter']);
configure({
  enforceActions: 'never',
  computedRequiresReaction: false,
  reactionRequiresObservable: false,
  observableRequiresReaction: false,
  disableErrorBoundaries: false
});
const protobuf = require('protobufjs');
protobuf.util.Long = require('long');
protobuf.configure();
Orientation.lockToPortrait();

AppRegistry.registerComponent(appName, () => App);
