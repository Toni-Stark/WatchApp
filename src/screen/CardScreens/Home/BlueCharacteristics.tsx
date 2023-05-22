import React, { useEffect, useRef, useState } from 'react';
import Spinner from 'react-native-loading-spinner-overlay/src/index';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { Text } from 'react-native-paper';
import { StackBar } from '../../../component/home/StackBar';
import { getChartStatus } from '../../../common/tools';
import { ScreenComponent } from '../../index';
import { useStore } from '../../../store';
import BaseView from '../../../component/BaseView';

export const BlueCharacteristics: ScreenComponent = observer(
  (props): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { blueToothStore } = useStore();
    const [refresh, setRefresh] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const backScreen = () => {
      props.navigation.goBack();
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
    const getAllDeviceInfo = (params) => {
      let deviceId = blueToothStore.devicesInfo.id;
      let characteristicId = blueToothStore.servicesDevices[params.index].uuid;
      blueToothStore.manager.characteristicsForDevice(deviceId, characteristicId).then((data) => {
        console.log('拿到特征值');
        blueToothStore.characteristics = data;
      });
      setSpinner(false);
    };

    const connectItem = async (item) => {
      // setSpinner(true);
      let list = getChartStatus(item);
      switch (list[0].id) {
        case 1:
          props.navigation.navigate('BlueListener', { item: item, type: 1 });
          break;
        case 2:
          props.navigation.navigate('BlueListener', { item: item });
          break;
        case 3:
          item.read().then((result) => {
            blueToothStore.manager
              .readCharacteristicForDevice(item.deviceID, item.serviceUUID, item.uuid)
              .then((res) => {
                if (res?.value) {
                  props.navigation.navigate('BlueToothValue', { item: res });
                } else {
                  baseView.current?.showMessage({ text: res, delay: 2 });
                }
              })
              .catch((err) => {
                console.log(err);
                baseView.current?.showMessage({ text: err, delay: 2 });
              });
          });
          break;
        case 4:
          props.navigation.navigate('BlueToothWhite', { item: item });
      }
    };

    useEffect(() => {
      getAllDeviceInfo(props.route.params);
    }, []);

    const renderItem = ({ item, index }) => {
      let list = getChartStatus(blueToothStore.characteristics[index]);

      return (
        <TouchableOpacity style={styles.toothItem} onPress={() => connectItem(item)}>
          <View>
            <Text style={styles.toothTitle}>特性（{index + 1}）</Text>
            <Text style={styles.toothMac}>{item.uuid}</Text>
            <Text style={styles.toothMac}>特性 （{list.map((item) => item.text + ' ')}）</Text>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.justifyCenter, tw.textCenter]}>
          <StackBar title="特征列表" onBack={() => backScreen()} onHelp={openHelp} />
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
            />
          </View>
          <Spinner visible={spinner} textContent={'连接中...'} />
        </View>
      </BaseView>
    );
  }
);

let color2 = '#ffffff';
let color3 = '#e7e7e7';
let color4 = '#9e9e9e';
let color5 = '#000000';

export const styles = StyleSheet.create({
  flexView: {
    flex: 1
  },
  headerLabel: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%'
  },
  toothItem: {
    alignItems: 'center',
    backgroundColor: color2,
    borderColor: color3,
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
    color: color4,
    fontSize: 13,
    marginTop: 4
  },
  toothTitle: {
    color: color5,
    fontSize: 13
  }
});
