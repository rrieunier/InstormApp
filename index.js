/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import History from "./screens/History";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import Icon from "./components/Icon";
import AnalyzeButton from "./components/AnalyzeButton"
import Recognition from "./screens/Recognition";

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('History', () => History);
AppRegistry.registerComponent('Home', () => Home);
AppRegistry.registerComponent('Settings', () => Settings);
AppRegistry.registerComponent('Icon', () => Icon);
AppRegistry.registerComponent('AnalyzeButton', () => AnalyzeButton);
AppRegistry.registerComponent('Recognition', () => Recognition);