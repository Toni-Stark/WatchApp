import moment from 'moment';
import BackgroundJob from 'react-native-background-job';
import BackgroundService from 'react-native-background-actions';
import AsyncStorage from '@react-native-community/async-storage';
import { action, makeAutoObservable, observable } from 'mobx';
import { BleManager } from 'react-native-ble-plx';
import { Platform } from 'react-native';
import { Buffer } from 'buffer';
import {
  allDataC,
  allDataSign,
  allDataSleep,
  batterySign,
  mainListen,
  passRegSign,
  settingDevicesAlarm,
  settingDevicesHeart,
  settingDevicesLang,
  settingDevicesLongSit,
  settingDevicesMessage,
  settingDevicesOxygen,
  settingDevicesScreenLight,
  settingName,
  updateWeather
} from '../common/watch-module';
import { DEVICE_DATA, DEVICE_INFO, NEAR_FUTURE, TOKEN_NAME, UPDATE_DEVICE_INFO, UPDATE_TIME } from '../common/constants';
import { arrToByte, baseToHex, dateTimes, eventTimer, getBytesList, regCutString, stringToByte } from '../common/tools';
import { RootEnum } from '../common/sign-module';
import { Api, ApiResult } from '../common/api';

export const defaultDataLog = {
  power: null,
  list: null,
  battery: null,
  'new-date': null,
  temperature: null,
  'heart-jump': null
};
export const defaultDevice = {
  '-47': {
    i8: [],
    i9: [],
    i10: [],
    xinlvTime: [],
    xueyaTime: [],
    intValue2: [],
    intValue3: []
  },
  '-180': {},
  '-32': {},
  '-33': {
    i8: [],
    i9: [],
    i10: [],
    xinlvTime: [],
    xueyaTime: [],
    intValue2: [],
    intValue3: []
  }
};
const defaultData = {
  '1': '',
  '2': '',
  '3': '',
  '4': '',
  '5': ''
};

export class BlueToothStore {
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
  @observable deviceFormData: any = defaultData;
  @observable currentDevice: any = this.device;
  @observable logcatDetailed: any = {};
  @observable refreshing: boolean = false;
  @observable refreshBtn: boolean = false;
  @observable refreshInfo: any = undefined;
  @observable hadBackgroundFetch: boolean = false;
  @observable hadStateListener: boolean = false;
  @observable isCheckHeart: boolean = false;

  @observable isRoot = RootEnum['初次进入'];
  @observable userRootDevices = [];

  @observable needRegPassword = false;
  @observable noPasswordTips = false;

