import { CommonUtil } from './signing';
import { arrToByte } from './tools';

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
    value: CommonUtil.getUtilHex(),
    serviceUUID: 'f0080001-0451-4000-B000-000000000000',
    uuid: 'f0080003-0451-4000-B000-000000000000'
  };
};

let list = `
88 01 00 02 00 01 00 01 0c 12 19 00 00 00 00 00 00 00 00 00
88 01 00 02 00 02 00 01 0c 12 1e 00 00 00 00 00 00 00 00 00
`;
let data1 = `
0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 
df 01 00 00 e3 00 0c 00 00 00 b9 35 e6 14 00 00 00 00 00 00
df 01 00 01 b1 04 03 1b 00 00 b2 0a 00 00 00 00 00 00 00 00
df 01 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 01 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 01 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 01 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 01 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 01 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 01 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 01 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 01 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 01 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 01 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 02 00 00 e3 00 0c 00 00 00 b9 fc 19 14 00 00 00 00 00 00
df 02 00 01 b1 04 03 1b 00 05 b2 0a 00 00 00 00 00 00 00 00
df 02 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 02 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 02 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 02 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 02 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 02 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 02 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 02 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 02 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 02 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 02 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 03 00 00 e3 00 0c 00 00 00 b9 a4 59 14 00 00 00 00 00 00
df 03 00 01 b1 04 03 1b 00 0a b2 0a 00 00 00 00 00 00 00 00
df 03 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 03 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 03 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 03 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 03 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 03 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 03 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 03 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 03 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 03 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 03 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 04 00 00 e3 00 0c 00 00 00 b9 6d a6 14 00 00 00 00 00 00
df 04 00 01 b1 04 03 1b 00 0f b2 0a 00 00 00 00 00 00 00 00
df 04 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 04 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 04 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 04 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 04 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 04 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 04 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 04 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 04 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 04 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 04 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 05 00 00 e3 00 0c 00 00 00 b9 14 d9 14 00 00 00 00 00 00
df 05 00 01 b1 04 03 1b 00 14 b2 0a 00 00 00 00 00 00 00 00
df 05 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 05 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 05 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 05 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 05 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 05 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 05 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 05 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 05 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 05 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 05 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 06 00 00 e3 00 0c 00 00 00 b9 36 ff 14 00 00 00 00 00 00
df 06 00 01 b1 04 03 1b 00 19 b2 0a 00 00 00 00 00 00 00 00
df 06 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 06 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 06 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 06 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 06 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 06 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 06 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 06 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 06 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 06 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 06 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 07 00 00 e3 00 0c 00 00 00 b9 85 66 14 00 00 00 00 00 00
df 07 00 01 b1 04 03 1b 00 1e b2 0a 00 00 00 00 00 00 00 00
df 07 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 07 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 07 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 07 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 07 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 07 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 07 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 07 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 07 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 07 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 07 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 08 00 00 e3 00 0c 00 00 00 b9 db 14 14 00 00 00 00 00 00
df 08 00 01 b1 04 03 1b 00 23 b2 0a 00 00 00 00 00 00 00 00
df 08 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 08 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 08 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 08 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 08 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 08 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 08 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 08 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 08 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 08 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 08 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 09 00 00 e3 00 0c 00 00 00 b9 77 98 14 00 00 00 00 00 00
df 09 00 01 b1 04 03 1b 00 28 b2 0a 00 00 00 00 00 00 00 00
df 09 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 09 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 09 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 09 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 09 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 09 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 09 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 09 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 09 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 09 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 09 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 0a 00 00 e3 00 0c 00 00 00 b9 be 67 14 00 00 00 00 00 00
df 0a 00 01 b1 04 03 1b 00 2d b2 0a 00 00 00 00 00 00 00 00
df 0a 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 0a 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 0a 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 0a 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 0a 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 0a 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 0a 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 0a 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 0a 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 0a 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 0a 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 01 00 00 e3 00 0c 00 00 00 b9 35 e6 14 00 00 00 00 00 00
df 01 00 01 b1 04 03 1b 00 00 b2 0a 00 00 00 00 00 00 00 00
df 01 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 01 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 01 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 01 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 01 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 01 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 01 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 01 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 01 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 01 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 01 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 05 00 00 e3 00 0c 00 00 00 b9 14 d9 14 00 00 00 00 00 00
df 05 00 01 b1 04 03 1b 00 14 b2 0a 00 00 00 00 00 00 00 00
df 05 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 05 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 05 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 05 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 05 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 05 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 05 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 05 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 05 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 05 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 05 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 09 00 00 e3 00 0c 00 00 00 b9 77 98 14 00 00 00 00 00 00
df 09 00 01 b1 04 03 1b 00 28 b2 0a 00 00 00 00 00 00 00 00
df 09 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 09 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 09 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 09 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 09 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 09 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 09 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 09 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 09 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 09 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 09 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 0d 00 00 e3 00 0c 00 00 00 b9 c7 37 14 00 00 00 00 00 00
df 0d 00 01 b1 04 03 1b 01 00 b2 0a 00 00 00 00 00 00 00 00
df 0d 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 0d 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 0d 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 0d 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 0d 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 0d 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 0d 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 0d 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 0d 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 0d 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 0d 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 11 00 00 e3 00 0c 00 00 00 b9 e6 08 14 00 00 00 00 00 00
df 11 00 01 b1 04 03 1b 01 14 b2 0a 00 00 00 00 00 00 00 00
df 11 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 11 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 11 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 11 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 11 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 11 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 11 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 11 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 11 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 11 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 11 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 15 00 00 e3 00 0c 00 00 00 b9 85 49 14 00 00 00 00 00 00
df 15 00 01 b1 04 03 1b 01 28 b2 0a 00 00 00 00 00 00 00 00
df 15 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 15 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 15 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 15 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 15 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 15 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 15 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 15 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 15 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 15 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 15 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 19 00 00 e3 00 0c 00 00 00 b9 d2 05 14 00 00 00 00 00 00
df 19 00 01 b1 04 03 1b 02 00 b2 0a 00 00 00 00 00 00 00 00
df 19 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 19 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 19 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 19 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 19 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 19 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 19 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 19 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 19 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 19 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 19 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 1d 00 00 e3 00 0c 00 00 00 b9 f3 3a 14 00 00 00 00 00 00
df 1d 00 01 b1 04 03 1b 02 14 b2 0a 00 00 00 00 00 00 00 00
df 1d 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 1d 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 1d 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 1d 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 1d 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 1d 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 1d 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 1d 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 1d 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 1d 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 1d 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 21 00 00 e3 00 0c 00 00 00 b9 90 7b 14 00 00 00 00 00 00
df 21 00 01 b1 04 03 1b 02 28 b2 0a 00 00 00 00 00 00 00 00
df 21 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 21 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 21 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 21 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 21 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 21 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 21 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 21 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 21 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 21 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 21 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 25 00 00 e3 00 0c 00 00 00 b9 20 d4 14 00 00 00 00 00 00
df 25 00 01 b1 04 03 1b 03 00 b2 0a 00 00 00 00 00 00 00 00
df 25 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 25 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 25 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 25 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 25 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 25 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 25 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 25 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 25 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 25 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 25 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 29 00 00 e3 00 0c 00 00 00 b9 01 eb 14 00 00 00 00 00 00
df 29 00 01 b1 04 03 1b 03 14 b2 0a 00 00 00 00 00 00 00 00
df 29 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 29 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 29 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 29 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 29 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 29 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 29 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 29 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 29 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 29 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 29 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 2d 00 00 e3 00 0c 00 00 00 b9 62 aa 14 00 00 00 00 00 00
df 2d 00 01 b1 04 03 1b 03 28 b2 0a 00 00 00 00 00 00 00 00
df 2d 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 2d 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 2d 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 2d 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 2d 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 2d 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 2d 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 2d 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 2d 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 2d 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 2d 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 31 00 00 e3 00 0c 00 00 00 b9 f8 61 14 00 00 00 00 00 00
df 31 00 01 b1 04 03 1b 04 00 b2 0a 00 00 00 00 00 00 00 00
df 31 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 31 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 31 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 31 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 31 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 31 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 31 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 31 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 31 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 31 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 31 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 35 00 00 e3 00 0c 00 00 00 b9 d9 5e 14 00 00 00 00 00 00
df 35 00 01 b1 04 03 1b 04 14 b2 0a 00 00 00 00 00 00 00 00
df 35 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 35 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 35 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 35 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 35 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 35 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 35 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 35 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 35 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 35 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 35 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 39 00 00 e3 00 0c 00 00 00 b9 ba 1f 14 00 00 00 00 00 00
df 39 00 01 b1 04 03 1b 04 28 b2 0a 00 00 00 00 00 00 00 00
df 39 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 39 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 39 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 39 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 39 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 39 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 39 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 39 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 39 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 39 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 39 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 3d 00 00 e3 00 0c 00 00 00 b9 0a b0 14 00 00 00 00 00 00
df 3d 00 01 b1 04 03 1b 05 00 b2 0a 00 00 00 00 00 00 00 00
df 3d 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 3d 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 3d 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 3d 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 3d 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 3d 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 3d 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 3d 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 3d 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 3d 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 3d 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 41 00 00 e3 00 0c 00 00 00 b9 2b 8f 14 00 00 00 00 00 00
df 41 00 01 b1 04 03 1b 05 14 b2 0a 00 00 00 00 00 00 00 00
df 41 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 41 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 41 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 41 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 41 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 41 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 41 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 41 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 41 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 41 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 41 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 45 00 00 e3 00 0c 00 00 00 b9 48 ce 14 00 00 00 00 00 00
df 45 00 01 b1 04 03 1b 05 28 b2 0a 00 00 00 00 00 00 00 00
df 45 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 45 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 45 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 45 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 45 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 45 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 45 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 45 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 45 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 45 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 45 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 49 00 00 e3 00 0c 00 00 00 b9 1f 82 14 00 00 00 00 00 00
df 49 00 01 b1 04 03 1b 06 00 b2 0a 00 00 00 00 00 00 00 00
df 49 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 49 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 49 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 49 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 49 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 49 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 49 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 49 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 49 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 49 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 49 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 4d 00 00 e3 00 0c 00 00 00 b9 3e bd 14 00 00 00 00 00 00
df 4d 00 01 b1 04 03 1b 06 14 b2 0a 00 00 00 00 00 00 00 00
df 4d 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 4d 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 4d 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 4d 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 4d 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 4d 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 4d 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 4d 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 4d 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 4d 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 4d 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 51 00 00 e3 00 0c 00 00 00 b9 5d fc 14 00 00 00 00 00 00
df 51 00 01 b1 04 03 1b 06 28 b2 0a 00 00 00 00 00 00 00 00
df 51 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 51 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 51 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 51 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 51 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 51 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 51 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 51 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 51 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 51 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 51 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 55 00 00 e3 00 0c 00 00 00 b9 ed 53 14 00 00 00 00 00 00
df 55 00 01 b1 04 03 1b 07 00 b2 0a 00 00 00 00 00 00 00 00
df 55 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 55 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 55 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 55 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 55 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 55 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 55 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 55 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 55 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 55 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 55 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 59 00 00 e3 00 0c 00 00 00 b9 68 87 14 00 00 00 00 00 00
df 59 00 01 b1 04 03 1b 07 14 b2 0a 00 00 00 01 00 00 00 00
df 59 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 59 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 59 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 59 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 59 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 59 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 59 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 59 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 59 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 59 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 59 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 5d 00 00 e3 00 0c 00 00 00 b9 0b c6 14 00 00 00 00 00 00
df 5d 00 01 b1 04 03 1b 07 28 b2 0a 00 00 00 01 00 00 00 00
df 5d 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 5d 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 5d 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 5d 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 5d 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 5d 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 5d 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 5d 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 5d 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 5d 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 5d 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 61 00 00 e3 00 0c 00 00 00 b9 ac a9 14 00 00 00 00 00 00
df 61 00 01 b1 04 03 1b 08 00 b2 0a 00 00 00 00 00 00 00 00
df 61 00 02 48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 61 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 61 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 61 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 61 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 61 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 61 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 61 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 61 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 61 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 61 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 65 00 00 e3 00 0c 00 00 00 b9 da b0 14 00 00 00 00 00 00
df 65 00 01 b1 04 03 1b 08 14 b2 0a 00 22 00 60 00 1a 00 11
df 65 00 02 49 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 65 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 65 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 65 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 65 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 65 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 65 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 65 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 65 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 65 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 65 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 69 00 00 e3 00 0c 00 00 00 b9 f5 fc 14 00 00 00 00 00 00
df 69 00 01 b1 04 03 1b 08 28 b2 0a 00 d9 00 f2 00 9e 00 68
df 69 00 02 35 00 b3 06 6a 8a 8a c0 ca 00 b4 05 7a 7e 6f 50
df 69 00 03 4f b5 05 00 00 00 00 00 b6 05 15 14 16 0c 0c b7
df 69 00 04 33 00 3e 37 38 37 38 3c 38 36 40 46 44 43 44 46
df 69 00 05 4b 4c 49 3b 3e 45 44 48 45 48 4b 48 4b 48 46 48
df 69 00 06 4c 4a 48 41 45 44 45 40 44 43 3d 38 3a 3c 3b 41
df 69 00 07 3b 3e 3b 3e b8 02 77 52 b9 1e 00 00 00 00 00 00
df 69 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 21 20
df 69 00 09 1f 21 21 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 69 00 0a 19 2b 35 4c 3c 1b 3b 44 33 24 25 3c 34 1d 0c 04
df 69 00 0b 15 14 06 06 06 04 06 15 15 16 bc 02 00 00 bd 05
df 69 00 0c 00 00 00 00 00 be 02 cc 01 00 00 00 e8 4c 80 00
df 6d 00 00 e3 00 0c 00 00 00 b9 d2 48 14 00 00 00 00 00 00
df 6d 00 01 b1 04 03 1b 09 00 b2 0a 00 c2 00 ed 00 a3 00 6a
df 6d 00 02 40 00 b3 06 d0 d0 d0 90 68 00 b4 05 6a 6f 6c 74
df 6d 00 03 68 b5 05 00 00 00 00 00 b6 05 15 14 15 14 16 b7
df 6d 00 04 33 00 33 70 73 6d 4f 38 40 59 67 65 60 4b 37 34
df 6d 00 05 2f 35 37 33 2e 33 34 32 35 3b 44 4a 44 45 44 46
df 6d 00 06 43 3e 36 38 3a 3e 40 3f 40 3f 3a 3e 39 40 44 40
df 6d 00 07 3b 3e 38 3b b8 02 73 50 b9 1e 00 00 00 00 00 00
df 6d 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 21
df 6d 00 09 21 21 2e 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 6d 00 0a 19 04 16 0b 0b 05 06 04 04 04 05 06 04 0d 15 13
df 6d 00 0b 24 33 3c 44 43 43 53 53 4b 43 bc 02 00 00 bd 05
df 6d 00 0c 00 00 00 00 00 be 02 f4 01 00 00 00 e8 4c 80 00
df 71 00 00 e3 00 0c 00 00 00 b9 e1 b3 14 00 00 00 00 00 00
df 71 00 01 b1 04 03 1b 09 14 b2 0a 00 00 00 00 00 00 00 00
df 71 00 02 48 01 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 71 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 71 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 71 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 71 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 71 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 71 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 71 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 71 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 71 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 71 00 0c 00 00 00 00 00 be 02 41 02 00 00 00 e8 4c 80 00
df 75 00 00 e3 00 0c 00 00 00 b9 d7 f2 14 00 00 00 00 00 00
df 75 00 01 b1 04 03 1b 09 28 b2 0a 00 00 00 00 00 00 00 00
df 75 00 02 48 01 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 75 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 75 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 75 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 75 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 75 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 75 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 75 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 75 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 75 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 75 00 0c 00 00 00 00 00 be 02 8d 02 00 00 00 e8 4c 80 00
df 79 00 00 e3 00 0c 00 00 00 b9 dd d8 14 00 00 00 00 00 00
df 79 00 01 b1 04 03 1b 0a 00 b2 0a 00 00 00 00 00 00 00 00
df 79 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 79 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 79 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 79 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 79 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 79 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 79 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 79 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 79 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 79 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 79 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 7d 00 00 e3 00 0c 00 00 00 b9 fc e7 14 00 00 00 00 00 00
df 7d 00 01 b1 04 03 1b 0a 14 b2 0a 00 00 00 00 00 00 00 00
df 7d 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 7d 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 7d 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 7d 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 7d 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 7d 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 7d 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 7d 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 7d 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 7d 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 7d 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 81 00 00 e3 00 0c 00 00 00 b9 9f a6 14 00 00 00 00 00 00
df 81 00 01 b1 04 03 1b 0a 28 b2 0a 00 00 00 00 00 00 00 00
df 81 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 81 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 81 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 81 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 81 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 81 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 81 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 81 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 81 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 81 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 81 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 85 00 00 e3 00 0c 00 00 00 b9 2f 09 14 00 00 00 00 00 00
df 85 00 01 b1 04 03 1b 0b 00 b2 0a 00 00 00 00 00 00 00 00
df 85 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 85 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 85 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 85 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 85 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 85 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 85 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 85 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 85 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 85 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 85 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 89 00 00 e3 00 0c 00 00 00 b9 aa dd 14 00 00 00 00 00 00
df 89 00 01 b1 04 03 1b 0b 14 b2 0a 00 00 00 01 00 00 00 00
df 89 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 89 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 89 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 89 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 89 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 89 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 89 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 89 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 89 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 89 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 89 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 8d 00 00 e3 00 0c 00 00 00 b9 6d 77 14 00 00 00 00 00 00
df 8d 00 01 b1 04 03 1b 0b 28 b2 0a 00 00 00 00 00 00 00 00
df 8d 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 8d 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 8d 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 8d 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 8d 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 8d 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 8d 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 8d 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 8d 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 8d 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 8d 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 91 00 00 e3 00 0c 00 00 00 b9 f7 bc 14 00 00 00 00 00 00
df 91 00 01 b1 04 03 1b 0c 00 b2 0a 00 00 00 00 00 00 00 00
df 91 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 91 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 91 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 91 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 91 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 91 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 91 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 91 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 91 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 91 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 91 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 95 00 00 e3 00 0c 00 00 00 b9 d6 83 14 00 00 00 00 00 00
df 95 00 01 b1 04 03 1b 0c 14 b2 0a 00 00 00 00 00 00 00 00
df 95 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 95 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 95 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 95 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 95 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 95 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 95 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 95 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 95 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 95 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 95 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 99 00 00 e3 00 0c 00 00 00 b9 b5 c2 14 00 00 00 00 00 00
df 99 00 01 b1 04 03 1b 0c 28 b2 0a 00 00 00 00 00 00 00 00
df 99 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 99 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 99 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 99 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 99 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 99 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 99 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 99 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 99 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 99 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 99 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df 9d 00 00 e3 00 0c 00 00 00 b9 05 6d 14 00 00 00 00 00 00
df 9d 00 01 b1 04 03 1b 0d 00 b2 0a 00 00 00 00 00 00 00 00
df 9d 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 9d 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 9d 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 9d 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 9d 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 9d 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 9d 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 9d 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 9d 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 9d 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 9d 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df a1 00 00 e3 00 0c 00 00 00 b9 24 52 14 00 00 00 00 00 00
df a1 00 01 b1 04 03 1b 0d 14 b2 0a 00 00 00 00 00 00 00 00
df a1 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df a1 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df a1 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df a1 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df a1 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df a1 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df a1 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df a1 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df a1 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df a1 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df a1 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df a5 00 00 e3 00 0c 00 00 00 b9 47 13 14 00 00 00 00 00 00
df a5 00 01 b1 04 03 1b 0d 28 b2 0a 00 00 00 00 00 00 00 00
df a5 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df a5 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df a5 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df a5 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df a5 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df a5 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df a5 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df a5 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df a5 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df a5 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df a5 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df a9 00 00 e3 00 0c 00 00 00 b9 10 5f 14 00 00 00 00 00 00
df a9 00 01 b1 04 03 1b 0e 00 b2 0a 00 00 00 00 00 00 00 00
df a9 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df a9 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df a9 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df a9 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df a9 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df a9 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df a9 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df a9 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df a9 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df a9 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df a9 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df ad 00 00 e3 00 0c 00 00 00 b9 31 60 14 00 00 00 00 00 00
df ad 00 01 b1 04 03 1b 0e 14 b2 0a 00 00 00 00 00 00 00 00
df ad 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df ad 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df ad 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df ad 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df ad 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df ad 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df ad 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df ad 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df ad 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df ad 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df ad 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df b1 00 00 e3 00 0c 00 00 00 b9 52 21 14 00 00 00 00 00 00
df b1 00 01 b1 04 03 1b 0e 28 b2 0a 00 00 00 00 00 00 00 00
df b1 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df b1 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df b1 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df b1 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df b1 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df b1 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df b1 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df b1 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df b1 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df b1 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df b1 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df b5 00 00 e3 00 0c 00 00 00 b9 e2 8e 14 00 00 00 00 00 00
df b5 00 01 b1 04 03 1b 0f 00 b2 0a 00 00 00 00 00 00 00 00
df b5 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df b5 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df b5 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df b5 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df b5 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df b5 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df b5 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df b5 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df b5 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df b5 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df b5 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df b9 00 00 e3 00 0c 00 00 00 b9 c3 b1 14 00 00 00 00 00 00
df b9 00 01 b1 04 03 1b 0f 14 b2 0a 00 00 00 00 00 00 00 00
df b9 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df b9 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df b9 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df b9 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df b9 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df b9 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df b9 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df b9 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df b9 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df b9 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df b9 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df bd 00 00 e3 00 0c 00 00 00 b9 a0 f0 14 00 00 00 00 00 00
df bd 00 01 b1 04 03 1b 0f 28 b2 0a 00 00 00 00 00 00 00 00
df bd 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df bd 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df bd 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df bd 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df bd 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df bd 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df bd 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df bd 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df bd 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df bd 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df bd 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df c1 00 00 e3 00 0c 00 00 00 b9 91 eb 14 00 00 00 00 00 00
df c1 00 01 b1 04 03 1b 10 00 b2 0a 00 00 00 00 00 00 00 00
df c1 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df c1 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df c1 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df c1 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df c1 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df c1 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df c1 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df c1 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df c1 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df c1 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df c1 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df c5 00 00 e3 00 0c 00 00 00 b9 b0 d4 14 00 00 00 00 00 00
df c5 00 01 b1 04 03 1b 10 14 b2 0a 00 00 00 00 00 00 00 00
df c5 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df c5 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df c5 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df c5 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df c5 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df c5 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df c5 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df c5 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df c5 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df c5 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df c5 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df c9 00 00 e3 00 0c 00 00 00 b9 d3 95 14 00 00 00 00 00 00
df c9 00 01 b1 04 03 1b 10 28 b2 0a 00 00 00 00 00 00 00 00
df c9 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df c9 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df c9 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df c9 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df c9 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df c9 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df c9 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df c9 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df c9 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df c9 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df c9 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df cd 00 00 e3 00 0c 00 00 00 b9 63 3a 14 00 00 00 00 00 00
df cd 00 01 b1 04 03 1b 11 00 b2 0a 00 00 00 00 00 00 00 00
df cd 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df cd 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df cd 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df cd 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df cd 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df cd 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df cd 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df cd 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df cd 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df cd 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df cd 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df d1 00 00 e3 00 0c 00 00 00 b9 42 05 14 00 00 00 00 00 00
df d1 00 01 b1 04 03 1b 11 14 b2 0a 00 00 00 00 00 00 00 00
df d1 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df d1 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df d1 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df d1 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df d1 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df d1 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df d1 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df d1 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df d1 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df d1 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df d1 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df d5 00 00 e3 00 0c 00 00 00 b9 21 44 14 00 00 00 00 00 00
df d5 00 01 b1 04 03 1b 11 28 b2 0a 00 00 00 00 00 00 00 00
df d5 00 02 48 02 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df d5 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df d5 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df d5 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df d5 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df d5 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df d5 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df d5 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df d5 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df d5 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df d5 00 0c 00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
df d9 00 00 e3 00 0c 00 00 00 b9 da 9b 14 00 00 00 00 00 00
df d9 00 01 b1 04 03 1b 12 00 b2 0a 00 00 00 4b 00 00 00 00
df d9 00 02 4a 01 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df d9 00 03 00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df d9 00 04 33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df d9 00 05 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df d9 00 06 ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df d9 00 07 ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df d9 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df d9 00 09 00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df d9 00 0a 19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df d9 00 0b 00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df d9 00 0c 00 00 00 00 00 be 02 93 01 00 00 00 e8 4c 80 00
df dd 00 00 e3 00 0c 00 00 00 b9 90 08 14 00 00 00 00 00 00
df dd 00 01 b1 04 03 1b 12 14 b2 0a 00 00 00 47 00 00 00 00
df dd 00 02 40 00 b3 06 90 88 c8 d0 88 00 b4 05 4d 4d 47 45
df dd 00 03 45 b5 05 00 00 00 00 00 b6 05 0c 08 0c 09 09 b7
df dd 00 04 33 00 4a 3b 3c 3b 3f 3b 3b 37 43 46 49 45 3a 3b
df dd 00 05 42 45 44 42 45 46 44 48 51 53 51 53 56 54 50 54
df dd 00 06 57 53 50 4e 4a 4d 4a 46 46 4c 45 43 4a 55 5b 5c
df dd 00 07 5b 4f 4c 4e b8 02 77 53 b9 1e 00 00 00 00 00 00
df dd 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 21 21
df dd 00 09 1b 20 27 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df dd 00 0a 19 03 04 05 23 03 13 14 13 14 0c 05 04 04 03 06
df dd 00 0b 04 04 04 03 06 04 04 04 04 05 bc 02 00 00 bd 05
df dd 00 0c 00 00 00 00 00 be 02 aa 01 00 00 00 e8 4c 80 00
df e1 00 00 e3 00 0c 00 00 00 b9 9b af 14 00 00 00 00 00 00
df e1 00 01 b1 04 03 1b 12 28 b2 0a 00 00 00 50 00 00 00 00
df e1 00 02 4a 00 b3 06 90 8a 68 88 90 00 b4 05 4a 4b 50 49
df e1 00 03 46 b5 05 00 00 00 00 00 b6 05 ff 0b 10 10 0d b7
df e1 00 04 33 00 40 3b 4a 4c ff 56 52 58 57 54 5b 57 54 57
df e1 00 05 54 5a 46 43 42 47 3f 4c ff 50 52 5e 60 5e 58 43
df e1 00 06 48 54 56 5d 57 48 46 49 45 41 56 60 5e 5e 55 46
df e1 00 07 4a 4d 43 40 b8 02 74 4f b9 1e 00 00 00 00 00 00
df e1 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 19 21
df e1 00 09 1b 21 21 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df e1 00 0a 19 13 03 04 0b 04 14 14 0b 0c 04 0b 03 03 03 0b
df e1 00 0b 04 03 04 03 04 04 04 04 05 0c bc 02 00 00 bd 05
df e1 00 0c 00 00 00 00 00 be 02 c0 01 00 00 00 e8 4c 80 00
df ff ff e3 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
`;
let geoLocation = {
  accuracy: 29,
  adCode: '500103',
  address: '重庆市渝中区经纬大道66号靠近华清远见嵌入式培训(重庆分中心)',
  altitude: 0,
  city: '重庆市',
  cityCode: '023',
  coordinateType: 'GCJ02',
  country: '中国',
  description: '在华清远见嵌入式培训(重庆分中心)附近',
  district: '渝中区',
  errorCode: 0,
  errorInfo: 'success',
  gpsAccuracy: -1,
  heading: 0,
  latitude: 29.547679,
  locationDetail: '#id:ELA==#csid:6e7780aae2364109a9914297f32db9bc',
  locationType: 2,
  longitude: 106.495963,
  poiName: '华清远见嵌入式培训(重庆分中心)',
  province: '重庆市',
  speed: 0,
  street: '经纬大道',
  streetNumber: '66号',
  timestamp: 1677656376216,
  trustedLevel: 1
};

