import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenComponent } from '../../index';
import { Text } from 'react-native-paper';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store';
import { StackBar } from '../../../component/home/StackBar';

export const BlueListener: ScreenComponent = observer(
  (props): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { blueToothStore } = useStore();

    const backScreen = () => {
      props.navigation.goBack();
    };

    const openHelp = () => {
      console.log('帮助');
    };

    useEffect(() => {
      let { item, type }: any = props.route.params;
      switch (type) {
        case 1:
          blueToothStore.devicesInfo.monitorCharacteristicForService(item.serviceUUID, item.uuid, (error, characteristic) => {
            console.log(error, 'log1', characteristic);
          });
          break;
        case 2:
          console.log('属于公开广播类型');
          blueToothStore.devicesInfo.monitorCharacteristicForService(item.serviceUUID, item.uuid, (error, characteristic) => {
            console.log(error, 'log2', characteristic);
          });
          break;
      }
    }, []);

    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.justifyCenter, tw.textCenter]}>
          <StackBar title="特性值" onBack={() => backScreen()} onHelp={openHelp} />
          <View style={styles.headerLabel}>
            <Text>设备名称：{blueToothStore.devicesInfo.name}</Text>
          </View>
          <View style={styles.flexView}></View>
        </View>
      </BaseView>
    );
  }
);

let color1 = '#7f7f7f';
let color2 = '#000000';
let color3 = '#00D1DE';
let color4 = '#ffffff';
let color5 = '#e7e7e7';
let color6 = '#9e9e9e';

export const styles = StyleSheet.create({
  content: {
    color: color1,
    fontSize: 12
  },
  context: {
    color: color2
  },
  flexView: {
    flex: 1
  },
  footerBtn: {
    alignItems: 'center',
    backgroundColor: color3,
    borderRadius: 5,
    justifyContent: 'center',
    margin: 20,
    paddingVertical: 10
  },
  footerText: {
    color: color4,
    fontSize: 16
  },
  headerLabel: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%'
  },
  textView: {
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  toothItem: {
    alignItems: 'center',
    backgroundColor: color4,
    borderColor: color5,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 6,
    paddingHorizontal: 15,
    paddingVertical: 7
  },
  toothMac: {
    color: color6,
    fontSize: 13,
    marginTop: 4
  },
  toothPoint: {
    color: color3,
    fontSize: 16
  },
  toothTitle: {
    color: color2,
    fontSize: 13
  }
});
