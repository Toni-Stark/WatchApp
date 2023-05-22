import { makeAutoObservable } from 'mobx';
import { deviceStatus } from '../common/sign-module';
const RNFS = require('react-native-fs');

export class RSJournalStore {
  private static fileBaseUrl: string = '/watch-app';
  private static deviceStoragePath: string = RNFS.DocumentDirectoryPath + '/logs.txt';

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * name: 写入日志
   */
  static writeDataCache(data) {
    try {
      let text = '';
      for (let key in data) {
        text += deviceStatus[key] + ':' + '\n' + data[key];
      }
      RNFS.writeFile(this.deviceStoragePath, text, 'utf8')
        .then((success) => {
          console.log('FILE WRITTEN!', success);
        })
        .catch((err) => {
          console.log(err.message);
        });
      this.readFilesForDevice();
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * name: 写入日志
   */
  static whiteFilesForDevice({ name, text }) {
    try {
      RNFS.writeFile(this.deviceStoragePath, text, 'utf8')
        .then((success) => {
          console.log('FILE WRITTEN!', success);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * name: 读取日志
   */
  static readFilesForDevice() {
    RNFS.readFile(this.deviceStoragePath, true).then((res) => {
      console.log(res);
      this.readDirForDevice();
    });
  }
  /**
   * name: 读取目录
   */

  static readDirForDevice() {
    RNFS.readdir(RNFS.DocumentDirectoryPath).then((res) => {
      console.log(res);
    });
  }
}
