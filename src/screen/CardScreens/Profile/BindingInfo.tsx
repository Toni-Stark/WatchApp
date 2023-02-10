import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import BaseView from '../../../component/BaseView';
import { useStore } from '../../../store';
import { tw } from 'react-native-tailwindcss';
import { ProfilePlaceholder } from '../../../component/skeleton/ProfilePlaceholder';
import { observer } from 'mobx-react-lite';
import { ScreenComponent } from '../../index';
import FastImage from 'react-native-fast-image';
import { StackBar } from '../../../component/home/StackBar';
import DropDownPicker from 'react-native-dropdown-picker';
import { SERVER_URL } from '../../../common/app.config';
import Spinkit from 'react-native-spinkit';
import { UserStore } from '../../../store/UserStore';

export const BindingInfo: ScreenComponent = observer(
  ({ navigation, route }): JSX.Element => {
    const { blueToothStore, userStore } = useStore();
    const { mac }: any = route.params;
    const baseView = useRef<any>(undefined);

    const [loading, setLoading] = useState(!!mac);
    const [refresh, setRefresh] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<any>();
    const [newValue, setNewValue] = useState<any>(0);
    const [items, setItems] = useState<Array<any>>([]);
    const [codeInfo, setCodeInfo] = useState<any>(undefined);
    const [token, setToken] = useState<any>('');

    const setOpenValue = (e) => {
      setOpen(!open);
    };

    useEffect(() => {
      if (value && newValue > 0) {
        checkCode({ id: value });
      }
      setOpen(false);
    }, [value]);

    useEffect(() => {
      updateData({ id: mac }).then(() => {
        // getCode().then();
      });
    }, []);

    const checkCode = (info) => {
      blueToothStore.getDeviceBindInfo({ id: info?.id }).then((result) => {
        if (!result.success) {
          baseView.current.hideLoading();
          baseView.current.showToast({ text: result.msg, delay: 2 });
          return;
        }
        if (!value) {
          setValue(info.id);
        }
        console.log('log--------------');
        console.log(result.data);
        console.log('log--------------');
        setNewValue(newValue + 1);
        setCodeInfo(result.data);
        setLoading(false);
        baseView.current.hideLoading();
      });
    };

    const updateData = async (params) => {
      const tokenStr: any = await UserStore.getToken();
      setToken(tokenStr);
      baseView.current.showLoading({ text: '加载中...' });
      setRefresh(true);
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
            value: item.id,
            place: item.device_mac
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

    const refreshCodes = () => {
      setRefresh(true);
      checkCode({ id: value });
    };

    const loadImage = () => {
      console.log('success');
      setRefresh(false);
    };

    const renderImage: any = useMemo(() => {
      const url = SERVER_URL + '/qr-code/wechat?data=' + codeInfo?.qr_str;
      console.log(url, 'strUrl');
      if (codeInfo?.qr_str) {
        return <FastImage style={[styles.fastImage, [{}]]} onLoad={loadImage} resizeMode="stretch" source={{ uri: url }} />;
      }
    }, [codeInfo, refresh]);

    const renderContent = useMemo(() => {
      if (loading) {
        return <ProfilePlaceholder />;
      }
      return (
        <View style={[tw.flex1]}>
          <View style={styles.moduleView}>
            <View style={styles.pickerView}>
              {items.length > 1 ? (
                <DropDownPicker placeholder="选择一个设备" open={open} value={value} items={items} setOpen={setOpenValue} setValue={setValue} />
              ) : (
                <View style={styles.pickerValue}>
                  <Text style={styles.pickerEval1}>{items[0] && items[0].label} </Text>
                  <Text style={styles.pickerEval}> {items[0] && items[0].place}</Text>
                </View>
              )}
            </View>
            <View style={styles.fastView}>
              {renderImage}
              {refresh ? <Spinkit style={styles.fastSpinkit} type="Circle" size={50} color="white" /> : null}
            </View>
            <View style={styles.fastText}>
              <Text style={styles.evalTitle}>授权码：</Text>
              <Text style={styles.mainText}>{codeInfo?.code}</Text>
            </View>
            <TouchableOpacity style={styles.refreshCode} onPress={refreshCodes}>
              <View style={styles.refreshView}>
                {refresh ? (
                  <Spinkit type="Circle" size={18} color="white" />
                ) : (
                  <FastImage style={styles.refreshImage} source={require('../../../assets/home/style-setting/refresh.png')} />
                )}
              </View>
              <Text style={styles.refreshText}>刷新授权码</Text>
            </TouchableOpacity>
            <Text style={styles.refreshTips}>请使用微信扫描二维码，并输入授权码</Text>
          </View>
        </View>
      );
    }, [open, value, codeInfo, loading, codeInfo?.qr_str, refresh, token, codeInfo]);

    return (
      <BaseView ref={baseView} style={[tw.flex1]}>
        <StackBar title="共享信息" onBack={() => backScreen()} />
        {renderContent}
      </BaseView>
    );
  }
);

const color1 = '#00D1DE';
const color2 = 'rgba(0,209,222,0.91)';
const color3 = '#ffffff';
const styles = StyleSheet.create({
  evalTitle: {
    fontSize: 16
  },
  fastImage: {
    borderRadius: 10,
    height: 250,
    width: 250
  },
  fastText: {
    alignItems: 'center',
    flexDirection: 'row',
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
    position: 'relative',
    width: 280
  },
  fastSpinkit: {
    position: 'absolute'
  },
  headerStart: {
    flexDirection: 'row'
  },
  mainText: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  moduleView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 90
  },
  pickerEval: {
    fontSize: 16
  },
  pickerEval1: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  pickerValue: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  pickerView: {
    marginBottom: 25,
    width: '78%'
  },
  refreshCode: {
    alignItems: 'center',
    backgroundColor: color1,
    borderRadius: 10,
    flexDirection: 'row',
    height: 45,
    paddingHorizontal: 20,
    width: '45%'
  },
  refreshImage: {
    height: 22,
    width: 22
  },
  refreshText: {
    color: color3,
    fontSize: 16,
    textAlign: 'center'
  },
  refreshTips: {
    marginTop: 40
  },
  refreshView: {
    marginRight: 8,
    width: 20
  }
});
