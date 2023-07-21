export const appConfig = {
  VERSION: '1.3.5',

  WX_APP_ID: 'wx03e67906834900ec',
  wideScreenDevices: ['rk3399_nextclass'],

  server: {
    dev: {
      API_PROTOCOL: 'http://',
      API_HOST: '192.168.10.241',
      HOST_PORT: '10038/apic'
      // WEBSOCKET_PATH: 'ws://app.icst-edu.com:50188/communicate'
    },
    prod: {
      API_PROTOCOL: 'https://',
      API_HOST: 'c.api.drug.360zhishu.cn',
      HOST_PORT: ''
      // WEBSOCKET_PATH: 'ws://app.icst-edu.com:50188/communicate'
    }
    // prod: {
    //   API_PROTOCOL: 'http://',
    //   API_HOST: 'app.icst-edu.com',
    //   HOST_PORT: '50188/api/v2',
    //   WEBSOCKET_PATH: 'ws://app.icst-edu.com:50188/communicate'
    // }
  }
};

export const SERVER_URL = __DEV__
  ? `${appConfig.server.dev.API_PROTOCOL}${appConfig.server.dev.API_HOST}:${appConfig.server.dev.HOST_PORT}`
  : `${appConfig.server.prod.API_PROTOCOL}${appConfig.server.prod.API_HOST}${appConfig.server.prod.HOST_PORT}`;
// export const SERVER_URL = 'https://m.api.drug.360zhishu.cn';
// export const SERVER_WEBSOCKET_URL = __DEV__ ? `${appConfig.server.dev.WEBSOCKET_PATH}` : `${appConfig.server.prod.WEBSOCKET_PATH}`;
