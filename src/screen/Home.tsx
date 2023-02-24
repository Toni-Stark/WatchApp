import React, { useEffect, useMemo, useRef } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackgroundService from 'react-native-background-actions';

import BaseView from '../component/BaseView';
import { ScreenComponent } from './index';
import { tw } from 'react-native-tailwindcss';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';
export const Home: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef(undefined);
    const { settingStore, blueToothStore } = useStore();

    const sleep = (time) =>
      new Promise((resolve) =>
        setTimeout(() => {
          // let str = new Date().getTime().toString();
          // settingStore.count = str.slice(str.length - 3, str.length);
          resolve();
        }, time)
      );

    const veryIntensiveTask = async (taskDataArguments) => {
      const { delay } = taskDataArguments;
      console.log('注册后台任务');
      await new Promise(async (resolve) => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
          settingStore.getDeviceUpdate().then((res) => {
            settingStore.count = settingStore.count + 1;
          });
          await sleep(delay);
        }
      });
    };

    const options = {
      taskName: '正在运行',
      taskTitle: '正在运行中',
      taskDesc: '后台更新数据中',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap'
      },
      color: '#ff00ff',
      linkingURI: 'com.cqqgsafe.watch', // See Deep Linking for more info
      parameters: {
        delay: 5000
      }
    };

    useEffect(() => {
      console.log('注册后台---log');
      BackgroundService.start(veryIntensiveTask, options);
      // await BackgroundService.updateNotification({ taskDesc: 'New ExampleTask description' });
      return () => {
        // console.log('消灭后台任务');
        // BackgroundService.stop();
      };
    }, []);

    const renderContext = useMemo(() => {
      return (
        <TouchableOpacity
          style={styles.countView}
          onPress={() => {
            settingStore.count = 0;
          }}
        >
          <Text style={styles.count}>
            {settingStore.newDevice?.ver}: {settingStore.count}
          </Text>
        </TouchableOpacity>
      );
    }, [settingStore.count, settingStore.newDevice?.ver]);
    return (
      <BaseView ref={baseView} style={[tw.flex1]} useSafeArea={true} needUpdate={false}>
        <StatusBar backgroundColor="#00D1DE" barStyle={'light-content'} hidden={false} />

        <View style={styles.contentView}>{renderContext}</View>
      </BaseView>
    );
  }
);
const color1 = '#00D1DE';
const color3 = '#ffffff';
const color5 = '#cecece';
const color7 = '#3d3d3d';
const color8 = '#00bac4';
const color9 = '#FF002F';
const color10 = '#8f8f8f';
const color11 = 'transparent';
const color12 = '#6a6a6a';

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 70
  },
  count: {
    color: color3,
    fontSize: 30
  },
  countView: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: color1,
    borderRadius: 12,
    height: 130,
    justifyContent: 'center',
    width: '50%'
  }
});
