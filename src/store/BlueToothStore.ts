import { action, makeAutoObservable, observable } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_DATA, DEVICE_INFO } from '../common/constants';
import { arrToByte, baseToHex, eventTimer, eventTimes, getMinTen, regCutString, stringToByte } from '../common/tools';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import moment from 'moment';
import { allDataC, allDataHeartEnd, allDataHeartStart, allDataSign, allDataSleep, batterySign, mainListen, passRegSign } from '../common/watch-module';
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
  '-32': {}
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
    this.needRegPassword = false;
    this.noPasswordTips = false;
    await this.manager.cancelDeviceConnection(this.devicesInfo.id);
    this.devicesInfo = undefined;
    this.manager = undefined;
    await this.clearDevice();
    this.currentDevice = this.device;
    this.refreshing = false;
    this.refreshInfo = {};
    this.manager = new BleManager();
    this.deviceFormData = defaultData;
  }

  @action
  async getMsgUpload() {
    try {
      await this.sendActiveMessage(allDataSleep);
    } catch (err) {
      console.log(err);
    }
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
  async successDialog(pass?: string) {
    this.deviceFormData = defaultData;
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
    await this.sendActiveMessage(passRegSign(pass));
    await this.sendActiveMessage(allDataSign);
    await this.sendActiveMessage(batterySign);
    await this.sendActiveMessage(allDataSleep);
    await this.sendActiveMessage(allDataC);
  }

  @action
  async sendActiveMessage(params) {
    let storeRes = regCutString(params.value);
    console.log(storeRes, '蓝牙输入状态值');
    let buffer = Buffer.from(stringToByte(storeRes)).toString('base64');
    await this.devicesInfo.writeCharacteristicWithResponseForService(params.serviceUUID, params.uuid, buffer);
  }
  @action
  async sendActiveWithoutMessage(params) {
    console.log(this.device, '查看蓝牙设备');
    console.log(this.devicesInfo, '查看蓝牙设备信息');
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
        console.log(value);
        let regValue = ['a1', 'a0', 'd1', 'd0', 'd8', '88', '80', 'd2', 'e0'].includes(value.slice(0, 2));
        if (regValue) {
          this.devicesModules(value);
        }
        if (this.backgroundActive) {
          let dateTime = new Date().getTime();
          let timeThan = this.dataChangeTime ? dateTime - this.dataChangeTime : dateTime;
          if (timeThan > 10000) {
            this.dataChangeTime = dateTime;
            this.currentDevice = { ...this.device };
          } else if (timeThan > 1000) {
            this.dataChangeTime = dateTime;
            this.updateDeviceList();
          }
          return;
        }
        if (['d0'].includes(value.slice(0, 2))) {
          this.currentDevice = { ...this.device };
          return;
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
    await this.updateDeviceList();
    // RSJournalStore.writeDataCache(this.logcatDetailed);
  }

  @action
  async getDescriptorsForDeviceInfo(params) {
    const { data } = params;
    await this.manager.descriptorsForDevice(data.deviceID, data.serviceUUID, data.uuid);
  }

  @action
  async devicesModules(val) {
    let hex = parseInt(val.slice(0, 2), 16) - 256;
    // if (!this.logcatDetailed[hex]) {
    //   this.logcatDetailed[hex] = '';
    // }
    // this.logcatDetailed[hex] += val + '\n';
    let params = {
      '-95': (e) => {
        let reg = [0, '0'].includes(e.slice(0, -1));
        if (this.needRegPassword && reg) {
          this.noPasswordTips = true;
        }
        if (reg) {
          this.needRegPassword = true;
        }
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
        this.deviceFormData['1'] += e + '\n';
        return list;
      },
      '-32': (e) => {
        let battery = e.match(/([\d\D]{2})/g);
        let data: any = this.device[hex] || {};
        data[battery[1]] = battery;
        this.deviceFormData['2'] += e + '\n';
        return data;
      },
      '-120': (e) => {
        let battery = e.match(/([\d\D]{2})/g);
        this.deviceFormData['3'] += e + '\n';
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
   * get UserDeviceSetting
   * url: /watch/device/list
   */
  @action
  async userDeviceSetting(bool): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const res: ApiResult = await Api.getInstance.post({
        url: '/watch/device/list',
        params: {},
        withToken: true
      });
      let data = res.data;
      if (bool) {
        if (res.code !== 200) {
          return resolve({ msg: res.msg, success: false });
        }
        if (data.device_list.length <= 0) {
          return resolve({ needBinding: true, name: this.devicesInfo.name });
        }
        if (!data.device_list.find((item) => item.device_mac === this.devicesInfo.id)) {
          return resolve({ needBinding: true, name: this.devicesInfo.name });
        }
      }
      if (!bool) {
        return resolve({ success: true, data: data.device_list });
      }
    });
  }

  /**
   * get updateDeviceList
   * url:
   */
  @action
  async updateDeviceList(): Promise<any> {
    let data = this.deviceFormData;
    if (data['1']) await this.updateDeviceData({ type: '1', value: data['1'] });
    if (data['2']) await this.updateDeviceData({ type: '2', value: data['2'] });
    if (data['3']) await this.updateDeviceData({ type: '3', value: data['3'] });
    if (data['4']) await this.updateDeviceData({ type: '4', value: data['4'] });
    if (data['5']) await this.updateDeviceData({ type: '5', value: data['5'] });
  }

  /**
   * get updateDeviceData
   * url: /watch/device/list
   */
  @action
  async updateDeviceData(params): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const res: ApiResult = await Api.getInstance.post({
        url: '/watch/data/save',
        params: {
          type: params.type,
          record_date: moment(new Date()).format('YYYY-MM-DD HH:mm'),
          device_mac: this.devicesInfo.id,
          raw_data: params.value
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
}
