export const appConfig = {
  VERSION: 'v2.1.0',

  MSG_API_VERSION: '2.1.0',
  WHITEBOARD_VERSION: '1.4.22',

  WX_APP_ID: 'wx7317dd1555d82433',
  wideScreenDevices: ['rk3399_nextclass'],

  server: {
    // 192.168.0.105
    dev: {
      // API_PROTOCOL: 'http://',
      // API_HOST: '192.168.0.100',
      // HOST_PORT: '50180/api/v2',
      // WEBSOCKET_PATH: 'ws://192.168.0.100:50199/communicate'
      API_PROTOCOL: 'http://',
      API_HOST: 'app.icst-edu.com',
      HOST_PORT: '50188/api/v2',
      WEBSOCKET_PATH: 'ws://app.icst-edu.com:50188/communicate'
    },
    prod: {
      API_PROTOCOL: 'http://',
      API_HOST: 'app.icst-edu.com',
      HOST_PORT: '50188/api/v2',
      WEBSOCKET_PATH: 'ws://app.icst-edu.com:50188/communicate'
    }
  }
};

export const SERVER_URL = __DEV__
  ? `${appConfig.server.dev.API_PROTOCOL}${appConfig.server.dev.API_HOST}:${appConfig.server.dev.HOST_PORT}`
  : `${appConfig.server.prod.API_PROTOCOL}${appConfig.server.prod.API_HOST}:${appConfig.server.prod.HOST_PORT}`;

export const SERVER_WEBSOCKET_URL = __DEV__ ? `${appConfig.server.dev.WEBSOCKET_PATH}` : `${appConfig.server.prod.WEBSOCKET_PATH}`;
