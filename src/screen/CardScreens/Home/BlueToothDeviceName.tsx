import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { ScreenComponent } from '../../index';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store';
import { StackBar } from '../../../component/home/StackBar';
import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_DATA, DEVICE_INFO } from '../../../common/constants';

export const BlueToothDeviceName: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { blueToothStore } = useStore();
    const [text, setText] = useState('');

    useEffect(() => {
      if (blueToothStore.evalName) {
        setText(blueToothStore.evalName);
      }
    }, []);

    const backScreen = () => {
      navigation.goBack();
    };
    const currentSubmit = async () => {
      let info: any = await AsyncStorage.getItem(DEVICE_INFO);
      let res = JSON.parse(info);
      baseView.current.showLoading({ text: '修改中...' });
      let params = {
        id: blueToothStore.readyDevice.id,
        note: text
      };
      let result = await blueToothStore.settingNote(params);
      baseView.current.hideLoading();
      if (result.success) {
        res.note = text;
        await AsyncStorage.setItem(DEVICE_INFO, JSON.stringify(res));
        blueToothStore.evalName = text;
        baseView.current.showToast({ text: result.msg, delay: 1.5 });
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
        return;
      }
      baseView.current.showToast({ text: result.msg, delay: 1.5 });
    };

    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.textCenter]}>
          <StackBar title="设备备注" onBack={() => backScreen()} />
          <View style={styles.headerLabel}>
            <TextInput style={styles.headerInput} placeholder="设置备注" value={text} onChangeText={(e) => setText(e)} onEndEditing={currentSubmit} />
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
