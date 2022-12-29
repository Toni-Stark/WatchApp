import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Text, useTheme, Avatar } from 'react-native-paper';
import { Platform, View, TouchableOpacity, ScrollView, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import BaseView from '../component/BaseView';
import { useStore } from '../store';
import { ScreenComponent } from './index';
import { getStatusBarHeight, requestCameraPermission, throttle } from '../common/tools';
import { tw } from 'react-native-tailwindcss';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SettingView, { SettingViewItemType } from '../component/SettingView';
import { ProfilePlaceholder } from '../component/skeleton/ProfilePlaceholder';
import { t } from '../common/tools';
import { observer } from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';

export const Profile: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();
    const { settingStore, userStore } = useStore();
    const baseView = useRef<any>(undefined);
    const handleLogin = () => {
      navigation.navigate('LoginByPhone');
    };

    const [teachersList] = useState<SettingViewItemType[]>([
      // {
      //   icon: 'supervisor-account',
      //   title: t('profile.listOfStuAndPar'),
      //   description: t('profile.listOfStuAndPar'),
      //   notification: false,
      //   iconColor: colors.primary,
      //   onPress: () => {
      //     navigation.navigate('Main', { screen: 'ParentsStudents', options: { animationEnabled: false } });
      //   }
      // }
    ]);

    const [studentList] = useState<SettingViewItemType[]>([
      {
        icon: 'cloud-circle',
        title: '网盘资源',
        description: '进入详情',
        notification: false,
        iconColor: colors.primary,
        onPress: async () => {
          if (userStore.login) {
            navigation.navigate('CloudSeaDisk');
          } else {
            await handleLogin();
          }
        }
      },
      // {
      //   icon: 'qr-code-2',
      //   title: t('profile.QRCode'),
      //   description: t('profile.relatedParents'),
      //   notification: false,
      //   iconColor: colors.primary,
      //   onPress: async () => {
      //     if (userStore.login) {
      //       navigation.navigate('Main', { screen: 'MyQRDetail', options: { animationEnabled: false } });
      //     } else {
      //       await handleLogin();
      //     }
      //   }
      // },
      // {
      //   icon: 'supervisor-account',
      //   title: t('profile.listOfStuAndPar'),
      //   description: t('profile.listOfStuAndPar'),
      //   notification: false,
      //   iconColor: colors.primary,
      //   onPress: () => {
      //     navigation.navigate('Main', { screen: 'ParentsStudents', options: { animationEnabled: false } });
      //   }
      // },
      // {
      //   icon: 'account-balance-wallet',
      //   title: t('profile.balance'),
      //   description: t('profile.balanceRecharge'),
      //   notification: false,
      //   iconColor: colors.primary,
      //   onPress: async () => {
      //     if (userStore.login) {
      //       navigation.navigate('Main', { screen: 'BalanceDetail', options: { animationEnabled: false } });
      //     } else {
      //       await handleLogin();
      //     }
      //   }
      // },
      // {
      //   icon: 'account-details-outline',
      //   title: t('profile.account'),
      //   description: t('profile.conInDel'),
      //   notification: false,
      //   iconColor: colors.primary,
      //   onPress: () => {
      //     console.log('message');
      //   }
      // },
      {
        icon: 'account-circle',
        title: '个人信息',
        description: '详细信息',
        notification: false,
        iconColor: colors.primary,
        onPress: () => {
          if (userStore.login) {
            navigation.navigate('Main', { screen: 'MyProfileDetail', options: { animationEnabled: false } });
          } else {
            navigation.navigate('LoginByPhone');
          }
        }
      },
      {
        icon: 'qr-code-scanner',
        title: t('profile.scanCodePC'),
        description: t('profile.clickScanCode'),
        notification: false,
        iconColor: colors.primary,
        onPress: async () => {
          if (userStore.login) {
            requestCameraPermission()
              .then((res) => {
                if (res) {
                  navigation.navigate('Main', { screen: 'CodeScan' });
                }
              })
              .catch((e) => baseView.current?.showMessage(e));
          } else {
            await handleLogin();
          }
        }
      },
      {
        icon: 'handyman',
        title: t('profile.sysMan'),
        description: t('profile.viewDetails'),
        notification: false,
        iconColor: colors.primary,
        onPress: () => {
          navigation.navigate('Main', { screen: 'ProfileDetail', options: { animationEnabled: false } });
        }
      },

      {
        icon: 'source',
        title: t('profile.about'),
        description: t('profile.YunHaiXueYue'),
        notification: false,
        iconColor: colors.primary,
        onPress: () => {
          navigation.navigate('Main', { screen: 'AboutDetail', options: { animationEnabled: false } });
        }
      }
    ]);

    const [menuList] = useState<SettingViewItemType[]>([]);

    useEffect(() => {
      try {
        let setting: SettingViewItemType[] = [];
        setting = studentList;
        settingStore.updateSettings(setting);
      } catch (err) {}
    }, [menuList, settingStore, studentList, teachersList, userStore.login]);

    const navigateTo = () => {
      if (userStore.login) {
        navigation.navigate('Main', { screen: 'MyProfileDetail', options: { animationEnabled: false } });
      } else {
        navigation.navigate('LoginByPhone');
      }
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
            </View>
            <View style={styles.deviceLabel}>
              <Text style={styles.deviceText}>设备绑定</Text>
              <FastImage style={styles.deviceIcon} source={require('../assets/home/right.png')} resizeMode={FastImage.resizeMode.cover} />
            </View>
          </View>
          <View style={styles.context}>
            <View style={styles.moduleView}>
              <Text style={styles.mainText}>我的设备</Text>
              <View style={styles.labelView}>
                <View style={styles.startLabel}>
                  <FastImage style={styles.labelIcon} source={require('../assets/home/header-assets.png')} resizeMode={FastImage.resizeMode.cover} />
                  <Text style={styles.labelText}>F22R</Text>
                </View>
                <FastImage style={styles.deviceIcon} source={require('../assets/home/right-gray.png')} resizeMode={FastImage.resizeMode.cover} />
              </View>
            </View>
          </View>
        </ScrollView>
      );
    }, [settingStore.loading]);

    return (
      <BaseView ref={baseView} style={[tw.flex1, { backgroundColor: 'blue' }]}>
        {renderContent}
      </BaseView>
    );
  }
);

const styles = StyleSheet.create({
  headerStart: {
    flexDirection: 'row'
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
    marginLeft: 10,
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2
  },
  headerImg: {
    height: 50,
    width: 50
  },
  iconText: { color: '#00D1DE', fontSize: 12 },
  icons: {
    backgroundColor: '#ffffff',
    borderRadius: 9,
    paddingHorizontal: 5,
    paddingVertical: 3,
    marginRight: 5
  },
  imageView: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    height: 60,
    justifyContent: 'center',
    width: 60
  },
  userIcons: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  userName: {
    color: '#ffffff',
    fontSize: 18
  },
  deviceLabel: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 10
  },
  deviceText: {
    fontSize: 14,
    color: '#ffffff'
  },
  deviceIcon: {
    width: 20,
    height: 20
  },
  context: {
    flex: 1
  },
  labelView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e3e3e3'
  },
  startLabel: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  labelIcon: {
    width: 25,
    height: 25
  },
  labelText: {
    fontSize: 18,
    marginLeft: 15
  },
  moduleView: {
    padding: 20
  },
  mainText: {
    fontSize: 16,
    color: '#a6a6a6',
    marginBottom: 10
  }
});
