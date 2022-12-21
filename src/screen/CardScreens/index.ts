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

export type ScreensParamList = {
  Login: { message?: string };
  BlueCharacteristics: { index?: string | number; item?: any };
  BlueToothValue: { item?: any };
  BlueToothWhite: { item?: any };
  BlueListener: { item?: any; type?: string };
};

export const CardScreens: Array<ScreenList> = [
  { name: 'BlueTooth', component: BlueTooth },
  { name: 'BlueServers', component: BlueServers },
  { name: 'BlueToothDetail', component: BlueToothDetail },
  { name: 'BlueToothValue', component: BlueToothValue },
  { name: 'BlueCharacteristics', component: BlueCharacteristics },
  { name: 'BlueToothWhite', component: BlueToothWhite },
  { name: 'BlueListener', component: BlueListener }
];
