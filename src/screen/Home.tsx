import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, ScrollView, SafeAreaView, AppState } from 'react-native';
import BaseView from '../component/BaseView';
import { useStore } from '../store';
import { ScreenComponent } from './index';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { HeaderBar } from '../component/home/HeaderBar';
import FastImage from 'react-native-fast-image';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { arrSort, eventTimes, hasAndroidPermission } from '../common/tools';
import { Svg, Circle } from 'react-native-svg';
import { Hexagon } from '../component/home/Hexagon';
import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_INFO } from '../common/constants';
import Spinkit from 'react-native-spinkit';
import { RootEnum } from '../common/sign-module';
import moment from 'moment';
import BackgroundFetch from 'react-native-background-fetch';
import { observable } from 'mobx';

let type = 0;
export const Home: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { blueToothStore } = useStore();
    const baseView = useRef<any>(undefined);
    const [dashArray] = useState([Math.PI * 2 * 102]);
    const [timeList] = useState([
      { name: '今天', value: 1 },
      { name: '昨天', value: 2 },
      { name: '前天', value: 3 }
    ]);
    const [contentList, setContentList] = useState([
      { title: '运动', evalTitle: '最大步数', color: '#0098f7', image: require('../assets/home/footer.png'), value: '788步' },
      { title: '睡眠', evalTitle: '最长睡眠', color: '#5b75c5', image: require('../assets/home/sleep.png'), value: '2小时' },
      { title: '心率', evalTitle: '最近', color: '#ff007e', image: require('../assets/home/heartPulse.png'), value: '' },
      { title: '血压', evalTitle: '最近', color: '#ff9100', image: require('../assets/home/xueya.png'), value: '' },
      { title: '血氧', evalTitle: '最近', color: '#3847a4', image: require('../assets/home/xueo2.png'), value: '' },
      { title: '体温', evalTitle: '最近', color: '#ff451f', image: require('../assets/home/tiwen.png'), value: '36.6°C' }
    ]);
    const [active, setActive] = useState(1);
    const [hasBack, setHasBack] = useState(false);
    const [configureOptions] = useState({
      minimumFetchInterval: 1,
      enableHeadless: true,
      forceAlarmManager: true,
      stopOnTerminate: false,
      startOnBoot: true
    }); // 默认后台运行配置项

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

    // await setBackgroundServer();
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
        await setBackgroundServer();
      })();
    }, []);

    useEffect(() => {
      eventTimes(() => {
        currentSetContentList(blueToothStore.currentDevice);
      }, 1500);
    }, [blueToothStore.currentDevice]);

    const updateMenuState = () => {
      console.log('打开分享链接');
    };
    const chooseTabs = (val) => {
      setActive(val);
    };
    const openBlueTooth = useCallback(() => {
      navigation.navigate('BlueToothDetail', {});
    }, [navigation]);

    const currentSetContentList: Function = (device) => {
      let list: any = contentList;
      if (!device['-47']) return;
      list[2].value = (device['-47'].i8[0] || 0) + 'bpm';
      list[3].value = `${arrSort(device['-47'].i9, true)[0] || 0}/${arrSort(device['-47'].i10, false)[0] || 0}mmHg`;
      setContentList([...list]);
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
                      style={[styles.batteryContent, { backgroundColor: item <= isTrue ? '#ffffff' : '' }]}
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
          <View style={styles.tabRow}>
            {timeList.map((item) => {
              let current = item.value === active;
              return (
                <TouchableWithoutFeedback key={item.name} onPress={() => chooseTabs(item.value)}>
                  <View style={styles.tabBar}>
                    <Text style={[styles.barText, { color: current ? '#8f8f8f' : '#cecece' }]}>{item.name}</Text>
                    {current ? <View style={styles.triangle} /> : null}
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
          <View style={styles.tableList}>
            {contentList.map((item) => {
              return (
                <View key={Math.ceil(Math.random() * 1000000).toString()} style={styles.tableItem}>
                  <View style={styles.tableHeader}>
                    <View style={styles.tableStart}>
                      <Hexagon border={true} color={item.color}>
                        <FastImage style={styles.imageIcon} source={item.image} />
                      </Hexagon>
                      <Text style={[styles.headerTitle, { color: item.color }]}>{item.title}</Text>
                    </View>
                    <View style={styles.tableEnd}>
                      <Text style={[styles.endTitle, { color: item.color }]}>{item.evalTitle}:</Text>
                      <Text style={[styles.endValue, { color: item.color }]}>{item.value}</Text>
                    </View>
                  </View>
                  <View></View>
                </View>
              );
            })}
          </View>
        </View>
      );
    }, [blueToothStore.blueRootList, active, blueToothStore.currentDevice, contentList]);

    const renderContext = useMemo(() => {
      return (
        <ScrollView style={[tw.flex1, [{ backgroundColor: '#fcfcfc', marginBottom: 50 }]]}>
          <View style={styles.header}>
            <View>
              <FastImage style={styles.headerImage} source={require('../assets/home/watch-banner.jpg')} />
              <Svg height="240" width="240">
                {/*<Circle cx="119" cy="120" r="102" stroke="#ffffff" strokeWidth="9" fill="transparent" />*/}
                <Circle
                  cx="119"
                  cy="120"
                  r="102"
                  // origin="50,50"
                  stroke="#ffffff"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={dashArray}
                  strokeDashoffset={Math.PI * 2 * 32}
                  transform={`rotate(-90, 119, 120)`}
                />
              </Svg>
            </View>
            <View style={{ position: 'absolute' }}>
              <View>
                <Text style={styles.mainTitle}>788</Text>
                <Text style={styles.evalTitle}>步</Text>
              </View>
              <View style={styles.footerText}>
                <Text style={styles.mainTitle}>0.3</Text>
                <Text style={styles.evalTitle}>小时</Text>
              </View>
            </View>
          </View>
          {currentDevice}
          {currentResult}
        </ScrollView>
      );
    }, [currentDevice, blueToothStore.devicesInfo, active, blueToothStore.currentDevice, contentList, blueToothStore.refreshInfo, blueToothStore.refreshing]);

    return (
      <BaseView ref={baseView} style={[tw.flex1]}>
        <HeaderBar openLayout={() => updateMenuState()} />
        {renderContext}
      </BaseView>
    );
  }
);

