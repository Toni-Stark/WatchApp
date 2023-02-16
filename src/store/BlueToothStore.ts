import { action, makeAutoObservable, observable } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import i18n from 'i18n-js';
import { Appearance, AppState, Platform, StatusBar } from 'react-native';
import { APP_COLOR_MODE, APP_LANGUAGE, DEVICE_DATA, DEVICE_INFO, TOKEN_NAME, USER_CONFIG } from '../common/constants';
import { arrToByte, baseToHex, eventTimer, eventTimes, getMinTen, regCutString, stringToByte, t } from '../common/tools';
import { darkTheme, theme } from '../common/theme';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import moment from 'moment';
import {
  allDataC,
  allDataHeartEnd,
  allDataHeartStart,
  allDataSign,
  allDataSleep,
  batterySign,
  bloodData,
  mainListen,
  passRegSign
} from '../common/watch-module';
import { RootEnum } from '../common/sign-module';
import { RSJournalStore } from './RSJournalStore';
import { Api, ApiResult, ErrorLog } from '../common/api';

export type AppColorModeType = 'light' | 'dark' | 'system';
export type AppLanguageType = 'zh' | 'en' | 'system';

const defaultDevice = {
  '-47': {
    i8: [],
    i9: [],
    i10: [],
    xinlvTime: [],
    xueyaTime: [],
    intValue2: [],
    intValue3: []
  },
  '-180': {}
};

export class BlueToothStore {
  readonly defaultLanguage: AppLanguageType = 'zh';
  readonly defaultColorMode = Appearance.getColorScheme() === 'light' ? 'light' : 'dark';

  @observable showBootAnimation: boolean = true;
  @observable manager: any;
  @observable devicesInfo: any;
  @observable servicesDevices: any = [];
  @observable characteristics: any = [];

  @observable writeId: any;
  @observable notifyId: any;

  @observable blueToothListener: any;
  @observable blueListenerList: any[] = [];

  @observable blueRootList: any[] = [];
  @observable blueRootInfo: any = {};

  @observable listenDevices: any;

  @observable device: any = defaultDevice;
  @observable currentDevice: any = this.device;
  @observable logcatDetailed: any = {};
  @observable refreshing: boolean = false;
  @observable refreshInfo: any = {};
  @observable hadBackgroundFetch: boolean = false;
  @observable hadStateListener: boolean = false;
  @observable isCheckHeart: boolean = false;

  @observable isRoot = RootEnum['初次进入'];
  @observable value = 0;
  constructor() {
    makeAutoObservable(this);

    (async () => {
      let data: any = await AsyncStorage.getItem(DEVICE_DATA);
      if (data) {
        this.device = JSON.parse(data);
        this.currentDevice = JSON.parse(data);
      }
    })();
  }

  @action
  async checkBlO2() {
    // await this.sendActiveMessage(bloodData);
    await this.sendActiveMessage(allDataSleep);
  }
  @action
  async checkHeart() {
    if (this.isCheckHeart) {
      await this.sendActiveMessage(allDataHeartEnd);
      this.isCheckHeart = false;
      return;
    }
    await this.sendActiveMessage(allDataHeartStart);
    this.isCheckHeart = true;
  }

  @action
  async setManagerInit() {
    this.manager = new BleManager();
  }
  @action
  async clearDevice() {
    this.device = defaultDevice;
  }

  @action
  async closeDevices() {
    if (!this.devicesInfo?.id) {
      return;
    }
    await this.manager.cancelDeviceConnection(this.devicesInfo.id);
    this.devicesInfo = undefined;
    this.manager = undefined;
    await this.clearDevice();
    this.currentDevice = this.device;
    this.refreshing = false;
    this.refreshInfo = {};
    this.manager = new BleManager();
  }

  @action
  async setDeviceStorage(devices) {
    let deviceInfo = {
      deviceID: devices.id,
      time: moment(new Date()).format('YYYY-MM-DD')
    };
    await AsyncStorage.setItem(DEVICE_INFO, JSON.stringify(deviceInfo));
  }
  @action
  async successDialog() {
    this.refreshing = true;
    if (!this.devicesInfo?.id) {
      return;
    }
    this.refreshInfo = {
      deviceID: this.devicesInfo.id,
      time: moment(new Date()).format('YYYY-MM-DD')
    };
    await this.clearDevice();
    await this.setDeviceStorage(this.devicesInfo);
    await this.sendActiveMessage(passRegSign);
    await this.sendActiveMessage(allDataSign);
    await this.sendActiveMessage(batterySign);
    await this.sendActiveMessage(allDataSleep);
    await this.sendActiveMessage(allDataC);
  }

  @action
  async sendActiveMessage(params) {
    let storeRes = regCutString(params.value);
    console.log(storeRes);
    let buffer = Buffer.from(stringToByte(storeRes)).toString('base64');
    await this.devicesInfo.writeCharacteristicWithResponseForService(params.serviceUUID, params.uuid, buffer);
  }
  @action
  async sendActiveWithoutMessage(params) {
    let storeRes = regCutString(params.value);
    let buffer = Buffer.from(stringToByte(storeRes)).toString('base64');
    await this.devicesInfo.writeCharacteristicWithoutResponseForService(params.serviceUUID, params.uuid, buffer);
  }

  @action
  async listenActiveMessage(params) {
    try {
      // if (this.listenDevices) {
      //   this.listenDevices?.remove();
      // }
      this.listenDevices = this.devicesInfo.monitorCharacteristicForService(params.serviceUUID, params.uuid, (error, characteristic) => {
        if (error) return;
        let value = baseToHex(characteristic.value);
        this.blueRootList = [...this.blueRootList, value];
        let regValue = ['a1', 'a0', 'd1', 'd0', 'd8', '88', '80'].includes(value.slice(0, 2));
        if (regValue) {
          this.devicesModules(value);
        }
        eventTimes(() => {
          this.setBasicInfo();
        }, 1000);
      });
    } catch (err) {
      console.log('打印报错', err);
    }
  }

