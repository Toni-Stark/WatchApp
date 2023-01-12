import { action, makeAutoObservable, observable } from 'mobx';
import { Api } from '../common/api';

const BaseUrl = '/auth';

export class SettingStore {
  @observable loading = false;
  @observable initURL: string | undefined = '';
  @observable canJump: boolean = true;

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
}
