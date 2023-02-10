import { action, makeAutoObservable, observable } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import { TOKEN_NAME } from '../common/constants';
import { Api, ApiResult } from '../common/api';
import { deviceInfo } from '../common/tools';

export const SMS_MODE_REGISTER = 1;

export const BaseUrl = '/auth';

export class UserStore {
  public static DEVICE_MOBILE = 1;
  public static DEVICE_DESKTOP = 2;

  constructor() {
    makeAutoObservable(this);
  }

  public static async getToken(): Promise<string | null> {
    const token = await AsyncStorage.getItem(TOKEN_NAME);
    return Promise.resolve(token);
  }

  public static async isLogin(): Promise<boolean> {
    const token = await AsyncStorage.getItem(TOKEN_NAME);
    return Promise.resolve(token !== null);
  }

  public static async setToken(token: string): Promise<void> {
    return AsyncStorage.setItem(TOKEN_NAME, token);
  }

  public static async removeToken(): Promise<void> {
    return AsyncStorage.removeItem(TOKEN_NAME);
  }

  public emptyAvatar: string = '';

  // 状态值
  @observable loaded: boolean = false;
  @observable JMessageLogin: boolean = false;
  @observable login: boolean = false;

  /**
   * put ChangeNickName
   * url: /xueyue/sys/user/edit
   */
  @action
  async changeNickName(nickName: string) {
    const params = {
      nickName: nickName
    };
    const res: boolean | string = await this.editMyDetailInfo(params);
    if (typeof res === 'boolean') {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res);
    }
  }

  /**
   * put changeEmail
   * url: /xueyue/sys/user/edit
   * status: incomplete
   */
  @action
  async changeEmail(email: string) {
    const params = {
      email: email
    };
    const res: boolean | string = await this.editMyDetailInfo(params);
    if (typeof res === 'boolean') {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res);
    }
  }

  /**
   * put ChangePassword
   * url: /xueyue/sys/user/edit
   * status: incomplete
   */
  @action
  async changePassword(param: { passwordNew?: string; oldPassword?: string; smsCode?: string }) {
    const params = {
      passwordNew: param.passwordNew,
      passwordOriginal: param.oldPassword,
      smsCode: param.smsCode
    };
    const res: ApiResult = await Api.getInstance.patch({ url: BaseUrl + '/users/update-my-password', params, withToken: true });
    if (res.success) {
      await UserStore.removeToken();
      this.login = false;
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * post PhoneLoginVerifyCode
   * url: /xueyue/sys/sendSms
   */
  @action
  async sendSms(phone: string, mode: number) {
    const params = { phone, mode };
    const res: ApiResult = await Api.getInstance.post({ url: BaseUrl + '/public/generate-sms', params, withToken: false });
    if (res.success) {
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * get public key
   * url: /auth/public/get-public-key
   */
  @action
  async getPublicKey(): Promise<string | undefined> {
    const res: ApiResult = await Api.getInstance.get({ url: BaseUrl + '/public/get-public-key', withToken: false });
    if (res.success) {
      return Promise.resolve(res.result);
    } else {
      return Promise.reject(res.message);
    }
  }

  /**
   * get change of identity
   * url: /users/current-upgrade-to-teacher
   */
  @action
  async changeOfIdentity(): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.patch({ url: BaseUrl + '/users/current-upgrade-to-teacher', withToken: true });
    if (res.success) {
      await UserStore.removeToken();
      this.login = false;
      // this.clearProfile();
      return Promise.resolve(res.success);
    } else {
      return Promise.reject(res.message);
    }
  }

  /**
   * get userInfoDetail
   * url: /auth/users/current
   */
  @action
  async queryUserInfo(): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.get({ url: BaseUrl + '/users/current', withToken: true });
    if (res.success) {
      // this.userInfoDetail = res.result;
      this.login = true;
      return Promise.resolve(res.success);
    } else {
      return Promise.reject(res.message);
    }
  }

  /**
   * get UserLogin
   * url: /xueyue/sys/login
   */
  @action
  async loginByUserName(param: { password: string; userName: string; verifyCode: string }, resPass: any): Promise<string | boolean> {
    const params = {
      captcha: param.verifyCode,
      // captchaKey: this.loginVerifyKey,
      deviceType: deviceInfo,
      password: resPass,
      username: param.userName
    };
    const res: ApiResult = await Api.getInstance.post({ url: BaseUrl + '/public/login-by-username', params, withToken: false });
    if (res.success) {
      await UserStore.setToken(res.result.token);
      // this.userBindingInfo = res.result;
      this.login = true;
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * post doRegister
   * url: /xueyue/sys/app_registe
   */
  @action
  async doRegister({ smsCode, phone, deviceType, businessCode }) {
    const params = { phone, smsCode, deviceType, businessCode };
    console.log(params);
    const res: ApiResult = await Api.getInstance.post({ url: BaseUrl + '/public/app-user-register-by-phone', params: params, withToken: false });
    if (res.success) {
      console.log(res.result);
      await UserStore.setToken(res.result.token);
      this.login = true;
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * post doRegisterNoPhone
   * url: /xueyue/sys/app_registe
   */
  @action
  async doRegisterNoPhone({ businessCode, password, deviceType, username }) {
    const params = { businessCode, password, deviceType, username };
    const res: ApiResult = await Api.getInstance.post({ url: BaseUrl + '/public/app-user-register-by-username', params: params, withToken: false });
    if (res.success) {
      //   console.log(res.result);
      //   await UserStore.setToken(res.result.token);
      //   this.login = true;
      //   return Promise.resolve(res.success);
      // } else {
      //   return Promise.resolve(res.message);
    }
  }

  /**
   * post sendSmsRegister
   * url: /xueyue/sys/sendSms
   */
  @action
  async sendSmsRegister(phone?: string) {
    const params = {
      mobile: phone,
      smsMode: 1
    };
    const res: ApiResult = await Api.getInstance.post({ url: '/xueyue/sys/sendSms', params, withToken: false });
    if (res.success) {
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.msg);
    }
  }

  /**
   * get UserLoginVerifyCode
   * url: /xueyue/sys/getCheckCode
   */
  @action
  async getProfile(): Promise<void> {
    const res: ApiResult = await Api.getInstance.get({ url: '/xueyue/sys/myProfile', withToken: true });
    if (res.success) {
      this.login = true;
    } else {
      this.login = false;
    }
  }
}
