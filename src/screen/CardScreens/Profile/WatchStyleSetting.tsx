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

export const WatchStyleSetting: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { settingStore } = useStore();
    const baseView = useRef<any>(undefined);

    const navigateToDevice = () => {
      navigation.navigate('ClockDial', {});
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
            <Text style={styles.mainText}>我的设备</Text>
            <TouchableOpacity onPress={navigateToDevice}>
              <View style={styles.labelView}>
                <View style={styles.startLabel}>
                  <FastImage
                    style={styles.labelIcon}
                    source={require('../../../assets/home/style-setting/watch-icon.png')}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <Text style={styles.labelText}>表盘设置</Text>
                </View>
                <FastImage style={styles.deviceIcon} source={require('../../../assets/home/right-gray.png')} resizeMode={FastImage.resizeMode.cover} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }, [settingStore.loading]);

    return (
      <BaseView ref={baseView} style={[tw.flex1, [{ backgroundColor: 'blue' }]]}>
        <StackBar title="我的设备" onBack={() => backScreen()} />
        {renderContent}
      </BaseView>
    );
  }
);

const styles = StyleSheet.create({
  headerStart: {
    flexDirection: 'row'
  },
  moduleView: {
    padding: 20
  },
  mainText: {
    color: '#a6a6a6',
    fontSize: 16,
    marginBottom: 10
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
  startLabel: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  labelIcon: {
    height: 25,
    width: 25
  },
  labelText: {
    fontSize: 18,
    marginLeft: 15
  },
  deviceIcon: {
    height: 20,
    width: 20
  }
});
