import { action, makeAutoObservable, observable } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import { TOKEN_NAME } from '../common/constants';
import { Api, ApiResult } from '../common/api';
import { deviceInfo } from '../common/tools';

export interface LoginInfo {
  token: string; // "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NzczNDcwNDIsInVzZXJuYW1lIjoiTWFjcm93In0.idA_cLA-mxWegNddotiDhy_oZxIvjJlYcNb1CwSUj2A"
  userInfoDetail: userInfoDetailType;
  key: string;
  roles: Array<number>;
}

export interface UserInfoType {
  avatar: string; // "files/201911/M2_1573109560983.jpg",
  balance: number; // 0
  birthday: string; // "1979-09-29",
  cashStatus: number; // 1,
  createBy: string; // "test",
  createTime: number; // 1573020167000,
  departs: Array<UserDepart>;
  email: string; // "Macrow_wh@163.com",
  frozenBalance: number; // 0
  id: string; // "1191959091972632578",
  lessonCount: number;
  phone: string; // "13212332984",
  post: string; // "cto",
  realname: string; // "Macrow",
  referrer: string; // 推荐人的推荐码
  sex: number; // 1,
  status: number; // 1,
  studentCount: number;
  telephone: string; // "023-66555511",
  updateBy: string; // "Macrow",
  updateTime: number; // 1575859988000,
  userType: number; // 用户类型
  username: string; // "Macrow",
  workNo: string; // "0001"
}

export type userInfoDetailType = {
  id?: string;
  createdTime?: Date;
  updatedTime?: Date;
  username?: string;
  phone?: string;
  nickName?: string;
  realName?: string;
  avatar?: { id: string; url: string };
  birthday?: Date;
  sex?: number;
  email?: string;
  userType?: number;
  isEnabled?: true;
  createdBy?: string;
  updatedBy?: string;
  business?: {
    id?: string;
    createdTime?: Date;
    updatedTime?: Date;
    name?: string;
    contactPerson?: any;
    contactPhone?: any;
    description?: any;
    createdBy?: string;
    updatedBy?: string;
  };
  organization?: {
    id?: string;
    createdTime?: Date;
    updatedTime?: Date;
    name?: string;
    contactPerson?: any;
    contactPhone?: any;
    description?: any;
    parentId?: string;
    weight?: number;
    createdBy?: string;
    updatedBy?: string;
  };
  role?: {
    id?: string;
    createdTime?: Date;
    updatedTime?: Date;
    name?: string;
    description?: string;
    isRoot?: boolean;
    createdBy?: string;
    updatedBy?: string;
  };
  unreadCount?: 0;
};

export interface UserDepart {
  address?: string; // "",
  createBy?: string; // "admin",
  createTime?: string; // "2019-02-21 16:14:41",
  delFlag?: string; // "0",
  departName?: string; // "研发部",
  departNameAbbr?: string; // "",
  departNameEn?: string; // "",
  departOrder?: number; // 0,
  description?: string; // null,
  fax?: string; // "",
  id?: string; // "57197590443c44f083d42ae24ef26a2c",
  memo?: string; // "",
  mobile?: string; // "",
  orgCategory?: string; // "1",
  orgCode?: string; // "A01A05",
  orgType?: string; // "2",
  parentId?: string; // "c6d7cb4deeac411cb3384b1b31278596",
  status?: string; // "",
  updateBy?: string; // "admin",
  updateTime?: string; // "2019-03-27 19:05:49"
}

export type RegisterType = {
  smsCode: string;
  phone: string;
  deviceType: number;
  businessCode: string;
};

export type RegisterNoPhoneType = {
  businessCode: string;
  password: string;
  deviceType: number;
  username: string;
};

export type EditMyDetailInfoType = {
  avatarId?: string;
  birthday?: Date;
  email?: string;
  nickName?: string;
  username?: string;
  realName?: string;
  sex?: number;
};

export type PhoneParamType = {
  phone: string;
  verifyCode: string;
};
export type UserLoginParamType = {
  captcha?: string;
  captchaKey?: string;
  deviceType: number;
  password: any;
  username: string;
};

export type UserBindingInfoType = { id: string; nickName: string; token: string; username: string };

export type ChangeUserInfoType = { realname?: string; id?: string; userName?: string; email?: string };

export const SMS_MODE_LOGIN = 0;
export const SMS_MODE_REGISTER = 1;

export const BaseUrl = '/auth';

export class UserStore {
  public static DEVICE_UNKNOWN = 0;
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
      const loginInfoResult: LoginInfo = res.result;
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
    const loginInfoResult: LoginInfo = res.result;
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
  async editMyDetailInfo(param: EditMyDetailInfoType): Promise<boolean | string> {
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
  async loginByPhone(param: PhoneParamType): Promise<boolean | string> {
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
    const params: EditMyDetailInfoType = {
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
    const params: EditMyDetailInfoType = {
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
    const params: EditMyDetailInfoType = {
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
    const params: EditMyDetailInfoType = {
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
    const params: UserLoginParamType = {
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
  async doRegister({ smsCode, phone, deviceType, businessCode }: RegisterType): Promise<boolean | string> {
    const params: RegisterType = { phone, smsCode, deviceType, businessCode };
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
  async doRegisterNoPhone({ businessCode, password, deviceType, username }: RegisterNoPhoneType): Promise<boolean | string> {
    const params: RegisterNoPhoneType = { businessCode, password, deviceType, username };
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
      return Promise.resolve(res.message);
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
