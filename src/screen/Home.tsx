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
import { arrCount, eventTimes, hasAndroidPermission } from '../common/tools';
import { Hexagon } from '../component/home/Hexagon';
import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_DATA, DEVICE_INFO } from '../common/constants';
import Spinkit from 'react-native-spinkit';
import { RootEnum } from '../common/sign-module';
import moment from 'moment';
import BackgroundFetch from 'react-native-background-fetch';
import { CirCleView } from '../component/home/CirCleView';
import LinearGradient from 'react-native-linear-gradient';

let type = 0;
export const Home: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { blueToothStore, weChatStore } = useStore();
    const baseView = useRef<any>(undefined);
    const [target, setTarget] = useState(102);
    const [contentList, setContentList] = useState<any>([
      {
        title: '运动',
        evalTitle: '最大步数',
        colors: ['rgba(109,189,252,0.71)', 'rgba(51,163,250,0.71)', 'rgba(0,152,247,0.71)'],
        image: require('../assets/home/footer.png'),
        value: '0',
        cap: '',
        fun: async () => {
          await jumpToMiniProgram();
        }
      },
      {
        title: '睡眠',
        evalTitle: '最长睡眠',
        colors: ['rgba(91,117,197,0.71)', 'rgba(119,144,226,0.71)', 'rgba(148,174,255,0.71)'],
        image: require('../assets/home/sleep.png'),
        value: '0',
        cap: '小时',
        fun: async () => {
          await jumpToMiniProgram();
        }
      },
      {
        title: '心率',
        evalTitle: '最近',
        colors: ['rgba(255,0,126,0.71)', 'rgba(253,41,144,0.71)', 'rgba(252,104,176,0.71)'],
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
        colors: ['rgba(255,145,0,0.68)', 'rgba(248,159,41,0.68)', 'rgba(255,190,107,0.68)'],
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
        colors: ['rgba(56,71,164,0.68)', 'rgba(94,112,206,0.68)', 'rgba(142,156,252,0.68)'],
        image: require('../assets/home/xueo2.png'),
        value: '',
        cap: '',
        // fun: () => blueToothStore.checkBlO2()
        fun: async () => {
          await naviToCommon('BloodTest');
        }
      },
      {
        title: '体温',
        evalTitle: '最近',
        colors: ['rgba(253,160,139,0.67)', 'rgba(231,148,131,0.67)', 'rgba(227,126,105,0.67)'],
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
    const [refreshing, setRefreshing] = React.useState(false);

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
        }
      })();
    }, [blueToothStore?.devicesInfo, AsyncStorage, blueToothStore.isRoot]);

    const setBackgroundServer = async () => {
      if (hasBack) return;
      AppState.addEventListener('change', async (e) => {
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
        blueToothStore.successDialog().then(() => {
          resolve();
        });
      });
    };

    const initBackgroundFetch = async () => {
      type = 1;
      console.log('初始化后台任务', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
      try {
        await BackgroundFetch.configure(
          configureOptions,
          async (taskId) => {
            console.log('添加后台任务', taskId, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
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

    const currentDevice = useMemo(() => {
      let isTrue = blueToothStore.currentDevice['-96']?.power || 0;
      if (blueToothStore.refreshing) {
        return (
          <TouchableOpacity style={styles.linkModule} onPress={blueToothDetail}>
            <View style={[tw.flexRow, tw.itemsCenter, tw.justifyAround, tw.p2, tw.flex1]}>
              <Spinkit type="Circle" size={25} color="white" />
              <View style={[tw.flexRow, tw.itemsCenter]}>
                <Text style={[styles.labelColor, styles.labelRe]}>加载设备:{blueToothStore.refreshInfo.deviceID}</Text>
              </View>
              <FastImage style={styles.imageIcon} source={require('../assets/home/right.png')} />
            </View>
          </TouchableOpacity>
        );
      }
      if (blueToothStore.devicesInfo) {
        return (
          <TouchableOpacity style={styles.linkModule} onPress={openBlueTooth}>
            <View style={[tw.flexRow, tw.itemsCenter, tw.justifyBetween, tw.p2, tw.flex1]}>
              <View style={[tw.flexRow, tw.itemsCenter]}>
                <FastImage style={styles.imageIcon} source={require('../assets/home/device.png')} />
                <Text style={[styles.labelColor, styles.labelData]}>{blueToothStore.devicesInfo.name}</Text>
                <View style={styles.battery}>
                  {[1, 2, 3, 4].map((item) => (
                    <View
                      style={[styles.batteryContent, [{ backgroundColor: item <= isTrue ? '#ffffff' : '' }]]}
                      key={Math.ceil(Math.random() * 10000).toString()}
                    />
                  ))}
                </View>
              </View>
              <View style={styles.labelView}>
                <Text style={[styles.labelColor, styles.labelText]}>更多操作</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity style={styles.linkStatus} onPress={blueToothDetail}>
          <View style={[tw.flexRow, tw.itemsCenter, tw.justifyBetween, tw.p2, tw.flex1]}>
            <View style={[tw.flexRow, tw.itemsCenter]}>
              <FastImage style={styles.imageIcon} source={require('../assets/home/device.png')} />
              <Text style={[styles.labelColor, styles.labelData]}>设备未连接</Text>
            </View>
            <View style={[tw.flexRow, tw.itemsCenter]}>
              <Text style={[styles.labelColor, styles.labelData]}>点击连接设备</Text>
              <FastImage style={styles.imageIcon} source={require('../assets/home/right.png')} />
            </View>
          </View>
        </TouchableOpacity>
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
                  onPress={() => {
                    if (!blueToothStore.refreshing && blueToothStore.devicesInfo) {
                      return item.fun && item.fun();
                    }
                    baseView.current.showToast({ text: '请先连接设备', delay: 2 });
                  }}
                >
                  <LinearGradient colors={item.colors} style={styles.tableItemLinear}>
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
          <View style={styles.header}>
            <CirCleView target={target} />
            <View style={{ position: 'absolute' }}>
              <View>
                <Text style={styles.mainTitle}>{contentList[0].value}</Text>
                <Text style={styles.evalTitle}>步</Text>
              </View>
              <View style={styles.footerText}>
                <Text style={styles.mainTitle}>0.0</Text>
                <Text style={styles.evalTitle}>小时</Text>
              </View>
            </View>
          </View>
          {currentDevice}
          {currentResult}
        </ScrollView>
      );
    }, [refreshing, onRefresh, target, contentList, currentDevice, currentResult]);

    return (
      <BaseView ref={baseView} style={[tw.flex1]}>
        <HeaderBar openLayout={() => updateMenuState()} />
        {renderContext}
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
    marginLeft: 10,
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
  cap: {
    fontSize: 12
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
  mainTitle: {
    color: color3,
    fontFamily: 'SimpleLineIcons',
    fontSize: 35,
    textAlign: 'center'
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
  triangle: {
    borderColor: color11,
    borderStyle: 'solid',
    borderTopColor: color10,
    borderTopWidth: 8,
    borderWidth: 5,
    height: 0,
    marginTop: 3,
    width: 0
  }
});
