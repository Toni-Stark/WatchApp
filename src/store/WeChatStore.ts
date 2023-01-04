import { action, makeAutoObservable, observable } from 'mobx';
import * as WeChat from 'react-native-wechat-lib';
import { Alert } from 'react-native';

export type AppColorModeType = 'light' | 'dark' | 'system';
export type AppLanguageType = 'zh' | 'en' | 'system';

export class WeChatStore {
  readonly defaultLanguage: AppLanguageType = 'zh';

  @observable showBootAnimation: boolean = true;
  @observable weChatIsRoot: boolean = false;

  constructor() {
    makeAutoObservable(this);
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
          console.warn('isInstalled==', isInstalled);
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
        userName: 'gh_d3efb6420559',
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
      const result = await WeChat.registerApp('wxab3f4cef2e3c2c6a', 'universalLink');
      if (!result) {
        return Alert.alert('请检查app微信服务', '请检查app微信服务，否则系统部分功能将无法使用');
      }
      resolve(result);
    });
  }
}
