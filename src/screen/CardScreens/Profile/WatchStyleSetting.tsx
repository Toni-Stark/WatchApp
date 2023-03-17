import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import BaseView from '../../../component/BaseView';
import { useStore } from '../../../store';
import { tw } from 'react-native-tailwindcss';
import { ProfilePlaceholder } from '../../../component/skeleton/ProfilePlaceholder';
import { observer } from 'mobx-react-lite';
import { ScreenComponent } from '../../index';
import FastImage from 'react-native-fast-image';
import { StackBar } from '../../../component/home/StackBar';
import BackgroundJob from 'react-native-background-job';
import BackgroundService from 'react-native-background-actions';
import { getBrand } from 'react-native-device-info';
import { UPDATE_DEVICE_INFO } from '../../../common/constants';

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
      if (Platform.OS === 'android') {
        const backgroundJob = {
          jobKey: 'backgroundDownloadTask',
          job: () => {
            console.log('尝试启动后台服务');
            // BackgroundJob.cancel({ jobKey: 'backgroundDownloadTask' }).then(() => console.log('Success'));
            settingStore.getDeviceUpdate().then((res) => {
              console.log(res, blueToothStore.devicesTimes, blueToothStore.aloneTimes);
              blueToothStore.getMsgUpload();
            });
          }
        };
        BackgroundJob.register(backgroundJob);
        BackgroundJob.isAppIgnoringBatteryOptimization((error, ignoringOptimization) => {
          console.log(ignoringOptimization);
        });
        // setTimeout(() => {
        BackgroundJob.schedule({
          jobKey: 'backgroundDownloadTask', //后台运行任务的key
          notificationText: '启动后台',
          notificationTitle: '智能蓝牙手表',
          period: 60000, //任务执行周期
          timeout: 86400000,
          persist: true,
          override: true,
          // requiresDeviceIdle: false,
          // requiresCharging: false,
          exact: true, //安排一个作业在提供的时间段内准确执行
          allowWhileIdle: true //允许计划作业在睡眠模式下执行
          // allowExecutionInForeground: false //允许任务在前台执行
        });
        // }, 1000);
      }
    };

    const sleep = (time) =>
      new Promise((resolve) =>
        setTimeout(() => {
          settingStore.getDeviceUpdate().then((res) => {
            blueToothStore.getMsgUpload();
          });
          console.log(blueToothStore.devicesTimes, blueToothStore.aloneTimes);
          resolve();
        }, time)
      );
    const veryIntensiveTask = async (taskDataArguments) => {
      const { delay } = taskDataArguments;

      await new Promise(async (resolve) => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
          await sleep(delay);
        }
      });
    };
    const openDevice = async (item) => {
      const options = {
        taskName: '智能手表',
        taskTitle: '正在运行中',
        taskDesc: '运动数据实时检测中',
        taskIcon: {
          name: 'ic_launcher',
          type: 'mipmap'
        },
        color: '#ff00ff',
        linkingURI: 'youlu://com.cqqgsafe.watch', // See Deep Linking for more info
        parameters: {
          delay: 5000
        }
      };

      await BackgroundService.start(veryIntensiveTask, options);
    };

    const updateActionStatus = () => {
      blueToothStore.settingBackgroundJob(getBrand(), UPDATE_DEVICE_INFO, 90000);
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
            <Text style={styles.mainText}>已绑定的设备</Text>
            {switchList.map((item, index) => {
              return (
                <TouchableOpacity
                  key={item.value}
                  onPress={async () => {
                    // navigateToDevice(item);
                    // openDevice(item);
                    // updateActionStatus();
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
        <StackBar title="我的设备" onBack={() => backScreen()} />
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
