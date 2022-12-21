import _, { memoize } from 'lodash';
import i18n from 'i18n-js';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import { Alert, Dimensions, Modal, PermissionsAndroid, Platform, StatusBar } from 'react-native';
import { SERVER_URL } from './app.config';
import AsyncStorage from '@react-native-community/async-storage';
import { LESSON_TYPE_DEMAND, LESSON_TYPE_LIVE } from './status-module';
import DeviceInfo from 'react-native-device-info';

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

export type ChartStatus = {
  text: string;
  id: number;
};
export const getChartStatus = (item): ChartStatus[] => {
  let list: ChartStatus[] = [];
  // 如果特征可以监控值的变化为true
  if (item.isNotifiable) list.push({ text: '可通知的', id: 1 });
  // 如果监控值随ACK变化为true
  if (item.isIndicatable) list.push({ text: '可通知的', id: 2 });
  // 如果监控值在没有ACK的情况下变化为true
  if (item.isNotifying) list.push({ text: '可通知的', id: 5 });
  // 如果可以读取特征值为true
  if (item.isReadable) list.push({ text: '可读的', id: 3 });
  // 如果写入特征值有响应就为true
  if (item.isWritableWithResponse) list.push({ text: '有响应写入', id: 4 });
  // 如果可以无响应写入特征值就为true
  if (item.isWritableWithoutResponse) list.push({ text: '无响应写入', id: 6 });
  return list;
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

export const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    if ((await check(PERMISSIONS.ANDROID.CAMERA)) !== 'granted') {
      if ((await request(PERMISSIONS.ANDROID.CAMERA)) !== 'granted') {
        return Promise.reject('操作需要相机权限');
      }
    }
    if ((await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)) !== 'granted') {
      if ((await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)) !== 'granted') {
        return Promise.reject('操作需要相册权限');
      }
    }
  } else {
    if ((await check(PERMISSIONS.IOS.CAMERA)) !== 'granted') {
      if ((await request(PERMISSIONS.IOS.CAMERA)) !== 'granted') {
        return Promise.reject('操作需要相机权限');
      }
    }
  }
  return Promise.resolve(true);
};

export const requestAudioAndVideoPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    if ((await check(PERMISSIONS.ANDROID.CAMERA)) !== 'granted') {
      if ((await request(PERMISSIONS.ANDROID.CAMERA)) !== 'granted') {
        return Promise.reject('操作需要相机权限');
      }
    }
    if ((await check(PERMISSIONS.ANDROID.RECORD_AUDIO)) !== 'granted') {
      if ((await request(PERMISSIONS.ANDROID.RECORD_AUDIO)) !== 'granted') {
        return Promise.reject('操作需要录音权限');
      }
    }
  } else {
    if ((await check(PERMISSIONS.IOS.CAMERA)) !== 'granted') {
      if ((await request(PERMISSIONS.IOS.CAMERA)) !== 'granted') {
        return Promise.reject('操作需要相机权限');
      }
    }
    if ((await check(PERMISSIONS.IOS.MICROPHONE)) !== 'granted') {
      if ((await request(PERMISSIONS.IOS.MICROPHONE)) !== 'granted') {
        return Promise.reject('操作需要录音权限');
      }
    }
  }
  return Promise.resolve(true);
};

export const getStorage = async (name): Promise<string | null> => {
  console.log(await AsyncStorage.getItem(name));
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