//

`
df 09 00 01   b1 04 03 1b 00 28 b2 0a 00 00 00 00 00 00 00 00
df 09 00 02   48 03 b3 06 00 00 00 00 00 ff b4 05 00 00 00 00
df 09 00 03   00 b5 05 00 00 00 00 00 b6 05 ff ff ff ff ff b7
df 09 00 04   33 00 ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 09 00 05   ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 09 00 06   ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff
df 09 00 07   ff ff ff ff b8 02 00 00 b9 1e 00 00 00 00 00 00
df 09 00 08   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 09 00 09   00 00 00 00 00 00 00 00 ba 05 00 00 00 00 00 bb
df 09 00 0a   19 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
df 09 00 0b   00 00 00 00 00 00 00 00 00 00 bc 02 00 00 bd 05
df 09 00 0c   00 00 00 00 00 be 02 00 00 00 00 00 e8 4c 80 00
`;

// 睡眠数据
`
a1 - f4 02;
a2 - 08 aa 6f 15 f1 ff f9 98 1c;
a3 - 24 03 1c 01 23 03 1c 07 00 03 04 02 04 03 00 00 03 00 00 00 58 00 c3 00 2a 00 45 01 0c 00 00 00 00 00 3c 00 01
a4 - 2c 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e03d0201 a1 f4 02 a2 08 aa 6f 15 f1 ff f9 98 1c a3 24 03
e03c0201 1c 01 23 03 1c 07 00 03 04 02 04 03 00 00 03 00
e03b0201 00 00 58 00 c3 00 2a 00 45 01 0c 00 00 00 00 00
e03a0201 3c 00 01 a4 2c 00 00 00 00 00 00 00 00 00 00 00
e0390201 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e0380201 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e0370201 00 a5 8a 02 20 00 20 00 20 00 20 00 20 00 20 00
e0360201 20 00 20 00 40 00 40 00 00 00 20 00 20 00 20 00
e0350201 20 00 00 00 40 00 00 00 20 00 40 00 20 00 20 00
e0340201 00 00 40 00 20 00 00 00 00 00 00 00 00 00 20 00
e0330201 20 00 20 00 20 00 20 00 00 00 00 00 40 00 00 00
e0320201 20 00 20 00 20 00 20 00 20 00 20 00 20 00 00 00
e0310201 20 00 20 00 00 00 20 00 20 00 00 00 20 00 20 00
e0300201 40 00 20 00 20 00 40 00 20 00 00 00 20 00 20 00
e02f0201 20 00 20 00 00 00 20 00 20 00 20 00 20 00 00 00
e02e0201 20 00 00 00 20 00 20 00 00 00 20 00 20 00 20 00
e02d0201 40 00 00 00 20 00 00 00 20 00 20 00 20 00 00 00
e02c0201 20 00 20 00 20 00 00 00 20 00 40 00 20 00 00 00
e02b0201 00 00 00 00 20 00 20 00 20 00 40 00 20 00 40 00
e02a0201 20 00 20 00 20 00 20 00 20 00 20 00 00 00 20 00
e0290201 40 00 00 00 20 00 40 00 00 00 20 00 20 00 00 00
e0280201 20 00 00 00 20 00 20 00 20 00 00 00 00 00 20 00
e0270201 00 00 00 00 00 00 20 00 20 00 20 00 00 00 00 00
e0260201 20 00 40 00 20 00 20 00 00 00 20 00 20 00 20 00
e0250201 20 00 00 00 20 00 20 00 20 00 00 00 20 00 40 00
e0240201 00 00 20 00 20 00 20 00 20 00 40 00 00 00 20 00
e0230201 00 00 20 00 20 00 00 00 20 00 20 00 20 00 20 00
e0220201 20 00 40 00 20 00 20 00 20 00 00 00 40 00 20 00
e0210201 00 00 20 00 40 00 20 00 00 00 20 00 00 00 00 00
e0200201 20 00 00 00 20 00 00 00 00 00 00 00 40 00 20 00
e01f0201 20 00 20 00 40 00 20 00 20 00 40 00 20 00 20 00
e01e0201 00 00 20 00 00 00 20 00 20 00 40 00 20 00 20 00
e01d0201 00 00 20 00 20 00 40 00 40 00 40 00 00 00 20 00
e01c0201 20 00 20 00 20 00 20 00 20 00 40 00 20 00 00 00
e01b0201 20 00 40 00 20 00 20 00 40 00 00 00 20 00 00 00
e01a0201 20 00 20 00 40 00 20 00 20 00 20 00 20 00 20 00
e0190201 00 00 20 00 20 00 20 00 40 00 00 00 20 00 00 00
e0180201 00 00 20 00 20 00 00 00 00 00 20 00 20 00 20 00
e0170201 20 00 20 00 00 00 20 00 20 00 20 00 00 00 20 00
e0160201 00 00 20 00 00 00 20 00 00 00 20 00 20 00 40 00
e0150201 00 00 20 00 20 00 20 00 40 00 20 00 00 00 20 00
e0140201 20 00 00 00 20 00 00 00 00 00 20 00 00 00 00 00
e0130201 20 00 40 00 00 00 20 00 00 00 20 00 20 00 20 00
e0120201 20 00 20 00 00 00 00 00 00 00 00 00 20 00 00 00
e0110201 20 00 20 00 00 00 00 00 40 00 20 00 20 00 40 00
e0100201 40 00 20 00 40 00 40 00 20 00 20 00 40 00 40 00
e00f0201 20 00 20 00 20 80 20 80 20 80 20 80 20 80 a6 02
e00e0201 00 01 00 00 a1 e0 00 a2 08 48 8f 15 f1 1d da 7a
                   3 28        3 28  
e00d0201 e4 a3 24 03 1c 07 00 03 1c 08 00 03 04 02 04 03
                           67      229 35        385
e00c0201 02 00 03 00 00 00 67 00 e5 00 35 00 81 01 0c 00
e00b0201 00 00 00 00 3c 00 01 a4 2c 00 00 00 00 00 00 00
e00a0201 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e0090201 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e0080201 00 00 00 00 00 a5 78 00 45 40 20 00 20 00 20 00
e0070201 40 00 20 00 20 00 00 00 20 00 40 00 40 00 00 00
e0060201 00 00 00 00 00 00 20 00 00 00 20 00 20 00 20 00
e0050201 20 00 00 00 00 00 20 00 00 00 00 00 20 00 20 00
e0040201 20 00 00 00 20 00 20 00 00 00 40 00 40 00 20 00
e0030201 20 00 20 00 20 00 40 00 20 00 20 00 20 00 20 00
e0020201 20 00 20 00 20 00 40 00 20 00 20 00 20 00 20 00
e0010201 20 00 40 00 40 00 40 00 40 00 40 00 40 00 20 00
e0000201 a6 02 01 ff 00 00 00 00 00 00 00 00 00 00 00 00
`;
// 温度数据
`
                         36.1 30.0
8801007b000100031c 00 00 6901 2c01 0000000000
8801007b000200031c 00 05 6901 3401 0000000000
8801007b000300031c 00 0a 6901 3401 0000000000
8801007b000400031c 00 0f 6901 2b01 0000000000
8801007b000500031c 00 14 6901 2b01 0000000000
8801007b000600031c 00 19 6901 2a01 0000000000
8801007b000700031c 00 1e 6901 2a01 0000000000
8801007b000800031c 00 23 6901 2e01 0000000000
8801007b000900031c 00 28 6901 2e01 0000000000
8801007b000a00031c 00 2d 6b01 4101 0000000000
8801007b000b00031c 00 32 6b01 4101 0000000000
8801007b000c00031c 00 37 6f01 5301 0000000000
8801007b000d00031c 01 00 6f01 5301 0000000000
8801007b000e00031c 01 05 7101 5901 0000000000
8801007b000f00031c 01 0a 7101 5901 0000000000
8801007b001000031c 01 0f 7101 5901 0000000000
8801007b001100031c 01 14 7101 5901 0000000000
8801007b001200031c 01 19 7301 5e01 0000000000
8801007b001300031c 01 1e 7301 5e01 0000000000
8801007b001400031c 01 23 7601 6501 0000000000
8801007b001500031c 01 28 7601 6501 0000000000
8801007b001600031c 01 2d 7701 6701 0000000000
8801007b001700031c 01 32 7701 6701 0000000000
8801007b001800031c 01 37 7701 6901 0000000000
8801007b001900031c 02 00 7701 6901 0000000000
8801007b001a00031c 02 05 7801 6901 0000000000
8801007b001b00031c 02 0a 7801 6901 0000000000
8801007b001c00031c 02 0f 7701 6801 0000000000
8801007b001d00031c 02 14 7701 6801 0000000000
8801007b001e00031c 02 19 7701 6701 0000000000
8801007b001f00031c 02 1e 7701 6701 0000000000
8801007b002000031c 02 23 7701 6701 0000000000
8801007b002100031c 02 28 7701 6701 0000000000
8801007b002200031c 02 2d 7801 6901 0000000000
8801007b002300031c 02 32 7801 6901 0000000000
8801007b002400031c 02 37 7801 6a01 0000000000
8801007b002500031c 03 00 7801 6a01 0000000000
8801007b002600031c 03 05 7801 6a01 0000000000
8801007b002700031c 03 0a 7801 6a01 0000000000
8801007b002800031c 03 0f 7801 6a01 0000000000
8801007b002900031c 03 14 7801 6a01 0000000000
8801007b002a00031c 03 19 7801 6b01 0000000000
8801007b002b00031c 03 1e 7801 6b01 0000000000
8801007b002c00031c 03 23 7701 6801 0000000000
8801007b002d00031c 03 28 7701 6801 0000000000
8801007b002e00031c 03 2d 7701 6701 0000000000
8801007b002f00031c 03 32 7701 6701 0000000000
8801007b003000031c 03 37 7601 6401 0000000000
8801007b003100031c 04 00 7601 6401 0000000000
8801007b003200031c 04 05 7601 6601 0000000000
8801007b003300031c 04 0a 7601 6601 0000000000
8801007b003400031c 04 0f 7601 6601 0000000000
8801007b003500031c 04 14 7601 6601 0000000000
8801007b003600031c 04 19 7101 5801 0000000000
8801007b003700031c 04 1e 7101 5801 0000000000
8801007b003800031c 04 23 7101 5801 0000000000
8801007b003900031c 04 28 7101 5801 0000000000
8801007b003a00031c 04 2d 7201 5c01 0000000000
8801007b003b00031c 04 32 7201 5c01 0000000000
8801007b003c00031c 04 37 7301 5f01 0000000000
8801007b003d00031c 05 00 7301 5f01 0000000000
8801007b003e00031c 05 05 7401 6001 0000000000
8801007b003f00031c 05 0a 7401 6001 0000000000
8801007b004000031c 05 0f 7501 6401 0000000000
8801007b004100031c 05 14 7501 6401 0000000000
8801007b004200031c 05 19 7601 6701 0000000000
8801007b004300031c 05 1e 7601 6701 0000000000
8801007b004400031c 05 23 7601 6701 0000000000
8801007b004500031c 05 28 7601 6701 0000000000
8801007b004600031c 05 2d 7401 6101 0000000000
8801007b004700031c 05 32 7401 6101 0000000000
8801007b004800031c 05 37 7401 6201 0000000000
8801007b004900031c 06 00 7401 6201 0000000000
8801007b004a00031c 06 05 7201 5a01 0000000000
8801007b004b00031c 06 0a 7201 5a01 0000000000
8801007b004c00031c 06 0f 7001 5501 0000000000
8801007b004d00031c 06 14 7001 5501 0000000000
8801007b004e00031c 06 19 7001 5401 0000000000
8801007b004f00031c 06 1e 7001 5401 0000000000
8801007b005000031c 06 23 7201 5c01 0000000000
8801007b005100031c 06 28 7201 5c01 0000000000
8801007b005200031c 06 2d 7501 6201 0000000000
8801007b005300031c 06 32 7501 6201 0000000000
8801007b005400031c 06 37 7701 6901 0000000000
8801007b005500031c 07 00 7701 6901 0000000000
8801007b005600031c 07 05 7901 6d01 0000000000
8801007b005700031c 07 0a 7901 6d01 0000000000
8801007b005800031c 07 0f 7001 5601 0000000000
8801007b005900031c 07 14 7001 5601 0000000000
8801007b005a00031c 07 19 7001 5501 0000000000
8801007b005b00031c 07 1e 7001 5501 0000000000
8801007b005c00031c 07 23 6f01 5301 0000000000
8801007b005d00031c 07 28 6f01 5301 0000000000
8801007b005e00031c 07 2d 6f01 5201 0000000000
8801007b005f00031c 07 32 6f01 5201 0000000000
8801007b006000031c 07 37 6d01 4c01 0000000000
8801007b006100031c 08 00 6d01 4c01 0000000000
8801007b006200031c 08 05 6d01 4c01 0000000000
8801007b006300031c 08 0a 6d01 4c01 0000000000
8801007b006400031c 08 0f 6a01 3601 0000000000
8801007b006500031c 08 14 6a01 3601 0000000000
8801007b006600031c 08 19 6b01 3e01 0000000000
8801007b006700031c 08 1e 6b01 3e01 0000000000
8801007b006800031c 08 23 6901 2b01 0000000000
8801007b006900031c 08 28 6901 2b01 0000000000
8801007b006a00031c 08 2d 6a01 3901 0000000000
8801007b006b00031c 08 32 6a01 3901 0000000000
8801007b006c00031c 08 37 6e01 4d01 0000000000
8801007b006d00031c 09 00 6e01 4d01 0000000000
8801007b006e00031c 09 05 6d01 4901 0000000000
8801007b006f00031c 09 0a 6d01 4901 0000000000
8801007b007000031c 09 0f 6e01 4c01 0000000000
8801007b007100031c 09 14 6e01 4c01 0000000000
8801007b007200031c 09 19 6e01 4f01 0000000000
8801007b007300031c 09 1e 6e01 4f01 0000000000
8801007b007400031c 09 23 6e01 4e01 0000000000
8801007b007500031c 09 28 6e01 4e01 0000000000
8801007b007600031c 09 2d 6d01 4c01 0000000000
8801007b007700031c 09 32 6d01 4c01 0000000000
8801007b007800031c 09 37 6e01 4e01 0000000000
8801007b007900031c 0a 00 6e01 4e01 0000000000
8801007b007a00031c 0a 05 6d01 4901 0000000000
8801007b007b00031c 0a 0a 6d01 4901 0000000000
`;
// gw睡眠数据
`
e0420401 a1 e0 00 a2 08 87 e0 15 f1 a0 9a 9f 70 a3 24 03
e0410401 1c 01 23 03 1c 02 23 03 04 02 04 03 00 00 03 00
e0400401 00 00 0e 00 20 00 0e 00 3c 00 16 00 00 00 00 00
e03f0401 3c 00 01 a4 2c 00 00 00 00 00 00 00 00 00 00 00
e03e0401 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e03d0401 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e03c0401 00 a5 78 00 20 00 20 80 20 80 20 80 20 00 00 00
e03b0401 40 80 40 00 40 00 00 00 20 00 20 00 40 00 00 00
e03a0401 20 00 20 00 40 00 00 00 40 00 40 00 20 00 00 00
e0390401 00 00 00 00 20 00 20 00 00 00 20 00 20 00 20 00
e0380401 00 00 20 00 20 00 40 00 20 00 00 00 20 00 00 00
e0370401 00 00 20 00 00 00 20 00 00 00 40 00 20 00 40 00
e0360401 20 00 20 00 40 00 20 00 20 00 40 00 20 00 20 00
e0350401 40 00 40 00 20 80 20 00 20 00 20 80 a6 02 00 01
e0340401 a1 14 01 a2 08 bd 0d 15 f1 ec b6 1e 7e a3 24 03
e0330401 1c 02 23 03 1c 04 00 03 04 02 04 03 00 00 03 00
e0320401 00 00 23 00 52 00 1c 00 91 00 16 00 00 00 00 00
e0310401 3c 00 01 a4 2c 00 00 00 00 00 00 00 00 00 00 00
e0300401 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e02f0401 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e02e0401 00 a5 aa 00 20 00 40 00 40 00 20 80 40 80 40 00
e02d0401 20 00 40 00 40 00 20 00 20 00 40 00 00 00 20 00
e02c0401 00 00 00 00 20 00 20 00 20 00 20 00 20 00 00 00
e02b0401 20 00 00 00 20 00 20 00 20 00 20 00 20 00 00 00
e02a0401 00 00 00 00 20 00 20 00 20 00 00 00 00 00 20 00
e0290401 00 00 20 00 20 00 20 00 20 00 20 00 20 00 00 00
e0280401 00 00 20 00 20 00 20 00 00 00 20 00 40 00 40 00
e0270401 00 00 00 00 40 00 00 00 20 00 20 00 00 00 20 00
e0260401 20 00 20 00 20 00 20 00 20 00 20 00 20 00 20 00
e0250401 20 00 20 00 40 00 20 00 20 00 40 00 20 00 40 00
e0240401 20 00 40 00 40 80 40 00 20 00 20 80 40 80 a6 02
e0230401 01 01 00 00 a1 50 01 a2 08 48 b9 15 f1 3a dd 79
e0220401 c9 a3 24 03 1c 04 00 03 1c 05 37 03 04 02 04 03
e0210401 00 00 03 00 00 00 42 00 93 00 2f 00 04 01 16 00
e0200401 00 00 00 00 3c 00 01 a4 2c 00 00 00 00 00 00 00
e01f0401 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e01e0401 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e01d0401 00 00 00 00 00 a5 e6 00 40 80 40 80 20 80 20 00
e01c0401 00 00 20 00 20 80 00 00 20 00 20 00 40 00 40 00
e01b0401 20 00 20 00 00 00 20 00 20 00 00 00 20 00 20 00
e01a0401 20 00 20 00 20 00 20 00 20 00 40 00 20 00 20 00
e0190401 00 00 20 00 00 00 20 00 00 00 20 00 20 00 20 00
e0180401 00 00 20 00 00 00 00 00 00 00 20 00 00 00 00 00
e0170401 20 00 20 00 20 00 20 00 20 00 00 00 20 00 00 00
e0160401 40 00 40 00 00 00 00 00 00 00 00 00 20 00 00 00
e0150401 20 00 20 00 00 00 20 00 00 00 40 00 00 00 20 00
e0140401 20 00 20 00 20 00 20 00 20 00 20 00 00 00 20 00
e0130401 20 00 20 00 20 00 00 00 20 00 20 00 40 00 00 00
e0120401 00 00 20 00 40 80 20 00 20 80 40 80 40 00 20 00
e0110401 20 00 20 00 20 00 20 00 00 00 40 80 20 80 20 00
e0100401 40 00 20 80 40 00 40 00 40 00 40 00 20 00 40 00
e00f0401 20 00 20 00 40 00 20 00 20 80 40 00 40 00 a6 02
e00e0401 01 01 00 00 a1 ec 00 a2 08 4b f0 15 f1 ae e8 97
e00d0401 dc a3 24 03 1c 05 37 03 1c 07 01 03 03 02 03 03
                                      (52)   (5:26)    
e00c0401 00 00 02 01 00 00 4b 00 c1 00 34 00 46 01 16 00
e00c0401 00 00 02 01 00 00 4b 00 c1 00 34 00 46 01 16 00
e00b0401 06 00 0b 00 3c 00 01 a4 2c 00 00 00 00 00 00 00
e00a0401 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e0090401 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e0080401 00 00 00 00 00 a5 84 00 40 80 85 00 80 80 80 80
e0070401 85 c0 80 00 80 00 20 00 20 00 20 00 20 00 20 00
e0060401 40 00 20 00 25 00 20 00 00 00 20 00 20 00 20 00
e0050401 40 00 20 00 20 00 20 00 20 00 40 00 00 00 20 00
e0040401 20 00 20 00 25 00 40 00 20 00 20 00 20 80 20 00
e0030401 20 00 20 00 20 00 20 00 00 00 20 00 20 00 20 00
e0020401 20 00 20 00 20 00 20 00 00 00 20 00 20 00 20 00
e0010401 40 00 20 00 40 00 20 00 20 00 20 00 20 00 20 00
e0000401 40 00 20 00 20 00 40 00 40 00 25 80 a6 02 01 ff
`;
`
a701000101010200021401010300000100040301
a700030400030300010105010101020401000102
a702110100000104010000000100000200000003
ad02020202020002020002020202020202000001
b802010101010000000001010000000001000000
b802000001010001000001000000000000000001
a10000061995030502000001f5ca350654f20000
`;
`
a701000101010100051401010300000100060301
a700030400030300000105010103020003000102
a702110001000104010000000100000201010003
ad02010201020002010002020201020202000001
ad02020201020002000000000000000000000010
b802010102020000000001010000000000000000
b802000002010002000001000000000000000001
bd03010000010100000000000000000000000000
a100000625ac005704000001dad5f16ddf4a0000
`;

