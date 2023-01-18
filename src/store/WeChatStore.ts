import { action, makeAutoObservable, observable } from 'mobx';
import * as WeChat from 'react-native-wechat-lib';
import { Alert, ToastAndroid } from 'react-native';
import { Api, ApiResult, ErrorLog } from '../common/api';
import { TOKEN_NAME, USER_CONFIG } from '../common/constants';
import AsyncStorage from '@react-native-community/async-storage';
import { appConfig } from '../common/app.config';

export type AppColorModeType = 'light' | 'dark' | 'system';
export type AppLanguageType = 'zh' | 'en' | 'system';

export class WeChatStore {
  readonly defaultLanguage: AppLanguageType = 'zh';

  @observable showBootAnimation: boolean = true;
  @observable weChatIsRoot: boolean = false;
  @observable userInfo: any = {};

  constructor() {
    makeAutoObservable(this);
  }

  @action
  async getUserInfo() {
    let res: any = await AsyncStorage.getItem(USER_CONFIG);
    if (res) this.userInfo = JSON.parse(res);
  }

  /**
   * put checkWeChatInstall
   * url: 微信登录
   */
  @action
  async checkWeChatInstall() {
    return new Promise((resolve, reject) => {
      this.registerMiniProgram();
      WeChat.isWXAppInstalled()
        .then((isInstalled) => {
          WeChat.sendAuthRequest('snsapi_userinfo')
            .then((wechatInfo) => {
              resolve(wechatInfo);
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  /**
   * put LaunchMiniProgram
   * url: 跳转微信小程序
   */
  @action
  async launchMiniProgram() {
    return new Promise(async (resolve, reject) => {
      await this.registerMiniProgram();
      await WeChat.launchMiniProgram({
        userName: 'gh_86ca0d9e5a9a',
        miniProgramType: 0,
        path: 'pages/index/index'
      });
    });
  }

  /**
   * put registerWeChat
   * url: 注册微信api
   */
  @action
  async registerMiniProgram() {
    if (this.weChatIsRoot) return true;
    return new Promise(async (resolve, reject) => {
      const result = await WeChat.registerApp(appConfig.WX_APP_ID, 'universalLink');
      if (!result) {
        return Alert.alert('请检查app微信服务', '请检查app微信服务，否则系统部分功能将无法使用');
      }
      resolve(result);
    });
  }

  /**
   * get UserLoginForWeChat
   * url: /member/member/check-login
   */
  @action
  async userWeChatLogin({ code, type = 'App' }): Promise<Partial<ErrorLog> | undefined> {
    return new Promise(async (resolve, reject) => {
      const res: ApiResult = await Api.getInstance.post({
        url: '/member/member/check-login',
        params: { code, type },
        withToken: false
      });
      if (res.code === 402) {
        let data: Partial<ErrorLog> = await this.userGetLogin({ openid: res.data.openid, mobile_code: code });
        if (data?.success) {
          return resolve({ msg: '登录成功', success: true });
        }
        return resolve(data);
      }
      if (res.code !== 200) {
        return resolve({ msg: res.msg, success: false });
      }
      await AsyncStorage.setItem(TOKEN_NAME, res.data.token);
      await AsyncStorage.setItem(USER_CONFIG, JSON.stringify(res.data));
      this.userInfo = res.data;
      return resolve({ msg: '登录成功', success: true });
    });
  }

  /**
   * get UserLogin
   * url: /member/member/login
   */
  @action
  async userGetLogin({ openid, mobile_code, login_type = 'App' }): Promise<Partial<ErrorLog>> {
    const res: ApiResult = await Api.getInstance.post({
      url: '/member/member/login',
      params: { openid, mobile_code, login_type },
      withToken: false
    });
    console.log(res);
    if (res.code !== 200) {
      return { msg: res.msg, success: false };
    }
    await AsyncStorage.setItem(TOKEN_NAME, res.data.token);
    await AsyncStorage.setItem(USER_CONFIG, JSON.stringify(res.data));
    return { msg: '登录成功', success: true };
  }
}
