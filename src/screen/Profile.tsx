import React, { useEffect, useMemo, useRef, useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { Text } from 'react-native-paper';
import { ProfilePlaceholder } from '../component/skeleton/ProfilePlaceholder';
import { ScreenComponent } from './index';
import { useStore } from '../store';
import BaseView from '../component/BaseView';

export const Profile: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { settingStore, weChatStore, blueToothStore } = useStore();
    const baseView = useRef<any>(undefined);
    const [list] = useState<any>([
      {
        title: '我的设备',
        icon: require('../assets/home/header-assets.png'),
        tag: 'device'
      },
      {
        title: '共享信息',
        icon: require('../assets/home/binding.png'),
        tag: 'info'
      }
    ]);
    const [helpList] = useState<any>([
      {
        title: '权限管理',
        icon: require('../assets/pro/setting.png'),
        tag: 'permission'
      }
    ]);

    useEffect(() => {
      settingStore.updateSettings();
      (async () => {
        await weChatStore.getUserInfo();
      })();
    }, [settingStore]);

    const goLogin = () => {
      // navigation.navigate('OnePassLogin', {});
      navigation.navigate('UserInfo', {});
    };
    const navigateToDevice = async (data) => {
      // navigation.navigate('BlueToolsList');
      // return;
      // await blueToothStore.sendActiveMessage(batterySign);
      // await blueToothStore.sendActiveWithoutMessage(allDataC(0));
      // await blueToothStore.successDialog();
      // await blueToothStore.listenActiveMessage(mainListen);
      // blueToothStore.device = defaultDevice;
      // await blueToothStore.sendActiveMessage(allDataSign);
      // return;
      switch (data.tag) {
        case 'device':
          navigation.navigate('WatchStyleSetting', {});
          break;
        case 'info':
          blueToothStore.userDeviceSetting(false, true).then((res) => {
            if (!res.success) {
              baseView.current.showToast({ text: res.msg, delay: 1.5 });
              return;
            }
            if (res.data.length > 0) {
              navigation.navigate('BindingInfo', {});
              return;
            }
            baseView.current.showToast({ text: '无绑定信息', delay: 1.5 });
          });
          break;
        case 'permission':
          navigation.navigate('Permission', {});
          // await AsyncStorage.removeItem(TOKEN_NAME);
          break;
      }
    };
    const logOut = () => {
      console.log('退出登录');
      navigation.replace('WeChatOnePassLogin');
    };

    const renderContent = useMemo(() => {
      if (settingStore.loading) {
        return <ProfilePlaceholder />;
      }
      const { avatar, nickname } = weChatStore.userInfo;
      let url;
      if (avatar) url = { uri: avatar };
      if (!avatar) url = require('../assets/home/header-assets.png');
      let name = nickname || '微信用户';
      let version = DeviceInfo.getVersion();
      return (
        <View style={[tw.flex1, [{ marginBottom: 80 }]]}>
          <View style={styles.header}>
            <View style={styles.headerStart}>
              <View style={styles.imageView}>
                <FastImage style={styles.headerImg} source={url} resizeMode={FastImage.resizeMode.cover} />
              </View>
              <TouchableOpacity style={styles.loginView} onPress={goLogin}>
                <View style={styles.headerContent}>
                  <Text style={styles.userName}>{name}</Text>
                  <View style={styles.userIcons}>
                    <View style={styles.icons}>
                      <Text style={styles.iconText}>已绑定</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.logView} onPress={logOut}>
              <Text style={styles.logText}>退出登录</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.context}>
            <View style={styles.moduleView}>
              <Text style={styles.mainText}>我的设备</Text>
              {list.map((item, index) => (
                <TouchableOpacity key={item.title} onPress={() => navigateToDevice(item)}>
                  <View style={[styles.labelView, index === 0 ? styles.topBorder : null]}>
                    <View style={styles.startLabel}>
                      <FastImage style={styles.labelIcon} source={item.icon} resizeMode={FastImage.resizeMode.center} />
                      <Text style={styles.labelText}>{item.title}</Text>
                    </View>
                    <FastImage style={styles.deviceIcon} source={require('../assets/home/right-gray.png')} resizeMode={FastImage.resizeMode.cover} />
                  </View>
                </TouchableOpacity>
              ))}
              <Text style={styles.mainText}>帮助</Text>
              {helpList.map((item, index) => (
                <TouchableOpacity key={item.title} onPress={() => navigateToDevice(item)}>
                  <View style={[styles.labelView, index === 0 ? styles.topBorder : null]}>
                    <View style={styles.startLabel}>
                      <FastImage style={styles.labelIcon} source={item.icon} resizeMode={FastImage.resizeMode.center} />
                      <Text style={styles.labelText}>{item.title}</Text>
                    </View>
                    <FastImage style={styles.deviceIcon} source={require('../assets/home/right-gray.png')} resizeMode={FastImage.resizeMode.cover} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.versionView}>
            <Text style={styles.versionText}>智能手表{version}版本</Text>
          </View>
        </View>
      );
    }, [settingStore.loading, weChatStore.userInfo]);

    return (
      <BaseView ref={baseView} style={[tw.flex1, [{ backgroundColor: 'blue' }]]}>
        {renderContent}
      </BaseView>
    );
  }
);

let color1 = '#ffffff';
let color2 = '#00D1DE';
let color3 = '#e3e3e3';
let color4 = '#a6a6a6';
let color5 = '#908f8f';

const styles = StyleSheet.create({
  context: {
    flex: 1
  },
  deviceIcon: {
    height: 20,
    width: 20
  },
  deviceLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 10
  },
  deviceText: {
    color: color1,
    fontSize: 14
  },
  header: {
    alignItems: 'center',
    backgroundColor: color2,
    flexDirection: 'row',
    height: 150,
    paddingHorizontal: 20,
    paddingTop: 30
  },
  headerContent: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 10,
    paddingVertical: 2,
    height: 80
  },
  headerImg: {
    height: 60,
    width: 60
  },
  headerStart: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
    width: '80%'
  },
  iconText: { color: color2, fontSize: 12 },
  icons: {
    backgroundColor: color1,
    borderRadius: 9,
    marginRight: 5,
    paddingHorizontal: 5,
    paddingVertical: 3
  },
  imageView: {
    alignItems: 'center',
    backgroundColor: color1,
    borderRadius: 50,
    height: 60,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 60
  },
  labelIcon: {
    height: 25,
    width: 25
  },
  labelText: {
    fontSize: 18,
    marginLeft: 15
  },
  labelView: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: color3,
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  logText: {
    color: color1
  },
  logView: {},
  loginView: {
    flex: 1
  },
  mainText: {
    color: color4,
    fontSize: 16,
    marginVertical: 10
  },
  moduleView: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  startLabel: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  topBorder: {
    borderTopWidth: 1
  },
  userIcons: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  userName: {
    color: color1,
    fontSize: 18
  },
  versionText: {
    color: color5,
    fontSize: 14
  },
  versionView: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
