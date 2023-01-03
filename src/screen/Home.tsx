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
import { arrCount, eventTimes, hasAndroidPermission } from '../common/tools';
import { Hexagon } from '../component/home/Hexagon';
import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_DATA, DEVICE_INFO } from '../common/constants';
import Spinkit from 'react-native-spinkit';
import { RootEnum } from '../common/sign-module';
import moment from 'moment';
import BackgroundFetch from 'react-native-background-fetch';
import { CirCleView } from '../component/home/CirCleView';

let type = 0;
export const Home: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { blueToothStore } = useStore();
    const baseView = useRef<any>(undefined);
    const [target, setTarget] = useState(102);
    const [timeList] = useState([
      { name: '今天', value: 1 },
      { name: '昨天', value: 2 },
      { name: '前天', value: 3 }
    ]);
    const [contentList, setContentList] = useState([
      { title: '运动', evalTitle: '最大步数', color: '#0098f7', image: require('../assets/home/footer.png'), value: '0', cap: '' },
      { title: '睡眠', evalTitle: '最长睡眠', color: '#5b75c5', image: require('../assets/home/sleep.png'), value: '0', cap: '小时' },
      { title: '心率', evalTitle: '最近', color: '#ff007e', image: require('../assets/home/heartPulse.png'), value: '', cap: 'bpm', time: '' },
      { title: '血压', evalTitle: '最近', color: '#ff9100', image: require('../assets/home/xueya.png'), value: '', cap: 'mmHg', time: '' },
      { title: '血氧', evalTitle: '最近', color: '#3847a4', image: require('../assets/home/xueo2.png'), value: '', cap: '' },
      { title: '体温', evalTitle: '最近', color: '#ff451f', image: require('../assets/home/tiwen.png'), value: '', cap: '°C' }
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
        // let data = await AsyncStorage.getItem(DEVICE_DATA);
        // data && currentSetContentList(JSON.parse(data));
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
    const chooseTabs = (val) => {
      setActive(val);
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
        console.log(temperature, '体温');
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
          <View style={styles.tableList}>
            {contentList.map((item) => {
              return (
                <View key={Math.ceil(Math.random() * 1000000).toString()} style={styles.tableItem}>
                  <Text style={[styles.endTitle, { color: item.color }]}>{item.title}</Text>
                  {item.time ? (
                    <View style={styles.timeHeader}>
                      <Text style={[styles.timeTitle, { color: item.color }]}>
                        {item.evalTitle}: {item.time}
                      </Text>
                      <View style={styles.tableStart}>
                        <Text style={[styles.endValue, { color: item.color }]}>
                          {item.value || 0}
                          <Text style={styles.cap}> {item.cap}</Text>
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.tableHeader}>
                      <View style={styles.tableStart}>
                        <Text style={[styles.headerTitle, { color: item.color }]}>{item.evalTitle}: </Text>
                        <Text style={[styles.endValue, { color: item.color }]}>
                          {item.value || 0}
                          <Text style={styles.cap}> {item.cap}</Text>
                        </Text>
                      </View>
                    </View>
                  )}
                  <View style={styles.iconPosi}>
                    <Hexagon border={true} color={item.color}>
                      <FastImage style={styles.imageIcon} source={item.image} />
                    </Hexagon>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      );
    }, [timeList, contentList, active]);

    const renderContext = useMemo(() => {
      return (
        <ScrollView style={[tw.flex1, [{ backgroundColor: '#f2f2f2', marginBottom: 60 }]]}>
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
    }, [target, contentList, currentDevice, currentResult]);

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
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15
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
  tableList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  tableItem: {
    // height: 170,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    width: '48%',
    borderRadius: 15,
    padding: 10
  },
  tableHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  timeHeader: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  tableStart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    flex: 1,
    paddingTop: 15
  },
  iconPosi: {
    position: 'absolute',
    right: 10,
    top: 5
  },
  headerTitle: {
    fontSize: 18
  },
  timeTitle: {
    fontSize: 12
  },
  cap: {
    fontSize: 12
  },
  tableEnd: {
    alignItems: 'flex-end'
  },
  endTitle: {
    fontSize: 20,
    color: '#0098f7'
  },
  endValue: {
    fontSize: 19,
    color: '#0098f7'
  }
});
