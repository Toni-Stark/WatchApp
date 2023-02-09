import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import BaseView from '../../../component/BaseView';
import { useStore } from '../../../store';
import { tw } from 'react-native-tailwindcss';
import { ProfilePlaceholder } from '../../../component/skeleton/ProfilePlaceholder';
import { observer } from 'mobx-react-lite';
import { ScreenComponent } from '../../index';
import FastImage from 'react-native-fast-image';
import { StackBar } from '../../../component/home/StackBar';
import DropDownPicker from 'react-native-dropdown-picker';
import { appConfig, SERVER_URL } from '../../../common/app.config';
import { eventTimeInterval, eventTimes } from '../../../common/tools';

export const BindingInfo: ScreenComponent = observer(
  ({ navigation, route }): JSX.Element => {
    const { blueToothStore } = useStore();
    const { mac }: any = route.params;
    const baseView = useRef<any>(undefined);

    const [loading, setLoading] = useState(!!mac);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<any>();
    const [newValue, setNewValue] = useState<any>(0);
    const [items, setItems] = useState([]);
    const [codeInfo, setCodeInfo] = useState<any>(undefined);

    const setOpenValue = (e) => {
      setOpen(true);
    };

    useEffect(() => {
      if (value && newValue > 0) {
        checkCode({ id: value });
        eventTimeInterval(
          (e) => {
            console.log('二维码更新');
            checkCode({ id: value });
          },
          60000,
          false
        );
      }
      setOpen(false);
      return () => {
        eventTimeInterval(() => {}, 60000, true);
      };
    }, [value]);

    useEffect(() => {
      updateData({ id: mac }).then();
    }, []);

    const checkCode = (info) => {
      blueToothStore.getDeviceBindInfo({ id: info?.id }).then((result) => {
        if (!result.success) {
          baseView.current.showToast({ text: result.msg, delay: 2 });
          return;
        }
        if (!value) {
          setValue(info.id);
        }
        setNewValue(newValue + 1);
        setCodeInfo(result.data);
        setLoading(false);
        baseView.current.hideLoading();
      });
    };

    const updateData = async (params) => {
      baseView.current.showLoading({ text: '加载中...' });
      blueToothStore.userDeviceSetting(false, true).then((res) => {
        if (!res.success) {
          baseView.current.showToast({ text: res.msg, delay: 2 });
          return;
        }
        let devices = res.data;
        let list: any = [];
        devices.map((item) => {
          list.push({
            label: item.device_name + (item.note ? ' - ' + item.note : ''),
            value: item.id
          });
        });
        setItems(list);
        if (params?.id) {
          let info: any = res.data?.find((item, index) => {
            return item.device_mac === params.id;
          });
          checkCode(info);
        } else {
          if (res.data.length > 0) {
            checkCode({ id: res.data[0].id });
          } else {
            baseView.current.hideLoading();
          }
        }
      });
    };

    const backScreen = () => {
      navigation.goBack();
    };

    const renderContent = useMemo(() => {
      if (loading) {
        return <ProfilePlaceholder />;
      }
      const url = SERVER_URL + '/qr-code/gen?data=' + codeInfo?.qr_str;
      return (
        <ScrollView style={[tw.flex1, [{ marginBottom: 60 }]]}>
          <View style={styles.moduleView}>
            <View style={styles.pickerView}>
              <DropDownPicker placeholder="选择一个设备" open={open} value={value} items={items} setOpen={setOpenValue} setValue={setValue} />
            </View>
            <View style={styles.fastView}>
              <FastImage style={styles.fastImage} resizeMode="stretch" source={{ uri: url }} />
            </View>
            <View style={styles.fastText}>
              <Text>验证码：</Text>
              <Text style={styles.mainText}>{codeInfo?.code}</Text>
            </View>
          </View>
        </ScrollView>
      );
    }, [open, value, codeInfo, loading]);

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
  fastImage: {
    borderRadius: 10,
    height: 250,
    width: 250
  },
  fastText: {
    alignItems: 'center',
    height: 60,
    justifyContent: 'center'
  },
  fastView: {
    alignItems: 'center',
    backgroundColor: color2,
    borderColor: color1,
    borderRadius: 20,
    borderWidth: 1,
    height: 280,
    justifyContent: 'center',
    width: 280
  },
  headerStart: {
    flexDirection: 'row'
  },
  mainText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  moduleView: {
    alignItems: 'center',
    paddingVertical: 100
  },
  pickerView: {
    marginBottom: 25,
    width: '78%'
  }
});
