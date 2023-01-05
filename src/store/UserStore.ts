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

  @action
  async loginBySelectRoleAfterOnePass(key: string, role: number): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.post({ url: '/xueyue/sys/login_by_select_role_after_one_pass', params: { key, role }, withToken: false });
    if (res.success) {
      const loginInfoResult = res.result;
      await UserStore.setToken(loginInfoResult.token);
      this.login = true;
      return Promise.resolve(res.success);
    } else {
      return Promise.reject(res.message);
    }
  }

  @action
  async loginByOnePass(token): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.post({ url: '/xueyue/sys/login_by_one_pass', params: { token }, withToken: false });
    const loginInfoResult = res.result;
    if (res.success) {
      if (loginInfoResult.key === undefined) {
        // 正常登陆
        await UserStore.setToken(loginInfoResult.token);
        this.login = true;
      } else {
        // this.onePassKey = loginInfoResult.key;
        // if (loginInfoResult.roles === undefined) {
        //   // 未注册，填入推荐码、选择角色注册
        //   if (typeof this.registerToLogin !== 'undefined') {
        //     await this.registerToLogin();
        //   }
        // } else {
        //   // 已注册，选择角色登录
        //   this.onePassRoles = loginInfoResult.roles;
        //   this.roleSelectionModal = true;
        // }
      }
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
  }

  @action
  async logOut(): Promise<boolean> {
    const res: ApiResult = await Api.getInstance.delete({ url: BaseUrl + '/users/logout', withToken: true });
    if (res.success) {
      await UserStore.removeToken();
      this.login = false;
      return Promise.resolve(true);
    } else {
      return Promise.reject(res.message);
    }
  }

  @action
  async uploadAvatar(image): Promise<boolean | string> {
    const res = await Api.getInstance.uploadAuthImage(image.path);
    console.log(res.result, '上传头像返回id');
    if (res.success) {
      const avatar = res.result.id;
      const result = await this.editMyDetailInfo({ avatarId: avatar });
      if (result) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(result);
      }
    } else {
      return Promise.resolve(res.message);
    }
  }

  @action
  async editMyDetailInfo(param): Promise<boolean | string> {
    console.log(param, '改变信息的参数');
    const params = {
      avatarId: param.avatarId,
      birthday: param.birthday,
      email: param.email,
      nickName: param.nickName,
      realName: param.realName,
      sex: param.sex
    };
    const restUpdate: ApiResult = await Api.getInstance.patch({ url: BaseUrl + '/users/current', params, withToken: true });
    if (restUpdate.success) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(restUpdate.message);
    }
  }

  @action
  async loginByPhone(param): Promise<boolean | string> {
    const params = {
      deviceType: deviceInfo,
      code: param.verifyCode,
      phone: param.phone
    };
    const res: ApiResult = await Api.getInstance.post({ url: BaseUrl + '/public/login-by-phone', params, withToken: false });
    if (res.success) {
      await UserStore.setToken(res.result.token);
      this.login = true;
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * get ParentsStudents
   * url: /xueyue/sys/user/getContacts
   */
  @action
  async getParentsStudents(): Promise<boolean | string> {
    const res: ApiResult = await Api.getInstance.get({ url: '/xueyue/sys/user/getContacts', params: {}, withToken: true });
    if (res.success) {
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * put ChangeRealName
   * url: /xueyue/sys/user/edit
   */
  @action
  async changeRealName(realname: string): Promise<boolean | string> {
    const params = {
      realName: realname
    };
    const res: boolean | string = await this.editMyDetailInfo(params);
    if (typeof res === 'boolean') {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res);
    }
  }
  /**
   * put ChangeUserName
   * url: /xueyue/sys/user/edit
   */
  @action
  async changeUserName(username: string): Promise<boolean | string> {
    const params = {
      username: username
    };
    const res: ApiResult = await Api.getInstance.patch({ url: BaseUrl + '/users/update-my-username', params, withToken: true });

    if (res.success) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * put ChangeNickName
   * url: /xueyue/sys/user/edit
   */
  @action
  async changeNickName(nickName: string): Promise<boolean | string> {
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
  async changeEmail(email: string): Promise<boolean | string> {
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
  async changePassword(param: { passwordNew?: string; oldPassword?: string; smsCode?: string }): Promise<boolean | string> {
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
  async sendSms(phone: string, mode: number): Promise<boolean | string> {
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
  async doRegister({ smsCode, phone, deviceType, businessCode }): Promise<boolean | string> {
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
  async doRegisterNoPhone({ businessCode, password, deviceType, username }): Promise<boolean | string> {
    const params = { businessCode, password, deviceType, username };
    const res: ApiResult = await Api.getInstance.post({ url: BaseUrl + '/public/app-user-register-by-username', params: params, withToken: false });
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
   * post sendSmsRegister
   * url: /xueyue/sys/sendSms
   */
  @action
  async sendSmsRegister(phone?: string): Promise<boolean | string> {
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
