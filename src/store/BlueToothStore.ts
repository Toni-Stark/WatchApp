import { action, makeAutoObservable, observable } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import i18n from 'i18n-js';
import { Appearance, Platform, StatusBar } from 'react-native';
import { APP_COLOR_MODE, APP_LANGUAGE } from '../common/constants';
import { baseToHex, regCutString, stringToByte, t } from '../common/tools';
import { darkTheme, theme } from '../common/theme';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

export type AppColorModeType = 'light' | 'dark' | 'system';
export type AppLanguageType = 'zh' | 'en' | 'system';
export class BlueToothStore {
  readonly defaultLanguage: AppLanguageType = 'zh';
  readonly defaultColorMode = Appearance.getColorScheme() === 'light' ? 'light' : 'dark';
  @observable showBootAnimation: boolean = true;
  @observable manager: any = true;
  @observable devicesInfo: any;
  @observable servicesDevices: any = [];
  @observable characteristics: any = [];

  @observable writeId: any;
  @observable notifyId: any;

  @observable blueToothListener: any;
  @observable blueListenerList: any[] = [];

  @observable blueRootList: any[] = [];
  @observable blueRootInfo: any = {};

  @observable device: any = {};

  constructor() {
    makeAutoObservable(this);
  }

  @action
  async setManagerInit() {
    this.manager = new BleManager();
  }

  @action
  async sendActiveMessage(params) {
    const { value, data } = params;
    let storeRes = regCutString(value);
    let buffer = Buffer.from(stringToByte(storeRes)).toString('base64');
    await this.devicesInfo.writeCharacteristicWithResponseForService(data.serviceUUID, data.uuid, buffer);
  }

  @action
  async listenActiveMessage(params) {
    const { data } = params;
    this.devicesInfo.monitorCharacteristicForService(data.serviceUUID, data.uuid, (error, characteristic) => {
      let value = baseToHex(characteristic.value);
      this.blueRootList = [...this.blueRootList, value];
      // console.log(getBatteryService(characteristic.value));
      if (value.slice(0, 2) === 'a1') this.setBasicInfo(value);
    });
  }

  @action
  async setBasicInfo(val) {
    let res = await this.devicesModules(val);
    console.log(res);
  }

  @action
  async getDescriptorsForDeviceInfo(params) {
    const { data } = params;
    const result = await this.manager.descriptorsForDevice(data.deviceID, data.serviceUUID, data.uuid);
    console.log(result);
    this.blueRootInfo = {
      deviceID: 'EF:39:16:32:92:F7',
      serviceUUID: 'F0080001-0451-4000-B000-000000000000',
      characteristicUUID: 'f0080002-0451-4000-b000-000000000000',
      uuid: '00002902-0000-1000-8000-00805f9b34fb'
    };
  }

  @action
  async devicesModules(val) {
    let hex = parseInt(val.slice(0, 2), 16) - 256;
    let params = {
      '-95': (e) => {
        let battery = e.match(/([\d\D]{2})/g);
        return {
          power: parseInt(battery[4], 16)
        };
      }
    };
    this.device[hex] = params[hex](val);
    return this.device;
  }

  @action
  async setI18nConfig(language: AppLanguageType | string | null, saveSetting: boolean = true) {
    let selectedLanguage, saveLanguage;
    switch (language) {
      case 'zh':
        selectedLanguage = language;
        saveLanguage = language;
        break;
      case null:
        saveLanguage = 'system';
        break;
      default:
        selectedLanguage = this.defaultLanguage;
        saveLanguage = 'system';
    }
    t.cache.clear();
    i18n.locale = selectedLanguage;
    if (saveSetting) {
      await AsyncStorage.setItem(APP_LANGUAGE, saveLanguage);
    }
  }

  @action
  async setColorModeConfig(params: {
    isSys: boolean;
    mode: AppColorModeType | string | undefined | null;
    saveSetting?: boolean;
    backgroundColorStatusBar: string;
  }) {
    let selectedMode, saveMode, statusBarStyle;
    let nowMode = Appearance.getColorScheme();
    switch (params.mode) {
      case 'light':
        selectedMode = 'light';
        saveMode = params.isSys ? 'system' : 'light';
        statusBarStyle = 'dark-content';
        break;
      case 'dark':
        selectedMode = 'dark';
        saveMode = params.isSys ? 'system' : 'dark';
        statusBarStyle = 'light-content';
        break;
      default:
        selectedMode = Appearance.getColorScheme();
        saveMode = 'system';
        statusBarStyle = nowMode === 'dark' ? 'light-content' : 'dark-content';
    }
    if (params.saveSetting || true) {
      await AsyncStorage.setItem(APP_COLOR_MODE, saveMode);
      StatusBar.setBarStyle(statusBarStyle, false);
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(selectedMode === 'light' ? theme.colors.background : darkTheme.colors.background);
      }
    }
  }
}
