import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ScreenComponent } from '../../index';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { StackBar } from '../../../component/home/StackBar';
import { RightSlideTab } from '../../../component/list/RightSlideTab';
import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_INFO } from '../../../common/constants';
import { useStore } from '../../../store';

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
        value: 'F22R',
        image: require('../../../assets/home/note.png'),
        cate: 'device',
        fun: () => {
          baseView.current.showLoading({ text: '加载中...' });
          navigation.navigate('BlueToothName');
          setTimeout(() => {
            baseView.current.hideLoading();
          }, 100);
        }
      }
    ]);

    useEffect(() => {
      baseView.current.showLoading({ text: '加载中...' });
      blueToothStore.userDeviceSetting(false).then((res) => {
        let list = [...dataList];
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
