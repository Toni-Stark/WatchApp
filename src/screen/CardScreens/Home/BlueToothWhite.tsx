import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenComponent } from '../../index';
import { Text } from 'react-native-paper';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store';
import { StackBar } from '../../../component/home/StackBar';
const Buffer = require('buffer/').Buffer;

export const BlueToothWhite: ScreenComponent = observer(
  (props): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { blueToothStore } = useStore();
    const [data, setData] = useState<any>({});
    const [value, setValue] = useState<string>('');

    const backScreen = () => {
      props.navigation.goBack();
    };

    const openHelp = () => {
      console.log('帮助');
    };

    const sendValue = async () => {
      let buffer = Buffer.from(value).toString('base64');
      // const result = await blueToothStore.devicesInfo.writeCharacteristicWithResponseForService(data.serviceUUID, data.uuid, value);
      const result = await blueToothStore.manager.writeCharacteristicWithoutResponseForDevice(data.deviceID, data.serviceUUID, data.uuid, value);
      console.log(result);
    };

    useEffect(() => {
      let params: any = props.route.params;
      if (params?.item) {
        console.log(params.item);
        setData(params.item);
      }
    }, []);

    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.textCenter]}>
          <StackBar title="特性值" onBack={() => backScreen()} onHelp={openHelp} />
          <View style={styles.headerLabel}>
            <Text>设备名称：{blueToothStore.devicesInfo.name}</Text>
          </View>
          <View style={styles.flexView}>
            <TextInput style={styles.textInput} value={value} onChangeText={(text) => setValue(text)} />
            <TouchableOpacity style={styles.submit} onPress={async () => await sendValue()}>
              <Text style={styles.textSubmit}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BaseView>
    );
  }
);
export const styles = StyleSheet.create({
  content: {
    color: '#7f7f7f',
    fontSize: 12
  },
  context: {
    color: '#000000'
  },
  flexView: {
    borderColor: '#f2f2f2',
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    overflow: 'hidden'
  },
  headerLabel: {
    marginHorizontal: 20,
    marginVertical: 10
  },
  submit: {
    alignItems: 'center',
    backgroundColor: '#00D1DE',
    justifyContent: 'center',
    width: '15%'
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 15
  },
  textSubmit: {
    color: '#ffffff',
    fontSize: 16
  }
});
