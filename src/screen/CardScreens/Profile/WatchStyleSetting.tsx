import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import BaseView from '../../../component/BaseView';
import { useStore } from '../../../store';
import { tw } from 'react-native-tailwindcss';
import { ProfilePlaceholder } from '../../../component/skeleton/ProfilePlaceholder';
import { observer } from 'mobx-react-lite';
import { ScreenComponent } from '../../index';
import FastImage from 'react-native-fast-image';
import { StackBar } from '../../../component/home/StackBar';

export const WatchStyleSetting: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { settingStore, blueToothStore } = useStore();
    const baseView = useRef<any>(undefined);
    const [switchList, setSwitchList] = useState<any>([]);

    useEffect(() => {
      updateData();
    }, []);

    const updateData = async () => {
      await blueToothStore.userDeviceSetting(false).then((res) => {
        if (!res.success) {
          baseView.current.showToast({ text: res.msg, delay: 2 });
          return;
        }
        let data: any = [];
        res.data.map((item, index) => {
          data.push({ name: `${item.device_name}${item.note ? '-' + item.note : ''}`, value: item.device_mac });
        });
        setSwitchList(data);
      });
    };

    const navigateToDevice = async (item) => {
      // navigation.navigate('ClockDial', {});
      // blueToothStore.sendActiveMessage(allDataC);
    };
    const backScreen = () => {
      navigation.goBack();
    };

    const renderContent = useMemo(() => {
      if (settingStore.loading) {
        return <ProfilePlaceholder />;
      }
      return (
        <ScrollView style={[tw.flex1, [{ marginBottom: 60 }]]}>
          <View style={styles.moduleView}>
            <Text style={styles.mainText}>我的设备</Text>
            {switchList.map((item, index) => {
              return (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => {
                    navigateToDevice(item);
                  }}
                >
                  <View style={[styles.labelView, index === 0 && styles.labelTop, styles.labelBottom]}>
                    <View style={styles.startLabel}>
                      <FastImage
                        style={styles.labelIcon}
                        source={require('../../../assets/home/style-setting/watch-icon.png')}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                      <View style={styles.labelContext}>
                        <Text style={styles.labelText}>{item.name}</Text>
                        <Text style={styles.evalText}>{item.value}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
            {switchList.length <= 0 ? <Text style={styles.placeText}>未绑定设备</Text> : null}
          </View>
        </ScrollView>
      );
    }, [settingStore.loading, switchList]);

    return (
      <BaseView ref={baseView} style={[tw.flex1, [{ backgroundColor: 'blue' }]]}>
        <StackBar title="已绑定的设备" onBack={() => backScreen()} />
        {renderContent}
      </BaseView>
    );
  }
);

const color1 = '#a6a6a6';
const color2 = '#e3e3e3';
const styles = StyleSheet.create({
  deviceIcon: {
    height: 20,
    width: 20
  },
  evalText: {
    fontSize: 13,
    marginLeft: 15,
    marginTop: 5
  },
  headerStart: {
    flexDirection: 'row'
  },
  labelBottom: {
    borderBottomWidth: 1,
    borderColor: color2,
    borderStyle: 'solid'
  },
  labelContext: {
    flex: 1,
    justifyContent: 'space-between'
  },
  labelIcon: {
    height: 25,
    width: 25
  },
  labelText: {
    fontSize: 18,
    marginLeft: 15
  },
  labelTop: {
    borderColor: color2,
    borderStyle: 'solid',
    borderTopWidth: 1
  },
  labelView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  mainText: {
    color: color1,
    fontSize: 16,
    marginBottom: 10
  },
  moduleView: {
    padding: 20
  },
  placeText: {
    fontSize: 17
  },
  startLabel: {
    alignItems: 'center',
    flexDirection: 'row'
  }
});