  @action
  async setBasicInfo() {
    this.refreshing = false;
    this.currentDevice = { ...this.device };
    // RSJournalStore.writeDataCache(this.logcatDetailed);
  }

  @action
  async getDescriptorsForDeviceInfo(params) {
    const { data } = params;
    const result = await this.manager.descriptorsForDevice(data.deviceID, data.serviceUUID, data.uuid);
    this.blueRootInfo = {
      deviceID: 'EF:39:16:32:92:F7',
      serviceUUID: 'F0080001-0451-4000-B000-000000000000',
      characteristicUUID: 'f0080002-0451-4000-b000-000000000000',
      uuid: '00002902-0000-1000-8000-00805f9b34fb'
    };
  }

  @action
  async devicesModules(val) {
    console.log(val, 'logs-------------');
    let hex = parseInt(val.slice(0, 2), 16) - 256;
    // if (!this.logcatDetailed[hex]) {
    //   this.logcatDetailed[hex] = '';
    // }
    // this.logcatDetailed[hex] += val + '\n';
    let params = {
      '-95': (e) => {
        // console.log(e);
        // let battery = e.match(/([\d\D]{2})/g);
        // return {
        //   power: parseInt(battery[4], 16)
        // };
      },
      '-96': (e) => {
        let battery = e.match(/([\d\D]{2})/g);
        return {
          power: parseInt(battery[4], 16)
        };
      },
      '-47': (e) => {
        let list: any = this.device[hex] || {};
        let message = arrToByte(e.match(/([\d\D]{2})/g), true);
        let prototype = e.match(/([\d\D]{2})/g);
        // list.i = message[19]; // 分钟
        // list.i4 = message[5]; // 小时
        // let i5 = byte2HexToIntArr[7]; = 00
        // let i6 = byte2HexToIntArr[8]; = 00
        // let i7 = byte2HexToIntArr[9]; = 00
        if (parseInt(message[14]) > 30) {
          list.i8.push(message[14]); //心率
          list.xinlvTime.push(`${message[5]}:${message[19]}`); //心率记录时间
        }
        if (message[15] && message[16]) {
          // console.log(message[15], message[16], message[5], message[19], '数据');
          message[15] && list.i9.push(message[15]); //血压高
          message[16] && list.i10.push(message[16]); //血压低
          list.xueyaTime.push(`${getMinTen(message[5])}:${getMinTen(message[19])}`); //血压低
        }
        list.i3 = list.i3 || message[17];
        list.i2 = list.i2 || message[18];
        list.intValue = list?.intValue || parseInt(prototype[2] + prototype[1], 16);
        let val1 = parseInt(prototype[10] + prototype[11], 16);
        let val2 = parseInt(prototype[12] + prototype[13], 16);
        list.intValue2.push(val1); //步数
        list.intValue3.push(val2); //运动量
        return list;
      },
      '-32': (e) => {
        let battery = e.match(/([\d\D]{2})/g);
        console.log(battery, 'battery');
      },
      '-120': (e) => {
        let battery = e.match(/([\d\D]{2})/g);
        if (battery[12] !== '00' || battery[11] !== '00') {
          let byte = parseInt(battery[12] + battery[11], 16);
          return {
            temperature: byte / 10
          };
        }
      },
      '-46': (e) => {
        console.log(e, '血氧数据');
      },
      '-48': (e) => {
        let battery = e.match(/([\d\D]{2})/g);
        if (battery[1]) {
          return {
            heartJump: parseInt(battery[1], 16),
            time: moment().format('YYYY-MM-DD HH:mm:ss')
          };
        }
      }
    };
    this.device = { ...this.device, [hex]: params[hex](val) };
    return this.device;
  }

  @action
  async reConnectDevice(params, callback) {
    this.refreshInfo = { ...params };
    this.refreshing = true;
    let isDevice = false;
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // 处理错误（扫描会自动停止）
        return;
      }
      if (device.name && device?.id !== params.deviceID) {
        isDevice = false;
        eventTimer(() => {
          console.log('停止搜索');
          this.manager?.stopDeviceScan();
          this.refreshing = false;
          !isDevice && callback({ type: '3', delay: 1 });
        }, 10000);
        return;
      } else {
        isDevice = true;
        if (device.id === params.deviceID) {
          this.manager?.stopDeviceScan();
          device
            .connect()
            .then((res) => {
              this.manager?.stopDeviceScan();
              this.isRoot = RootEnum['连接中'];
              if (res.id) {
                return res.discoverAllServicesAndCharacteristics();
              }
              return callback({ type: '1', delay: 1 });
            })
            .then((devices) => {
              this.manager?.stopDeviceScan();
              this.devicesInfo = devices;
              this.listenActiveMessage(mainListen);
              return callback({ type: '2', delay: 1 });
            })
            .catch((err) => {
              this.closeDevices();
              return callback({ type: '1', delay: 1 });
            });
        }
      }
    });
  }

  /**
   * get UserLogin
   * url: /apic/watch/device/list
   */
  @action
  async userDeviceSetting(): Promise<any> {
    const res: ApiResult = await Api.getInstance.post({
      url: '/watch/device/list',
      params: {},
      withToken: false
    });
    if (res.code !== 200) {
      return { msg: res.msg, success: false };
    }
    if (!res.data) {
      return { needBinding: true };
    }
    if (!res.data.find((item) => item === this.devicesInfo.id)) {
      return { needBinding: true };
    }
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
