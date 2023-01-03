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

export const Profile: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { settingStore } = useStore();
    const baseView = useRef<any>(undefined);

    useEffect(() => {
      settingStore.updateSettings();
    }, [settingStore]);

    const goLogin = () => {
      navigation.navigate('OnePassLogin', {});
    };
    const navigateToDevice = () => {
      navigation.navigate('WatchStyleSetting', {});
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
              <TouchableOpacity onPress={goLogin}>
                <View style={styles.headerContent}>
                  <Text style={styles.userName}>用戶13</Text>
                  <View style={styles.userIcons}>
                    <View style={styles.icons}>
                      <Text style={styles.iconText}>已认证</Text>
                    </View>
                    <View style={styles.icons}>
                      <Text style={styles.iconText}>桐君阁药房</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.deviceLabel}>
              <Text style={[styles.deviceText]}>设备绑定</Text>
              <FastImage style={styles.deviceIcon} source={require('../assets/home/right.png')} resizeMode={FastImage.resizeMode.cover} />
            </View>
          </View>
          <View style={styles.context}>
            <View style={styles.moduleView}>
              <Text style={styles.mainText}>我的设备</Text>
              <TouchableOpacity onPress={navigateToDevice}>
                <View style={styles.labelView}>
                  <View style={styles.startLabel}>
                    <FastImage style={styles.labelIcon} source={require('../assets/home/header-assets.png')} resizeMode={FastImage.resizeMode.cover} />
                    <Text style={styles.labelText}>F22R</Text>
                  </View>
                  <FastImage style={styles.deviceIcon} source={require('../assets/home/right-gray.png')} resizeMode={FastImage.resizeMode.cover} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
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
    fontSize: 14,
    color: '#ffffff'
  },
  header: {
    backgroundColor: '#00D1DE',
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
  iconText: { color: '#00D1DE', fontSize: 12 },
  icons: {
    backgroundColor: '#ffffff',
    borderRadius: 9,
    marginRight: 5,
    paddingHorizontal: 5,
    paddingVertical: 3
  },
  imageView: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
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
    borderColor: '#e3e3e3',
    borderStyle: 'solid',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  mainText: {
    color: '#a6a6a6',
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
    color: '#ffffff',
    fontSize: 18
  }
});
