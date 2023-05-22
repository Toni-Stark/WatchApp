import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import BaseView from '../../../component/BaseView';
import { ProfilePlaceholder } from '../../../component/skeleton/ProfilePlaceholder';
import { StackBar } from '../../../component/home/StackBar';
import { ScreenComponent } from '../../index';
import { useStore } from '../../../store';
import LinearGradient from 'react-native-linear-gradient';
import { settingDevicesScreenLight } from '../../../common/watch-module';
import moment from 'moment';
import { strToHexEny } from '../../../common/tools';

export const LightScreen: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { settingStore, blueToothStore } = useStore();
    const baseView = useRef<any>(undefined);
    const [timeParams, setTimeParams] = useState<any>({
      minValue: '2023-05-15 08:00',
      maxValue: '2023-05-15 18:00',
      value: '9'
    });
    const backScreen = () => {
      navigation.goBack();
    };

    const valueInput = async (val) => {
      timeParams.value = val.replace(/[^\d]+/, '');
      if (timeParams.value < 0) {
        baseView?.current.showToast({ text: '请输入规范值', delay: 1 });
        return;
      }
      setTimeParams({ ...timeParams });
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
      await blueToothStore.sendActiveMessage(settingDevicesScreenLight('00'));
      baseView?.current?.showToast({ text: '关闭成功', delay: 1 });
    };
    const currentSubmit = async () => {
      const { minValue, maxValue, value } = timeParams;
      let v1 = strToHexEny(moment(minValue).format('HH'));
      let v2 = strToHexEny(moment(minValue).format('mm'));
      let v3 = strToHexEny(moment(maxValue).format('HH'));
      let v4 = strToHexEny(moment(maxValue).format('mm'));
      let v5 = strToHexEny(value);
      await blueToothStore.sendActiveMessage(settingDevicesScreenLight(1, v1, v2, v3, v4, v5));
      baseView?.current?.showToast({ text: '设置成功', delay: 1 });
    };
    const renderContent = useMemo(() => {
      if (settingStore.loading) {
        return <ProfilePlaceholder />;
      }
      let max = moment(timeParams.maxValue).format('HH:mm');
      let min = moment(timeParams.minValue).format('HH:mm');
      return (
        <View style={[tw.flex1]}>
          <View style={styles.moduleView}>
            <View style={styles.inputLabelView}>
              <TouchableWithoutFeedback onPress={() => console.log('选中')}>
                <View style={[styles.labelView]}>
                  <Text style={styles.labelText}>起始时间</Text>
                  <View style={styles.agree}>
                    <TextInput
                      style={styles.input}
                      placeholderTextColor={placeholderColor}
                      placeholder={min}
                      value={min}
                      keyboardType="numeric"
                      onChangeText={minValueInput}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => console.log('选中')}>
                <View style={[styles.labelView]}>
                  <Text style={styles.labelText}>结束时间</Text>
                  <View style={styles.agree}>
                    <TextInput
                      style={styles.input}
                      placeholderTextColor={placeholderColor}
                      placeholder={max}
                      value={max}
                      keyboardType="numeric"
                      onChangeText={maxValueInput}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => console.log('选中')}>
                <View style={[styles.labelView]}>
                  <Text style={styles.labelText}>灵敏度</Text>
                  <View style={styles.agree}>
                    <TextInput
                      style={styles.input}
                      placeholderTextColor={placeholderColor}
                      placeholder={timeParams.value}
                      value={timeParams.value}
                      keyboardType="numeric"
                      onChangeText={valueInput}
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
        <StackBar title="转手腕亮屏设置" onBack={() => backScreen()} />
        {renderContent}
      </BaseView>
    );
  }
);

const color1 = '#f3f3f3';
const color2 = '#666666';
const color4 = '#9e9e9e';
const color5 = '#ffffff';
const placeholderColor = '#666666';

const styles = StyleSheet.create({
  moduleView: {
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between'
  },
  firstBorder: {
    borderTopWidth: 1
  },
  input: {
    borderRadius: 12,
    color: color2,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  inputLabelView: {},
  agree: {
    padding: 0,
    paddingRight: 5,
    flex: 1,
    paddingLeft: 15
  },
  labelText: {
    fontSize: 18,
    marginLeft: 5,
    color: '#777777'
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
