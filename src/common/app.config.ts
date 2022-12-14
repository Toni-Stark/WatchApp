export const appConfig = {
  VERSION: 'v1.1.0',

  WX_APP_ID: 'wxab3f4cef2e3c2c6a',
  wideScreenDevices: ['rk3399_nextclass'],

  server: {
    dev: {
      API_PROTOCOL: 'http://',
      API_HOST: '192.168.10.241',
      HOST_PORT: '10038/apic'
      // WEBSOCKET_PATH: 'ws://app.icst-edu.com:50188/communicate'
    },
    prod: {
      API_PROTOCOL: 'http://',
      API_HOST: '192.168.10.241',
      HOST_PORT: '10038/apic'
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
  : `${appConfig.server.prod.API_PROTOCOL}${appConfig.server.prod.API_HOST}:${appConfig.server.prod.HOST_PORT}`;
// export const SERVER_URL = 'https://m.api.drug.360zhishu.cn';
// export const SERVER_WEBSOCKET_URL = __DEV__ ? `${appConfig.server.dev.WEBSOCKET_PATH}` : `${appConfig.server.prod.WEBSOCKET_PATH}`;
