import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, ScrollView, SafeAreaView, AppState, RefreshControl } from 'react-native';
import BaseView from '../component/BaseView';
import { useStore } from '../store';
import { ScreenComponent } from './index';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { HeaderBar } from '../component/home/HeaderBar';
import FastImage from 'react-native-fast-image';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { arrCount, arrToByte, eventTimes, getMinTen, hasAndroidPermission } from '../common/tools';
import { Hexagon } from '../component/home/Hexagon';
import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_DATA, DEVICE_INFO, TOKEN_NAME, USER_CONFIG } from '../common/constants';
import Spinkit from 'react-native-spinkit';
import { RootEnum } from '../common/sign-module';
import moment from 'moment';
import BackgroundFetch from 'react-native-background-fetch';
import LinearGradient from 'react-native-linear-gradient';
import { allDataSleep, batterySign, bloodData, mainListen, O2Data } from '../common/watch-module';
import { PortalDialog } from '../component/home/PortalDialog';
import { PasswordDialog } from '../component/home/PasswordDialog';

let type = 0;
export const Home: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { blueToothStore, weChatStore } = useStore();
    const baseView = useRef<any>(undefined);
    const [target, setTarget] = useState(102);
    const [contentList, setContentList] = useState<any>([
      {
        title: '运动',
        evalTitle: '今日步数',
        colors: ['#F2F8FF', '#F7FCFF', '#FAFCFF'],
        image: require('../assets/home/footer.png'),
        value: '0',
        cap: '步',
        time: ' ',
        fun: async () => {
          await jumpToMiniProgram();
        }
      },
      {
        title: '睡眠',
        evalTitle: '昨晚睡眠时长',
        colors: ['#E7FBFC', '#ECFBFB', '#F4FEFF'],
        image: require('../assets/home/sleep.png'),
        value: '0',
        cap: '',
        time: ' ',
        fun: async () => {
          await blueToothStore.sendActiveMessage(allDataSleep);
        }
      },
      {
        title: '心率',
        evalTitle: '最近',
        colors: ['#F2EFFF', '#F3F4FF', '#F7FAFF'],
        image: require('../assets/home/heartPulse.png'),
        value: '',
        cap: 'bpm',
        time: '',
        fun: async () => {
          await naviToCommon('HeartTest');
        }
      },
      {
        title: '血压',
        evalTitle: '最近',
        colors: ['#F1EDFF', '#F3F4FF', '#FAF9FE'],
        image: require('../assets/home/xueya.png'),
        value: '',
        cap: 'mmHg',
        time: '',
        fun: async () => {
          await jumpToMiniProgram();
        }
      },
      {
        title: '血氧',
        evalTitle: '最近',
        colors: ['#F1F4FF', '#F5F6FF', '#FFFAFA'],
        image: require('../assets/home/xueo2.png'),
        value: '',
        cap: '',
        // fun: () => blueToothStore.checkBlO2()
        fun: async () => {
          // await naviToCommon('BloodTest');
          await blueToothStore.sendActiveMessage(bloodData);
        }
      },
      {
        title: '体温',
        evalTitle: '最近',
        colors: ['#FFF8F7', '#FFEFEA', '#FFE5E1'],
        image: require('../assets/home/tiwen.png'),
        value: '',
        cap: '°C',
        fun: async () => {
          await jumpToMiniProgram();
        }
      }
    ]);
    const [hasBack, setHasBack] = useState(false);
    const [configureOptions] = useState({
      minimumFetchInterval: 1,
      enableHeadless: true,
      forceAlarmManager: true,
      stopOnTerminate: false,
      startOnBoot: true
    }); // 默认后台运行配置项
    const [refreshing, setRefreshing] = useState(false);
    const [visDialog, setVisDialog] = useState(false);
    const [visContext, setVisContext] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
      (async () => {
        const rePowered = await BluetoothStateManager.getState();
        if (rePowered !== 'PoweredOn') return;
        let deviceInfo: string | null = await AsyncStorage.getItem(DEVICE_INFO);
        if (!blueToothStore?.devicesInfo) {
          if (deviceInfo && JSON.parse(deviceInfo)) {
            await blueToothStore.reConnectDevice(JSON.parse(deviceInfo), (res) => {
              if (res.type === '1') {
                blueToothStore.isRoot = RootEnum['无设备连接'];
                blueToothStore.refreshing = false;
                baseView?.current?.showToast({ text: '重连失败', delay: 1 });
              }
              if (res.type === '3') {
                baseView?.current?.showToast({ text: '未搜索到设备', delay: 1 });
              }
            });
          }
        }
        let bool = [RootEnum['初次进入'], RootEnum['连接中']].includes(blueToothStore.isRoot);
        if (blueToothStore?.devicesInfo && bool) {
          eventTimes(() => blueToothStore.successDialog(), 1000);
          await blueToothStore.listenActiveMessage(mainListen);
          blueToothStore.userDeviceSetting(true).then((res) => {
            if (res.needBinding) {
              setVisContext(`绑定设备： ${res.name}`);
              setVisDialog(true);
            }
          });
        }
      })();
    }, [blueToothStore?.devicesInfo, AsyncStorage, blueToothStore.isRoot]);

    useEffect(() => {
      if (blueToothStore.noPasswordTips && blueToothStore.needRegPassword) {
        baseView.current.showToast({ text: '设备密码错误', delay: 2 });
        setPassword('');
      }
    }, [blueToothStore.noPasswordTips]);

    const openApi = async () => {
      await blueToothStore.bindUserDevice().then((res) => {
        baseView.current.showToast({ text: res.msg, delay: 2 });
      });
      setVisDialog(false);
    };
    const delayApi = () => {
      setVisDialog(false);
    };
    const passApi = async () => {
      if (password.trim().length <= 0) {
        return baseView.current.showToast({ text: '请验证设备密码', delay: 2 });
      }
      await blueToothStore.successDialog(password);
    };
    const dissApi = async () => {
      console.log(234);
    };
    const bindTextInput = (text) => {
      setPassword(text);
    };

    const setBackgroundServer = async () => {
      if (hasBack) return;
      AppState.addEventListener('change', async (e) => {
        console.log('state', e);
        if (!blueToothStore.devicesInfo?.id) return;
        if (e === 'background') {
          await setHasBack(true);
          if (type) return;
          await initBackgroundFetch();
        }
        if (e === 'active') {
          await removeBackgroundFetch();
        }
      });
    };

    const jumpToMiniProgram = async () => {
      let res = await weChatStore.launchMiniProgram();
      if (res === 'notRegister') {
        navigation.navigate('OnePassLogin', {});
      }
    };
    const naviToCommon = (e) => {
      navigation.navigate(e, {});
    };

    const addEvent = (taskId) => {
      // 用Promise模拟长时间的任务
      return new Promise((resolve, reject) => {
        console.log(blueToothStore.currentDevice, moment(new Date()).format('YYYY-MM-DD hh:mm'));
        blueToothStore.getMsgUpload(mainListen).then(() => {
          resolve();
        });
        // blueToothStore.userDeviceSetting(false).then((res) => {
        //   console.log(res, '-----------------logs');
        // });
      });
    };

    const initBackgroundFetch = async () => {
      type = 1;
      console.log('初始化后台任务', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
      try {
        // await blueToothStore.manager.cancelDeviceConnection(blueToothStore.devicesInfo.id);
        await BackgroundFetch.configure(
          configureOptions,
          async (taskId) => {
            // await blueToothStore.listenActiveMessage(mainListen);
            await addEvent(taskId);
            BackgroundFetch.finish(taskId);
          },
          (taskId) => {
            console.warn('后台任务超时: ', taskId, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
            BackgroundFetch.finish(taskId);
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

    const removeBackgroundFetch = async () => {
      console.log('清除后台服务');
      type = 0;
      await BackgroundFetch.stop();
    };

    useEffect(() => {
      (async () => {
        let data = await AsyncStorage.getItem(DEVICE_DATA);
        data && currentSetContentList(JSON.parse(data));
        await setBackgroundServer();
      })();
    }, []);

    useEffect(() => {
      eventTimes(() => {
        setTarget(102);
        currentSetContentList(blueToothStore.currentDevice);
      }, 500);
    }, [blueToothStore.currentDevice]);

    const updateMenuState = () => {
      console.log('打开分享链接');
    };
    const openBlueTooth = useCallback(() => {
      navigation.navigate('BlueToothDetail', {});
    }, [navigation]);

    const currentSetContentList: Function = async (device) => {
      let list: any = contentList;
      if (device['-47']) {
        const { intValue2, i8, i9, i10, xinlvTime, xueyaTime } = device['-47'];
        list[0].value = `${arrCount(intValue2)}`;
        list[2].value = i8[i8.length - 1] || 0;
        list[2].time = xinlvTime[i8.length - 1] || '';
        if (i9.length > 0 && i10.length > 0) {
          list[3].value = `${i9[i9.length - 1] || 0}/${i10[i10.length - 1] || 0}`;
          list[3].time = xueyaTime[i9.length - 1] || '';
        }
      }
      if (device['-120']) {
        const { temperature } = device['-120'];
        if (temperature) {
          list[5].value = temperature.toFixed(2);
        }
      }
      if (device['-32']) {
        let data = device['-32'];
        if (!data['05']) {
          return;
        }
        let five = arrToByte(data['05'].toString().split(','), true);
        if (data) {
          let startTime = `${getMinTen(five[5])}-${getMinTen(five[6])} ${getMinTen(five[7])}:${getMinTen(five[8])}`;
          let endTime = `${getMinTen(five[9])}-${getMinTen(five[10])} ${getMinTen(five[11])}:${getMinTen(five[12])}`;
          // return {
          //   deepSleep: data['02']['12'],
          //   startTime: startTime,
          //   endTime: endTime
          // };
          const date1 = moment(startTime, 'MM-DD hh:mm');
          const date2 = moment(endTime, 'MM-DD hh:mm');
          let time = date2.diff(date1, 'minute');
          const h = Math.floor(time / 60);
          const mm = time % 60;
          list[1].value = `${h}小时${mm}分钟`;
        }
      }
      setContentList([...list]);
      let circle = list[0].value < 9000 ? 102 - Math.ceil((list[0].value / 9000) * 102) : 102;
      setTarget(circle);
      await AsyncStorage.setItem(DEVICE_DATA, JSON.stringify(device));
    };

    const blueToothDetail = useCallback(async () => {
      await hasAndroidPermission();
      const Powered = await BluetoothStateManager.getState();
      if (Powered === 'PoweredOn') {
        navigation.navigate('BlueTooth', {});
      } else {
        try {
          await BluetoothStateManager.enable();
        } catch (err) {}

        setTimeout(async () => {
          const status = await BluetoothStateManager.getState();
          if (status === 'PoweredOff') return;
          if (!blueToothStore.manager) await blueToothStore.setManagerInit();
          navigation.navigate('BlueTooth', {});
        }, 500);
      }
    }, [blueToothStore, navigation]);

    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      await blueToothStore.successDialog().then(() => setRefreshing(false));
    }, []);

    const closeBlueTooth = async () => {
      blueToothStore.isRoot = RootEnum['断开连接'];
      await AsyncStorage.removeItem(DEVICE_INFO);
      await setTimeout(async () => {
        await blueToothStore.closeDevices();
      }, 1000);
    };

    const currentDeviceView = useMemo(() => {
      let isTrue = blueToothStore.currentDevice['-96']?.power || 0;
      if (blueToothStore.refreshing) {
        return (
          <TouchableOpacity style={styles.modalModule} onPress={blueToothDetail}>
            <View style={[tw.flexRow, tw.itemsCenter, tw.justifyAround, tw.p2, tw.flex1]}>
              <Spinkit type="Circle" size={30} color="white" />
              <View style={styles.loadingView}>
                <Text style={[styles.labelColor, styles.labelRe]}>搜索设备: {blueToothStore.refreshInfo.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }
      if (!blueToothStore.devicesInfo) {
        return (
          <TouchableOpacity style={styles.cardStart} onPress={blueToothDetail}>
            <Text style={styles.tipText}>暂未绑定设备</Text>
            <View style={styles.btnView}>
              <Text style={styles.btnText}>去绑定</Text>
            </View>
          </TouchableOpacity>
        );
      }
      return (
        <View style={styles.deviceStart}>
          <View style={styles.deviceBanner}>
            <Text style={styles.tipText}>设备名称: {blueToothStore.devicesInfo.name}</Text>
            <View style={styles.deviceView}>
              <Text style={styles.deviceText}>电量</Text>
              <View style={styles.battery}>
                {[1, 2, 3, 4].map((item) => (
                  <View
                    style={[styles.batteryContent, [{ backgroundColor: item <= isTrue ? '#ffffff' : '' }]]}
                    key={Math.ceil(Math.random() * 10000).toString()}
                  />
                ))}
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.contextView} onPress={closeBlueTooth}>
            <Text style={styles.deviceContext}>断开连接</Text>
          </TouchableOpacity>
        </View>
      );
    }, [blueToothDetail, blueToothStore.devicesInfo, blueToothStore.refreshInfo.deviceID, blueToothStore.refreshing]);

    const currentDeviceBanner = useMemo(() => {
      return (
        <View style={styles.card}>
          <LinearGradient
            // colors={['#0078FF', '#0081FF', '#005eff', '#0090ff', '#008EFF']}
            colors={['#00bac4', '#06d1dc', '#00dbe5', '#00D1DE']}
            style={styles.cardLinear}
            start={{ x: 0.0, y: 0.25 }}
            end={{ x: 0.5, y: 1.0 }}
            locations={[0.2, 0.7, 0.5, 0.2]}
          >
            <View style={styles.headerStart}>
              <View style={styles.imageView}>
                <FastImage style={styles.headerImg} source={require('../assets/home/header-assets.png')} resizeMode={FastImage.resizeMode.cover} />
              </View>
              <TouchableOpacity style={styles.loginView}>
                <View style={styles.headerContent}>
                  <Text style={styles.userName}>用戶13</Text>
                </View>
              </TouchableOpacity>
            </View>
            {currentDeviceView}
          </LinearGradient>
        </View>
      );
    }, [blueToothDetail, blueToothStore.devicesInfo, openBlueTooth, blueToothStore.currentDevice, blueToothStore.refreshInfo, blueToothStore.refreshing]);

    const currentResult = useMemo(() => {
      return (
        <View style={styles.resultView}>
          <Text style={styles.resultText}>今日实时数据</Text>
          <View style={styles.tableList}>
            {contentList.map((item) => {
              return (
                <TouchableOpacity
                  key={Math.ceil(Math.random() * 1000000).toString()}
                  style={[styles.tableItem]}
                  onPress={async () => {
                    // await AsyncStorage.removeItem(TOKEN_NAME);
                    // let data = await AsyncStorage.getItem(USER_CONFIG);
                    // console.log(data, '123345');
                    // await blueToothStore.userDeviceSetting();
                    // return;
                    if (!blueToothStore.refreshing && blueToothStore.devicesInfo) {
                      return item.fun && item.fun();
                    }
                    baseView.current.showToast({ text: '请先连接设备', delay: 2 });
                  }}
                >
                  <LinearGradient
                    colors={item.colors}
                    style={styles.tableItemLinear}
                    start={{ x: 0.0, y: 0.25 }}
                    end={{ x: 0.5, y: 1.0 }}
                    locations={[0, 0.5, 0.6]}
                  >
                    <Text style={[styles.endTitle]}>{item.title}</Text>
                    {item.time ? (
                      <View style={styles.timeHeader}>
                        <Text style={[styles.timeTitle]}>
                          {item.evalTitle}: {item.time}
                        </Text>
                        <View style={styles.tableStart}>
                          <Text style={[styles.endValue]}>
                            {item.value || 0}
                            <Text style={styles.cap}> {item.cap}</Text>
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.tableHeader}>
                        <View style={styles.tableStart}>
                          <Text style={[styles.headerTitle]}>{item.evalTitle}: </Text>
                          <Text style={[styles.endValue]}>
                            {item.value || 0}
                            <Text style={styles.cap}> {item.cap}</Text>
                          </Text>
                        </View>
                      </View>
                    )}
                    <View style={styles.iconPosi}>
                      <Hexagon border={true} color={item.colors[0]}>
                        <FastImage style={styles.imageIcon} source={item.image} />
                      </Hexagon>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    }, [contentList, blueToothStore.refreshing, blueToothStore.devicesInfo]);

    const renderContext = useMemo(() => {
      return (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={[tw.flex1, [{ backgroundColor: '#f2f2f2', marginBottom: 60 }]]}
        >
          {currentDeviceBanner}
          {currentResult}
        </ScrollView>
      );
    }, [refreshing, onRefresh, target, contentList, currentResult]);

    return (
      <BaseView ref={baseView} style={[tw.flex1]}>
        <HeaderBar openLayout={() => updateMenuState()} />
        {renderContext}
        <PortalDialog visible={visDialog} open={openApi} delay={delayApi} context={visContext} />
        <PasswordDialog visible={blueToothStore.needRegPassword} open={passApi} input={bindTextInput} />
      </BaseView>
    );
  }
);
const color1 = '#00D1DE';
const color3 = '#ffffff';
const color5 = '#cecece';
const color7 = '#3d3d3d';
const color8 = '#00bac4';
const color9 = '#FF002F';
const color10 = '#8f8f8f';
const color11 = 'transparent';

const styles = StyleSheet.create({
  barText: {
    color: color5,
    fontSize: 16
  },
  battery: {
    borderColor: color3,
    borderRadius: 2,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    height: 15,
    padding: 1,
    paddingLeft: 0,
    width: 37
  },
  batteryContent: {
    backgroundColor: color3,
    flex: 1,
    height: '100%',
    marginLeft: 1
  },
  btnText: {
    color: color1,
    fontSize: 17
  },
  btnView: {
    alignItems: 'center',
    backgroundColor: color3,
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 6
  },
  cap: {
    fontSize: 12
  },
  card: {
    height: 200,
    margin: 10
  },
  cardDevicesView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  cardLinear: {
    borderRadius: 15,
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  cardStart: {
    alignItems: 'flex-start',
    flex: 1,
    paddingTop: 20
  },
  deviceBanner: {
    flex: 1
  },
  deviceStart: {
    flexDirection: 'row',
    marginTop: 40
  },
  contextView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  deviceContext: {
    color: '#ffffff'
  },
  deviceText: {
    color: color3,
    fontSize: 15,
    marginRight: 6
  },
  deviceView: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10
  },
  endTitle: {
    color: color7,
    fontSize: 16
  },
  endValue: {
    fontSize: 19
  },
  evalTitle: {
    color: color3,
    marginTop: 2,
    textAlign: 'center'
  },
  footerText: {
    marginTop: 3
  },
  header: {
    alignItems: 'center',
    backgroundColor: color1,
    height: 260,
    justifyContent: 'center',
    position: 'relative',
    width: '100%'
  },
  headerContent: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
    paddingVertical: 2
  },
  headerImg: {
    height: 50,
    width: 50
  },
  headerStart: {
    flexDirection: 'row'
  },
  headerTitle: {
    fontSize: 18
  },
  iconPosi: {
    position: 'absolute',
    right: 10,
    top: 5
  },
  imageIcon: {
    height: 23,
    width: 23
  },
  imageView: {
    alignItems: 'center',
    backgroundColor: color3,
    borderRadius: 50,
    height: 60,
    justifyContent: 'center',
    width: 60
  },
  labelColor: {
    color: color3
  },
  labelData: {
    fontSize: 15
  },
  labelRe: {
    fontSize: 18
  },
  labelText: {
    fontSize: 13
  },
  labelView: {
    borderColor: color3,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 3
  },
  linkModule: {
    backgroundColor: color8,
    height: 50,
    width: '100%'
  },
  linkStatus: {
    backgroundColor: color9,
    height: 50,
    width: '100%'
  },
  loginView: {
    flex: 1
  },
  mainTitle: {
    color: color3,
    fontFamily: 'SimpleLineIcons',
    fontSize: 35,
    textAlign: 'center'
  },
  modalModule: {
    flex: 1
  },
  resultText: {
    fontSize: 18
  },
  resultView: {
    backgroundColor: color3,
    borderRadius: 15,
    flex: 1,
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  tabBar: {
    alignItems: 'center',
    flex: 1
  },
  tabRow: {
    flexDirection: 'row'
  },
  tableEnd: {
    alignItems: 'flex-end'
  },
  tableHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tableItem: {
    backgroundColor: color3,
    marginBottom: 15,
    width: '48%'
  },
  tableItemLinear: {
    padding: 10
  },
  tableList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  tableStart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    flex: 1,
    paddingTop: 15
  },
  timeHeader: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  timeTitle: {
    fontSize: 12,
    paddingVertical: 10
  },
  tipText: {
    color: color3,
    fontSize: 17,
    fontWeight: 'bold'
  },
  triangle: {
    borderColor: color11,
    borderStyle: 'solid',
    borderTopColor: color10,
    borderTopWidth: 8,
    borderWidth: 5,
    height: 0,
    marginTop: 3,
    width: 0
  },
  userName: {
    color: color3,
    fontSize: 18
  },
  loadingView: {
    flex: 1,
    paddingHorizontal: 20
  }
});
