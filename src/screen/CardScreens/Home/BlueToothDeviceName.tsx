import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { ScreenComponent } from '../../index';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store';
import { StackBar } from '../../../component/home/StackBar';

export const BlueToothDeviceName: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { blueToothStore } = useStore();
    const [text, setText] = useState('');

    const backScreen = () => {
      navigation.goBack();
    };
    const currentSubmit = () => {
      baseView.current.showLoading({ text: '修改中...' });
      setTimeout(() => {
        baseView.current.hideLoading();
        navigation.goBack();
      }, 2000);
    };

    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.textCenter]}>
          <StackBar title="设备备注" onBack={() => backScreen()} />
          <View style={styles.headerLabel}>
            <TextInput style={styles.headerInput} placeholder="输入设备备注" onChangeText={(e) => setText(e)} onEndEditing={currentSubmit} />
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
