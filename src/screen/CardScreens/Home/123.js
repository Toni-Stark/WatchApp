let obj = {
  deviceID: 'D5:3D:04:34:21:F5',
  id: 12,
  isIndicatable: false,
  isNotifiable: false,
  isNotifying: false,
  isReadable: false,
  isWritableWithResponse: true,
  isWritableWithoutResponse: true,
  serviceID: 9,
  serviceUUID: 'f0080001-0451-4000-b000-000000000000',
  uuid: 'f0080003-0451-4000-b000-000000000000',
  value: 'MDAwMA=='
};

let res = {
  deviceID: 'D5:3D:04:34:21:F5',
  id: 10,
  isIndicatable: false,
  isNotifiable: true,
  isNotifying: true,
  isReadable: false,
  isWritableWithResponse: false,
  isWritableWithoutResponse: false,
  serviceID: 9,
  serviceUUID: 'f0080001-0451-4000-b000-000000000000',
  uuid: 'f0080002-0451-4000-b000-000000000000',
  value: 'oQAAACB5ABcCAAABAAAAAAAAAAA='
};

let data = [
  {
    serverId: '00001800-0000-1000-8000-00805f9b34fb',
    uuid: '00002a01-0000-1000-8000-00805f9b34fb',
    value: 'AAA=',
    string: '00 00'
  },
  {
    serverId: '00001800-0000-1000-8000-00805f9b34fb',
    uuid: '00002a00-0000-1000-8000-00805f9b34fb',
    value: 'RjEwNw==',
    string: '46 31 30 37'
  },
  {
    serverId: '00001800-0000-1000-8000-00805f9b34fb',
    uuid: '00002aa6-0000-1000-8000-00805f9b34fb',
    value: 'AQ==',
    string: '01'
  },
  {
    serverId: '00001800-0000-1000-8000-00805f9b34fb',
    uuid: '00002ac9-0000-1000-8000-00805f9b34fb',
    value: 'AA==',
    string: '00'
  },
  {
    serverId: '00001800-0000-1000-8000-00805f9b34fb',
    uuid: '00002aa6-0000-1000-8000-00805f9b34fb',
    value: 'AQ==',
    string: '01'
  },
  {
    serverId: '00001800-0000-1000-8000-00805f9b34fb',
    uuid: '00002ac9-0000-1000-8000-00805f9b34fb',
    value: 'AA==',
    string: '00'
  }
];
