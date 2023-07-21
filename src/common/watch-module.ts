import { CommonUtil } from './signing';
import { arrToByte, strToHexEny } from './tools';

export type dateType = 0 | 1 | 2 | 3;

/**
 * serviceUUID: 服务id;
 * uuid: 通知监听id;
 * */
export const mainListen = {
  serviceUUID: 'f0080001-0451-4000-B000-000000000000',
  uuid: 'f0080002-0451-4000-B000-000000000000'
};

/**
 * 密码验证主服务：密码 - 0000
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * */
export const passRegSign = (pass?: string) => {
  return {
    value: CommonUtil.getUtilHex(pass),
    serviceUUID: 'f0080001-0451-4000-B000-000000000000',
    uuid: 'f0080003-0451-4000-B000-000000000000'
  };
};

/**
 * 获取电池格数：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * */
export const batterySign = {
  value: arrToByte([-96, 1]),
  serviceUUID: 'f0080001-0451-4000-B000-000000000000',
  uuid: 'f0080003-0451-4000-B000-000000000000'
};

/**
 *  获取近日数据：
 *  serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * */
// -47
export const allDataSign = (e: dateType) => {
  return {
    value: arrToByte([-33, 1, 0, e]),
    serviceUUID: 'f0080001-0451-4000-B000-000000000000',
    uuid: 'f0080003-0451-4000-B000-000000000000'
  };
};

/**
 * 睡眠：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * */
export const allDataSleep = (e: dateType) => {
  return {
    value: arrToByte([-32, e]),
    serviceUUID: 'f0080001-0451-4000-B000-000000000000',
    uuid: 'f0080003-0451-4000-B000-000000000000'
  };
};
/**
 * 读取心率开始：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * */
export const allDataHeartStart = {
  value: arrToByte([-48, 1]),
  serviceUUID: 'f0080001-0451-4000-B000-000000000000',
  uuid: 'f0080003-0451-4000-B000-000000000000'
};
/**
 * 读取心率结束：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * */
export const allDataHeartEnd = {
  value: arrToByte([-48, 0]),
  serviceUUID: 'f0080001-0451-4000-B000-000000000000',
  uuid: 'f0080003-0451-4000-B000-000000000000'
};

/**
 * 体温：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * */
export const allDataC = (e: dateType) => {
  return {
    value: arrToByte([-120, 1, e, 1, 0]),
    serviceUUID: 'f0080001-0451-4000-B000-000000000000',
    uuid: 'f0080003-0451-4000-B000-000000000000'
  };
};

/**
 * 血氧检测开关：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * */
// value: arrToByte([-46, 1, 0, 0]),
export const bloodData = {
  value: arrToByte([-46, 1, 1, 0]),
  serviceUUID: 'f0080001-0451-4000-B000-000000000000',
  uuid: 'f0080003-0451-4000-B000-000000000000'
};

/**
 *  久坐数据：
 *  serviceUUID:服务id;
 *  uuid: 写入特征值id;
 * */
export const downData = {
  value: arrToByte([-31, 0, 0, 0, 0, 0, 0]),
  serviceUUID: 'f0080001-0451-4000-B000-000000000000',
  uuid: 'f0080003-0451-4000-B000-000000000000'
};

/**
 * 设置蓝牙名称：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * */
export const settingName = (str) => {
  return {
    value: arrToByte([-124, 1]) + ' ' + str,
    serviceUUID: 'f0080001-0451-4000-B000-000000000000',
    uuid: 'f0080003-0451-4000-B000-000000000000'
  };
};

/**
 * 更新蓝牙天气：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * */
export const updateWeather = (num) => {
  return {
    value: arrToByte([-56, 3, num, 0]),
    serviceUUID: 'f0080001-0451-4000-B000-000000000000',
    uuid: 'f0080003-0451-4000-B000-000000000000'
  };
};

/**
 * 关闭蓝牙长链接通信：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * */
export const closeSendInfo = (pass) => {
  return {
    value: CommonUtil.getUtilHex(pass),
    serviceUUID: 'f0080001-0451-4000-B000-000000000000',
    uuid: 'f0080003-0451-4000-B000-000000000000'
  };
};

/**
 * 设置语言：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
   CHINA, 1
   CHINA_TRADITIONAL, 2
   ENGLISH, 3
   JAPAN, 4
   KOREA, 5
   DEUTSCH, 6
   RUSSIA, 7
   SPANISH,8
   ITALIA, 9
   FRENCH, 10
   VIETNAM, 11
   PORTUGUESA, 12
   THAI, 13
   POLISH,14
   SWEDISH,15
   TURKISH,16
   DUTCH,17
   CZECH, 18
 * */
export type languageType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18;

export const settingDevicesLang = (e: languageType) => {
  return {
    value: arrToByte([-12, 1, e, 0]),
    serviceUUID: 'f0080001-0451-4000-B000-000000000000',
    uuid: 'f0080003-0451-4000-B000-000000000000'
  };
};
/**
 * 设置表盘：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * value: 0|1|2
 * */
