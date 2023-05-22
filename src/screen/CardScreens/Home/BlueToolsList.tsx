import React, { useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { DeviceEventEmitter, ScrollView, StyleSheet, Text, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { DEVICE_INFO, WEATHER_UPDATE } from '../../../common/constants';
import { RightSlideTab } from '../../../component/list/RightSlideTab';
import {
  passRegSign,
  settingDevicesAlarm,
  settingDevicesHeart,
  settingDevicesLongSit,
  settingDevicesMessage,
  settingDevicesOxygen,
  settingDevicesScreenLight,
  updateWeather
} from '../../../common/watch-module';
import { StackBar } from '../../../component/home/StackBar';
import { ScreenComponent } from '../../index';
import { useStore } from '../../../store';
import BaseView from '../../../component/BaseView';

export const BlueToolsList: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { blueToothStore } = useStore();
    const [dataList, setDataList] = useState([
      {
        name: '修改备注',
        value: '',
        image: require('../../../assets/home/name.png'),
        cate: 'info',
        type: 'label',
        navigate: () => {
          baseView?.current?.showLoading({ text: '加载中...', delay: 1.5 });
          navigation.navigate('BlueToothDeviceName');
          setTimeout(() => {
            baseView?.current?.hideLoading();
          }, 100);
        }
      },
      {
        name: '设备名称',
        value: '',
        image: require('../../../assets/home/setting.png'),
        cate: 'device',
        type: 'label',
        navigate: async () => {
          baseView?.current?.showLoading({ text: '加载中...', delay: 1.5 });
          navigation.navigate('BlueToothName');
          setTimeout(() => {
            baseView?.current?.hideLoading();
          }, 100);
        }
      },
      {
        name: '天气更新',
        value: '',
        image: require('../../../assets/home/open-btn.png'),
        cate: 'device',
        type: 'switch',
        fun: async (e) => {
          await blueToothStore.sendActiveMessage(updateWeather(e ? 1 : 0));
          await AsyncStorage.setItem(WEATHER_UPDATE, JSON.stringify(e));
        }
      },
      {
        name: '天气预报',
        value: '',
        image: require('../../../assets/home/weather.png'),
        cate: 'device',
        type: 'label',
        navigate: async () => {
          baseView?.current?.showLoading({ text: '加载中...' });
          navigation.navigate('GeoWeather');
          setTimeout(() => {
            baseView?.current?.hideLoading();
          }, 100);
        }
      },
      {
        name: '推送消息',
        value: '',
        image: require('../../../assets/home/message.png'),
        cate: 'device',
        type: 'label',
        navigate: async () => {
          baseView?.current?.showLoading({ text: '加载中...' });
          navigation.navigate('BlueToothMessage');
          setTimeout(() => {
            baseView?.current?.hideLoading();
          }, 100);
        }
      },
      {
        name: '表盘设置',
        value: '',
        image: require('../../../assets/home/clock.png'),
        cate: 'device',
        type: 'label',
        navigate: async () => {
          baseView?.current?.showLoading({ text: '加载中...' });
          navigation.navigate('ClockDial');
          setTimeout(() => {
            baseView?.current?.hideLoading();
          }, 100);
        }
      },
      {
        name: '语言设置',
        value: '',
        image: require('../../../assets/home/translation.png'),
        cate: 'device',
        type: 'label',
        navigate: async () => {
          // if (!blueToothStore.readyDevice) return baseView?.current?.showToast({ text: '请连接蓝牙手表', delay: 1.5 });
          // baseView?.current?.showLoading({ text: '加载中...' });
          navigation.navigate('LanguageSet');
          setTimeout(() => {
            baseView?.current?.hideLoading();
          }, 100);
        }
      },
      {
        name: '消息设置',
        value: '',
        image: require('../../../assets/home/message-setting.png'),
        cate: 'device',
        type: 'label',
        navigate: async () => {
          // if (!blueToothStore.readyDevice) return baseView?.current?.showToast({ text: '请连接蓝牙手表', delay: 1.5 });
          // baseView?.current?.showLoading({ text: '加载中...' });
          navigation.navigate('MessageControl');
          setTimeout(() => {
            baseView?.current?.hideLoading();
          }, 100);
        }
        // fun: async (e) => {
        //   if (e) {
        //     await blueToothStore.sendActiveMessage(settingDevicesMessage(Array(18).fill(1)));
        //   } else {
        //     await blueToothStore.sendActiveMessage(settingDevicesMessage(Array(18).fill(2)));
        //   }
        // }
      }
    ]);
    const [controlList, setControlList] = useState([
      {
        name: '久坐提醒设置',
        value: '',
        image: require('../../../assets/home/set.png'),
        cate: 'device',
        type: 'switch',
        navigate: async () => {
          navigation.navigate('LongSet');
        },
        fun: async (e) => {
          if (e) {
            await blueToothStore.sendActiveMessage(settingDevicesLongSit('08', '00', '12', '00', '1e', 1));
          } else {
            await blueToothStore.sendActiveMessage(settingDevicesLongSit('00', '00', '00', '00', '00', 0));
          }
        }
      },
      {
        name: '转手腕亮屏设置',
        value: '',
        image: require('../../../assets/home/transform.png'),
        cate: 'device',
        type: 'switch',
        navigate: async () => {
          navigation.navigate('LightScreen');
        },
        fun: async (e) => {
          if (e) {
            await blueToothStore.sendActiveMessage(settingDevicesScreenLight(1, '08', '00', '12', '00', '09'));
          } else {
            await blueToothStore.sendActiveMessage(settingDevicesScreenLight(0, '08', '00', '12', '00', '09'));
          }
        }
      }
    ]);
    const [healthList, setHealthList] = useState([
      {
        name: '心率警报设置',
        value: '',
        image: require('../../../assets/home/heart-setting.png'),
        cate: 'device',
        type: 'switch',
        navigate: async () => {
          navigation.navigate('HeartSetting');
        },
        fun: async (e) => {
          if (e) {
            await blueToothStore.sendActiveMessage(settingDevicesAlarm(115, 55, 1));
          } else {
            await blueToothStore.sendActiveMessage(settingDevicesAlarm(0, 0, 0));
          }
        }
      },
      {
        name: '血氧夜间监控',
        value: '',
        image: require('../../../assets/home/blood_ox.png'),
        cate: 'device',
        type: 'switch',
        fun: async (e) => {
          if (e) {
            await blueToothStore.sendActiveMessage(settingDevicesOxygen(16, 0, 8, 0, 1));
          } else {
            await blueToothStore.sendActiveMessage(settingDevicesOxygen(16, 0, 8, 0, 0));
          }
        }
      },
      {
        name: '一键打开健康监测开关',
        value: '',
        image: require('../../../assets/home/blood_ox.png'),
        cate: 'device',
        type: 'switch',
        fun: async () => {
          blueToothStore.sendActiveMessage(passRegSign('0000'));
          let open1 = '00 00 01 01 00 00 00 00 01 00 00 00 01 00 01';
          blueToothStore.sendActiveMessage(settingDevicesHeart(open1));
          let open2 = '00 00 01 00 00 01 00 00 00 00 00 00 00 00 00 00 00 01';
          blueToothStore.sendActiveMessage(settingDevicesHeart(open2));
          // if (e) {
          //   // 第一部分开关
          //   let open1 = '00 00 01 01 00 00 00 00 01 00 00 00 01 00 01';
          //   await blueToothStore.sendActiveMessage(settingDevicesHeart(open1));
          //   let open2 = '00 00 01 00 00 01 00 00 00 00 00 00 00 00 00 00 00 01';
          //   await blueToothStore.sendActiveMessage(settingDevicesHeart(open2));
          // } else {
          //   let open1 = '00 00 02 02 00 00 00 00 02 00 00 00 02 00 02';
          //   await blueToothStore.sendActiveMessage(settingDevicesHeart(open1));
          //   let open2 = '00 00 02 00 00 02 00 00 00 00 00 00 00 00 00 00 00 01';
          //   await blueToothStore.sendActiveMessage(settingDevicesHeart(open2));
          // }
        }
      }
    ]);

    useEffect(() => {
      baseView?.current?.showLoading({ text: '加载中...' });
      AsyncStorage.getItem(WEATHER_UPDATE).then((weather) => {
        let list: any = [...dataList];
        if (!weather) return;
        list[2].value = JSON.parse(weather);
        setDataList(list);
      });
      blueToothStore.userDeviceSetting(false).then((res) => {
        let list: any = [...dataList];
        AsyncStorage.getItem(DEVICE_INFO).then((info) => {
          let result: any = typeof info === 'string' ? JSON.parse(info) : '';
          let resInfo: any = res?.data?.find((item) => item.device_mac === result.deviceID);
          list[1].value = resInfo?.device_name || result.name;
          list[0].value = resInfo?.note || '';
          setDataList(list);
          setTimeout(() => {
            baseView?.current?.hideLoading();
          }, 500);
        });
      });

      let subscription = DeviceEventEmitter.addListener('EventType', (param) => {
        let list: any = [...dataList];
        if (param?.name) {
          list[1].value = param?.name;
        }
        if (param?.note) {
          list[0].value = param?.note;
        }
        setDataList(list);
        // 刷新界面等
      });
      blueToothStore.sendActiveMessage(passRegSign('0000'));
      let open1 = '00 00 01 01 00 00 00 00 01 00 00 00 01 00 01';
      blueToothStore.sendActiveMessage(settingDevicesHeart(open1));
      let open2 = '00 00 01 00 00 01 00 00 00 00 00 00 00 00 00 00 00 01';
      blueToothStore.sendActiveMessage(settingDevicesHeart(open2));
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

    const renderView = useMemo(() => {
      let isCate = { value: true, cate: dataList[0].cate };
      return (
        <ScrollView style={styles.scrollView}>
          <Text style={styles.btnText}>设备设置</Text>
          {dataList.map((item, index) => {
            if (index !== 0 && isCate.cate !== item.cate) {
              isCate.value = false;
              isCate.cate = item.cate;
            } else if (index !== 0) {
              isCate.value = true;
            }
            return <RightSlideTab key={index + Math.random() * 1000} data={item} cate={isCate.value} onPress={item.fun} navigate={item.navigate} />;
          })}
          <Text style={styles.healthStyle}>开关设置</Text>
          {controlList.map((item, index) => {
            if (index !== 0 && isCate.cate !== item.cate) {
              isCate.value = false;
              isCate.cate = item.cate;
            } else if (index !== 0) {
              isCate.value = true;
            }
            return <RightSlideTab key={index + Math.random() * 1000} data={item} cate={isCate.value} onPress={item.fun} navigate={item?.navigate} />;
          })}
          <Text style={styles.healthStyle}>健康设置</Text>
          {healthList.map((item, index) => {
            if (index !== 0 && isCate.cate !== item.cate) {
              isCate.value = false;
              isCate.cate = item.cate;
            } else if (index !== 0) {
              isCate.value = true;
            }
            return <RightSlideTab key={index + Math.random() * 1000} data={item} cate={isCate.value} onPress={item.fun} navigate={item.navigate} />;
          })}
          <View style={styles.bottomView} />
        </ScrollView>
      );
    }, [dataList, healthList]);

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
export const styles = StyleSheet.create({
  bottomView: { height: 70, width: '100%' },
  btnText: { color: color1, fontSize: 18, paddingHorizontal: 15, paddingVertical: 10 },
  healthStyle: { color: color1, fontSize: 18, paddingHorizontal: 15, paddingVertical: 10 },
  scrollView: { backgroundColor: color2, flex: 1 }
});
