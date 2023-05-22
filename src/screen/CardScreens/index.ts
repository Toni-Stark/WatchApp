/**
 * Lesson Page
 * Url ./Lesson
 */
import { ScreenList } from '../index';
import { BlueTooth } from './Home/BlueTooth';
import { BlueToothDetail } from './Home/BlueToothDetail';
import { BlueCharacteristics } from './Home/BlueCharacteristics';
import { BlueServers } from './Home/BlueServers';
import { BlueToothValue } from './Home/BlueToothValue';
import { BlueToothWhite } from './Home/BlueToothWhite';
import { BlueListener } from './Home/BlueListener';
import { WatchStyleSetting } from './Profile/WatchStyleSetting';
import { ClockDial } from './Profile/ClockDial';
import { BloodTest } from './Home/HomeCommon/BloodTest';
import { HeartTest } from './Home/HomeCommon/HeartTest';
import { UserInfo } from './Profile/UserInfo';
import { BindingInfo } from './Profile/BindingInfo';
import { BlueToothDeviceName } from './Home/BlueToothDeviceName';
import { BlueToolsList } from './Home/BlueToolsList';
import { BlueToothName } from './Home/BlueToothName';
import { GeoWeather } from './Home/GeoWeather';
import { BlueToothMessage } from './Home/BlueToothMessage';
import { Permission } from './Profile/Permission';
import { LanguageSet } from './Profile/LanguageSet';
import { MessageControl } from './Profile/MessageControl';
import { HeartSetting } from './Profile/HeartSetting';
import { LongSet } from './Profile/LongSet';
import { LightScreen } from './Profile/LightScreen';

export type ScreensParamList = {
  Login: { message?: string };
  BlueCharacteristics: { index?: string | number; item?: any };
  BlueToothValue: { item?: any };
  BlueToothWhite: { item?: any };
  BlueListener: { item?: any; type?: string };
  BindingInfo: { mac?: string };
  MessageControl: { message: string };
};

export const CardScreens: Array<ScreenList> = [
  { name: 'BlueTooth', component: BlueTooth },
  { name: 'BlueServers', component: BlueServers },
  { name: 'BlueToothDetail', component: BlueToothDetail },
  { name: 'BlueToothValue', component: BlueToothValue },
  { name: 'BlueCharacteristics', component: BlueCharacteristics },
  { name: 'BlueToothWhite', component: BlueToothWhite },
  { name: 'WatchStyleSetting', component: WatchStyleSetting },
  { name: 'BlueListener', component: BlueListener },
  { name: 'ClockDial', component: ClockDial },
  { name: 'BloodTest', component: BloodTest },
  { name: 'HeartTest', component: HeartTest },
  { name: 'UserInfo', component: UserInfo },
  { name: 'BindingInfo', component: BindingInfo },
  { name: 'BlueToothDeviceName', component: BlueToothDeviceName },
  { name: 'BlueToolsList', component: BlueToolsList },
  { name: 'BlueToothName', component: BlueToothName },
  { name: 'GeoWeather', component: GeoWeather },
  { name: 'BlueToothMessage', component: BlueToothMessage },
  { name: 'Permission', component: Permission },
  { name: 'LanguageSet', component: LanguageSet },
  { name: 'MessageControl', component: MessageControl },
  { name: 'HeartSetting', component: HeartSetting },
  { name: 'LongSet', component: LongSet },
  { name: 'LightScreen', component: LightScreen }
];