`
e0420401  a1 e0 00 a2 08 87 e0 15 f1 a0 9a 9f 70 a3 24 03
              1:35  3-28  2:35
e0410401  1c 01 23 03 1c 02 23 03 04 02 04 03 00 00 03 00
e0400401  00 00 0e 00 20 00 0e 00 3c 00 16 00 00 00 00 00
e03f0401  3c 00 01 a4 2c 00 00 00 00 00 00 00 00 00 00 00
e03e0401  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e03d0401  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e03c0401  00 a5 78 00 20 00 20 80 20 80 20 80 20 00 00 00
e03b0401  40 80 40 00 40 00 00 00 20 00 20 00 40 00 00 00
e03a0401  20 00 20 00 40 00 00 00 40 00 40 00 20 00 00 00
e0390401  00 00 00 00 20 00 20 00 00 00 20 00 20 00 20 00
e0380401  00 00 20 00 20 00 40 00 20 00 00 00 20 00 00 00
e0370401  00 00 20 00 00 00 20 00 00 00 40 00 20 00 40 00
e0360401  20 00 20 00 40 00 20 00 20 00 40 00 20 00 20 00
e0350401  40 00 40 00 20 80 20 00 20 00 20 80 a6 02 00 01
e0340401  a1 14 01 a2 08 bd 0d 15 f1 ec b6 1e 7e a3 24 03
e0330401  1c 02 23 03 1c 04 00 03 04 02 04 03 00 00 03 00
e0320401  00 00 23 00 52 00 1c 00 91 00 16 00 00 00 00 00
e0310401  3c 00 01 a4 2c 00 00 00 00 00 00 00 00 00 00 00
e0300401  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e02f0401  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e02e0401  00 a5 aa 00 20 00 40 00 40 00 20 80 40 80 40 00
e02d0401  20 00 40 00 40 00 20 00 20 00 40 00 00 00 20 00
e02c0401  00 00 00 00 20 00 20 00 20 00 20 00 20 00 00 00
e02b0401  20 00 00 00 20 00 20 00 20 00 20 00 20 00 00 00
e02a0401  00 00 00 00 20 00 20 00 20 00 00 00 00 00 20 00
e0290401  00 00 20 00 20 00 20 00 20 00 20 00 20 00 00 00
e0280401  00 00 20 00 20 00 20 00 00 00 20 00 40 00 40 00
e0270401  00 00 00 00 40 00 00 00 20 00 20 00 00 00 20 00
e0260401  20 00 20 00 20 00 20 00 20 00 20 00 20 00 20 00
e0250401  20 00 20 00 40 00 20 00 20 00 40 00 20 00 40 00
e0240401  20 00 40 00 40 80 40 00 20 00 20 80 40 80 a6 02
e0230401  01 01 00 00 a1 50 01 a2 08 48 b9 15 f1 3a dd 79
                    3-28  4:00  3-28  5:55 
e0220401  c9 a3 24 03 1c 04 00 03 1c 05 37 03 04 02 04 03
e0210401  00 00 03 00 00 00 42 00 93 00 2f 00 04 01 16 00
e0200401  00 00 00 00 3c 00 01 a4 2c 00 00 00 00 00 00 00
e01f0401  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e01e0401  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e01d0401  00 00 00 00 00 a5 e6 00 40 80 40 80 20 80 20 00
e01c0401  00 00 20 00 20 80 00 00 20 00 20 00 40 00 40 00
e01b0401  20 00 20 00 00 00 20 00 20 00 00 00 20 00 20 00
e01a0401  20 00 20 00 20 00 20 00 20 00 40 00 20 00 20 00
e0190401  00 00 20 00 00 00 20 00 00 00 20 00 20 00 20 00
e0180401  00 00 20 00 00 00 00 00 00 00 20 00 00 00 00 00
e0170401  20 00 20 00 20 00 20 00 20 00 00 00 20 00 00 00
e0160401  40 00 40 00 00 00 00 00 00 00 00 00 20 00 00 00
e0150401  20 00 20 00 00 00 20 00 00 00 40 00 00 00 20 00
e0140401  20 00 20 00 20 00 20 00 20 00 20 00 00 00 20 00
e0130401  20 00 20 00 20 00 00 00 20 00 20 00 40 00 00 00
e0120401  00 00 20 00 40 80 20 00 20 80 40 80 40 00 20 00
e0110401  20 00 20 00 20 00 20 00 00 00 40 80 20 80 20 00
e0100401  40 00 20 80 40 00 40 00 40 00 40 00 20 00 40 00
e00f0401  20 00 20 00 40 00 20 00 20 80 40 00 40 00 a6 02
                                     75
e00e0401  01 01 00 00 a1 ec 00 a2 08 4b f0 15 f1 ae e8 97
                    3 28 (5:55) 3 28 (7:01) 
e00d0401  dc a3 24 03 1c 05 37 03 1c 07 01 03 03 02 03 03
                            75    193   52
e00c0401  00 00 02 01 00 00 4b 00 c1 00 34 00 46 01 16 00
          6
e00b0401  06 00 0b 00 3c 00 01 a4 2c 00 00 00 00 00 00 00
e00a0401  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e0090401  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
e0080401  00 00 00 00 00 a5 84 00 40 80 85 00 80 80 80 80
e0070401  85 c0 80 00 80 00 20 00 20 00 20 00 20 00 20 00
e0060401  40 00 20 00 25 00 20 00 00 00 20 00 20 00 20 00
e0050401  40 00 20 00 20 00 20 00 20 00 40 00 00 00 20 00
e0040401  20 00 20 00 25 00 40 00 20 00 20 00 20 80 20 00
e0030401  20 00 20 00 20 00 20 00 00 00 20 00 20 00 20 00
e0020401  20 00 20 00 20 00 20 00 00 00 20 00 20 00 20 00
e0010401  40 00 20 00 40 00 20 00 20 00 20 00 20 00 20 00
e0000401  40 00 20 00 20 00 40 00 40 00 25 80 a6 02 01 ff
`;
`
df050000   b6000c00 0000b915 44140000 00000000
df050001   b1040404 0014b20a 00000003 00000000
df050002   4000b306 d0303830 3000b405 4b454846
df050003   43b50500 00000000 b605ff09 0a0c0db7
df050004   3300513f 3e3a3942 48535957 56545654
df050005   51555154 524d5051 52514f54 55535751
df050006   50525654 4f555753 595a5956 58565257
df050007   54565453 b8027b4c b91e6161 61616100
df050008   00000000 00000000 00000000 0000212f
df050009   231a2100 00000000 ba050003 000000bb
df05000a   19040406 06040102 01010101 01010101
df05000b   01010103 01030101 0101bc02 0000bd05
df05000c   00000000 00be0280 01000000 e84c8000

`;
`
{"deviceID":"F2:54:06:35:CA:F5","name":"E400","time":"2023-03-30"}
`;
