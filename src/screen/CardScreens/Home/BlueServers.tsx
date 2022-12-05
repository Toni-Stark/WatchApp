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

export const BlueServers: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { blueToothStore } = useStore();
    const [refresh, setRefresh] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [context, setContext] = useState([]);
    const [currentId, setCurrentId] = useState('');

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
    const getAllDeviceInfo = (item) => {
      if (currentId) {
        baseView.current.showToast({ text: '已经监听了一个特征值', delay: 1 });
        return;
      }
      blueToothStore.blueToothListener?.remove();
      let deviceId = blueToothStore.characteristics[item].deviceID;
      let serverUUID = blueToothStore.characteristics[item].serviceUUID;
      let CharacteristicUUID = blueToothStore.characteristics[item].uuid;
      setCurrentId(serverUUID);
      blueToothStore.blueToothListener = blueToothStore.manager.monitorCharacteristicForDevice(
        deviceId,
        serverUUID,
        CharacteristicUUID,
        (error, characteristic) => {
          if (error) {
            console.log('ble response hex data fail：', error, characteristic);
            let list: any = [...context];
            list.push(JSON.stringify(error));
            setContext(list);
          } else {
            // this.responseData = resData;
            console.log(characteristic, '获取到值');
            let list: any = [...context];
            list.push(JSON.stringify(characteristic));
            setContext(list);
          }
        },
        'monitor'
      );
    };

    useEffect(() => {
      // getAllDeviceInfo();
      return () => blueToothStore.blueToothListener?.remove();
    }, []);

    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity style={currentId === item.serviceUUID ? styles.blueItem : styles.toothItem} onPress={() => getAllDeviceInfo(index)}>
          <View>
            <Text style={styles.toothMac}>{item.uuid}</Text>
          </View>
        </TouchableOpacity>
      );
    };

    const FooterBtn = () => {
      return (
        <View style={styles.contextView}>
          {context.map((item, index) => (
            <View style={styles.contextItem} key={index.toString()}>
              <Text style={styles.textItem}>{item}</Text>
            </View>
          ))}
        </View>
      );
    };

    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.justifyCenter, tw.textCenter]}>
          <StackBar title="设备蓝牙详情" onBack={() => backScreen()} onHelp={openHelp} />
          <View style={styles.headerLabel}>
            <Text>设备名称：{blueToothStore.devicesInfo.name}</Text>
          </View>
          <View style={styles.flexView}>
            <FlatList
              refreshing={refresh}
              data={blueToothStore.characteristics}
              renderItem={renderItem}
              keyExtractor={() => Math.ceil(Math.random() * 1000).toString()}
              onRefresh={onRefresh}
              ListFooterComponent={<FooterBtn />}
            />
          </View>
          <Spinner visible={spinner} textContent={'连接中...'} />
        </View>
      </BaseView>
    );
  }
);
export const styles = StyleSheet.create({
  blueItem: {
    alignItems: 'center',
    backgroundColor: '#eeeeee',
    borderColor: '#e7e7e7',
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
  contextItem: {
    paddingVertical: 5
  },
  contextView: {
    paddingHorizontal: 20
  },
  flexView: {
    flex: 1
  },
  footerBtn: {
    alignItems: 'center',
    backgroundColor: '#00D1DE',
    borderRadius: 5,
    justifyContent: 'center',
    margin: 20,
    paddingVertical: 10
  },
  footerText: {
    color: '#ffffff',
    fontSize: 16
  },
  headerLabel: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%'
  },
  textItem: {
    fontSize: 13
  },
  toothItem: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e7e7e7',
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
    fontSize: 13
  }
});
