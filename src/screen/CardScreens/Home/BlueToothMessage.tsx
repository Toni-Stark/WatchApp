import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenComponent } from '../../index';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store';
import { StackBar } from '../../../component/home/StackBar';

export const BlueToothMessage: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { blueToothStore } = useStore();
    const [data, setData] = useState<any>({});

    const backScreen = () => {
      navigation.goBack();
    };

    const currentSubmit = async () => {
      let reg = /^([a-zA-Z]|[0-9]){1,280}$/;
      if (!data.name.match(reg)) {
        baseView?.current?.showToast({ text: '请输入符合规范的字符', delay: 1.5 });
        return;
      }
      let params = {
        id: blueToothStore.devicesInfo.id,
        name: data.name
      };
      baseView?.current?.showLoading({ text: '发送数据...' });
      blueToothStore.sendMessageOfDevice(params).then((res) => {
        baseView?.current?.hideLoading();
        console.log(res);
        if (res.success) {
          baseView?.current?.showToast({ text: res.text, delay: 1.5 });
        }
      });
    };

    const changeText = (e) => {
      setData({ name: e });
    };

    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.textCenter]}>
          <StackBar title="推送消息到手表" onBack={() => backScreen()} />
          <View style={styles.headerLabel}>
            <TextInput
              style={styles.headerInput}
              placeholder="请输入手表要接收的信息"
              value={data.name}
              onChangeText={changeText}
              onEndEditing={currentSubmit}
            />
          </View>
          <View style={styles.tipsView}>
            <Text style={styles.tips}>提示：数字、英文字符大小写，不超过280个字符。</Text>
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
