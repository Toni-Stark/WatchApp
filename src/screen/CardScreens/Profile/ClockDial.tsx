import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import BaseView from '../../../component/BaseView';
import { ProfilePlaceholder } from '../../../component/skeleton/ProfilePlaceholder';
import { StackBar } from '../../../component/home/StackBar';
import { ScreenComponent } from '../../index';
import { useStore } from '../../../store';
import { settingDevicesStyles } from '../../../common/watch-module';
import AsyncStorage from '@react-native-community/async-storage';
import { CLOCK_STYLE } from '../../../common/constants';

export const ClockDial: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { settingStore, blueToothStore } = useStore();
    const baseView = useRef<any>(undefined);
    const [switchValue, setSwitchValue] = useState<number>(1);
    const [switchList] = useState<any>([
      {
        name: '表盘一',
        value: 0
      },
      {
        name: '表盘二',
        value: 1
      },
      {
        name: '表盘三',
        value: 2
      }
    ]);

    useEffect(() => {
      AsyncStorage.getItem(CLOCK_STYLE).then((res) => {
        if (res) {
          setSwitchValue(JSON.parse(res));
        }
      });
    }, []);

    const backScreen = () => {
      navigation.goBack();
    };
    const currentAgree = async (val) => {
      setSwitchValue(val);
      await AsyncStorage.setItem(CLOCK_STYLE, JSON.stringify(val));
      await blueToothStore.sendActiveMessage(settingDevicesStyles(val));
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
                <TouchableWithoutFeedback key={Math.ceil(Math.random() * 1000).toString()} onPress={() => currentAgree(item.value)}>
                  <View style={[styles.labelView, !index && styles.firstBorder]}>
                    <Text style={styles.labelText}>{item.name}</Text>
                    <View style={styles.agree}>
                      <View style={styles.agreeView}>{switchValue === item.value ? <View style={styles.agreeMain} /> : null}</View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      );
    }, [settingStore.loading, switchValue]);

    return (
      <BaseView ref={baseView} style={[tw.flex1, [{ backgroundColor: 'blue' }]]}>
        <StackBar title="表盘设置" onBack={() => backScreen()} />
        {renderContent}
      </BaseView>
    );
  }
);

const color1 = '#0d9fa8';
const color2 = '#e3e3e3';
const color3 = '#a6a6a6';
const styles = StyleSheet.create({
  agree: {
    padding: 0,
    paddingRight: 5
  },
  agreeMain: {
    backgroundColor: color1,
    borderRadius: 50,
    height: 15,
    width: 15
  },
  agreeView: {
    alignItems: 'center',
    borderColor: color1,
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 23,
    justifyContent: 'center',
    width: 23
  },
  firstBorder: {
    borderTopWidth: 1
  },
  headerStart: {
    flexDirection: 'row'
  },
  labelIcon: {
    height: 25,
    width: 25
  },
  labelText: {
    fontSize: 18,
    marginLeft: 5
  },
  labelView: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: color2,
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  mainText: {
    color: color3,
    fontSize: 16,
    marginBottom: 10
  },
  moduleView: {
    padding: 20
  }
});
