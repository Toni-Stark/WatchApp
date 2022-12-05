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

export const BlueTooth: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { blueToothStore } = useStore();
    const [devicesList, setDevicesList] = useState<any>([]);
    const [refresh, setRefresh] = useState(false);
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
      refreshDeviceScan();
    };

    const refreshDeviceScan = () => {
      setRefresh(true);
      let list: any = [];
      let timer: any = null;
      // let manager = new BleManager();
      blueToothStore.manager.startDeviceScan(null, null, (error, device) => {
        console.log(544353, device);
        if (error) {
          // 处理错误（扫描会自动停止）
          return;
        }
        if (device.name && !list.find((item) => item?.name === device.name)) {
          list.push(device);
          setDevicesList([...list]);
          if (list.find((item) => item?.name === device.name)) {
            timer = setTimeout(() => {
              blueToothStore.manager?.stopDeviceScan();
              clearTimeout(timer);
              timer = null;
              setRefresh(false);
            }, 3000);
          }
        }
      });
    };

    const connectItem = async (item) => {
      if (item.name === connectName) {
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
            setConnectName(item.name);
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
      blueToothStore.manager?.stopDeviceScan();
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
          {connectName === item.name ? (
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
            />
          </View>
          <Spinner visible={spinner} textContent={'连接中...'} />
        </View>
      </BaseView>
    );
  }
);
export const styles = StyleSheet.create({
  flexView: {
    flex: 1
  },
  toothItem: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#e7e7e7',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%'
  },
  toothMac: {
    color: '#9e9e9e',
    fontSize: 13,
    marginTop: 4
  },
  toothPoint: {
    color: '#00D1DE',
    fontSize: 16
  },
  toothTitle: {
    color: '#000000',
    fontSize: 16
  }
});
