// 10进制16进制转换
const strToHex = (num) => {
  if (num > -128 && num < 0) return (256 + num).toString(16);
  if (num >= 0 && num <= 15) return '0' + (num + 0).toString(16);
  if (num > 15 && num < 127) return (num + 0).toString(16);
  return (num + 0).toString(16);
};

const strToPass = (num) => {
  let val;
  if (num.length > 0) val = parseInt(num).toString(16);
  return val;
};

// 生成密码密匙
export const createSigning = (arg) => {
  let byte: Array<string> = [];
  byte[0] = strToHex(arg[0]);

  let str = strToPass(arg[1]);
  console.log(Math.ceil(arg[1]), str);
  byte[2] = str.length >= 2 ? str.slice(-2, str.length) : '00';
  // byte[1] = console.log(byte[2], 1212);
  let year = strToHex(arg[3]).toString();
  if (year.length % 2 !== 0) {
    let length = year.length;
    for (let k = 1; k <= Math.ceil(length / 2); k++) {
      byte[3 + k] = length % 2 !== 0 && k % 2 !== 0 ? '0' + year.slice(k - 1, 2 * k - 1) : year.slice(k - 1, 2 * k - 1);
    }
  }
  for (let j = 5; j < arg.length; j++) {
    byte[j + 1] = strToHex(arg[j]);
  }
  return byte;
};

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
  public static getUtilByte(str, byte, bool): string {
    let sysYear = this.getSysYear();
    let sysMonth = this.getSysMonth();
    let sysDay = this.getSysDay();
    let sysHour = this.getSysHour();
    let sysMiute = this.getSysMiute();
    let sysSecond = this.getSysSecond();
    return this.bytesToHexString([-95, str, 0, sysYear, sysMonth, sysDay, sysHour, sysMiute, sysSecond, 1, 1]);
  }
  public static getUtilHex() {
    return this.getUtilByte('2022', 0, true);
  }
}

interface UtilByteType {
  str: string;
  byte: number;
  bool: boolean;
}
