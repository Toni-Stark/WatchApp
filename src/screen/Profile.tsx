import React, { useEffect, useRef, useState } from 'react';
import { Text, useTheme, Avatar } from 'react-native-paper';
import { Platform, View, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
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

    const renderContent = () => {
      if (!settingStore.loading) {
        return <ProfilePlaceholder />;
      }
      return (
        <ScrollView
          style={[
            { paddingTop: Platform.OS === 'ios' ? getStatusBarHeight(false) : 0, marginBottom: 55 + (Platform.OS === 'ios' ? 0 : getStatusBarHeight(false)) }
          ]}
        >
          <Text>微信登录开发中，切换分支即可见</Text>
        </ScrollView>
      );
    };

    return (
      <BaseView ref={baseView} useSafeArea={settingStore.loading} style={[tw.flex1]}>
        {renderContent()}
      </BaseView>
    );
  }
);
