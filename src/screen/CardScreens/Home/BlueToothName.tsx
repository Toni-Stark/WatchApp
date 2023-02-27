import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
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
      let params = {
        id: blueToothStore.devicesInfo.id,
        note: data.name
      };
      await blueToothStore.changeDeviceName(params);
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
