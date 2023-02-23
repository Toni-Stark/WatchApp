import { action, get, makeAutoObservable, observable } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_CONFIG, DEVICE_DATA, DEVICE_INFO, NEAR_FUTURE, TOKEN_NAME, UPDATE_TIME } from '../common/constants';
import { arrToByte, baseToHex, dateTimes, eventTimer, eventTimes, getCircularReplacer, getMinTen, regCutString, stringToByte } from '../common/tools';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import moment from 'moment';
import { allDataC, allDataSign, allDataSleep, batterySign, mainListen, passRegSign } from '../common/watch-module';
import { RootEnum } from '../common/sign-module';
import { Api, ApiResult } from '../common/api';

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
export const defaultDataLog = {
  power: null,
  list: null,
  battery: null,
  'new-date': null,
  temperature: null,
  'heart-jump': null
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
  @observable refreshInfo: any = {};
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
  @observable dataLogCat: any = defaultDataLog;
  @observable evalName: string = '';
  @observable isConnected: boolean = false;
  @observable readyDevice: any = undefined;
  @observable activeDeviceConnect: boolean = false;
  @observable devicesTimes: number = 0;
  @observable nearFuture: number = 0;
  @observable baseView: any = null;

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
    this.dataLogCat = defaultDataLog;
  }

  @action
  async closeDevices(callback?: Function, bool?: boolean) {
    if (!this.devicesInfo?.id) {
      return;
    }
    this.currentDevice = this.device;
    this.refreshBtn = false;
    this.refreshInfo = {};
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
    let name = this.readyDevice?.device_name || this.refreshInfo.name;
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
  async backDeviceData() {
    this.devicesTimes = this.devicesTimes + 1;
    await this.sendActiveMessage(batterySign);
    await this.sendActiveMessage(allDataSleep(0));
    await this.sendActiveMessage(allDataC(0));
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
    await this.sendActiveMessage(allDataSleep(num));
    await this.sendActiveMessage(allDataC(num));
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
      await this.sendActiveMessage(passRegSign(pass));
      await this.sendActiveMessage(batterySign);
      // if (date === 0) {
      //   await this.checkList(this.devicesInfo.id);
      // }
      console.log(date || this.nearFuture, '此次数据向标data-for');
      await this.updateActiveDevices({ num: date || this.nearFuture }, base);
    } catch (err) {
      console.log(err, 'error');
      await this.closeDevices((res) => {
        return callback && callback(res);
      }, true);
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
        if (error) return;
        let value = baseToHex(characteristic.value);
        this.blueRootList = [...this.blueRootList, value];
        let regValue = ['a1', 'a0', 'd1', 'd0', 'd8', '88', '80', 'd2', 'e0', 'df'].includes(value.slice(0, 2));
        if (regValue) {
          this.devicesModules(value, this.backgroundActive);
        }
        if (['bd'].includes(value.slice(0, 2))) {
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
        // console.log(value, this.backgroundActive);
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.updateDeviceList();
        }, 1500);
        // eventTimes(() => {
        //   // this.setBasicInfo();
        //   this.updateDeviceList();
        // }, 1000);
      });
    } catch (err) {
      // this.baseView?.current.hideLoading();
      console.log('打印报错', err);
    }
  }

  @action
  async setBasicInfo() {
    // RSJournalStore.writeDataCache(this.logcatDetailed);
  }

  @action
  async getDescriptorsForDeviceInfo(params) {
    const { data } = params;
    await this.manager.descriptorsForDevice(data.deviceID, data.serviceUUID, data.uuid);
  }

  @action
  async devicesModules(val, bool) {
    let hex = parseInt(val.slice(0, 2), 16) - 256;
    // console.log(hex, val);
    // if (!this.logcatDetailed[hex]) {
    //   this.logcatDetailed[hex] = '';
    // }
    // this.logcatDetailed[hex] += val + '\n';
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
      '-95': (e) => {
        let reg = [0, '0'].includes(e.slice(0, -1));
        if (this.needRegPassword && reg) {
          this.noPasswordTips = true;
        }
        // if (reg) {
        //   this.needRegPassword = true;
        // }
        // let battery = e.match(/([\d\D]{2})/g);
        // return {
        //   power: parseInt(battery[4], 16)
        // };
      },
      '-96': (e) => {
        let battery = e.match(/([\d\D]{2})/g);
        let batteryNum;
        if (battery[6] === '00') batteryNum = parseInt(battery[4], 16);
        if (battery[6] !== '00') batteryNum = Math.ceil((parseInt(battery[4], 16) / 100) * 4);
        if (!bool) {
          this.dataLogCat = { ...this.dataLogCat, power: true };
          dateTimes(
            () => {
              console.log('获取电量数据完成');
              this.dataLogCat = { ...this.dataLogCat, power: false };
            },
            1000,
            'power'
          );
        }
        return {
          power: batteryNum
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
          list.xinlvTime.push(`${getMinTen(message[5])}:${getMinTen(message[19])}`); //心率记录时间
        }
        if (message[15] && message[16]) {
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
        if (!bool) {
          this.deviceFormData['1'] += val + '\n';
          this.dataLogCat = { ...this.dataLogCat, list: true };
          dateTimes(
            () => {
              console.log('获取日常数据完成');
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
              console.log('获取温度数据完成');
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
      '-46': (e) => {
        // console.log(e, '血氧数据');
      },
      '-48': (e) => {
        let battery = e.match(/([\d\D]{2})/g);
        if (battery[1]) {
          if (!bool) {
            this.dataLogCat = { ...this.dataLogCat, 'heart-jump': true };
            dateTimes(
              () => {
                console.log('获取详细心率数据完成');
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
    let date: any = '';
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
    console.log(data, time, 'data-what');
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
  async connectDevice(device, callback) {
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
        this.isConnected = true;
        this.activeDeviceConnect = true;
        this.listenActiveMessage(mainListen);
        if (devices?.id) this.checkList(devices.id);
        // this.successDialog({ date: this.nearFuture });
        return callback({ type: '2', delay: 1 });
      })
      .catch((err) => {
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
              this.refreshing = false;
              if (isDevice) {
                callback({ type: '5', delay: 1 });
              } else {
                callback({ type: '3', delay: 1 });
              }
            },
            20000,
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
    return new Promise(async (resolve, reject) => {
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
        let need = !data.device_list.find((item) => item.device_mac === this.devicesInfo.id) || data.device_list.length <= 0;
        if (need) {
          this.bindUserDevice().then((result) => {
            return resolve({ success: true, data: data.device_list });
          });
        }
        this.readyDevice = data.device_list.find((item) => item.device_mac === this.devicesInfo.id);
      }
      if (!bool) {
        return resolve({ success: true, data: data.device_list });
      }
    });
  }
  /**
   * get getDeviceBindInfo
   * url: /watch/share/share
   */
  @action
  async getDeviceBindInfo(params): Promise<any> {
    return new Promise(async (resolve, reject) => {
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
    this.devicesTimes += 1;
    let data = this.deviceFormData;
    if (data['1']) await this.updateDeviceData({ type: '1', value: data['1'] });
    if (data['2']) await this.updateDeviceData({ type: '2', value: data['2'] });
    if (data['3']) await this.updateDeviceData({ type: '3', value: data['3'] });
    if (data['4']) await this.updateDeviceData({ type: '4', value: data['4'] });
    if (data['5']) await this.updateDeviceData({ type: '5', value: data['5'] });
    this.currentDevice = { ...this.device };
    await AsyncStorage.setItem(UPDATE_TIME, moment().format('YYYY-MM-DD HH:mm'));
    setTimeout(async () => {
      let time = this.nearFuture - 1;
      await this.setTimesNow(this.devicesInfo.id, time);
      if (this.nearFuture > 0) {
        this.nearFuture = time;
        await this.successDialog({ date: this.nearFuture });
      }
    }, 1200);
  }

  /**
   * get updateDeviceData
   * url: /watch/device/list
   */
  @action
  async updateDeviceData(params) {
    await Api.getInstance.post({
      url: '/watch/data/save',
      params: {
        type: params.type,
        record_date: moment(new Date()).format('YYYY-MM-DD HH:mm'),
        device_mac: this.devicesInfo.id,
        raw_data: params.value
      },
      withToken: true
    });
  }

  /**
   * get bindUserDevice
   * url: /watch/device/binding
   */
  @action
  async bindUserDevice(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const res: ApiResult = await Api.getInstance.post({
        url: '/watch/device/binding',
        params: {
          device_mac: this.devicesInfo.id,
          device_name: this.devicesInfo.name
        },
        withToken: true
      });
      if (res.code !== 200) {
        return resolve({ msg: res.msg, success: false });
      }
      return resolve({ msg: '绑定成功', success: true });
    });
  }

  /**
   * get getDeviceInfo
   * url: /watch/device/newest-stat
   */
  @action
  async getDeviceInfo(params): Promise<any> {
    return new Promise(async (resolve, reject) => {
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
    return new Promise(async (resolve, reject) => {
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
