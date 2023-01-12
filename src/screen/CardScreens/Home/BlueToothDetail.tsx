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
import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_INFO } from '../../../common/constants';
import { RootEnum } from '../../../common/sign-module';

export const BlueToothDetail: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { blueToothStore } = useStore();
    const [refresh, setRefresh] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const backScreen = () => {
      navigation.goBack();
    };

    const openHelp = () => {
      console.log('帮助');
    };

    const onRefresh = () => {
      setRefresh(true);
      setTimeout(() => {
        setRefresh(false);
      }, 3000);
    };
    const getAllDeviceInfo = () => {
      let deviceId = blueToothStore.devicesInfo?.id;
      blueToothStore.manager.servicesForDevice(deviceId).then((res) => {
        if (res.length > 0) {
          blueToothStore.servicesDevices = res;
        }
        setSpinner(false);
      });
    };

    const connectItem = async (item, index) => {
      // setSpinner(true);
      navigation.navigate('BlueCharacteristics', { item, index });
    };

    const closeBlueTooth = async () => {
      blueToothStore.isRoot = RootEnum['断开连接'];
      await AsyncStorage.removeItem(DEVICE_INFO);
      await setTimeout(async () => {
        await blueToothStore.closeDevices();
        navigation.goBack();
      }, 1000);
    };

    useEffect(() => {
      getAllDeviceInfo();
    }, []);

    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity style={styles.toothItem} onPress={() => connectItem(item, index)}>
          <View>
            <Text style={styles.toothTitle}>服务（{index + 1}）</Text>
            <Text style={styles.toothMac}>{item.uuid}</Text>
            <Text style={styles.toothMac}>服务类型：{item.isPrimary ? '（主服务）' : '（二级服务）'}</Text>
          </View>
        </TouchableOpacity>
      );
    };

    // const FooterBtn = () => {
    //   return (
    //     <TouchableOpacity style={styles.footerBtn} onPress={getInServers}>
    //       <Text style={styles.footerText}>查看设备通信</Text>
    //     </TouchableOpacity>
    //   );
    // };

    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.justifyCenter, tw.textCenter]}>
          <StackBar title="服务列表" onBack={() => backScreen()} onHelp={openHelp} />
          <View style={styles.headerLabel}>
            <Text>设备名称：{blueToothStore.devicesInfo?.name}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={closeBlueTooth}>
              <Text style={styles.closeText}>断开连接</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flexView}>
            <FlatList
              refreshing={refresh}
              data={blueToothStore.servicesDevices}
              renderItem={renderItem}
              keyExtractor={() => Math.ceil(Math.random() * 1000).toString()}
              onRefresh={onRefresh}
              // ListFooterComponent={<FooterBtn />}
            />
          </View>
          <Spinner visible={spinner} textContent={'连接中...'} />
        </View>
      </BaseView>
    );
  }
);

let color1 = '#ffffff';
let color2 = '#000000';
let color5 = '#e7e7e7';
let color6 = '#9e9e9e';
let color7 = 'red';
export const styles = StyleSheet.create({
  closeBtn: {
    backgroundColor: color7,
    borderRadius: 5,
    padding: 5
  },
  closeText: {
    color: color1
  },
  flexView: {
    flex: 1
  },
  headerLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%'
  },
  toothItem: {
    alignItems: 'center',
    backgroundColor: color1,
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
  toothTitle: {
    color: color2,
    fontSize: 13
  }
});
