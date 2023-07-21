import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DeviceEventEmitter, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import BaseView from '../../../component/BaseView';
import { ProfilePlaceholder } from '../../../component/skeleton/ProfilePlaceholder';
import { StackBar } from '../../../component/home/StackBar';
import { ScreenComponent } from '../../index';
import { useStore } from '../../../store';
import LinearGradient from 'react-native-linear-gradient';
import { settingDevicesAlarm } from '../../../common/watch-module';
import AsyncStorage from '@react-native-community/async-storage';
import { HEART_VALUE, SET_TIME } from '../../../common/constants';

export const HeartSetting: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { settingStore, blueToothStore } = useStore();
    const baseView = useRef<any>(undefined);
    const [timeParams, setTimeParams] = useState<any>({
      minValue: '55',
      maxValue: '115'
    });

    useEffect(() => {
      AsyncStorage.getItem(HEART_VALUE).then((res) => {
        if (res) {
          setTimeParams(JSON.parse(res));
        }
      });
    }, []);

    const backScreen = () => {
      navigation.goBack();
    };
    const minValueInput = async (val) => {
      timeParams.minValue = val.replace(/[^\d]+/, '');
      if (timeParams.minValue < 0) {
        baseView?.current.showToast({ text: '请输入规范值', delay: 1 });
        return;
      }
      setTimeParams({ ...timeParams });
    };
    const maxValueInput = async (val) => {
      timeParams.maxValue = val.replace(/[^\d]+/, '');
      if (timeParams.maxValue > 300) {
        baseView?.current.showToast({ text: '请输入规范值', delay: 1 });
        return;
      }
      setTimeParams({ ...timeParams });
    };
    const currentClose = async () => {
      await blueToothStore.sendActiveMessage(settingDevicesAlarm(0, 0, 0));
      baseView?.current?.showToast({ text: '关闭成功', delay: 1 });
      DeviceEventEmitter.emit('EventType', { heart: false });
      navigation.goBack();
    };
    const currentSubmit = async () => {
      const { minValue, maxValue } = timeParams;
      if (minValue === 0 && maxValue === 0) {
        return;
      }
      if (Number(maxValue) <= Number(minValue)) {
        baseView?.current?.showToast({ text: '请输入有效值', delay: 1 });
        return;
      }
      if (Number(maxValue) > Number(minValue)) {
        await blueToothStore.sendActiveMessage(settingDevicesAlarm(maxValue, minValue, 1));
        baseView?.current?.showToast({ text: '设置成功', delay: 1 });
        await AsyncStorage.setItem(HEART_VALUE, JSON.stringify(timeParams));
        DeviceEventEmitter.emit('EventType', { heart: true });
        navigation.goBack();
      }
    };
    const renderContent = useMemo(() => {
      if (settingStore.loading) {
        return <ProfilePlaceholder />;
      }
      return (
        <View style={[tw.flex1]}>
          <View style={styles.moduleView}>
            <View style={styles.inputLabelView}>
              <TouchableWithoutFeedback onPress={() => console.log('选中')}>
                <View style={[styles.labelView]}>
                  <Text style={styles.labelText}>最低值</Text>
                  <View style={styles.agree}>
                    <TextInput
                      style={styles.input}
                      placeholder={timeParams.minValue}
                      value={timeParams.minValue}
                      placeholderTextColor={placeholderColor}
                      keyboardType="numeric"
                      onChangeText={minValueInput}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => console.log('选中')}>
                <View style={[styles.labelView]}>
                  <Text style={styles.labelText}>最高值</Text>
                  <View style={styles.agree}>
                    <TextInput
                      style={styles.input}
                      placeholder={timeParams.maxValue}
                      value={timeParams.maxValue}
                      placeholderTextColor={placeholderColor}
                      keyboardType="numeric"
                      onChangeText={maxValueInput}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.touchViewStyle}>
              <TouchableOpacity style={styles.touchView} onPress={currentClose}>
                <LinearGradient
                  colors={['#d4d4d4', '#c1c1c1']}
                  style={styles.touchStyle}
                  start={{ x: 0.3, y: 0.75 }}
                  end={{ x: 0.9, y: 1.0 }}
                  locations={[0.1, 0.8]}
                >
                  <Text style={styles.touchText}>关闭</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.touchViewRight} onPress={currentSubmit}>
                <LinearGradient
                  colors={['#07bec4', '#07bec5']}
                  style={styles.touchStyle}
                  start={{ x: 0.3, y: 0.75 }}
                  end={{ x: 0.9, y: 1.0 }}
                  locations={[0.1, 0.8]}
                >
                  <Text style={styles.touchText}>设置 & 开启</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }, [settingStore.loading, timeParams]);

    return (
      <BaseView ref={baseView} style={[tw.flex1, [{ backgroundColor: 'blue' }]]}>
        <StackBar title="心率警报设置" onBack={() => backScreen()} />
        {renderContent}
      </BaseView>
    );
  }
);

const color1 = '#f3f3f3';
const color4 = '#9e9e9e';
const color3 = '#777777';
const color5 = '#ffffff';
const placeholderColor = '#d0d0d0';

const styles = StyleSheet.create({
  agree: {
    padding: 0,
    paddingRight: 5,
    flex: 1,
    paddingLeft: 15
  },
  input: {
    borderRadius: 12,
    color: '#000000',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  inputLabelView: {},
  labelText: {
    color: color3,
    fontSize: 18,
    marginLeft: 5
  },
  labelView: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: color1,
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  moduleView: {
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between'
  },
  touchStyle: {
    alignItems: 'center',
    backgroundColor: color4,
    borderRadius: 5,
    marginBottom: 50,
    marginTop: 15,
    padding: 15
  },
  touchText: {
    color: color5,
    fontSize: 15,
    fontWeight: 'bold'
  },
  touchView: {
    width: '35%'
  },
  touchViewRight: {
    marginLeft: '5%',
    width: '60%'
  },
  touchViewStyle: {
    flexDirection: 'row',
    marginHorizontal: 20
  }
});
