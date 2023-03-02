import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, StyleSheet, TextInput, View } from 'react-native';
import { ScreenComponent } from '../../index';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store';
import { StackBar } from '../../../component/home/StackBar';
import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_INFO } from '../../../common/constants';

export const BlueToothDeviceName: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { blueToothStore } = useStore();
    const [data, setData] = useState<any>({});

    useEffect(() => {
      baseView.current.showLoading({ text: '加载中...' });
      blueToothStore.userDeviceSetting(false).then((res) => {
        let dataInfo = res.data;
        AsyncStorage.getItem(DEVICE_INFO).then((info) => {
          if (!info) {
            baseView.current.hideLoading();
            return;
          }
          let resInfo: any = JSON.parse(info);
          if (!dataInfo?.length) return;
          let result: any = dataInfo.find((item) => item.device_mac === resInfo.deviceID);
          setData({ text: result.note });
          setTimeout(() => {
            baseView.current.hideLoading();
          }, 1500);
        });
      });
    }, []);

    const backScreen = () => {
      navigation.goBack();
    };
    const currentSubmit = async () => {
      let info: any = await AsyncStorage.getItem(DEVICE_INFO);
      let res = JSON.parse(info);
      baseView.current.showLoading({ text: '修改中...' });
      if (!blueToothStore?.readyDevice?.id) {
        baseView.current.hideLoading();
        baseView.current.showToast({ text: '请先使用蓝牙连接设备', delay: 1.5 });
        return;
      }
      let params = {
        id: blueToothStore.readyDevice.id,
        note: data.text
      };
      let result = await blueToothStore.settingNote(params);
      baseView.current.hideLoading();
      if (result.success) {
        res.note = data.text;
        await AsyncStorage.setItem(DEVICE_INFO, JSON.stringify(res));
        blueToothStore.evalName = data.text;
        baseView.current.showToast({ text: result.msg, delay: 1.5 });
        setTimeout(() => {
          navigation.goBack();
          DeviceEventEmitter.emit('EventType', { note: data.text });
        }, 1500);
        return;
      }
      baseView.current.showToast({ text: result.msg, delay: 1.5 });
    };

    const changeText = (e) => {
      setData({ text: e });
    };

    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.textCenter]}>
          <StackBar title="设备备注" onBack={() => backScreen()} />
          <View style={styles.headerLabel}>
            <TextInput style={styles.headerInput} placeholder="设置备注" value={data.text} onChangeText={changeText} onEndEditing={currentSubmit} />
          </View>
        </View>
      </BaseView>
    );
  }
);

let color1 = '#9e9e9e';
export const styles = StyleSheet.create({
  headerInput: {
    borderBottomWidth: 1,
    borderColor: color1
  },
  headerLabel: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%'
  }
});
