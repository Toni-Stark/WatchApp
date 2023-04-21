import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, BackHandler, Linking, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import AsyncStorage from '@react-native-community/async-storage';
import Spinkit from 'react-native-spinkit';
import BaseView from '../component/BaseView';
import { ScreenComponent } from './index';
import { tw } from 'react-native-tailwindcss';
import { Api } from '../common/api';
import { RootEnum } from '../common/sign-module';
import { defaultDataLog } from '../store/BlueToothStore';
import { DEVICE_DATA, DEVICE_INFO, UPDATE_DEVICE_INFO, UPDATE_TIME } from '../common/constants';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';
import { HeaderBar } from '../component/home/HeaderBar';
import { arrCount, arrToByte, eventTimes, getMinTen, hasAndroidPermission } from '../common/tools';
import { StatusText } from '../component/home/StatusText';
import { Hexagon } from '../component/home/Hexagon';
import { getBrand } from 'react-native-device-info';

let type = 0;

export const Home: ScreenComponent = observer(
  ({ navigation, route }): JSX.Element => {
    const { blueToothStore, weChatStore, settingStore } = useStore();
    const baseView = useRef<any>(undefined);
    blueToothStore.baseView = baseView;
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
          // await blueToothStore.sendActiveMessage(allDataSleep);
          await jumpToMiniProgram();
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
          // await blueToothStore.sendActiveMessage(bloodData);
          // await naviToCommon('HeartTest');
          await jumpToMiniProgram();
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
        time: '',
        fun: async () => {
          await jumpToMiniProgram();
        }
      },
      {
        title: '体温',
        evalTitle: '最近',
        colors: ['#FFF8F7', '#FFEFEA', '#FFE5E1'],
        image: require('../assets/home/tiwen.png'),
        value: '',
        cap: '°C',
        time: '',
        fun: async () => {
          await jumpToMiniProgram();
        }
      },
      {
        title: '血糖',
        evalTitle: '最近',
        colors: ['#f7ffff', '#eafffe', '#e1fffd'],
        image: require('../assets/home/bloodC.png'),
        value: '',
        cap: 'mmol/L',
        time: '',
        fun: async () => {
          await jumpToMiniProgram();
        }
      }
    ]);
    const [hasBack, setHasBack] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [dataLogCat, setDataLogCat] = useState({ ...defaultDataLog });
    const [lastTime, setLastTime] = useState('');
    const [isRefresh, setIsRefresh] = useState(false);

    useEffect(() => {
      (async () => {
        const isUpdate: any = await settingStore.getDeviceUpdate();
        if (isUpdate?.success) {
          return;
        }
        // await AsyncStorage.setItem(NEAR_FUTURE, '{"F2:54:06:35:CA:F5":"2023/04/01"}');
        // let data: any = await AsyncStorage.getItem(NEAR_FUTURE);
        // console.log(data);
        // return;
        await weChatStore.getUserInfo();
        const rePowered = await BluetoothStateManager.getState();
        if (rePowered !== 'PoweredOn') return;
        let deviceInfo: string | null = await AsyncStorage.getItem(DEVICE_INFO);
        // if (blueToothStore?.devicesInfo) return;
        if (!deviceInfo) return;
        deviceInfo = JSON.parse(deviceInfo);
        if (!blueToothStore.devicesInfo) {
          await blueToothStore.reConnectDevice(deviceInfo, (res) => {
            if (res.type === '1') {
              blueToothStore.isRoot = RootEnum['无设备连接'];
              console.log('无设备连接');
              blueToothStore.refreshing = false;
              // baseView?.current?.showToast({ text: '重连失败', delay: 1 });
            }
            if (res.type === '5') {
              // baseView?.current?.showToast({ text: '', delay: 1 });
            }
            if (res.type === '3') {
              // baseView.current?.showToast({ text: '未搜索到设备', delay: 1 });
            }
            return;
          });
        }

        let bool = [RootEnum['初次进入'], RootEnum['连接中']].includes(blueToothStore.isRoot);
        if (blueToothStore?.devicesInfo && (bool || !blueToothStore?.reConnectionDevice)) {
          console.log('监听到状态变化，更新数据', blueToothStore.devicesInfo?.id);
          eventTimes(() => blueToothStore.successDialog({ date: blueToothStore.nearFuture }, baseView), 1000);
          blueToothStore.userDeviceSetting(true).then((res) => {});
        }
      })();
    }, [blueToothStore.isRoot, blueToothStore.devicesInfo]);

    useEffect(() => {
      navigation.addListener('focus', async () => {
        if (isRefresh) {
          await onRefreshing(true);
        }
      });
    }, [navigation]);

    const reConnectData = async () => {
      if (blueToothStore.devicesInfo) {
        if (blueToothStore.activeDeviceConnect) {
          await blueToothStore.successDialog({ date: 0 });
        }
      }
    };

    const showBackgroundActions = async () => {
      Linking.addEventListener('url', handleOpenURL);
      blueToothStore.settingBackgroundJob(getBrand(), UPDATE_DEVICE_INFO, 600000);
    };

    const handleOpenURL = (e) => {
      console.log(e, 'url-link');
    };

    const setBackgroundServer = async () => {
      let timer: any = null;
      if (hasBack) return;
      clearInterval(timer);
      timer = null;
      timer = setInterval(() => {
        if (!blueToothStore.refreshing) {
          reConnectData();
        }
      }, 1000000);
      AppState.addEventListener('change', async (e) => {
        if (!blueToothStore.devicesInfo?.id) return;
        if (e === 'background') {
          clearInterval(timer);
          timer = null;
          await setHasBack(true);
          blueToothStore.backgroundActive = true;
          if (type) return;
          // await showBackgroundActions();
        }
        if (e === 'active') {
          blueToothStore.backgroundActive = false;
          // ToastAndroid.show('清理后台进程' + getBrand(), 2000);
          // blueToothStore.stopBackgroundJob(getBrand());
          clearInterval(timer);
          timer = null;
          timer = setInterval(() => {
            reConnectData();
          }, 1000000);
        }
        let result = await blueToothStore.regDeviceConnect();
        if (!result) {
          setRefreshing(true);
          await blueToothStore
            .successDialog({
              callback: (res) => {
                setRefreshing(false);
                baseView.current.showToast(res);
              },
              date: 0
            })
            .then((res) => {
              setRefreshing(false);
            });
        }
      });
    };

    const jumpToMiniProgram = async () => {
      let res = await weChatStore.launchMiniProgram();
      if (res === 'notRegister') {
        navigation.navigate('OnePassLogin', {});
      }
    };

    useEffect(() => {
      (async () => {
        let data = await AsyncStorage.getItem(DEVICE_DATA);
        data && (await currentSetList(JSON.parse(data)));
        await setBackgroundServer();
      })();
    }, []);

    useEffect(() => {
      Api.getInstance.setUpNavigation(navigation);
    }, [navigation]);

    useEffect(() => {
      eventTimes(() => {
        // currentSetContentList(blueToothStore.currentDevice);
        if (blueToothStore?.devicesInfo?.id) {
          blueToothStore.getDeviceInfo({ id: blueToothStore.devicesInfo.id }).then((res) => {
            if (res.success) {
              currentSetList(res.data).then((upload) => {
                blueToothStore.updateGetDataTime().then();
              });
            }
            // blueToothStore.refreshing = false;
          });
        }
      }, 500);
    }, [blueToothStore.currentDevice, blueToothStore.refreshing]);

    const updateMenuState = () => {
      console.log('打开分享链接');
    };
    const updateTime = async () => {
      let time: any = await AsyncStorage.getItem(UPDATE_TIME);
      setLastTime(time);
    };

    const currentSetList = async (params) => {
      let list: any = contentList;
      list[0].value = params?.step_num || 0;
      list[1].value = params?.sleep_time || 0;
      list[2].value = params?.heart_rate || 0;
      list[2].time = params?.heart_rate_last_time || '';
      list[3].value = params?.blood_pressure || 0;
      list[3].time = params?.blood_pressure_last_time || '';
      list[4].value = params?.blood_oxygen ? params.blood_oxygen + '%' : 0;
      list[4].time = params?.blood_oxygen_last_time || '';
      list[5].value = params?.real_temp || 0;
      list[5].time = params?.temp_last_time || '';
      list[6].value = params?.blood_glucose || 0;
      list[6].time = params?.blood_glucose_last_time ? params?.blood_glucose_last_time : '';
      setContentList([...list]);
      setIsRefresh(true);
      await AsyncStorage.setItem(DEVICE_DATA, JSON.stringify(params));
      await updateTime();
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
      await blueToothStore
        .successDialog({
          callback: (res) => {
            setRefreshing(false);
            baseView.current.showToast(res);
          },
          date: 0
        })
        .then((res) => {
          setRefreshing(false);
        });
    }, []);

    const onRefreshing = async (bool?: boolean) => {
      if (!blueToothStore?.devicesInfo) {
        if (!bool) baseView.current.showToast({ text: '请连接设备', delay: 1.5 });
        return;
      }
      if (blueToothStore?.devicesInfo?.id) {
        blueToothStore.refreshBtn = true;
        blueToothStore.getDeviceInfo({ id: blueToothStore.devicesInfo.id }).then((res) => {
          if (res.success) {
            currentSetList(res.data).then(() => {
              blueToothStore.updateGetDataTime().then();
            });
          }
          if (!bool) baseView.current.showToast({ text: res.msg, delay: 1.5 });
          blueToothStore.refreshBtn = false;
        });
      }
    };

    const closeBlueTooth = async () => {
      await blueToothStore.removeBlueToothListen(true);
    };

    const addEval = () => {
      baseView.current.showLoading({ text: '加载中...' });
      navigation.navigate('BlueToolsList');
      setTimeout(() => {
        baseView.current.hideLoading();
      }, 100);
    };

    const outApp = async () => {
      if (settingStore.newDevice.type === 1) {
        settingStore.needUpdate = false;
        return;
      }
      BackHandler.exitApp();
      BackHandler.exitApp();
      BackHandler.exitApp();
      BackHandler.exitApp();
    };

    useEffect(() => {
      setDataLogCat({ ...blueToothStore.dataLogCat });
    }, [blueToothStore.dataLogCat]);

    const batteryItem = (light) => {
      return <View style={[styles.batteryContent, [{ backgroundColor: light ? '#ffffff' : '' }]]} key={Math.ceil(Math.random() * 10000).toString()} />;
    };

    const currentDeviceView = useMemo(() => {
      let isTrue = blueToothStore.currentDevice['-96']?.power || 0;
      // console.log(blueToothStore.refreshing, !blueToothStore.devicesInfo, '页面数据变化');
      if (blueToothStore.refreshing) {
        return (
          <TouchableOpacity style={styles.modalModule} onPress={blueToothDetail}>
            {!blueToothStore?.devicesInfo && blueToothStore?.refreshInfo ? (
              <View style={styles.refCard}>
                <View style={styles.refreshContent}>
                  <Text style={styles.refCardTitle}>设备名称：{blueToothStore.getEvalName()}</Text>
                  <Text style={styles.refCardMac}>MAC：{blueToothStore.refreshInfo.deviceID}</Text>
                  <Text style={styles.refCardTime}>上次连接时间：{blueToothStore.refreshInfo.time}</Text>
                </View>
                <View style={styles.refreshTips}>
                  <Text style={[styles.labelColor, styles.labelReady]}>正在重连设备...</Text>
                  <Spinkit type="Circle" size={30} color="white" />
                </View>
              </View>
            ) : (
              <View style={[tw.flexRow, tw.itemsCenter, tw.justifyAround, tw.p2, tw.flex1]}>
                <Spinkit type="Circle" size={30} color="white" />
                <StatusText dataLogCat={dataLogCat} info={blueToothStore.devicesInfo} />
              </View>
            )}
          </TouchableOpacity>
        );
      }
      if (!blueToothStore.devicesInfo) {
        return (
          <TouchableOpacity style={styles.cardStart} onPress={blueToothDetail}>
            <Text style={styles.tipText}>暂未连接设备</Text>
            <View style={styles.btnView}>
              <Text style={styles.btnText}>去连接</Text>
            </View>
          </TouchableOpacity>
        );
      }
      return (
        <View style={styles.deviceStart}>
          <TouchableOpacity style={styles.deviceBanner} onPress={onRefresh}>
            <View style={styles.deviceView}>
              <Text style={styles.deviceText}>电量</Text>
              <View style={styles.battery}>
                {batteryItem(isTrue >= 0)}
                {batteryItem(isTrue >= 1)}
                {batteryItem(isTrue >= 2)}
                {batteryItem(isTrue >= 3)}
              </View>
            </View>
            <Text style={styles.evalText}>数据记录时间：{lastTime}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contextView} onPress={closeBlueTooth}>
            <Text style={styles.deviceContext}>断开连接</Text>
          </TouchableOpacity>
        </View>
      );
    }, [
      lastTime,
      dataLogCat,
      blueToothStore.currentDevice,
      blueToothStore.refreshing,
      blueToothStore.devicesInfo,
      blueToothStore.dataNowTime,
      blueToothDetail,
      blueToothStore.evalName
    ]);
    const onPressCopy = () => {
      let str = blueToothStore.devicesInfo.id;
      Clipboard.setString(str);
      ToastAndroid.show('已复制到粘贴板', 1500);
    };
    const onLongPress = (e) => {
      let str = e._targetInst.pendingProps.children;
      Clipboard.setString(str);
      ToastAndroid.show('已复制到粘贴板', 1500);
    };

    // const currentDeviceBanner = useMemo(() => {
    //   let device = blueToothStore.devicesInfo;
    //   return (
    //     <View style={styles.card}>
    //       <LinearGradient
    //         colors={['#00bac4', '#06d1dc', '#00dbe5', '#00D1DE']}
    //         style={styles.cardLinear}
    //         start={{ x: 0.0, y: 0.25 }}
    //         end={{ x: 0.5, y: 1.0 }}
    //         locations={[0.2, 0.7, 0.5, 0.2]}
    //       >
    //         {device?.name ? (
    //           <TouchableOpacity onPress={addEval} style={styles.evalButton}>
    //             <Text style={styles.evalName}>操作</Text>
    //           </TouchableOpacity>
    //         ) : null}
    //         <View style={styles.headerStart}>
    //           {device?.id ? (
    //             <View style={styles.imageView}>
    //               <FastImage style={styles.headerImg} source={require('../assets/home/header-assets.png')} resizeMode={FastImage.resizeMode.cover} />
    //             </View>
    //           ) : (
    //             <View style={styles.imageViewEval} />
    //           )}
    //
    //           <TouchableOpacity style={styles.loginView} onPress={onPressCopy}>
    //             <View style={styles.headerContent}>
    //               {device?.name ? (
    //                 <View style={styles.userView}>
    //                   <Text ellipsizeMode="middle" numberOfLines={1} style={styles.userName} onLongPress={onLongPress}>
    //                     {blueToothStore.getEvalName()}
    //                   </Text>
    //                 </View>
    //               ) : (
    //                 <Text style={styles.userName} />
    //               )}
    //               {device?.id ? <Text style={styles.deviceMac}>MAC:{device.id}</Text> : null}
    //             </View>
    //           </TouchableOpacity>
    //         </View>
    //         {currentDeviceView}
    //       </LinearGradient>
    //     </View>
    //   );
    // }, [
    //   blueToothStore.evalName,
    //   weChatStore.userInfo,
    //   blueToothDetail,
    //   blueToothStore.devicesInfo,
    //   dataLogCat,
    //   lastTime,
    //   openBlueTooth,
    //   blueToothStore.currentDevice,
    //   blueToothStore.refreshInfo,
    //   blueToothStore.refreshing
    // ]);

    const currentResult = useMemo(() => {
      return (
        <View style={styles.resultView}>
          <View style={styles.refreshView}>
            <Text style={styles.resultText}>今日实时数据</Text>
            {blueToothStore.refreshBtn ? (
              <View style={styles.refreshButton}>
                <Spinkit type="Circle" size={15} color="white" />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={async () => {
                  await onRefreshing(false);
                }}
              >
                <Text style={styles.buttonText}>更新数据</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.tableList}>
            {contentList.map((item) => {
              return (
                <TouchableOpacity
                  key={Math.ceil(Math.random() * 1000000).toString()}
                  style={[styles.tableItem]}
                  onPress={async () => {
                    if (!blueToothStore.refreshing && blueToothStore.devicesInfo) {
                      return item.fun && item.fun();
                    }
                    // baseView.current.showToast({ text: '请先连接设备', delay: 2 });
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
                    <View style={styles.timeHeader}>
                      <Text style={[styles.timeTitle]}>
                        {item.evalTitle}: {item.time}
                      </Text>

                      <View style={styles.tableStart}>
                        {item?.value ? (
                          <Text style={[styles.endValue]}>
                            {item.value || 0}
                            <Text style={styles.cap}> {item.cap}</Text>
                          </Text>
                        ) : (
                          <Text style={[styles.evalValue]}>无数据</Text>
                        )}
                      </View>
                    </View>

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
    }, [contentList, blueToothStore.refreshing, blueToothStore.devicesInfo, blueToothStore.refreshBtn]);

    // 控制按钮
    const controlBtn = () => {
      return (
        <TouchableOpacity onPress={addEval} style={styles.evalButton}>
          <Text style={styles.evalName}>操作</Text>
        </TouchableOpacity>
      );
    };
    // 手表logo
    const renderDeviceLogo = (bool?: boolean | string) => {
      if (bool) {
        return (
          <View style={styles.imageView}>
            <FastImage style={styles.headerImg} source={require('../assets/home/header-assets.png')} resizeMode={FastImage.resizeMode.cover} />
          </View>
        );
      }
      return <View style={styles.imageViewEval} />;
    };
    // 设备全名
    const renderDeviceName = useMemo(() => {
      let name = blueToothStore.getEvalName();
      let refresh =
        (!blueToothStore.refreshing && blueToothStore?.refreshInfo && blueToothStore?.devicesInfo) ||
        (blueToothStore.refreshing && blueToothStore?.refreshInfo && blueToothStore?.devicesInfo);
      if (name && refresh) {
        return (
          <View style={styles.userView}>
            <Text ellipsizeMode="middle" numberOfLines={1} style={styles.userName} onLongPress={onLongPress}>
              {name}
            </Text>
          </View>
        );
      }
      return <Text style={styles.userName} />;
    }, [blueToothStore.refreshing, blueToothStore?.refreshInfo, blueToothStore?.devicesInfo]);
    // 设备id

    const renderContext = useMemo(() => {
      let { name, id } = blueToothStore?.devicesInfo || blueToothStore?.refreshInfo || {};
      return (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} contentContainerStyle={{ backgroundColor: '#f2f2f2' }}>
          <View style={styles.card}>
            <LinearGradient
              colors={['#00bac4', '#06d1dc', '#00dbe5', '#00D1DE']}
              style={styles.cardLinear}
              start={{ x: 0.0, y: 0.25 }}
              end={{ x: 0.5, y: 1.0 }}
              locations={[0.2, 0.7, 0.5, 0.2]}
            >
              {name && controlBtn()}
              <View style={styles.headerStart}>
                {renderDeviceLogo(id)}
                <TouchableOpacity style={styles.loginView} onPress={onPressCopy}>
                  <View style={styles.headerContent}>
                    {name && renderDeviceName}
                    {id ? <Text style={styles.deviceMac}>MAC:{id}</Text> : null}
                  </View>
                </TouchableOpacity>
              </View>
              {currentDeviceView}
            </LinearGradient>
          </View>
          {currentResult}
        </ScrollView>
      );
    }, [
      refreshing,
      blueToothStore.devicesInfo,
      onRefresh,
      contentList,
      currentResult,
      weChatStore.userInfo,
      dataLogCat,
      blueToothStore.readyDevice,
      blueToothStore.evalName,
      blueToothStore.refreshInfo,
      lastTime
    ]);

    return (
      <BaseView
        ref={baseView}
        style={[tw.flex1]}
        useSafeArea={true}
        needUpdate={settingStore.needUpdate}
        onSubmit={settingStore.updateIng}
        onDismiss={outApp}
        data={settingStore?.newDevice}
      >
        <StatusBar backgroundColor="#00D1DE" barStyle={'light-content'} hidden={false} />
        <HeaderBar
          openLayout={() => updateMenuState()}
          sharePress={
            blueToothStore?.devicesInfo
              ? () => {
                  navigation.navigate('BindingInfo', { mac: blueToothStore?.devicesInfo.id });
                }
              : undefined
          }
        />
        {renderContext}
        {/*<TouchableOpacity*/}
        {/*  onPress={() => {*/}
        {/*    blueToothStore.devicesTimes = 0;*/}
        {/*    blueToothStore.aloneTimes = 0;*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Text>*/}
        {/*    +++{blueToothStore.devicesTimes}---{blueToothStore.aloneTimes}+++*/}
        {/*  </Text>*/}
        {/*</TouchableOpacity>*/}
        <View style={{ height: 65 }} />
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
const color12 = '#6a6a6a';

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
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '80%'
  },
  buttonText: {
    color: color3
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
    paddingTop: 20,
    position: 'relative'
  },
  cardStart: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  contextView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  deviceBanner: {
    flex: 1
  },
  deviceContext: {
    color: color3
  },
  deviceMac: {
    color: color3,
    fontSize: 16
  },
  deviceStart: {
    flexDirection: 'row',
    marginTop: 30
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
  evalButton: {
    backgroundColor: color8,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 18,
    paddingVertical: 10,
    position: 'absolute',
    right: 0,
    top: 0
  },
  evalName: {
    color: color3,
    fontSize: 14
  },
  evalText: {
    color: color3,
    fontSize: 15,
    marginTop: 5
  },
  evalTitle: {
    color: color3,
    marginTop: 2,
    textAlign: 'center'
  },
  evalValue: {
    color: color12,
    fontSize: 16
  },
  footerText: {
    marginTop: 3
  },
  headerContent: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
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
    overflow: 'hidden',
    width: 60
  },
  imageViewEval: {
    // height: 60,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 60
  },
  labelColor: {
    color: color3,
    marginLeft: 10
  },
  labelData: {
    fontSize: 15
  },
  labelReady: {
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
  refCard: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 30
  },
  refCardMac: {
    color: color3,
    fontSize: 14,
    marginTop: 5
  },
  refCardTime: {
    color: color3,
    fontSize: 14,
    marginTop: 5
  },
  refCardTitle: {
    color: color3,
    fontSize: 20
  },
  refreshButton: {
    alignItems: 'center',
    backgroundColor: color1,
    borderRadius: 4,
    height: 27,
    justifyContent: 'center',
    padding: 5,
    width: 70
  },
  refreshContent: {
    marginLeft: 20,
    width: '100%'
  },
  refreshTips: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  refreshView: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 28,
    justifyContent: 'space-between'
  },
  resultText: {
    fontSize: 18
  },
  resultView: {
    backgroundColor: color3,
    borderRadius: 15,
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
    overflow: 'scroll',
    paddingVertical: 10
  },
  tableStart: {
    alignItems: 'flex-end',
    flexDirection: 'column'
    // paddingTop: 15
  },
  timeHeader: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  timeTitle: {
    flexDirection: 'row',
    fontSize: 12,
    paddingVertical: 6
  },
  tipText: {
    color: color3,
    fontSize: 25,
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
    alignItems: 'center',
    color: color3,
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold'
  },
  userView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
