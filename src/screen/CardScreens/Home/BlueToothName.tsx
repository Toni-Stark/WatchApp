import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenComponent } from '../../index';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store';
import { StackBar } from '../../../component/home/StackBar';
import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_INFO } from '../../../common/constants';

export const BlueToothName: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { blueToothStore } = useStore();
    const [data, setData] = useState<any>({});

    useEffect(() => {
      blueToothStore.userDeviceSetting(false).then((res) => {
        let dataInfo = res.data;
        AsyncStorage.getItem(DEVICE_INFO).then((info) => {
          if (!info) return;
          let resInfo: any = JSON.parse(info);
          if (!dataInfo?.length) return;
          let result: any = dataInfo.find((item) => item.device_mac === resInfo.deviceID);
          setData({ name: result.device_name });
        });
      });
    }, []);

    const backScreen = () => {
      navigation.goBack();
    };

    const currentSubmit = async () => {
      let reg = /^([a-zA-Z]|[0-9]){1,18}$/;
      if (!data.name.match(reg)) {
        baseView.current.showToast({ text: '请输入符合规范的名称', delay: 1.5 });
        return;
      }
      let params = {
        id: blueToothStore.devicesInfo.id,
        name: data.name
      };
      baseView.current.showLoading({ text: '修改中...' });
      blueToothStore.changeDeviceName(params).then((res) => {
        baseView.current.hideLoading();
        if (res.success) {
          baseView.current.showToast({ text: '修改成功', delay: 1 });
          blueToothStore.devicesInfo.name = res.name;
          blueToothStore.device.name = res.name;
          blueToothStore.currentDevice.name = res.name;
          blueToothStore.refreshInfo.name = res.name;
          blueToothStore.readyDevice.device_name = res.name;
          setTimeout(() => {
            backScreen();
            DeviceEventEmitter.emit('EventType', { name: res.name });
          }, 1000);
        }
      });
    };

    const changeText = (e) => {
      setData({ name: e });
    };

    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.textCenter]}>
          <StackBar title="更改设备名称" onBack={() => backScreen()} />
          <View style={styles.headerLabel}>
            <TextInput style={styles.headerInput} placeholder="请输入新的设备名称" value={data.name} onChangeText={changeText} onEndEditing={currentSubmit} />
          </View>
          <View style={styles.tipsView}>
            <Text style={styles.tips}>提示：数字、英文字符大小写，不超过16个字符。</Text>
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
  },
  tipsView: {
    paddingHorizontal: 20
  },
  tips: {
    fontSize: 13
  }
});