  @observable backgroundActive = false;
  @observable dataChangeTime: any = '';
  @observable dataNowTime: any = moment(new Date()).format('YYYY-MM-DD hh:mm');
  @observable dataLogCat: any = { ...defaultDataLog };
  @observable evalName: string = '';
  @observable isConnected: boolean = false;
  @observable readyDevice: any = undefined;
  @observable activeDeviceConnect: boolean = false;
  @observable devicesTimes: number = 0;
  @observable aloneTimes: number = 0;
  @observable nearFuture: any = 0;
  @observable baseView: any = null;
  @observable versionCode: string = '';
  @observable reConnectionDevice: boolean = false;
  @observable deviceControls: any = {};

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
  async setManagerInit() {
    this.manager = new BleManager();
  }
  @action
  async clearDevice() {
    this.device = defaultDevice;
    this.deviceFormData = defaultData;
  }
  @action
  async removeBlueToothListen(bool?: boolean) {
    this.isRoot = RootEnum['断开连接'];
    await AsyncStorage.removeItem(DEVICE_INFO);
    if (!bool) await AsyncStorage.removeItem(TOKEN_NAME);
    await setTimeout(async () => {
      await this.closeDevices();
    }, 1000);
  }
  @action
  async updateGetDataTime() {
    this.dataNowTime = moment(new Date()).format('YYYY-MM-DD hh:mm');
    this.dataLogCat = { ...defaultDataLog };
    this.reConnectionDevice = false;
  }
  @action
  async closeDevices(callback?: Function, bool?: boolean) {
    if (!this.devicesInfo?.id) {
      return;
    }
    this.currentDevice = this.device;
    this.versionCode = '';
    this.refreshBtn = false;
    this.refreshInfo = undefined;
    this.deviceFormData = defaultData;
    try {
      this.needRegPassword = false;
      this.isConnected = false;
      this.noPasswordTips = false;
      if (!bool) await this.manager.cancelDeviceConnection(this.devicesInfo.id);
      this.activeDeviceConnect = false;
      this.manager = undefined;
      this.devicesInfo = undefined;
      this.manager = new BleManager();
      this.refreshing = false;
      await this.clearDevice();
    } catch (err) {
      this.device = defaultDevice;
      this.activeDeviceConnect = false;
      this.manager = new BleManager();
      this.refreshing = false;
      await AsyncStorage.removeItem(DEVICE_INFO);
      return callback && callback({ text: '已断开连接', delay: 1.5 });

      // await this.connectDevice(this.devicesInfo, (res) => {
      //   return callback && callback(res);
      // });
    }
  }
  @action
  getEvalName() {
    let name = this.readyDevice?.device_name || this.refreshInfo?.name;
    if (this.evalName) {
      name = name + '-' + this.evalName;
    } else {
      if (this.readyDevice?.note) {
        name = name + '-' + this.readyDevice?.note;
      } else if (this.refreshInfo?.note) {
        name = name + '-' + this.refreshInfo?.note;
      }
    }
    return name;
  }
  @action
  async getMsgUpload() {
    await this.backDeviceData();
  }
  @action
  async sleepFunction({ time, type }: { time?: any; type?: string }) {
    return new Promise((resolve) =>
      setTimeout(() => {
        if (type === UPDATE_DEVICE_INFO) {
          this.getMsgUpload();
          // ToastAndroid.show('更新数据' + type, 1000);
        }
        resolve();
      }, time)
    );
  }
  /**
   * android系统普遍使用方式
   * vivo、oppo
   */
  @action
  async runningAndroidTask(type, timer, brand, run) {
    if (run) await this.stopBackgroundJob(brand);
    const options = {
      taskName: '智能手表',
      taskTitle: '正在运行中',
      taskDesc: '运动数据实时检测中',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap'
      },
      color: '#ff00ff',
      linkingURI: 'youlu://com.cqqgsafe.watch', // See Deep Linking for more info
      parameters: {
        delay: timer
      }
    };
    const veryIntensiveTask = async (taskDataArguments) => {
      if (run) {
        const { delay } = taskDataArguments;
        await new Promise(async () => {
          for (let i = 0; BackgroundService.isRunning(); i++) {
            await this.sleepFunction({ time: delay, type });
          }
        });
      }
    };
    await BackgroundService.start(veryIntensiveTask, options);
  }
  /**
   * 特殊第三方服务商android系统使用方式
   * HUAWEI
   */
  @action
  async runningProviderTask(type, timer, brand) {
    await this.stopBackgroundJob(brand);
    if (Platform.OS !== 'android') {
      return;
    }
    const backgroundJob = {
      jobKey: 'backgroundDownloadTask',
      job: () => {
        this.sleepFunction({ type });
      }
    };
    BackgroundJob.register(backgroundJob);
    BackgroundJob.isAppIgnoringBatteryOptimization(() => {});
    // setTimeout(() => {
    BackgroundJob.schedule({
      jobKey: 'backgroundDownloadTask', //后台运行任务的key
      notificationText: '启动后台',
      notificationTitle: '智能蓝牙手表',
      period: timer, //任务执行周期
      timeout: 86400000,
      persist: true,
      override: true,
      // requiresDeviceIdle: false,
      // requiresCharging: false,
      exact: true, //安排一个作业在提供的时间段内准确执行
      allowWhileIdle: true, //允许计划作业在睡眠模式下执行
      allowExecutionInForeground: true //允许任务在前台执行
    });
  }
  @action
  async settingBackgroundJob(brand, type, timer) {
    if (['vivo', 'VIVO', 'oppo', 'OPPO'].includes(brand)) {
      // ToastAndroid.show('应用程序已在后台运行', 1500);
      await this.runningAndroidTask(type, timer, brand, true);
    }
    if (['HUAWEI', 'huawei'].includes(brand)) {
      // ToastAndroid.show('应用程序已在后台运行', 1500);
      await this.runningProviderTask(type, timer, brand);
      await this.runningAndroidTask(type, timer, brand, false);
    }
  }
  @action
  async stopBackgroundJob(brand) {
    if (['vivo', 'VIVO', 'oppo', 'OPPO'].includes(brand)) {
      await BackgroundService?.stop();
    }
    if (['HUAWEI', 'huawei'].includes(brand)) {
      BackgroundJob.cancel({ jobKey: 'backgroundDownloadTask' });
    }
  }
  @action
  async backDeviceData() {
    this.devicesTimes = this.devicesTimes + 1;
    await this.sendActiveMessage(allDataSign(0));
    // await this.sendActiveMessage(allDataSleep(1));
    // await this.sendActiveMessage(allDataC(0));
  }
  @action
  async setDeviceStorage(devices) {
    let deviceInfo = {
      deviceID: devices.id,
      name: devices.name,
      time: moment(new Date()).format('YYYY-MM-DD')
    };
    await AsyncStorage.setItem(DEVICE_INFO, JSON.stringify(deviceInfo));
  }
  @action
  async updateActiveDevices({ num }, base) {
    if (base) {
      this.baseView = base;
    }
    if (num === 2) {
      this.baseView?.current?.hideLoading();
      this.baseView?.current.showLoading({ text: '加载前天数据...' });
    } else if (num === 1) {
      this.baseView?.current?.hideLoading();
      this.baseView?.current.showLoading({ text: '加载昨天数据...' });
    } else {
      this.baseView?.current?.hideLoading();
      // this.baseView?.current?.showLoading({ text: '加载今日数据...' });
    }
    await this.sendActiveMessage(allDataSign(num));
    // await this.sendActiveMessage(allDataSleep(num + 1));
    // await this.sendActiveMessage(allDataC(num));
  }
  @action
  async successDialog({ pass, callback, date = 0 }: { pass?: string; callback?: Function; date: number }, base?: any) {
    if (!this.devicesInfo?.id) {
      this.refreshing = false;
      return;
    }
    this.refreshing = true;
    this.refreshInfo = {
      deviceID: this.devicesInfo.id,
      name: this.devicesInfo.name,
      time: moment(new Date()).format('YYYY-MM-DD')
    };
    await this.clearDevice();
    await this.setDeviceStorage(this.devicesInfo);
    try {
      if (!this.versionCode) {
        await this.sendActiveMessage(passRegSign(pass));
      }
      // if (date === 0) {
      //   await this.checkList(this.devicesInfo.id);
      // }
      await this.updateActiveDevices({ num: date || this.nearFuture }, base);
    } catch (err) {
      await this.closeDevices((res) => {
        return callback && callback(res);
      }, true);
    }
  }
  @action
  async openDeviceControl(isOpen) {
    if (isOpen) {
      // 打开第一部分健康开关
      let open1 = '00 00 01 01 00 00 00 00 01 00 00 00 01 00 01';
      await this.sendActiveMessage(settingDevicesHeart(open1));
      // 打开第二部分健康开关
      let open2 = '00 00 01 00 00 01 00 00 00 00 00 00 00 00 00 00 00 01';
      await this.sendActiveMessage(settingDevicesHeart(open2));
      // 打开血氧夜间监控开关
      await this.sendActiveMessage(settingDevicesOxygen(18, 0, 8, 0, 1));
      // 打开心率报警开关
      await this.sendActiveMessage(settingDevicesAlarm(115, 55, 1));
      // 打开久坐提醒开关
      await this.sendActiveMessage(settingDevicesLongSit('08', '00', '12', '00', '1e', 1));
      // 打开消息通知开关
      let arr = Array(18).fill(1);
      await this.sendActiveMessage(settingDevicesMessage(arr));
      // 设置中文
      await this.sendActiveMessage(settingDevicesLang(1));
      // 打开天气推送开关
      await this.sendActiveMessage(updateWeather(1));
      // 翻转手腕亮屏设置
      await this.sendActiveMessage(settingDevicesScreenLight(1, '08', '00', '12', '00', '09'));
    }
  }
  @action
  async sendActiveMessage(params) {
    let storeRes = regCutString(params.value);
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
      let timer: any = null;
      this.listenDevices = this.devicesInfo.monitorCharacteristicForService(params.serviceUUID, params.uuid, (error, characteristic) => {
        if (error) {
          return;
        }
        let value = baseToHex(characteristic.value);
        this.blueRootList = [...this.blueRootList, value];
        let regValue = ['aa', 'a1', 'a0', 'ad', 'd1', 'd0', 'd8', '88', '80', 'd2', 'e0', 'df'].includes(value.slice(0, 2));
        if (regValue) {
          this.devicesModules(value, this.backgroundActive);
        }

        if (['bd'].includes(value.slice(0, 2))) {
          return;
        }
        if (['a0'].includes(value.slice(0, 2))) {
          this.currentDevice = { ...this.device };
          return;
        }
        if (['ad'].includes(value.slice(0, 2))) {
          this.currentDevice = { ...this.device };
          return;
        }
        if (this.backgroundActive) {
          let dateTime = new Date().getTime();
          let timeThan = this.dataChangeTime ? dateTime - this.dataChangeTime : dateTime;
          if (timeThan > 9000) {
            this.dataChangeTime = dateTime;
            this.updateDeviceList();
          } else if (timeThan > 1000) {
            this.dataChangeTime = dateTime;
            this.currentDevice = { ...this.device };
          }
          return;
        }
        if (['d0'].includes(value.slice(0, 2))) {
          this.currentDevice = { ...this.device };
          return;
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.updateDeviceList();
        }, 1500);
      });
    } catch (err) {
      console.log('打印报错', err);
    }
  }
  @action
  async setBasicInfo() {}
  @action
  async getDescriptorsForDeviceInfo(params) {
    const { data } = params;
    await this.manager.descriptorsForDevice(data.deviceID, data.serviceUUID, data.uuid);
  }
  @action
  async devicesModules(val, bool) {
    let hex = parseInt(val.slice(0, 2), 16) - 256;
    if (bool) {
      switch (hex) {
        case -47:
          this.deviceFormData['1'] += val + '\n';
          break;
        case -32:
          this.deviceFormData['2'] += val + '\n';
          break;
        case -33:
          this.deviceFormData['1'] += val + '\n';
          break;
        case -120:
          this.deviceFormData['3'] += val + '\n';
          break;
      }
    }
    let params = {
      '-86': (e) => {
        // 接受返回消息
        this.refreshing = false;
      },
      '-83': (e) => {
        // 消息设置
        this.deviceControls = { ...this.deviceControls, message: val };
      },
      '-72': (e) => {
        // 健康开关设置
        if (val.slice(-2, val.length) === '01') {
          this.deviceControls = { ...this.deviceControls, healthy: val.slice(-2, val.length) };
        } else {
          this.deviceControls = { ...this.deviceControls, health: val };
        }
      },
      '-95': (e) => {
        if (e.length >= 20) {
          let str = e.match(/([\d\D]{2})/g);
          this.versionCode = `${str[6]}.${str[7]}.${str[8]}.${str[9]}-${parseInt(str[4] + str[5], 16)}`;
          this.userDeviceSetting(true);
          // this.openDeviceControl(true);
        }
      },
      '-96': (e) => {
        let battery = e.match(/([\d\D]{2})/g);
        // let batteryNum = Math.ceil((parseInt(battery[6], 16) / 100) * 4);
        let batteryNum = Math.ceil(parseInt(battery[6], 16));
        if (!bool && !this.dataLogCat?.power) {
          this.dataLogCat = { ...this.dataLogCat, power: true };
          // this.currentDevice = { ...this.device };
          dateTimes(
            () => {
              this.dataLogCat = { ...this.dataLogCat, power: false };
            },
            1000,
            'power'
          );
        }
        return {
          power: batteryNum - 1
        };
      },
      '-47': (e) => {
        let list: any = this.device[hex] || {};
        if (!bool) {
          this.deviceFormData['1'] += e + '\n';
          this.dataLogCat = { ...this.dataLogCat, list: true };
          dateTimes(
            () => {
              this.dataLogCat = { ...this.dataLogCat, list: false };
            },
            1000,
            'list'
          );
        }
        return list;
      },
      '-32': (e) => {
        let battery = e.match(/([\d\D]{2})/g);
        let data: any = this.device[hex] || {};
        data[battery[1]] = battery;
        if (!bool) {
          this.deviceFormData['2'] += e + '\n';
          this.dataLogCat = { ...this.dataLogCat, battery: true };
          dateTimes(
            () => {
              this.dataLogCat.battery = false;
              this.dataLogCat = { ...this.dataLogCat, battery: false };
            },
            1000,
            'battery'
          );
        }
        return data;
      },
      '-33': (e) => {
        if (!bool) {
          this.deviceFormData['1'] += e + '\n';
          this.dataLogCat = { ...this.dataLogCat, 'new-date': true };
          dateTimes(
            () => {
              this.dataLogCat = { ...this.dataLogCat, 'new-date': false };
            },
            1000,
            'new-date'
          );
        }
        return '';
      },
      '-120': (e) => {
        let battery = e.match(/([\d\D]{2})/g);
        if (!bool) {
          this.deviceFormData['3'] += e + '\n';
          this.dataLogCat = { ...this.dataLogCat, temperature: true };
          dateTimes(
            () => {
              this.dataLogCat = { ...this.dataLogCat, temperature: false };
            },
            1000,
            'temperature'
          );
        }
        if (battery[12] === '00' || battery[11] === '00') {
          return {
            temperature: this.device['-120']?.temperature
          };
        } else {
          let byte = parseInt(battery[12] + battery[11], 16);
          return {
            temperature: byte / 10
          };
        }
      },
      '-46': () => {},
      '-48': (e) => {
        let battery = e.match(/([\d\D]{2})/g);
        if (battery[1]) {
          if (!bool) {
            this.dataLogCat = { ...this.dataLogCat, 'heart-jump': true };
            dateTimes(
              () => {
                this.dataLogCat = { ...this.dataLogCat, 'heart-jump': false };
              },
              1000,
              'heart-jump'
            );
          }
          return {
            heartJump: parseInt(battery[1], 16),
            time: moment().format('YYYY-MM-DD HH:mm:ss')
          };
        }
      }
    };
    if (hex !== -95) {
      this.needRegPassword = false;
      this.noPasswordTips = false;
    }

    this.device = { ...this.device, [hex]: params[hex](val) };
    return this.device;
  }
  @action
  async getDataTime(times) {
    this.nearFuture = times;
  }
  @action
  async setTimesNow(deviceId, times) {
    let oneDay = 60 * 60 * 24 * 1000;
    let data: any = await AsyncStorage.getItem(NEAR_FUTURE);
    let json: any = data ? JSON.parse(data) : {};
    let today = moment().format('YYYY-MM-DD');
    let date: any;
    if (times === 2) {
      date = moment(new Date(today).getTime() - 2 * oneDay).format('YYYY/MM/DD');
    } else {
      date = moment(new Date(today).getTime() - oneDay).format('YYYY/MM/DD');
    }
    json[deviceId] = date;
    await AsyncStorage.setItem(NEAR_FUTURE, JSON.stringify(json));
  }
  @action
  async checkList(deviceId) {
    let data: any = await AsyncStorage.getItem(NEAR_FUTURE);
    let json: any = data ? JSON.parse(data) : {};
    let today = moment().format('YYYY-MM-DD');
    let oneDay = 60 * 60 * 24 * 1000;
    const time: any = json && json[deviceId];
    if (time) {
      let yesterday = moment(new Date(time)).format('YYYY-MM-DD');
      let difference = moment(new Date(today)).diff(moment(new Date(yesterday)));
      if (difference > oneDay) {
        if (difference === 2 * oneDay) {
          await this.getDataTime(1);
          return;
        }
        await this.getDataTime(2);
      }
    } else {
      await this.getDataTime(2);
    }
  }
  @action
  async changeDeviceName(params): Promise<any> {
    return new Promise(async (resolve) => {
      let str = getBytesList(params.name);
      if (str?.length > 18) {
        str = str.slice(0, 18);
      }
      let completion = 18 - str.length;
      let str1 = ' ';
      for (let i = 1; i <= completion; i++) {
        if (i !== completion) {
          str1 += '00 ';
        } else {
          str1 += '00';
        }
      }
      let message = arrToByte(str) + str1;
      await this.sendActiveMessage(settingName(message));
      this.bindUserDevice({ name: params.name }).then((res) => {
        if (res.success) {
          return resolve({ name: params.name, success: true });
        }
        return resolve({ success: false });
      });
    });
  }
  @action
  async sendMessageOfDevice(params): Promise<any> {
    return new Promise(async (resolve) => {
      let str = getBytesList(params.name);
      if (str?.length > 280) {
        str = str.slice(0, 280);
      }
      let timesCount = Math.ceil(str.length / 14);

      for (let i = 1; i <= timesCount; i++) {
        let msg = str.slice((i - 1) * 14, 14 * i);
        let brr = [-62, 17];
        brr[2] = msg.length;
        brr[3] = timesCount;
        brr[4] = i;
        brr[5] = 2;
        let result = arrToByte(brr) + ' ' + arrToByte(msg);
        const obj = {
          value: result,
          serviceUUID: 'f0080001-0451-4000-B000-000000000000',
          uuid: 'f0080003-0451-4000-B000-000000000000'
        };
        await this.sendActiveMessage(obj);
      }
      return resolve({ success: true, text: '推送成功' });
    });
  }
  @action
  async connectDevice(device, callback) {
    device
      .connect({
        autoConnect: true,
        requestMTU: 247
      })
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
        this.isConnected = true;
        this.activeDeviceConnect = true;
        this.reConnectionDevice = true;
        this.listenActiveMessage(mainListen);
        if (devices?.id) this.checkList(devices.id);
        this.successDialog({ date: this.nearFuture });
        return callback({ type: '2', delay: 1 });
      })
      .catch(() => {
        console.log('断开了设备连接');
        this.closeDevices();
        return callback({ type: '1', delay: 1 });
      });
  }
  @action
  async regDeviceConnect() {
    let result = await this.manager.isDeviceConnected(this.devicesInfo.id);
    if (result) {
      this.activeDeviceConnect = true;
      return true;
    }
    this.activeDeviceConnect = false;
    return false;
  }
  @action
  async reConnectDevice(params, callback) {
    this.refreshInfo = { ...params };
    this.refreshing = true;
    let isDevice = false;
    try {
      this.manager.startDeviceScan(null, { scanMode: 2 }, (error, device) => {
        if (error) {
          // 处理错误（扫描会自动停止）
          this.refreshing = false;
          return;
        }
        if (device.name && device?.id !== params.deviceID) {
          isDevice = false;
          eventTimer(
            () => {
              this.manager?.stopDeviceScan();
              if (!this.devicesInfo) {
                this.refreshing = false;
              }
              if (isDevice) {
                callback({ type: '5', delay: 1 });
              } else {
                callback({ type: '3', delay: 1 });
              }
            },
            8000,
            false
          );
          return;
        } else {
          isDevice = true;
          if (device.id === params.deviceID) {
            eventTimer(() => {}, 0, true);
            this.manager?.stopDeviceScan();
            return this.connectDevice(device, callback);
          }
        }
      });
    } catch (err) {
      this.refreshing = false;
    }
  }
  /**
   * get UserDeviceSetting
   * url: /watch/device/list
   */
  @action
  async userDeviceSetting(bool, native = false): Promise<any> {
    return new Promise(async (resolve) => {
      const res: ApiResult = await Api.getInstance.post({
        url: '/watch/device/list',
        params: {},
        withToken: true
      });
      let data = res.data;
      if (native) {
        if (res.code !== 200) {
          return resolve({ msg: res.msg, success: false });
        }
        if (res.data?.data_list) {
          return resolve({ success: true, data: data?.device_list });
        }
      }
      if (bool) {
        if (res.code !== 200) {
          return resolve({ msg: res.msg, success: false });
        }
        let need = !data?.device_list.find((item) => item.device_mac === this.devicesInfo.id) || data.device_list.length <= 0;
        if (need) {
          this.bindUserDevice().then(() => {
            return resolve({ success: true, data: data?.device_list });
          });
        }
        this.readyDevice = data?.device_list?.find((item) => item.device_mac === this.devicesInfo.id);
      }
      if (!bool) {
        return resolve({ success: true, data: data?.device_list });
      }
    });
  }
  /**
   * get getDeviceBindInfo
   * url: /watch/share/share
   */
  @action
  async getDeviceBindInfo(params): Promise<any> {
    return new Promise(async (resolve) => {
      const res: ApiResult = await Api.getInstance.post({
        url: '/watch/share/share',
        params: params,
        withToken: true
      });
      if (res.code !== 200) {
        return resolve({ msg: res.msg, success: false });
      }
      return resolve({ data: res.data, success: true });
    });
  }
  /**
   * get updateDeviceList
   * url:
   */
  @action
  async updateDeviceList(): Promise<any> {
    let data = this.deviceFormData;
    let code = this.versionCode;
    if (data['1']) {
      await this.sendActiveMessage(batterySign);
      await this.updateDeviceData({ type: '1', device_ver: code, value: data['1'] }).then(() => {
        this.deviceFormData['1'] = '';
        return this.sendActiveMessage(allDataSleep(this.nearFuture + 1));
      });
      return;
    }
    if (data['2']) {
      await this.updateDeviceData({ type: '2', device_ver: code, value: data['2'] }).then(() => {
        this.deviceFormData['2'] = '';
        return this.sendActiveMessage(allDataC(this.nearFuture));
      });
      return;
    }
    if (data['3']) {
      await this.updateDeviceData({ type: '3', device_ver: code, value: data['3'] }).then(() => {
        this.deviceFormData['3'] = '';
        this.dataLogCat = { ...defaultDataLog };
      });
      await AsyncStorage.setItem(UPDATE_TIME, moment().format('YYYY-MM-DD HH:mm'));
      setTimeout(async () => {
        let time = this.nearFuture - 1;
        await this.openDeviceControl(true);
        await this.setTimesNow(this.devicesInfo.id, time);
        // this.refreshing = false;
        if (this.nearFuture > 0) {
          this.nearFuture = time;
          await this.successDialog({ date: this.nearFuture });
        }
      }, 1200);
      return;
    }
  }
  /**
   * get updateDeviceData
   * url: /watch/device/list
   */
  @action
  async updateDeviceData(params): Promise<any> {
    return new Promise(async (resolve) => {
      const res = Api.getInstance.post({
        url: '/watch/data/save',
        params: {
          type: params.type,
          record_date: moment(new Date()).format('YYYY-MM-DD HH:mm'),
          device_mac: this.devicesInfo.id,
          raw_data: params.value,
          device_ver: params.device_ver
        },
        withToken: true
      });
      return resolve(res);
    });
  }
  /**
   * get bindUserDevice
   * url: /watch/device/binding
   */
  @action
  async bindUserDevice(params?: any): Promise<any> {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const res: ApiResult = await Api.getInstance.post({
          url: '/watch/device/binding',
          params: {
            device_mac: this.devicesInfo.id,
            device_name: params?.name || this.devicesInfo.name,
            device_ver: this.versionCode
          },
          withToken: true
        });
        setTimeout(() => {
          if (res.code !== 200) {
            return resolve({ msg: res.msg, success: false });
          }
          return resolve({ msg: '绑定成功', success: true });
        }, 800);
      }, 2000);
    });
  }
  /**
   * get getDeviceInfo
   * url: /watch/device/newest-stat
   */
  @action
  async getDeviceInfo(params): Promise<any> {
    return new Promise(async (resolve) => {
      const res: ApiResult = await Api.getInstance.post({
        url: '/watch/device/newest-stat',
        params: {
          device_mac: params.id
        },
        withToken: true
      });
      if (res.code !== 200) {
        return resolve({ msg: res.msg, success: false });
      }
      return resolve({ msg: '更新成功', data: res.data, success: true });
    });
  }
  /**
   * get settingNote
   * url: /apic/watch/device/set-note
   */
  @action
  async settingNote(params): Promise<any> {
    return new Promise(async (resolve) => {
      const res: ApiResult = await Api.getInstance.post({
        url: '/watch/device/set-note',
        params: params,
        withToken: true
      });
      if (res.code !== 200) {
        return resolve({ msg: res.msg, success: false });
      }
      return resolve({ msg: '设置成功', data: res.data, success: true });
    });
  }
}
