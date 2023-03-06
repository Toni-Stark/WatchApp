import _, { memoize } from 'lodash';
import i18n from 'i18n-js';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import { Alert, Dimensions, PermissionsAndroid, Platform, StatusBar } from 'react-native';
import { SERVER_URL } from './app.config';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import { Buffer } from 'buffer';

export const t = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

export const throttle = (func: Function, throttleTime: number = 500) => {
  return _.throttle(func, throttleTime, {
    leading: true,
    trailing: false
  });
};

export const delay = (func: Function, delayTime: number = 500) => {
  return _.throttle(func, delayTime, {
    leading: false,
    trailing: true
  });
};

export const isBlank = (str: string) => {
  return str === null || str === undefined || str.trim() === '';
};

export const versionThanOld = (newVersion, oldVersion) => {
  let newList = newVersion.split('.');
  let oldList = oldVersion.split('.');
  for (let i = 0; i < newList.length || i < oldList.length; ++i) {
    let x = 0,
      y = 0;
    if (i < newList.length) {
      x = parseInt(newList[i]);
    }
    if (i < oldList.length) {
      y = parseInt(oldList[i]);
    }
    if (x > y) {
      return true;
    }
    if (x < y) {
      return false;
    }
  }
  return false;
};
export type ChartStatus = {
  text: string;
  id: number;
};
export const getChartStatus = (item): ChartStatus[] => {
  let list: ChartStatus[] = [];
  // 如果特征可以监控值的变化为true
  if (item.isNotifiable) list.push({ text: '可通知的', id: 1 });
  // 如果监控值随ACK变化为true
  if (item.isIndicatable) list.push({ text: '随ACK变化通知', id: 2 });
  // 如果监控值在没有ACK的情况下变化为true
  if (item.isNotifying) list.push({ text: '不随ACK变化通知', id: 5 });
  // 如果可以读取特征值为true
  if (item.isReadable) list.push({ text: '可读的', id: 3 });
  // 如果写入特征值有响应就为true
  if (item.isWritableWithResponse) list.push({ text: '有响应写入', id: 4 });
  // 如果可以无响应写入特征值就为true
  if (item.isWritableWithoutResponse) list.push({ text: '无响应写入', id: 6 });
  return list;
};

export const regCutString = (value): any => {
  console.log(value);
  let str = value.split(' ');
  let res = str.map((item) => {
    if (item.trim().length <= 1) {
      return '0' + item.trim();
    } else {
      return item;
    }
  });
  return res.toString().replace(/[,]/g, ' ');
};

let timer: any = null;
export const eventTimes = (callback: Function, time = 1000) => {
  try {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback();
    }, time);
  } catch (err) {
    console.log(err, 'errorMsg');
  }
};
let timerObject: any = {};
export const dateTimes = (callback: Function, time = 1000, tag) => {
  if (timerObject.hasOwnProperty(tag) && timerObject[tag]) {
    clearTimeout(timerObject[tag]);
  }
  timerObject[tag] = null;
  timerObject[tag] = setTimeout(() => {
    callback();
  }, time);
};

export const getAllFixString = (str, count) => {
  let str1 = ' ';
  for (let i = 0; i <= count; i++) {
    if (i !== count) {
      str1 += '00 ';
    } else {
      str1 += '00';
    }
  }
  return str1;
};

let times: any = null;
export const eventTimer = (callback: Function, time = 1000, stop) => {
  if (stop) {
    clearTimeout(times);
    times = null;
    return;
  }
  if (times !== null) return;
  times = setTimeout(() => {
    callback();
    clearTimeout(timer);
    timer = null;
  }, time);
};
let timeout: any = null;
export const eventTimeInterval = (callback: Function, time = 1000, stop) => {
  if (stop) {
    clearInterval(timeout);
    timeout = null;
    return;
  }
  clearInterval(timeout);
  timer = null;
  timeout = setInterval(() => {
    callback();
  }, time);
};
// 完善JSON序列化方法
export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export const getASCodeStr = (str) => {
  // let str = 'abcdefghijklmnopqrstuvwxyzACDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let arr = str.split('').map((item) => {
    return item.charCodeAt(0).toString(16);
  });
  // console.log(arr.toString().replaceAll(',', ''));
  return arr.toString().replace(/,/g, ' ');
};

// 10进制16进制转换
export const strToHex = (num): string => {
  if (num > -128 && num < 0) return (256 + num).toString(16);
  if (num >= 0 && num <= 15) return '0' + (num + 0).toString(16);
  if (num > 15 && num < 127) return (num + 0).toString(16);
  return (num + 0).toString(16);
};

export const getWeek = (num): string => {
  if (num === '1') return '一';
  if (num === '2') return '二';
  if (num === '3') return '三';
  if (num === '4') return '四';
  if (num === '5') return '五';
  if (num === '6') return '六';
  if (num === '7') return '日';
  return '日';
};

export const arrToByte = (arr, bool?: boolean): string => {
  let list = arr.map((item) => {
    if (bool) return parseInt(item, 16);
    return strToHex(item);
  });
  if (bool) return list;
  return list.toString().replace(/[,]/g, ' ');
};

