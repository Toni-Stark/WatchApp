import React, { useMemo, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, TouchableWithoutFeedback } from 'react-native';
import BaseView from '../../../component/BaseView';
import { useStore } from '../../../store';
import { tw } from 'react-native-tailwindcss';
import { ProfilePlaceholder } from '../../../component/skeleton/ProfilePlaceholder';
import { observer } from 'mobx-react-lite';
import { ScreenComponent } from '../../index';
import { StackBar } from '../../../component/home/StackBar';

export const ClockDial: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { settingStore } = useStore();
    const baseView = useRef<any>(undefined);
    const [switchValue, setSwitchValue] = useState<number>(0);
    const [switchList, setSwitchList] = useState<any>([
      {
        name: '表盘一',
        value: 0
      },
      {
        name: '表盘二',
        value: 1
      },
      {
        name: '表盘三',
        value: 2
      }
    ]);

    const navigateToDevice = () => {
      console.log('123456');
    };
    const backScreen = () => {
      navigation.goBack();
    };
    const currentAgree = (val) => {
      console.log(val);
      setSwitchValue(val);
    };

    const renderContent = useMemo(() => {
      if (settingStore.loading) {
        return <ProfilePlaceholder />;
      }
      return (
        <ScrollView style={[tw.flex1, [{ marginBottom: 60 }]]}>
          <View style={styles.moduleView}>
            <Text style={styles.mainText}>我的设备</Text>
            {switchList.map((item, index) => {
              return (
                <TouchableWithoutFeedback key={Math.ceil(Math.random() * 1000).toString()} onPress={() => currentAgree(item.value)}>
                  <View style={[styles.labelView, !index && styles.firstBorder]}>
                    <Text style={styles.labelText}>{item.name}</Text>
                    <View style={styles.agree}>
                      <View style={styles.agreeView}>{switchValue === item.value ? <View style={styles.agreeMain} /> : null}</View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      );
    }, [settingStore.loading, switchValue]);

    return (
      <BaseView ref={baseView} style={[tw.flex1, [{ backgroundColor: 'blue' }]]}>
        <StackBar title="表盘设置" onBack={() => backScreen()} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  firstBorder: {
    borderTopWidth: 1
  },
  labelIcon: {
    height: 25,
    width: 25
  },
  labelText: {
    fontSize: 18,
    marginLeft: 5
  },
  agree: {
    padding: 0,
    paddingRight: 5
  },
  agreeView: {
    alignItems: 'center',
    borderColor: '#0d9fa8',
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 23,
    justifyContent: 'center',
    width: 23
  },
  agreeMain: {
    backgroundColor: '#0d9fa8',
    borderRadius: 50,
    height: 15,
    width: 15
  }
});
