import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenComponent } from '../../index';
import { Text } from 'react-native-paper';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store';
import { StackBar } from '../../../component/home/StackBar';
import Spinner from 'react-native-loading-spinner-overlay/src/index';
import { RootEnum } from '../../../common/sign-module';
import { mainListen } from '../../../common/watch-module';

export const BlueTooth: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { blueToothStore } = useStore();
    const [devicesList, setDevicesList] = useState<any>([]);
    const [refresh, setRefresh] = useState(true);
    const [spinner, setSpinner] = useState(false);
    const [connectName, setConnectName] = useState('');

    const backScreen = () => {
      navigation.goBack();
    };

    const openHelp = () => {
      console.log('帮助');
    };

    const onRefresh = () => {
      setDevicesList([]);
      setRefresh(true);
      refreshDeviceScan();
    };

    const refreshDeviceScan = () => {
      let list: any = [];
      let timer: any = null;
      // let manager = new BleManager();
      blueToothStore.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          // 处理错误（扫描会自动停止）
          return;
        }
        console.log(device.name);
        if (device.name && !list.find((item) => item?.id === device.id)) {
          list.push(device);
          setDevicesList([...list]);
          if (list.find((item) => item?.id === device.id)) {
            timer = setTimeout(() => {
              blueToothStore.manager?.stopDeviceScan();
              clearTimeout(timer);
              timer = null;
              setRefresh(false);
            }, 5000);
          }
        }
      });
    };

    const connectItem = async (item) => {
      if (item.id === connectName) {
        navigation.navigate('BlueToothDetail', {});
      } else {
        setSpinner(true);
        item
          .connect()
          .then((res) => {
            if (res.id) {
              return res.discoverAllServicesAndCharacteristics();
            } else {
              baseView.current.showToast({ text: '连接失败', delay: 1 });
            }
            setSpinner(false);
          })
          .then((device) => {
            blueToothStore.devicesInfo = device;
            blueToothStore.isRoot = RootEnum['连接中'];
            blueToothStore.setDeviceStorage(device);
            blueToothStore.listenActiveMessage(mainListen);
            setConnectName(item.id);
            setSpinner(false);
            baseView.current.showToast({ text: '连接成功', delay: 1 });
            setTimeout(() => {
              navigation.goBack();
            }, 1000);
          })
          .catch((err) => {
            setSpinner(false);
            baseView.current.showToast({ text: '连接失败', delay: 1 });
          });
      }
    };

    useEffect(() => {
      // blueToothStore.manager?.stopDeviceScan();
      setRefresh(true);
      refreshDeviceScan();
      return () => {
        blueToothStore.manager.stopDeviceScan();
      };
    }, []);

    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity style={styles.toothItem} onPress={() => connectItem(item)}>
          <View>
            <Text style={styles.toothTitle}>{item.name}</Text>
            <Text style={styles.toothMac}>{item.id}</Text>
          </View>
          {connectName === item.id ? (
            <View>
              <Text>详细信息</Text>
            </View>
          ) : (
            <Text style={styles.toothPoint}>{item.rssi}</Text>
          )}
        </TouchableOpacity>
      );
    };

    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.justifyCenter, tw.textCenter]}>
          <StackBar title="连接设备" onBack={() => backScreen()} onHelp={openHelp} />
          <View style={styles.flexView}>
            <FlatList
              refreshing={refresh}
              data={devicesList}
              renderItem={renderItem}
              keyExtractor={(item) => (item.id + Math.ceil(Math.random() * 1000)).toString()}
              onRefresh={onRefresh}
              ListFooterComponent={<View style={styles.footerView}>{refresh ? <Text style={styles.footerText}>搜索中....</Text> : null}</View>}
            />
          </View>
          <Spinner visible={spinner} textContent={'连接中...'} />
        </View>
      </BaseView>
    );
  }
);

let color2 = '#000000';
let color3 = '#00D1DE';
let color4 = '#ffffff';
let color5 = '#e7e7e7';
let color6 = '#9e9e9e';
export const styles = StyleSheet.create({
  flexView: {
    flex: 1
  },
  footerText: {
    fontSize: 16
  },
  footerView: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  toothItem: {
    alignItems: 'center',
    backgroundColor: color4,
    borderBottomColor: color5,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%'
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
    fontSize: 16
  }
});
