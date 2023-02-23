import { CommonUtil } from './signing';
import { arrToByte } from './tools';

export type dateType = 0 | 1 | 2;

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
export const allDataSign = (e: dateType) => {
  return {
    value: arrToByte([-47, 1, 0, e]),
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
 * 血氧：
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
 * 血氧：
 * serviceUUID: 服务id;
 * uuid: 写入特征值id;
 * */
export const O2Data = {
  value: arrToByte([-72, 2]),
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

let list = `
88 01 00 02 00 01 00 01 0c 12 19 00 00 00 00 00 00 00 00 00
88 01 00 02 00 02 00 01 0c 12 1e 00 00 00 00 00 00 00 00 00
`;
let data1 = `
0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 
df010001b10402140000b20a00000023000000004000b3060000000000ff
df010001b10402150000b20a00000000000000003f01b3060000000000ff
df010001b10402140000b20a00000023000000004000b3060000000000ff
`;