export const rootByteArr = (arr): any => {
  let arr1 = new Array(20);
  arr1[0] = -124;
  arr1[1] = 1;
  for (let i = 0; i < arr; i++) {
    arr1[i + 2] = arr[i];
  }
  return arr1;
};

export const stringToByte = (value): Array<any> => {
  let str = value.replace(/\s*/g, '').split('');
  let index = 0;
  let val = '';
  let list: string[] = [];
  for (let i = 0; i < str.length; i++) {
    val += str[i];
    index++;
    if (index >= 2) {
      list.push('0x' + val);
      val = '';
      index = 0;
    }
  }
  return list;
};

export const stringToByteNoNum = (value): Array<any> => {
  let str = value.split(' ');
  let val = '';
  let list: any[] = [];
  for (let i = 0; i < str.length; i++) {
    val += str[i];
    list.push('0x' + val);
    val = '';
  }
  return list;
};

export const baseToHex = (str): any => {
  let buffer = Buffer.from(str, 'base64');
  return buffer.toString('hex');
};

export const arrSort = (arr, bool): Array<any> => {
  let fun = function (a, b) {
    if (bool) return b - a;
    return a - b;
  };
  return arr.sort(fun);
};

export const arrCount = (arr): number => {
  if (arr.length <= 0) return 0;
  let sum: number = 0;
  arr.forEach(function (num) {
    sum += num;
  });
  return sum;
};

export const getFileSize = (size?: string): string => {
  if (Number(size) > 900000) {
    return (Number(size) * 0.000001).toFixed(2) + 'MB';
  } else {
    return (Number(size) * 0.001).toFixed(2) + 'kb';
  }
};

export const deviceInfo = DeviceInfo.isTablet() ? (Platform.OS === 'ios' ? 3 : 4) : Platform.OS === 'ios' ? 1 : 2;

export const getSafeAvatar = (changeAvatar: string | undefined | null) => {
  if (changeAvatar && changeAvatar?.length > 0) {
    return { uri: SERVER_URL + '/xueyue/' + changeAvatar };
  } else {
    return { uri: '' };
  }
};

export const isIphoneX = () => {
  const window = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (window.height === 812 || window.width === 812 || window.height === 896 || window.width === 896)
  );
};

export const ifIphoneX = (iphoneXStyle, regularStyle) => {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
};

export const getStatusBarHeight = (safe) => {
  return Platform.select({
    ios: ifIphoneX(safe ? 44 : 30, 20),
    android: StatusBar.currentHeight,
    default: 0
  });
};

export const requestSaveImagePermission = async (): Promise<boolean> => {
  const err = '下载图片失败，请稍后重试。';
  if (Platform.OS === 'android') {
    const camera = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    if (camera !== 'granted') {
      return Promise.reject(err);
    }
    const photo = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    if (photo !== 'granted') {
      return Promise.reject(err);
    }
    return Promise.resolve(true);
  } else {
    const camera = await request(PERMISSIONS.IOS.CAMERA);
    if (camera !== 'granted') {
      return Promise.reject(err);
    }
    return Promise.resolve(true);
  }
};

export const getRandomStringByTime = () => {
  return `${Date.now()}${Math.round(Math.random() * 100000)}`;
};

export const getMinTen = (num) => {
  if (num >= 10) return num;
  return '0' + num;
};

export const getBottomSpace = () => {
  return isIphoneX() ? 34 : 0;
};

export const getOnlyWord = (str: string) => {
  const reg = /[`~!@#$%^&*()_+\-<>?:"{},./;'’[\]]/gi;
  return str.replace(reg, '');
};

export type NumberLike = string | number;

export const genRandomString = (len: number) => {
  const text = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const rdmIndex = (txt: string) => (Math.random() * txt.length) | 0;
  let rdmString = '';
  for (; rdmString.length < len; rdmString += text.charAt(rdmIndex(text)));
  return rdmString;
};

export const getStorage = async (name): Promise<string | null> => {
  return Promise.resolve(await AsyncStorage.getItem(name));
};

export const hasAndroidPermission = async () => {
  const permissions = [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION];
  const granteds = await PermissionsAndroid.requestMultiple(permissions);
  if (granteds['android.permission.ACCESS_FINE_LOCATION'] === 'granted' && granteds['android.permission.ACCESS_COARSE_LOCATION'] === 'granted') {
    return true;
  } else {
    Alert.alert('请开启定位权限', '请开启获取手机位置服务，否则系统部分功能将无法使用', [
      {
        text: '开启',
        onPress: () => {
          console.log('点击开启按钮');
          if (
            granteds['android.permission.ACCESS_FINE_LOCATION'] === 'never_ask_again' &&
            granteds['android.permission.ACCESS_COARSE_LOCATION'] === 'never_ask_again'
          ) {
            Alert.alert(
              '警告',
              '您将应用获取手机定位的权限设为拒绝且不再询问，功能无法使用!' + '想要重新打开权限，请到手机-设置-权限管理中允许[你的应用名称]app对该权限的获取'
            );
            return false;
          } else {
            //短时间第二次可以唤醒再次请求权限框，但是选项会从拒绝变为拒绝且不再询，如果选择该项则无法再唤起请求权限框
            // getPositionInit();
          }
        }
      },
      {
        text: '拒绝授权',
        onPress: () => {
          return false;
        }
      }
    ]);
  }
};
