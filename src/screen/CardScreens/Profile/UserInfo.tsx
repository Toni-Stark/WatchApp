import React, { useMemo, useRef } from 'react';
import FastImage from 'react-native-fast-image';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { ProfilePlaceholder } from '../../../component/skeleton/ProfilePlaceholder';
import { StackBar } from '../../../component/home/StackBar';
import { ScreenComponent } from '../../index';
import { useStore } from '../../../store';
import BaseView from '../../../component/BaseView';

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
const color2 = '#f8f8f8';
const color3 = '#e3e3e3';
const color4 = '#a6a6a6';
const styles = StyleSheet.create({
  context: {
    alignItems: 'center',
    flex: 1
  },
  deviceIcon: {
    height: 20,
    width: 20
  },
  fastView: {
    alignItems: 'center',
    backgroundColor: color2,
    borderRadius: 200,
    display: 'flex',
    height: 120,
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 20,
    width: 120
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
    borderColor: color3,
    borderStyle: 'solid',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  mainText: {
    color: color4,
    fontSize: 16,
    marginBottom: 10
  },
  moduleView: {
    alignItems: 'center',
    height: 250,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 50
  },
  startLabel: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  textView: {
    color: color1,
    fontSize: 26,
    fontWeight: 'bold'
  }
});
