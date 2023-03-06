import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DeviceEventEmitter, ScrollView, StyleSheet, View } from 'react-native';
import { ScreenComponent } from '../../index';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { StackBar } from '../../../component/home/StackBar';
import { RightSlideTab } from '../../../component/list/RightSlideTab';
import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_INFO, WEATHER_UPDATE } from '../../../common/constants';
import { useStore } from '../../../store';
import { updateWeather } from '../../../common/watch-module';

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
        fun: () => {
          if (!blueToothStore.readyDevice) return baseView?.current?.showToast({ text: '请连接蓝牙手表', delay: 1.5 });
          baseView?.current?.showLoading({ text: '加载中...' });
          navigation.navigate('BlueToothDeviceName');
          setTimeout(() => {
            baseView?.current?.hideLoading();
          }, 100);
        }
      },
      {
        name: '设备名称',
        value: '',
        image: require('../../../assets/home/note.png'),
        cate: 'device',
        type: 'label',
        fun: async () => {
          if (!blueToothStore.readyDevice) return baseView?.current?.showToast({ text: '请连接蓝牙手表', delay: 1.5 });
          baseView?.current?.showLoading({ text: '加载中...' });
          navigation.navigate('BlueToothName');
          setTimeout(() => {
            baseView?.current?.hideLoading();
          }, 100);
        }
      },
      {
        name: '天气更新',
        value: '',
        image: require('../../../assets/home/note.png'),
        cate: 'device',
        type: 'switch',
        fun: async (e) => {
          if (!blueToothStore.readyDevice) return baseView?.current?.showToast({ text: '请连接蓝牙手表', delay: 1.5 });
          // baseView.current.showLoading({ text: '加载中...' });
          await blueToothStore.sendActiveMessage(updateWeather(e ? 1 : 0));
          await AsyncStorage.setItem(WEATHER_UPDATE, JSON.stringify(e));
        }
      },
      {
        name: '天气预报',
        value: '',
        image: require('../../../assets/home/note.png'),
        cate: 'device',
        type: 'label',
        fun: async (e) => {
          // if (!blueToothStore.readyDevice) return baseView.current.showToast({ text: '请连接蓝牙手表', delay: 1.5 });
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
        image: require('../../../assets/home/note.png'),
        cate: 'device',
        type: 'label',
        fun: async (e) => {
          if (!blueToothStore.readyDevice) return baseView?.current?.showToast({ text: '请连接蓝牙手表', delay: 1.5 });
          baseView?.current?.showLoading({ text: '加载中...' });
          navigation.navigate('BlueToothMessage');
          setTimeout(() => {
            baseView?.current?.hideLoading();
          }, 100);
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
          let resInfo: any = res.data.find((item) => item.device_mac === result.deviceID);
          list[1].value = resInfo?.device_name || result.name;
          list[0].value = resInfo?.note || '';
          setDataList(list);
          setTimeout(() => {
            baseView?.current?.hideLoading();
          }, 500);
        });
      });

      let subscription = DeviceEventEmitter.addListener('EventType', (param) => {
        console.log(param, '页面监听');
        let list: any = [...dataList];
        if (param?.name) {
          list[1].value = param?.name;
        }
        if (param?.note) {
          list[0].value = param?.note;
        }
        console.log(list);
        setDataList(list);
        // 刷新界面等
      });
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
        <ScrollView style={[tw.flex1, { backgroundColor: '#e8e8e8' }]}>
          {dataList.map((item, index) => {
            if (index !== 0) {
              if (isCate.cate !== item.cate) {
                isCate.value = false;
                isCate.cate = item.cate;
              } else {
                isCate.value = true;
              }
            }
            return <RightSlideTab key={index + Math.random() * 1000} data={item} cate={isCate.value} onPress={item.fun} />;
          })}
        </ScrollView>
      );
    }, [dataList]);

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

let color2 = '#000000';
let color3 = '#00D1DE';
let color4 = '#ffffff';
let color5 = '#e7e7e7';
let color6 = '#9e9e9e';
export const styles = StyleSheet.create({});
