import { action, makeAutoObservable, observable } from 'mobx';
import { Api } from '../common/api';
import { util } from 'protobufjs';
import { versionThanOld } from '../common/tools';
import { appConfig } from '../common/app.config';
import { Platform } from 'react-native';

const BaseUrl = '/auth';

export class SettingStore {
  @observable loading = false;
  @observable initURL: string | undefined = '';
  @observable canJump: boolean = true;
  @observable needUpdate: boolean = false;

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
  async loginWithUuidForDesktop(uuid: string) {
    const res = await Api.getInstance.post({
      url: BaseUrl + '/users/request-login-by-qr-code',
      params: {
        uuid
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
        resolve(true);
        return;
      }
      if (Platform.OS === 'android') {
        setTimeout(() => {
          let data = { version: '1.0.1' };
          let bool: boolean = versionThanOld(data?.version, appConfig.VERSION);
          this.needUpdate = bool;
          resolve(bool);
        }, 3000);
      }
    });
  }
}
