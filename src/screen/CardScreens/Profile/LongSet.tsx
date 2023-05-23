import React, { useMemo, useRef, useState } from 'react';
import { Alert, DeviceEventEmitter, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import BaseView from '../../../component/BaseView';
import { ProfilePlaceholder } from '../../../component/skeleton/ProfilePlaceholder';
import { StackBar } from '../../../component/home/StackBar';
import { ScreenComponent } from '../../index';
import { useStore } from '../../../store';
import LinearGradient from 'react-native-linear-gradient';
import { settingDevicesLongSit } from '../../../common/watch-module';
import { strToHexEny } from '../../../common/tools';
import { TimePickerModal } from 'react-native-paper-dates';

let timeArr: any = [];
for (let i = 1; i <= 60; i++) {
  timeArr.push(i);
}
export const LongSet: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { settingStore, blueToothStore } = useStore();
    const baseView = useRef<any>(undefined);
    const [dateData, setDateData] = useState<any | undefined>({
      start: '08:00',
      end: '18:00',
      value: '30'
    });
    const [visible, setVisible] = useState(false);
    const [status, setStatus] = useState('start');
    const [current, setCurrent] = useState<any>({
      minutes: undefined,
      hours: undefined
    });
    const [modalVisible, setModalVisible] = useState(false);

    const backScreen = () => {
      navigation.goBack();
    };
    const onDismiss = () => {
      setVisible(false);
    };
    const openPickerStart = () => {
      setCurrent({
        hours: Number(dateData.start.slice(0, 2).toString()),
        minutes: Number(dateData.start.slice(3, 5).toString())
      });
      setVisible(true);
      setStatus('start');
    };
    const openPickerEnd = () => {
      setCurrent({
        hours: Number(dateData.end.slice(0, 2)),
        minutes: Number(dateData.end.slice(3, 5))
      });
      setVisible(true);
      setStatus('end');
    };
    const onConfirm = (params) => {
      const { hours, minutes } = params;
      let date: any = dateData;
      let time = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
      if (status === 'start') {
        date.start = time;
      } else {
        date.end = time;
      }
      setDateData({ ...date });
      setVisible(false);
    };
    const openModal = () => {
      setModalVisible(true);
    };
    const onClick = (e) => {
      setDateData({ ...dateData, value: e });
      setModalVisible(!modalVisible);
    };
    const currentClose = async () => {
      await blueToothStore.sendActiveMessage(settingDevicesLongSit('00', '00', '00', '00', '00', 0));
      baseView?.current?.showToast({ text: '关闭成功', delay: 1 });
      DeviceEventEmitter.emit('EventType', { is_set_long: false });
      navigation.goBack();
    };
    const currentSubmit = async () => {
      const { start, end, value } = dateData;
      let v1 = strToHexEny(start.slice(0, 2));
      let v2 = strToHexEny(start.slice(3, 5));
      let v3 = strToHexEny(end.slice(0, 2));
      let v4 = strToHexEny(end.slice(3, 5));
      let v5 = strToHexEny(value);
      await blueToothStore.sendActiveMessage(settingDevicesLongSit(v1, v2, v3, v4, v5, 1));
      baseView?.current?.showToast({ text: '设置成功', delay: 1 });
      DeviceEventEmitter.emit('EventType', { is_set_long: true });
      navigation.goBack();
    };
    const renderContent = useMemo(() => {
      if (settingStore.loading) {
        return <ProfilePlaceholder />;
      }
      return (
        <View style={[tw.flex1]}>
          <View style={styles.moduleView}>
            <View style={styles.inputLabelView}>
              <TouchableWithoutFeedback onPress={openPickerStart}>
                <View style={[styles.labelView]}>
                  <Text style={styles.labelText}>起始时间</Text>
                  <View style={styles.agree}>
                    <Text style={styles.input}>{dateData?.start}</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={openPickerEnd}>
                <View style={[styles.labelView]}>
                  <Text style={styles.labelText}>结束时间</Text>
                  <View style={styles.agree}>
                    <Text style={styles.input}>{dateData?.end}</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={openModal}>
                <View style={[styles.labelView]}>
                  <Text style={styles.labelText}>间隔时间</Text>
                  <View style={styles.agree}>
                    <Text style={styles.input}>{dateData.value}分钟</Text>
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
                  <Text style={styles.touchText}>打开 & 保存</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }, [settingStore.loading, dateData]);

    return (
      <BaseView ref={baseView} style={[tw.flex1, [{ backgroundColor: 'blue' }]]}>
        <StackBar title="久坐提醒设置" onBack={() => backScreen()} />
        {renderContent}
        <TimePickerModal
          locale="lh"
          label="选择时间"
          cancelLabel="关闭"
          confirmLabel="确定"
          visible={visible}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          hours={current?.hours}
          minutes={current?.minutes}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>持续时间选择</Text>
              <ScrollView>
                <View>
                  {timeArr.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.opacity} onPress={() => onClick(item)}>
                      <Text style={styles.opacityText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </BaseView>
    );
  }
);

const color1 = '#f3f3f3';
const color2 = '#666666';
const color4 = '#9e9e9e';
const color5 = '#ffffff';
const color6 = '#777777';
const color7 = 'rgba(0,0,0,0.44)';
const color8 = '#000000';

const styles = StyleSheet.create({
  agree: {
    padding: 0,
    paddingRight: 5,
    flex: 1,
    paddingLeft: 15
  },
  centeredView: {
    alignItems: 'center',
    backgroundColor: color7,
    flex: 1,
    justifyContent: 'center'
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
  labelText: {
    color: color6,
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
    padding: 10
  },
  modalTitle: {
    fontSize: 16,
    paddingBottom: 15,
    textAlign: 'center'
  },
  modalView: {
    backgroundColor: color5,
    borderRadius: 20,
    elevation: 5,
    height: 400,
    margin: 20,
    overflow: 'hidden',
    paddingVertical: 15,
    shadowColor: color8,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '80%'
  },
  moduleView: {
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between'
  },
  opacity: {
    paddingVertical: 8
  },
  opacityText: {
    fontSize: 20,
    textAlign: 'center',
    width: '100%'
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
