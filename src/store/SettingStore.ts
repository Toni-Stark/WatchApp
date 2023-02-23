import { action, makeAutoObservable, observable } from 'mobx';
import { Api } from '../common/api';
import { versionThanOld } from '../common/tools';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export class SettingStore {
  @observable loading = false;
  @observable initURL: string | undefined = '';
  @observable canJump: boolean = true;
  @observable needUpdate: boolean = false;
  @observable newDevice: any = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  updateSettings() {
    this.loading = false;
  }

  @action
  async updateInput(str: string) {
    const res = await Api.getInstance.get({
      url: '/xueyue/business/feedback/create',
      params: {
        description: str,
        type: '用户提交'
      }
    });
    if (res.success) {
      return Promise.resolve(true);
    } else {
    }
  }

  @action
  async updateIng() {
    return new Promise((resolve, reject) => {
      console.log('更新中');
    });
  }

  @action
  async getDeviceUpdate() {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'ios') {
        resolve({ success: true });
        return;
      }
      if (Platform.OS === 'android') {
        Api.getInstance
          .post({
            url: '/version/newest',
            params: {}
          })
          .then((res) => {
            if (res.code !== 200) {
              return resolve({ success: false, msg: res.msg });
            }
            let data = { version: res.data.ver };
            let bool: boolean = versionThanOld(data?.version, DeviceInfo.getVersion());
            this.needUpdate = bool;
            this.newDevice = res.data;
            return resolve({ success: bool });
          });
      }
    });
  }
}
