import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Linking, View, StyleSheet, Text, TouchableOpacity, Modal, Alert, PermissionsAndroid } from 'react-native';
import BaseView from '../component/BaseView';
import { useStore } from '../store';
import { ScreenComponent } from './index';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { HeaderBar } from '../component/home/HeaderBar';
import FastImage from 'react-native-fast-image';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

export const Home: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { settingStore, userStore, blueToothStore } = useStore();
    const baseView = useRef<any>(undefined);

    const onReceiveURL = useCallback(async () => {
      settingStore.canJump = true;
      await Linking.getInitialURL().then((res) => {
        if (res) {
          settingStore.initURL = res;
          baseView.current.showLoading({ text: '正在加载', delay: 2 });
          setTimeout(() => {
            let msg = res?.split(':', settingStore.initURL?.length);
            if (settingStore.canJump && msg) {
              switch (msg[1]) {
                case '//lesson-detail/':
                  baseView.current.hideLoading();
                  settingStore.initURL = '';
                  settingStore.canJump = false;
                  navigation.navigate('Main', { screen: 'LessonDetail', params: { lessonId: msg[2] } });
                  break;
              }
              return;
            }
          }, 1000);
        }
      });
    }, [navigation, settingStore]);

    const hasAndroidPermission = async () => {
      const permissions = [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION];
      const granteds = await PermissionsAndroid.requestMultiple(permissions);
      if (granteds['android.permission.ACCESS_FINE_LOCATION'] === 'granted' && granteds['android.permission.ACCESS_COARSE_LOCATION'] === 'granted') {
        return true;
      } else {
        Modal.alert('请开启定位权限', '请开启获取手机位置服务，否则系统部分功能将无法使用', [
          {
            text: '开启',
            onPress: () => {
              console.log('点击开启按钮');
              if (
                granteds['android.permission.ACCESS_FINE_LOCATION'] === 'never_ask_again' &&
                granteds['android.permission.ACCESS_COARSE_LOCATION'] === 'never_ask_again'
              ) {
                Alert.alert(
                  '警告',
                  '您将应用获取手机定位的权限设为拒绝且不再询问，功能无法使用!' +
                    '想要重新打开权限，请到手机-设置-权限管理中允许[你的应用名称]app对该权限的获取'
                );
                return false;
              } else {
                //短时间第二次可以唤醒再次请求权限框，但是选项会从拒绝变为拒绝且不再询，如果选择该项则无法再唤起请求权限框
                // getPositionInit();
              }
            }
          },
          {
            text: '拒绝授权',
            onPress: () => {
              return false;
            }
          }
        ]);
      }
    };

    useEffect(() => {
      if (userStore.login) {
        (async () => {
          await onReceiveURL();
        })();
        Linking.addEventListener('url', onReceiveURL);
        return Linking.removeEventListener('url', onReceiveURL);
      }
      (async () => {
        await hasAndroidPermission();
      })();
    }, [onReceiveURL, userStore.login]);

    useEffect(() => {}, []);

    const updateMenuState = () => {
      console.log(123345);
    };

    const openBlueTooth = () => {
      navigation.navigate('BlueToothDetail', {});
    };

    const blueToothDetail = async () => {
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
    };
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
    }, [blueToothStore.devicesInfo]);

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
        </View>
      );
    }, [currentDevice, blueToothStore.devicesInfo]);
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
  }
});
