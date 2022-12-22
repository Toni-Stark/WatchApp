import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import BaseView from '../component/BaseView';
import { useStore } from '../store';
import { ScreenComponent } from './index';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { HeaderBar } from '../component/home/HeaderBar';
import FastImage from 'react-native-fast-image';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { hasAndroidPermission } from '../common/tools';

export const Home: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { blueToothStore } = useStore();
    const baseView = useRef<any>(undefined);

    useEffect(() => {
      if (blueToothStore?.devicesInfo) {
        (async () => await successDialog())();
      }
    }, [blueToothStore?.devicesInfo]);

    const updateMenuState = () => {
      console.log('打开分享链接');
    };

    const openBlueTooth = useCallback(() => {
      navigation.navigate('BlueToothDetail', {});
    }, [navigation]);

    const successDialog = useCallback(async () => {
      let responseParams = {
        data: {
          deviceID: 'EF:39:16:32:92:F7',
          serviceUUID: 'f0080001-0451-4000-B000-000000000000',
          uuid: 'f0080002-0451-4000-B000-000000000000'
        }
      };
      await blueToothStore.listenActiveMessage(responseParams);
      let params = {
        value: 'A1 00 00 00 07 E6 0C 14 0E 37 1D 01 01',
        data: {
          deviceID: 'EF:39:16:32:92:F7',
          serviceUUID: 'f0080001-0451-4000-B000-000000000000',
          uuid: 'f0080003-0451-4000-B000-000000000000'
        }
      };
      await blueToothStore.sendActiveMessage(params);
    }, [blueToothStore]);

    const blueToothDetail = useCallback(async () => {
      await hasAndroidPermission();
      const Powered = await BluetoothStateManager.getState();
      if (Powered === 'PoweredOn') {
        navigation.navigate('BlueTooth', {});
      } else {
        await BluetoothStateManager.requestToEnable();
        setTimeout(() => {
          navigation.navigate('BlueTooth', {});
        }, 300);
      }
    }, []);
    const currentDevice = useMemo(() => {
      if (blueToothStore.devicesInfo) {
        return (
          <TouchableOpacity style={styles.linkModule} onPress={openBlueTooth}>
            <View style={[tw.flexRow, tw.itemsCenter, tw.justifyBetween, tw.p2, tw.flex1]}>
              <View style={[tw.flexRow, tw.itemsCenter]}>
                <FastImage style={styles.imageIcon} source={require('../assets/home/device.png')} />
                <Text style={styles.labelData}>{blueToothStore.devicesInfo.name}</Text>
              </View>
              <View style={styles.labelView}>
                <Text style={styles.labelText}>更多操作</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity style={styles.linkStatus} onPress={blueToothDetail}>
            <View style={[tw.flexRow, tw.itemsCenter, tw.justifyBetween, tw.p2, tw.flex1]}>
              <View style={[tw.flexRow, tw.itemsCenter]}>
                <FastImage style={styles.imageIcon} source={require('../assets/home/device.png')} />
                <Text style={styles.labelData}>设备未连接</Text>
              </View>
              <View style={[tw.flexRow, tw.itemsCenter]}>
                <Text style={styles.labelData}>点击连接设备</Text>
                <FastImage style={styles.imageIcon} source={require('../assets/home/right.png')} />
              </View>
            </View>
          </TouchableOpacity>
        );
      }
    }, [blueToothDetail, blueToothStore.devicesInfo, openBlueTooth]);

    // const currentResult = useMemo(() => {
    //   console.log(blueToothStore.blueRootList);
    //   return (
    //     <View style={styles.resultView}>
    //       {blueToothStore.blueRootList.map((item, index) => (
    //         <Text key={index.toString()}>响应值：{item}</Text>
    //       ))}
    //     </View>
    //   );
    // }, [blueToothStore.blueRootList]);

    const renderHeader = useMemo(() => {
      return (
        <View style={[tw.flex1, [{ backgroundColor: '#ffffff' }]]}>
          <View style={[tw.flexRow, tw.itemsCenter, tw.justifyCenter, [{ height: 260, width: '100%', backgroundColor: '#00D1DE', position: 'relative' }]]}>
            <FastImage style={{ width: 240, height: 240 }} source={require('../assets/home/watch-banner.jpg')} />
            <View style={{ position: 'absolute' }}>
              <View>
                <Text style={styles.mainTitle}>0</Text>
                <Text style={styles.evalTitle}>步</Text>
              </View>
              <View>
                <Text style={styles.mainTitle}>0.0</Text>
                <Text style={styles.evalTitle}>小时</Text>
              </View>
            </View>
          </View>
          {currentDevice}
          {/*{currentResult}*/}
        </View>
      );
    }, [currentDevice, blueToothStore.devicesInfo, blueToothStore.blueRootList]);

    return (
      <BaseView ref={baseView} style={[tw.flex1]}>
        <HeaderBar openLayout={() => updateMenuState()} />
        {renderHeader}
      </BaseView>
    );
  }
);

const styles = StyleSheet.create({
  evalTitle: {
    color: '#ffffff',
    textAlign: 'center'
  },
  imageIcon: {
    height: 26,
    width: 26
  },
  labelData: {
    color: '#ffffff',
    fontSize: 15
  },
  labelText: {
    color: '#ffffff',
    fontSize: 13
  },
  labelView: {
    borderColor: '#ffffff',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 3
  },
  linkModule: {
    backgroundColor: '#00BAC4',
    height: 50,
    width: '100%'
  },
  linkStatus: {
    backgroundColor: '#FF002F',
    height: 50,
    width: '100%'
  },
  mainTitle: {
    color: '#ffffff',
    fontSize: 30,
    textAlign: 'center'
  },
  resultView: {
    padding: 10
  }
});
