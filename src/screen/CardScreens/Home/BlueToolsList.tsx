import React, { useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { DeviceEventEmitter, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { CONTROL_LIST, DEVICE_INFO, WEATHER_UPDATE } from '../../../common/constants';
import { RightSlideTab } from '../../../component/list/RightSlideTab';
import { settingDevicesAlarm, settingDevicesLongSit, settingDevicesOxygen, settingDevicesScreenLight, updateWeather } from '../../../common/watch-module';
import { StackBar } from '../../../component/home/StackBar';
import { ScreenComponent } from '../../index';
import { useStore } from '../../../store';
import BaseView from '../../../component/BaseView';
import LinearGradient from 'react-native-linear-gradient';

export const BlueToolsList: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { blueToothStore } = useStore();

    const [nickName, setNickName] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [weatherControl, setWeatherControl] = useState<any>(false);
    const [lightControl, setLightControl] = useState<any>(false);
    const [whatLong, setWhatLong] = useState<any>(false);
    const [healthListen, setHealthListen] = useState<any>(false);
    const [bloodListen, setBloodListen] = useState<any>(false);
    // const [allListen, setAllListen] = useState<any>(false);

    useEffect(() => {
      baseView?.current?.showLoading({ text: '加载中...' });
      AsyncStorage.getItem(CONTROL_LIST).then((res) => {
        console.log(res, 'info-----------------');
        const { weather, light, long_set, health, blood } = res ? JSON.parse(res) : undefined;
        setWeatherControl(!!weather);
        setLightControl(!!light);
        setWhatLong(!!long_set);
        setHealthListen(!!health);
        setBloodListen(!!blood);
      });
      blueToothStore.userDeviceSetting(false).then((res) => {
        AsyncStorage.getItem(DEVICE_INFO).then((info) => {
          let result: any = typeof info === 'string' ? JSON.parse(info) : '';
          let resInfo: any = res?.data?.find((item) => item.device_mac === result.deviceID);
          setDeviceName(resInfo?.device_name || result.name);
          setNickName(resInfo?.note || '');
          setTimeout(() => {
            baseView?.current?.hideLoading();
          }, 500);
        });
      });
      let subscription = DeviceEventEmitter.addListener('EventType', (param) => {
        const { name, note, is_set_long, is_light, heart } = param;
        if ('name' in param) {
          setDeviceName(name);
        }
        if ('note' in param) {
          setNickName(note);
        }
        if ('is_light' in param) {
          setLightControl(is_light);
        }
        if ('is_set_long' in param) {
          setWhatLong(is_set_long);
        }
        if ('heart' in param) {
          setHealthListen(heart);
        }
      });
      // blueToothStore.sendActiveMessage(passRegSign('0000'));
      // let open1 = '00 00 01 01 00 00 00 00 01 00 00 00 01 00 01';
      // blueToothStore.sendActiveMessage(settingDevicesHeart(open1));
      // let open2 = '00 00 01 00 00 01 00 00 00 00 00 00 00 00 00 00 00 01';
      // blueToothStore.sendActiveMessage(settingDevicesHeart(open2));
      return () => {
        subscription.remove();
      };
    }, []);

    const backScreen = () => {
      navigation.goBack();
    };

    const openHelp = () => {
      console.log('帮助');
    };
    const openAllSetting = async () => {
      setLightControl(true);
      setWhatLong(true);
      setHealthListen(true);
      setBloodListen(true);
      await blueToothStore.openDeviceControl(true);
      let param = {
        weather: 'true',
        light: 'true',
        long_set: 'true',
        health: 'true',
        blood: 'true'
      };
      await AsyncStorage.setItem(CONTROL_LIST, JSON.stringify(param));
    };

    const currentSwitchWeather = useMemo(() => {
      return (
        <RightSlideTab
          data={options.weather}
          cate={weatherControl}
          onPress={async (e) => {
            setWeatherControl(e);
            await blueToothStore.sendActiveMessage(updateWeather(e ? 1 : 0));
            await AsyncStorage.setItem(WEATHER_UPDATE, JSON.stringify(e));
          }}
        />
      );
    }, [weatherControl]);
    const currentLongSetView = useMemo(() => {
      return (
        <RightSlideTab
          data={options.longSet}
          navigate={() => {
            navigation.navigate('LongSet');
          }}
          cate={whatLong}
          onPress={async (e) => {
            setWhatLong(!!e);
            let sto: any = await AsyncStorage.getItem(CONTROL_LIST);
            sto = sto ? JSON.parse(sto) : {};
            if (e) {
              await blueToothStore.sendActiveMessage(settingDevicesLongSit('08', '00', '12', '00', '1e', 1));
              sto.long_set = true;
            } else {
              await blueToothStore.sendActiveMessage(settingDevicesLongSit('00', '00', '00', '00', '00', 0));
              sto.long_set = false;
            }
            await AsyncStorage.setItem(CONTROL_LIST, JSON.stringify(sto));
          }}
        />
      );
    }, [whatLong]);
    const currentHandView = useMemo(() => {
      return (
        <RightSlideTab
          data={options.transform}
          cate={lightControl}
          noBorder={true}
          navigate={async () => {
            navigation.navigate('LightScreen');
          }}
          onPress={async (e) => {
            setLightControl(!!e);
            let sto: any = await AsyncStorage.getItem(CONTROL_LIST);
            sto = sto ? JSON.parse(sto) : {};
            if (e) {
              await blueToothStore.sendActiveMessage(settingDevicesScreenLight(1, '08', '00', '12', '00', '09'));
              sto.light = true;
            } else {
              await blueToothStore.sendActiveMessage(settingDevicesScreenLight(0, '08', '00', '12', '00', '09'));
              sto.light = false;
            }
            await AsyncStorage.setItem(CONTROL_LIST, JSON.stringify(sto));
          }}
        />
      );
    }, [lightControl]);
    const currentHealthView = useMemo(() => {
      return (
        <RightSlideTab
          data={options.heartSetting}
          cate={healthListen}
          navigate={async () => {
            navigation.navigate('HeartSetting');
          }}
          onPress={async (e) => {
            setHealthListen(!!e);
            let sto: any = await AsyncStorage.getItem(CONTROL_LIST);
            sto = sto ? JSON.parse(sto) : {};
            if (e) {
              await blueToothStore.sendActiveMessage(settingDevicesAlarm(115, 55, 1));
              sto.health = true;
            } else {
              await blueToothStore.sendActiveMessage(settingDevicesAlarm(0, 0, 0));
              sto.health = false;
            }
            await AsyncStorage.setItem(CONTROL_LIST, JSON.stringify(sto));
          }}
        />
      );
    }, [healthListen]);
    const currentBloodView = useMemo(() => {
      return (
        <RightSlideTab
          data={options.bloodSetting}
          cate={bloodListen}
          onPress={async (e) => {
            setBloodListen(!!e);
            let sto: any = await AsyncStorage.getItem(CONTROL_LIST);
            sto = sto ? JSON.parse(sto) : {};
            if (e) {
              await blueToothStore.sendActiveMessage(settingDevicesOxygen(16, 0, 8, 0, 1));
              sto.blood = true;
            } else {
              await blueToothStore.sendActiveMessage(settingDevicesOxygen(16, 0, 8, 0, 0));
              sto.blood = false;
            }
            await AsyncStorage.setItem(CONTROL_LIST, JSON.stringify(sto));
          }}
        />
      );
    }, [bloodListen]);
    // const currentAllListenView = useMemo(() => {
    //   return (
    //     <RightSlideTab
    //       data={options.setting}
    //       noBorder={true}
    //       cate={allListen}
    //       onPress={async (e) => {
    //         setAllListen(!!e);
    //         let sto: any = await AsyncStorage.getItem(CONTROL_LIST);
    //         sto = sto ? JSON.parse(sto) : {};
    //         sto.health = true;
    //         await blueToothStore.sendActiveMessage(passRegSign('0000'));
    //         let open1 = '00 00 01 01 00 00 00 00 01 00 00 00 01 00 01';
    //         await blueToothStore.sendActiveMessage(settingDevicesHeart(open1));
    //         let open2 = '00 00 01 00 00 01 00 00 00 00 00 00 00 00 00 00 00 01';
    //         await blueToothStore.sendActiveMessage(settingDevicesHeart(open2));
    //       }}
    //     />
    //   );
    // }, [allListen]);
    const renderView = useMemo(() => {
      return (
        <ScrollView style={styles.scrollView}>
          <Text style={styles.healthStyle}>设备设置</Text>
          <RightSlideTab
            data={options.nickName}
            value={nickName}
            navigate={() => {
              baseView?.current?.showLoading({ text: '加载中...', delay: 1.5 });
              navigation.navigate('BlueToothDeviceName');
              setTimeout(() => {
                baseView?.current?.hideLoading();
              }, 100);
            }}
          />
          <RightSlideTab
            data={options.deviceName}
            value={deviceName}
            navigate={() => {
              baseView?.current?.showLoading({ text: '加载中...', delay: 1.5 });
              navigation.navigate('BlueToothName');
              setTimeout(() => {
                baseView?.current?.hideLoading();
              }, 100);
            }}
          />
          {/*{currentSwitchWeather}*/}
          {/*<RightSlideTab*/}
          {/*  data={options.weatherPage}*/}
          {/*  navigate={() => {*/}
          {/*    baseView?.current?.showLoading({ text: '加载中...' });*/}
          {/*    navigation.navigate('GeoWeather');*/}
          {/*    setTimeout(() => {*/}
          {/*      baseView?.current?.hideLoading();*/}
          {/*    }, 100);*/}
          {/*  }}*/}
          {/*/>*/}
          <RightSlideTab
            data={options.messageSend}
            navigate={() => {
              baseView?.current?.showLoading({ text: '加载中...' });
              navigation.navigate('BlueToothMessage');
              setTimeout(() => {
                baseView?.current?.hideLoading();
              }, 100);
            }}
          />
          <RightSlideTab
            data={options.clockPage}
            navigate={() => {
              baseView?.current?.showLoading({ text: '加载中...' });
              navigation.navigate('ClockDial');
              setTimeout(() => {
                baseView?.current?.hideLoading();
              }, 100);
            }}
          />
          <RightSlideTab
            data={options.translation}
            noBorder={true}
            navigate={() => {
              navigation.navigate('LanguageSet');
              setTimeout(() => {
                baseView?.current?.hideLoading();
              }, 100);
            }}
          />
          <Text style={styles.healthStyle}>开关设置</Text>
          {currentLongSetView}
          {currentHandView}
          <Text style={styles.healthStyle}>健康设置</Text>
          {currentHealthView}
          {currentBloodView}
          {/*{currentAllListenView}*/}
          <TouchableOpacity style={styles.touchViewRight} onPress={openAllSetting}>
            <LinearGradient
              colors={['#07bec4', '#07bec5']}
              style={styles.touchStyle}
              start={{ x: 0.3, y: 0.75 }}
              end={{ x: 0.9, y: 1.0 }}
              locations={[0.1, 0.8]}
            >
              <Text style={styles.touchText}>推荐使用默认设置</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.bottomView} />
        </ScrollView>
      );
    }, [nickName, deviceName, weatherControl, whatLong, lightControl, healthListen, bloodListen]);

    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.justifyCenter, tw.textCenter]}>
          <StackBar title="设备控制" onBack={() => backScreen()} onHelp={openHelp} />
          {renderView}
        </View>
      </BaseView>
    );
  }
);

