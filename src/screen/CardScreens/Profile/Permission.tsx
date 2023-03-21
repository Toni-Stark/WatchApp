import React, { useMemo, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Linking } from 'react-native';
import BaseView from '../../../component/BaseView';
import { useStore } from '../../../store';
import { tw } from 'react-native-tailwindcss';
import { ProfilePlaceholder } from '../../../component/skeleton/ProfilePlaceholder';
import { observer } from 'mobx-react-lite';
import { ScreenComponent } from '../../index';
import FastImage from 'react-native-fast-image';
import { StackBar } from '../../../component/home/StackBar';
import { NativeModules } from 'react-native';

export const Permission: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { settingStore } = useStore();
    const baseView = useRef<any>(undefined);
    const [switchList] = useState<any>([
      {
        name: '自启动管理',
        type: 'mine',
        title: '允许App保持后台运行而不被系统电池管理功能清理',
        image: require('../../../assets/pro/script.png')
      },
      {
        name: '电池管理',
        type: 'battery',
        title: '对App的电池策略的使用',
        image: require('../../../assets/pro/do-main.png')
      },
      {
        name: '通知管理',
        type: 'task',
        title: '使应用能够在通知栏显示',
        image: require('../../../assets/pro/do-main.png')
      },
      {
        name: '后台运行',
        type: 'back',
        title: '用于同步设备数据，推送手机通知到设备',
        image: require('../../../assets/pro/clock.png')
      }
    ]);

    const jumpToSetting = (type) => {
      if (type === 'mine') {
        NativeModules.OpenSystem.enterSelfSetting((data) => {
          console.log('设置自启动管理', data);
        });
        return;
      }
      if (type === 'battery') {
        NativeModules.OpenSystem.enterBatterySetting((data) => {
          console.log('设置电池管理', data);
        });
        return;
      }
      if (type === 'task') {
        NativeModules.OpenSystem.enterTaskSetting((data) => {
          console.log('设置应用通知管理', data);
        });
        return;
      }
      if (type === 'back') {
        NativeModules.OpenSystem.openNetworkSettings((data) => {
          console.log('设置后台运行', data);
        });
        return;
      }
    };

    const backScreen = () => {
      navigation.goBack();
    };

    const renderContent = useMemo(() => {
      if (settingStore.loading) {
        return <ProfilePlaceholder />;
      }
      return (
        <ScrollView style={[tw.flex1]}>
          <View style={styles.moduleView}>
            <Text style={styles.mainText}>智能手表APP为您提供以下服务</Text>
            {switchList.map((item) => {
              return (
                <TouchableOpacity
                  key={item.value}
                  onPress={async () => {
                    jumpToSetting(item.type);
                  }}
                >
                  <View style={styles.labelView}>
                    <FastImage style={styles.labelIcon} source={item.image} resizeMode={FastImage.resizeMode.cover} />
                    <View style={styles.startLabel}>
                      <Text style={styles.labelText}>{item.name}</Text>
                      <Text style={styles.evalText}>{item.title}</Text>
                    </View>
                    <FastImage style={styles.labelIcon} source={require('../../../assets/home/right-gray.png')} resizeMode={FastImage.resizeMode.cover} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      );
    }, [settingStore.loading, switchList]);

    return (
      <BaseView ref={baseView} style={[tw.flex1, [{ backgroundColor: 'blue' }]]}>
        <StackBar title="权限管理" onBack={() => backScreen()} />
        {renderContent}
      </BaseView>
    );
  }
);

let color1 = '#252525';
let color2 = '#00D1DE';
let color3 = '#8d8d8d';
let color4 = '#a6a6a6';
const styles = StyleSheet.create({
  evalText: {
    color: color3,
    fontSize: 14
  },
  labelIcon: { height: 25, width: 25 },
  labelText: {
    color: color1,
    fontSize: 16,
    marginBottom: 3
  },
  labelView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15
  },
  mainText: {
    color: color4,
    fontSize: 17,
    marginVertical: 10
  },
  moduleView: {
    paddingHorizontal: 20
  },
  startLabel: {
    flexDirection: 'column',
    flex: 1,
    paddingHorizontal: 20
  }
});
