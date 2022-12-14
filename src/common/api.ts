import {
  ApiResponse,
  create,
  CANCEL_ERROR,
  CLIENT_ERROR,
  CONNECTION_ERROR,
  NETWORK_ERROR,
  NONE,
  SERVER_ERROR,
  TIMEOUT_ERROR,
  ApisauceInstance
} from 'apisauce';
import moment from 'moment';
import { SERVER_URL } from './app.config';
import { UserStore } from '../store/UserStore';
import { t } from './tools';
import { StackNavigationProp } from '@react-navigation/stack/src/types';
const qs = require('qs');

export interface ErrorLog {
  msg: string;
  success: boolean;
}

export interface ApiResultInterface {
  code?: number;
  msg: string;
  data: any;
  success: boolean;
  timestamp: string;
}

export type ApiResult = ApiResultInterface;

export type RestfulOperateType = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type ApiParam = {
  url: string;
  params?: object;
  withToken?: boolean;
  multipart?: boolean;
};

export class Api {
  static get getInstance() {
    return this.instance || (this.instance = new this());
  }
  static instance: Api;
  readonly _api: ApisauceInstance;
  readonly timeout: number = 5000;
  navigation: StackNavigationProp<any> | undefined;

  constructor() {
    this._api = create({
      baseURL: SERVER_URL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    if (__DEV__) {
      const apiMonitor = (response: any) => console.log('[API] -> ', response);
      this._api.addMonitor(apiMonitor);
    }
  }

  setUpNavigation(navigation: StackNavigationProp<any>) {
    this.navigation = navigation;
  }

  public timer: any;

  private async redirectToLoginScreen() {
    if (this.navigation !== undefined) {
      while (this.navigation.canGoBack()) {
        this.navigation.goBack();
      }
      this.navigation.navigate('WeChatOnePassLogin');
    }
  }

  rawGet(url: string, params: any = {}) {
    return this._api.get(url, params);
  }

  rawPost(url: string, params: any = {}) {
    return this._api.post(url, params);
  }

  rawPut(url: string, params: any = {}) {
    return this._api.put(url, params);
  }

  rawPatch(url: string, params: any = {}) {
    return this._api.patch(url, params);
  }

  rawDelete(url: string, params: any = {}) {
    return this._api.delete(url, params);
  }

  async get(param: ApiParam): Promise<ApiResult> {
    const { url, params = {}, withToken = true } = param;
    return this.RestfulOperate('get', url, params, withToken, false);
  }

  async post(param: ApiParam): Promise<ApiResult> {
    const { url, params = {}, withToken = true, multipart = false } = param;
    return this.RestfulOperate('post', url, qs.stringify(params), withToken, multipart);
  }

  async put(param: ApiParam): Promise<ApiResult> {
    const { url, params = {}, withToken = true } = param;
    return this.RestfulOperate('put', url, params, withToken, false);
  }

  async patch(param: ApiParam): Promise<ApiResult> {
    const { url, params = {}, withToken = true } = param;
    return this.RestfulOperate('patch', url, params, withToken, false);
  }

  async delete(param: ApiParam): Promise<ApiResult> {
    const { url, params = {}, withToken = true } = param;
    return this.RestfulOperate('delete', url, params, withToken, false);
  }

  async upload(filePath: string, fileName: string = 'avatar'): Promise<ApiResult> {
    const form = new FormData();
    form.append('file', {
      name: `${fileName}.jpg`,
      uri: filePath,
      type: 'image/jpg'
    });
    return this.post({ url: '/auth/users/upload-avatar', params: form, withToken: true, multipart: true });
  }

  async uploadAsyncImage(filePath: string, fileName: string = 'avatar'): Promise<ApiResult> {
    const form = new FormData();
    form.append('file', {
      name: `${fileName}.jpg`,
      uri: filePath,
      type: 'image/jpg'
    });
    return this.post({ url: '/xueyue/sys/common/upload-to-temp', params: form, withToken: true, multipart: true });
  }

  async uploadAuthImage(filePath: string): Promise<ApiResult> {
    const form = new FormData();
    form.append('file', {
      name: `${new Date().getTime()}.jpg`,
      uri: filePath,
      type: 'image/jpg'
    });
    return this.post({ url: `/auth/upload-images`, params: form, withToken: true, multipart: true });
  }

  async uploadEducationImage(filePath: string): Promise<ApiResult> {
    const form = new FormData();
    form.append('file', {
      name: `${new Date().getTime()}.jpg`,
      uri: filePath,
      type: 'image/jpg'
    });
    return this.post({ url: `/education/upload-images`, params: form, withToken: true, multipart: true });
  }

  private static getTimeStamp(): string {
    return moment().format('x');
  }

  private async RestfulOperate(operate: RestfulOperateType, url: string, params: any, withToken: boolean, multipart: boolean): Promise<ApiResult> {
    const isAuthFailed = (message: string) => {
      return message.includes('401');
    };
    const token = await UserStore.getToken();
    let response: ApiResponse<any>;
    const rawHeaders = {
      Authorization: '',
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    // console.log('0-????????????-??????????????????', token);
    if (withToken) {
      // console.log('1-????????????-??????????????????', withToken);
      console.log(token, '??????token');
      if (token === null) {
        // console.log('2-????????????-??????????????????', this.navigation);
        await this.redirectToLoginScreen();
        return { code: 401, msg: t('message.loginFailed'), data: null, success: false, timestamp: Api.getTimeStamp() };
      } else {
        rawHeaders.Authorization = token;
      }
    }
    if (multipart) {
      rawHeaders['  Content-Type'] = 'multipart/form-data';
    }
    const headers = { headers: rawHeaders };
    switch (operate) {
      case 'get':
        response = await this._api.get(url, params, headers);
        break;
      case 'post':
        response = await this._api.post(url, params, headers);
        break;
      case 'put':
        response = await this._api.put(url, params, headers);
        break;
      case 'patch':
        response = await this._api.patch(url, params, headers);
        break;
      case 'delete':
        response = await this._api.delete(url, params, headers);
        break;
      default:
        return { code: 500, msg: '??????????????????', data: null, success: false, timestamp: Api.getTimeStamp() };
    }
    if (response.data?.msg !== undefined && isAuthFailed(response.data.code.toString())) {
      const messageToUser = t('message.loginFailed');
      if (withToken) {
        await UserStore.removeToken();
        await this.redirectToLoginScreen();
      } else {
        return { code: response.data.status, msg: messageToUser, data: response.data.data, success: false, timestamp: Api.getTimeStamp() };
      }
    }
    switch (response.problem) {
      case NONE:
        return response.data;
      case CLIENT_ERROR:
      case SERVER_ERROR:
        if (response.data?.message !== undefined) {
          return { code: response.data.status, msg: response.data.message, data: response.data.result, success: false, timestamp: Api.getTimeStamp() };
        } else if (response.status === 404) {
          return { code: response.status, msg: '?????????????????????', data: null, success: false, timestamp: Api.getTimeStamp() };
        } else {
          return { code: response.status, msg: '?????????????????????????????????', data: null, success: false, timestamp: Api.getTimeStamp() };
        }
      case TIMEOUT_ERROR:
        return { code: response.status, msg: '?????????????????????', data: null, success: false, timestamp: Api.getTimeStamp() };
      case CONNECTION_ERROR:
        return { code: response.status, msg: '?????????????????????', data: null, success: false, timestamp: Api.getTimeStamp() };
      case NETWORK_ERROR:
        return { code: response.status, msg: '?????????????????????', data: null, success: false, timestamp: Api.getTimeStamp() };
      case CANCEL_ERROR:
      default:
        return { code: response.status, msg: '??????????????????', data: null, success: false, timestamp: Api.getTimeStamp() };
    }
  }
}
