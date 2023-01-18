import React, { useMemo, useRef } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import BaseView from '../../../component/BaseView';
import { useStore } from '../../../store';
import { tw } from 'react-native-tailwindcss';
import { ProfilePlaceholder } from '../../../component/skeleton/ProfilePlaceholder';
import { observer } from 'mobx-react-lite';
import { ScreenComponent } from '../../index';
import FastImage from 'react-native-fast-image';
import { StackBar } from '../../../component/home/StackBar';

export const UserInfo: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { settingStore, weChatStore } = useStore();
    const baseView = useRef<any>(undefined);

    const navigateToDevice = () => {
      navigation.navigate('ClockDial', {});
    };
    const backScreen = () => {
      navigation.goBack();
    };

    const renderContent = useMemo(() => {
      let info = weChatStore.userInfo;
      let avatar = info?.avatar ? { uri: info.avatar } : require('../../../assets/logo.png');
      let name = info.nickname;
      console.log(typeof info);
      if (settingStore.loading) {
        return <ProfilePlaceholder />;
      }
      return (
        <ScrollView style={[tw.flex1, [{ marginBottom: 60 }]]}>
          <View style={styles.moduleView}>
            <View style={styles.fastView}>
              <FastImage style={styles.labelIcon} source={avatar} resizeMode={FastImage.resizeMode.cover} />
            </View>
          </View>
          <View style={styles.context}>
            <Text style={styles.textView}>{name}</Text>
          </View>
        </ScrollView>
      );
    }, [settingStore.loading, weChatStore.userInfo]);

    return (
      <BaseView ref={baseView} style={[tw.flex1, [{ backgroundColor: 'blue' }]]}>
        <StackBar title="我的" onBack={() => backScreen()} />
        {renderContent}
      </BaseView>
    );
  }
);
const color1 = '#00D1DE';
const styles = StyleSheet.create({
  context: {
    flex: 1,
    alignItems: 'center'
  },
  deviceIcon: {
    height: 20,
    width: 20
  },
  fastView: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    width: 120,
    height: 120,
    borderRadius: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  headerStart: {
    flexDirection: 'row'
  },
  labelIcon: {
    height: 130,
    width: 130
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
    padding: 20,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50
  },
  startLabel: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  textView: {
    fontSize: 26,
    color: color1,
    fontWeight: 'bold'
  }
});
