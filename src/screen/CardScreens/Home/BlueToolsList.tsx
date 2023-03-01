import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ScreenComponent } from '../../index';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { StackBar } from '../../../component/home/StackBar';
import { RightSlideTab } from '../../../component/list/RightSlideTab';
import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_INFO, WEATHER_UPDATE } from '../../../common/constants';
import { useStore } from '../../../store';
import { closeSendInfo, passRegSign, settingName, updateWeather } from '../../../common/watch-module';
import { CommonUtil } from '../../../common/signing';
import { arrToByte, baseToHex, rootByteArr, stringToByte } from '../../../common/tools';

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
          baseView.current.showLoading({ text: '加载中...' });
          navigation.navigate('BlueToothDeviceName');
          setTimeout(() => {
            baseView.current.hideLoading();
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
          // baseView.current.showLoading({ text: '加载中...' });
          // navigation.navigate('BlueToothName');
          // setTimeout(() => {
          //   baseView.current.hideLoading();
          // }, 100);
          // console.log(baseToHex(str));
          console.log(rootByteArr([17, 11, 11, 11, 2, 11, 11, 11, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
          // await blueToothStore.sendActiveMessage(settingName());
        }
      },
      {
        name: '天气更新',
        value: '',
        image: require('../../../assets/home/note.png'),
        cate: 'device',
        type: 'switch',
        fun: async (e) => {
          // baseView.current.showLoading({ text: '加载中...' });
          await blueToothStore.sendActiveMessage(updateWeather(e ? 1 : 0));
          await AsyncStorage.setItem(WEATHER_UPDATE, JSON.stringify(e));
        }
      },
      {
        name: '定位设置',
        value: '',
        image: require('../../../assets/home/note.png'),
        cate: 'device',
        type: 'label',
        fun: async (e) => {
          baseView.current.showLoading({ text: '加载中...' });
          navigation.navigate('GeoWeather');
          setTimeout(() => {
            baseView.current.hideLoading();
          }, 100);
        }
      }
    ]);
    useEffect(() => {
      baseView.current.showLoading({ text: '加载中...' });
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
          list[1].value = result?.name || '';
          list[0].value = resInfo.note || '';
          setDataList(list);
          setTimeout(() => {
            baseView.current.hideLoading();
          }, 1500);
        });
      });
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