export type screenType = 1 | 2 | 0;
export const settingDevicesStyles = (e: screenType) => {
  return {
    value: arrToByte([-57, 1, e, 0]),
    serviceUUID: 'f0080001-0451-4000-B000-000000000000',
    uuid: 'f0080003-0451-4000-B000-000000000000'
  };
};
/**
 * 设置消息：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * value: [number]
 * maxWidth: 17
 * */
export const settingDevicesMessage = (e: Array<number>) => {
  console.log(e, 'result');
  return {
    value: arrToByte([-83, 1, ...e]),
    serviceUUID: 'f0080001-0451-4000-B000-000000000000',
    uuid: 'f0080003-0451-4000-B000-000000000000'
  };
};

/**
 * 健康监测-心率-血压-血氧：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * 第一部分 value长度不能等于20
 * 心率监测 i-4
 * 血压监测 i-5
 * 血氧警报 i-10
 * 断开提醒 i-14
 * 睡眠全天 i-16
 * 第二部分 value不能和第一部分重合,且长度必须为20, 最后一位为1
 * 体温全天 i-4
 * 血糖监测 i-7
 * */
export type healthType = 1 | 2;
export const settingDevicesHeart = (e: string) => {
  return {
    value: arrToByte([-72, 1]) + ' ' + e,
    serviceUUID: 'f0080001-0451-4000-B000-000000000000',
    uuid: 'f0080003-0451-4000-B000-000000000000'
  };
};
/**
 * 心率警报设置：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * 设置：x最高值(默认115次), y最低值(默认55), e为(0|1)开关
 * 读取：x: 0, y: 0, e: 2
 * */
export const settingDevicesAlarm = (x, y, e) => {
  return {
    value: arrToByte([-84]) + ' ' + strToHexEny(x) + ' ' + strToHexEny(y) + ' ' + strToHexEny(e),
    serviceUUID: 'f0080001-0451-4000-B000-000000000000',
    uuid: 'f0080003-0451-4000-B000-000000000000'
  };
};
/**
 * 久坐提醒：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * 设置：
 * sh-sm 开始时间 (分钟数)
 * eh-em 结束时间 (分钟数)
 * t 多长时间提醒 (分钟数)
 * e 开关 (1|0)
 * */
export const settingDevicesLongSit = (sh, sm, eh, em, t, e) => {
  return {
    value: arrToByte([-31]) + ' ' + sh + ' ' + sm + ' ' + eh + ' ' + em + ' ' + t + ' ' + strToHexEny(e),
    serviceUUID: 'f0080001-0451-4000-B000-000000000000',
    uuid: 'f0080003-0451-4000-B000-000000000000'
  };
};
/**
 * 亮屏提醒：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * 设置：
 * sh-sm 开始时间 (分钟数)
 * eh-em 结束时间 (分钟数)
 * e 开关 (1|0)
 * s 灵敏度 (1|10)
 * */
export const settingDevicesScreenLight = (e, sh?: any, sm?: any, eh?: any, em?: any, s?: any) => {
  return {
    value: arrToByte([-86]) + ' ' + strToHexEny(e) + ' ' + sh + ' ' + sm + ' ' + sm + ' ' + em + ' ' + s,
    serviceUUID: 'f0080001-0451-4000-B000-000000000000',
    uuid: 'f0080003-0451-4000-B000-000000000000'
  };
};
/**
 * 血氧监控：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * 设置：
 * sh-sm 开始时间 (分钟数)
 * eh-em 结束时间 (分钟数)
 * e 开关 (1|0)
 * s 灵敏度 (1|10)
 * */
export const settingDevicesOxygen = (sh, sm, eh, em, e) => {
  return {
    value: arrToByte([-77, 0, 0]) + ' ' + strToHexEny(sh) + ' ' + strToHexEny(sm) + ' ' + strToHexEny(eh) + ' ' + strToHexEny(em) + ' ' + strToHexEny(e),
    serviceUUID: 'f0080001-0451-4000-B000-000000000000',
    uuid: 'f0080003-0451-4000-B000-000000000000'
  };
};
`
-89
a701000101010200021401010300000100040301
a700030400030300010105010101020401000102
a702110100000104010000000100000200000003
-83
ad02020202020002020002020202020202000002
-72
b802010101010000000001010000000001000000
b802000001010001000001000000000000000001
-95
a10000061995030502000001f5ca350654f20000
`;
`
-89
a701000101010200021401010300000100040301
a700030400030300010105010101020401000102
a702110100000104010000000100000200000003
-83
ad02010101010001010001010101010101000001
-72
b802010101010000000001010000000001000000
b802000001010001000001000000000000000001
-95
a10000061995030502000001f5ca350654f20000
`;