const color1 = '#868686';
const color2 = '#f3f3f3';
const color3 = '#ffffff';
const color4 = '#07bec4';
export const styles = StyleSheet.create({
  bottomView: { height: 70, width: '100%' },
  btnText: { color: color1, fontSize: 18, paddingHorizontal: 15, paddingVertical: 10 },
  healthStyle: { color: color4, fontSize: 16, fontWeight: 'bold', paddingHorizontal: 15, paddingVertical: 10 },
  scrollView: { backgroundColor: color2, flex: 1 },
  touchStyle: { borderRadius: 8, padding: 15 },
  touchText: { color: color3, fontSize: 16, textAlign: 'center' },
  touchViewRight: { marginHorizontal: '10%', marginVertical: 40, width: '80%' }
});
const options = {
  nickName: {
    name: '修改备注',
    image: require('../../../assets/home/name.png'),
    cate: 'info',
    type: 'label'
  },
  deviceName: {
    name: '设备名称',
    image: require('../../../assets/home/setting.png'),
    cate: 'device',
    type: 'label'
  },
  weather: {
    name: '天气更新',
    image: require('../../../assets/home/open-btn.png'),
    cate: 'device',
    type: 'switch'
  },
  weatherPage: {
    name: '天气预报',
    image: require('../../../assets/home/weather.png'),
    cate: 'device',
    type: 'label'
  },
  messageSend: {
    name: '推送消息',
    image: require('../../../assets/home/message.png'),
    type: 'label',
    cate: 'device'
  },
  clockPage: {
    name: '表盘设置',
    image: require('../../../assets/home/clock.png'),
    type: 'label',
    cate: 'device'
  },
  translation: {
    name: '语言设置',
    image: require('../../../assets/home/translation.png'),
    type: 'label',
    cate: 'device'
  },
  messageSetting: {
    name: '消息设置',
    image: require('../../../assets/home/message-setting.png'),
    type: 'label',
    cate: 'device'
  },
  longSet: {
    name: '久坐提醒设置',
    image: require('../../../assets/home/set.png'),
    cate: 'device',
    type: 'switch'
  },
  transform: {
    name: '转手腕亮屏设置',
    image: require('../../../assets/home/transform.png'),
    cate: 'device',
    type: 'switch'
  },
  heartSetting: {
    name: '心率警报设置',
    image: require('../../../assets/home/heart-setting.png'),
    cate: 'device',
    type: 'switch'
  },
  bloodSetting: {
    name: '血氧夜间监控',
    image: require('../../../assets/home/blood_ox.png'),
    cate: 'device',
    type: 'switch'
  },
  setting: {
    name: '一键打开健康监测开关',
    image: require('../../../assets/home/style-setting/setting.png'),
    cate: 'device',
    type: 'switch'
  }
};
