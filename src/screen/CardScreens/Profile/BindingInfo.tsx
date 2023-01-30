import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import BaseView from '../../../component/BaseView';
import { useStore } from '../../../store';
import { tw } from 'react-native-tailwindcss';
import { ProfilePlaceholder } from '../../../component/skeleton/ProfilePlaceholder';
import { observer } from 'mobx-react-lite';
import { ScreenComponent } from '../../index';
import FastImage from 'react-native-fast-image';
import { StackBar } from '../../../component/home/StackBar';

export const BindingInfo: ScreenComponent = observer(
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
          data.push({ name: item.device_name, value: item.device_mac });
        });
        setSwitchList(data);
      });
    };

    const navigateToDevice = async (item) => {
      // navigation.navigate('ClockDial', {});
      // blueToothStore.sendActiveMessage(allDataC);
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
            <View style={styles.fastView}>
              <FastImage style={styles.fastImage} resizeMode="stretch" source={require('../../../assets/home/code.jpg')} />
            </View>
            <View style={styles.fastText}>
              <Text style={styles.mainText}>2354265</Text>
            </View>
          </View>
        </ScrollView>
      );
    }, [settingStore.loading, switchList]);

    return (
      <BaseView ref={baseView} style={[tw.flex1, [{ backgroundColor: 'blue' }]]}>
        <StackBar title="绑定信息" onBack={() => backScreen()} />
        {renderContent}
      </BaseView>
    );
  }
);

const color1 = '#00D1DE';
const color2 = 'rgba(0,209,222,0.91)';
const styles = StyleSheet.create({
  headerStart: {
    flexDirection: 'row'
  },
  moduleView: {
    paddingVertical: 100,
    alignItems: 'center'
  },
  fastView: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: color1,
    borderRadius: 20,
    backgroundColor: color2
  },
  fastImage: {
    height: 250,
    width: 250,
    borderRadius: 10
  },
  fastText: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mainText: {
    fontSize: 20
  }
});