const styles = StyleSheet.create({
  evalTitle: {
    color: '#ffffff',
    marginTop: 2,
    textAlign: 'center'
  },
  footerText: {
    marginTop: 3
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#00D1DE',
    height: 260,
    justifyContent: 'center',
    position: 'relative',
    width: '100%'
  },
  headerImage: {
    height: 240,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 240
  },
  imageIcon: {
    height: 23,
    width: 23
  },
  labelColor: {
    color: '#ffffff'
  },
  labelRe: {
    fontSize: 18
  },
  labelData: {
    fontSize: 15
  },
  labelText: {
    fontSize: 13
  },
  labelView: {
    borderColor: '#ffffff',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 3
  },
  linkModule: {
    backgroundColor: '#00BAC4',
    height: 50,
    width: '100%'
  },
  linkStatus: {
    backgroundColor: '#FF002F',
    height: 50,
    width: '100%'
  },
  mainTitle: {
    color: '#ffffff',
    fontFamily: 'SimpleLineIcons',
    fontSize: 35,
    textAlign: 'center'
  },
  resultView: {
    padding: 10,
    flex: 1
  },
  battery: {
    borderColor: '#ffffff',
    borderRadius: 2,
    borderStyle: 'solid',
    flexDirection: 'row',
    borderWidth: 1,
    height: 15,
    marginLeft: 10,
    padding: 1,
    paddingLeft: 0,
    width: 37
  },
  batteryContent: {
    backgroundColor: '#ffffff',
    flex: 1,
    height: '100%',
    marginLeft: 1
  },
  tabRow: {
    flexDirection: 'row'
  },
  tabBar: {
    alignItems: 'center',
    flex: 1
  },
  barText: {
    color: '#cecece',
    fontSize: 16
  },
  triangle: {
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderTopColor: '#8f8f8f',
    borderTopWidth: 8,
    borderWidth: 5,
    height: 0,
    marginTop: 3,
    width: 0
  },
  tableList: {},
  tableItem: {
    height: 170,
    marginBottom: 10,
    backgroundColor: '#f2f2f2'
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  tableStart: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 18,
    marginLeft: 10
  },
  tableEnd: {
    alignItems: 'flex-end'
  },
  endTitle: {
    fontSize: 14,
    color: '#0098f7'
  },
  endValue: {
    fontSize: 19,
    color: '#0098f7'
  }
});
