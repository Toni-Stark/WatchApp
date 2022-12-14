import React, { useEffect, useMemo, useRef } from 'react';
import { Text } from 'react-native-paper';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import BaseView from '../component/BaseView';
import { useStore } from '../store';
import { ScreenComponent } from './index';
import { tw } from 'react-native-tailwindcss';
import { ProfilePlaceholder } from '../component/skeleton/ProfilePlaceholder';
import { observer } from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';
import { mainListen, passRegSign } from '../common/watch-module';

export const Profile: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { settingStore, blueToothStore } = useStore();
    const baseView = useRef<any>(undefined);

    useEffect(() => {
      settingStore.updateSettings();
    }, [settingStore]);

    const goLogin = () => {
      // navigation.navigate('OnePassLogin', {});
      navigation.navigate('UserInfo', {});
    };
    const navigateToDevice = async () => {
      // await blueToothStore.successDialog();
      // await blueToothStore.listenActiveMessage(mainListen);
      navigation.navigate('WatchStyleSetting', {});
      // blueToothStore.device = defaultDevice;
      // await blueToothStore.sendActiveMessage(allDataSign);
    };

    const renderContent = useMemo(() => {
      if (settingStore.loading) {
        return <ProfilePlaceholder />;
      }
      return (
        <ScrollView style={[tw.flex1, [{ marginBottom: 60 }]]}>
          <View style={styles.header}>
            <View style={styles.headerStart}>
              <View style={styles.imageView}>
                <FastImage style={styles.headerImg} source={require('../assets/home/header-assets.png')} resizeMode={FastImage.resizeMode.cover} />
              </View>
              <TouchableOpacity style={styles.loginView} onPress={goLogin}>
                <View style={styles.headerContent}>
                  <Text style={styles.userName}>用户名</Text>
                  <View style={styles.userIcons}>
                    <View style={styles.icons}>
                      <Text style={styles.iconText}>已认证</Text>
                    </View>
                    {/*<View style={styles.icons}>*/}
                    {/*  <Text style={styles.iconText}>桐君阁药房</Text>*/}
                    {/*</View>*/}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            {/*<View style={styles.deviceLabel}>*/}
            {/*  <Text style={[styles.deviceText]}>设备绑定</Text>*/}
            {/*  <FastImage style={styles.deviceIcon} source={require('../assets/home/right.png')} resizeMode={FastImage.resizeMode.cover} />*/}
            {/*</View>*/}
          </View>
          <View style={styles.context}>
            <View style={styles.moduleView}>
              <Text style={styles.mainText}>我的设备</Text>
              <TouchableOpacity onPress={navigateToDevice}>
                <View style={styles.labelView}>
                  <View style={styles.startLabel}>
                    <FastImage style={styles.labelIcon} source={require('../assets/home/header-assets.png')} resizeMode={FastImage.resizeMode.cover} />
                    <Text style={styles.labelText}>已绑定的设备</Text>
                  </View>
                  <FastImage style={styles.deviceIcon} source={require('../assets/home/right-gray.png')} resizeMode={FastImage.resizeMode.cover} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/*<View style={styles.context}>*/}
          {/*  <View style={styles.moduleView}>*/}
          {/*    <Text style={styles.mainText}>添加数据</Text>*/}
          {/*    <TouchableOpacity onPress={writeText}>*/}
          {/*      <View style={styles.labelView}>*/}
          {/*        <View style={styles.startLabel}>*/}
          {/*          <FastImage style={styles.labelIcon} source={require('../assets/home/header-assets.png')} resizeMode={FastImage.resizeMode.cover} />*/}
          {/*          <Text style={styles.labelText}>添加一条数据</Text>*/}
          {/*        </View>*/}
          {/*        <FastImage style={styles.deviceIcon} source={require('../assets/home/right-gray.png')} resizeMode={FastImage.resizeMode.cover} />*/}
          {/*      </View>*/}
          {/*    </TouchableOpacity>*/}
          {/*    <TouchableOpacity onPress={readText}>*/}
          {/*      <View style={styles.labelView}>*/}
          {/*        <View style={styles.startLabel}>*/}
          {/*          <FastImage style={styles.labelIcon} source={require('../assets/home/header-assets.png')} resizeMode={FastImage.resizeMode.cover} />*/}
          {/*          <Text style={styles.labelText}>查看数据</Text>*/}
          {/*        </View>*/}
          {/*        <FastImage style={styles.deviceIcon} source={require('../assets/home/right-gray.png')} resizeMode={FastImage.resizeMode.cover} />*/}
          {/*      </View>*/}
          {/*    </TouchableOpacity>*/}
          {/*  </View>*/}
          {/*</View>*/}
        </ScrollView>
      );
    }, [settingStore.loading]);

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
    backgroundColor: color2,
    height: 150,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 30
  },
  headerContent: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 10,
    paddingVertical: 2
  },
  headerImg: {
    height: 50,
    width: 50
  },
  headerStart: {
    flexDirection: 'row'
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
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  loginView: {
    flex: 1
  },
  mainText: {
    color: color4,
    fontSize: 16,
    marginBottom: 10
  },
  moduleView: {
    padding: 20
  },
  startLabel: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  userIcons: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  userName: {
    color: color1,
    fontSize: 18
  }
});
