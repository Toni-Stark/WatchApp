import { strToHex } from './tools';

export const getHexBits = (val): any => {
  return ((((val | 0) & 0xff) + 128) % 256) - 128;
};
const getHexBytes = (x): any => {
  let radical = strToHex(x);
  let hex = strToHex(getHexBits(x));
  let str = radical.split(hex)[0];
  let res = str.slice(-2, str.length);
  return res.length > 1 ? res : res.length === 0 ? '00' : '0' + res;
};

// 生成密码密匙
export const createSigning = (arg) => {
  let byte: Array<string> = [];
  byte[0] = strToHex(arg[0]);
  byte[1] = strToHex(getHexBits(parseInt(arg[1])));
  byte[2] = getHexBytes(parseInt(arg[1]));
  byte[3] = arg[2] ? strToHex(arg[2]) : '00';
  let year = strToHex(arg[3]).toString();

  byte[4] = '00';
  byte[5] = '00';
  if (year.length % 2 !== 0) {
    let length = year.length;
    for (let k = 1; k <= Math.ceil(length / 2); k++) {
      let res = year.slice(k - 1, 2 * k - 1);
      let reg = length % 2 !== 0 && k % 2 !== 0;
      byte[3 + k] = reg ? '0' + res : res;
    }
  }
  for (let j = 5; j < arg.length + 1; j++) {
    byte[j + 1] = strToHex(arg[j - 1]);
  }
  return byte;
};

// 生成密码访问code
export class CommonUtil {
  public static bytesToHexString<Object>(src): string {
    let word = /[,]/;
    let str = createSigning(src).toString();
    while (word.test(str)) str = str.replace(word, '').trim();
    return str;
  }
  public static getSysMonth() {
    return new Date().getMonth() + 1;
  }
  public static getSysYear() {
    return new Date().getFullYear();
  }
  public static getSysDay() {
    return new Date().getDate();
  }
  public static getSysHour() {
    return new Date().getHours();
  }
  public static getSysMiute() {
    return new Date().getMinutes();
  }
  public static getSysSecond() {
    return new Date().getSeconds();
  }
  public static getUtilByte(num, str, byte, bool): string {
    let sysYear = this.getSysYear();
    let sysMonth = this.getSysMonth();
    let sysDay = this.getSysDay();
    let sysHour = this.getSysHour();
    let sysMiute = this.getSysMiute();
    let sysSecond = this.getSysSecond();

    let strRight = /^[A-Fa-f]{1,4}$/.test(str);

    let arr: any[];
    let hex = parseInt(num, 16) - 256;
    if (byte === 1) {
      arr = [hex, strRight ? '00' : str, strToHex(byte), 0, 0, 0, 0, 0, 0, 0, 0];
      return this.bytesToHexString(arr);
    }
    arr = [hex, strRight ? '00' : str, byte, sysYear, sysMonth, sysDay, sysHour, sysMiute, sysSecond, bool ? 1 : 0, 1];
    return this.bytesToHexString(arr);
  }

  // 登录初始化信息
  public static getUtilHex(pass = '0000') {
    return this.getUtilByte('a1', pass, 0, false);
  }
}
