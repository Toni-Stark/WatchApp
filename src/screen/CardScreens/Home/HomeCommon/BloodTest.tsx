import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenComponent } from '../../../index';
import { Text } from 'react-native-paper';
import BaseView from '../../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../../store';
import { StackBar } from '../../../../component/home/StackBar';
import Spinner from 'react-native-loading-spinner-overlay/src/index';
import { RootEnum } from '../../../../common/sign-module';
import { allDataSleep, bloodData, downData, mainListen } from '../../../../common/watch-module';

export const BloodTest: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { blueToothStore } = useStore();
    const [value, setValue] = useState(0);
    const backScreen = () => {
      navigation.goBack();
    };

    const openHelp = () => {
      console.log('帮助');
    };
    const openBlood = async () => {
      await blueToothStore.sendActiveWithoutMessage(bloodData);
    };
    const closeBlood = async () => {
      console.log('帮助');
    };

    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.justifyCenter, tw.textCenter]}>
          <StackBar title="检测血氧" onBack={() => backScreen()} onHelp={openHelp} />
          <View style={styles.flexView}>
            <View style={styles.btnView}>
              <TouchableOpacity style={[styles.buttons, styles.startBtn]} onPress={openBlood}>
                <Text style={styles.textBtn}>打开血氧测试</Text>
              </TouchableOpacity>
              <View style={styles.contextView}>
                <Text style={styles.values}>{value}</Text>
              </View>
              <TouchableOpacity style={[styles.buttons, styles.endBtn]} onPress={closeBlood}>
                <Text style={styles.textBtn}>关闭血氧测试</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BaseView>
    );
  }
);
export const styles = StyleSheet.create({
  flexView: {
    flex: 1
  },
  btnView: {
    flexDirection: 'row'
  },
  buttons: {
    padding: 15
  },
  startBtn: {
    backgroundColor: '#055fe7'
  },
  endBtn: {
    backgroundColor: '#d50921'
  },
  contextView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  values: {
    fontSize: 30
  },
  textBtn: {
    color: '#ffffff'
  }
});
