import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
      let params = {
        id: blueToothStore?.devicesInfo?.id,
        name: data.name
      };
      baseView?.current?.showLoading({ text: '发送数据...' });
      blueToothStore.sendMessageOfDevice(params).then((res) => {
        baseView?.current?.hideLoading();
        console.log(res);
        if (res.success) {
          setData({ name: '' });
          baseView?.current?.showToast({ text: res.text, delay: 1.5 });
        }
      });
    };

    const changeText = (e) => {
      setData({ name: e });
    };

    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.textCenter, { backgroundColor: color4 }]}>
          <StackBar title="推送消息到手表" onBack={() => backScreen()} />
          <View style={styles.labelCard}>
            <View style={styles.headerLabel}>
              <TextInput
                style={styles.headerInput}
                placeholder="请输入手表要接收的信息"
                clearTextOnFocus={true}
                multiline={true}
                numberOfLines={10}
                value={data.name}
                onChangeText={changeText}
              />
            </View>
            <TouchableOpacity style={styles.tipsView} onPress={currentSubmit}>
              <Text style={styles.tips}>推送消息</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BaseView>
    );
  }
);

let color1 = '#00D1DE';
let color3 = '#ffffff';
let color4 = '#f2f2f2';
export const styles = StyleSheet.create({
  headerInput: {
    textAlignVertical: 'top'
  },
  headerLabel: {
    paddingHorizontal: 10,
    width: '100%'
  },
  labelCard: {
    backgroundColor: color3,
    borderRadius: 8,
    margin: 20
  },
  tips: {
    color: color3,
    fontSize: 15
  },
  tipsView: {
    alignItems: 'center',
    backgroundColor: color1,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopColor: color4,
    borderTopWidth: 4,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingVertical: 12
  }
});
