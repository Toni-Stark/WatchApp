import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import BaseView from '../../../component/BaseView';
import { ProfilePlaceholder } from '../../../component/skeleton/ProfilePlaceholder';
import { StackBar } from '../../../component/home/StackBar';
import { ScreenComponent } from '../../index';
import { useStore } from '../../../store';
import { passRegSign, settingDevicesMessage } from '../../../common/watch-module';

export const MessageControl: ScreenComponent = observer(
  ({ navigation, route }): JSX.Element => {
    const { settingStore, blueToothStore } = useStore();

    const baseView = useRef<any>(undefined);
    const [switchList, setSwitchList] = useState<any>(message_list);

    useEffect(() => {
      blueToothStore.sendActiveMessage(passRegSign('0000'));
    }, []);
    useEffect(() => {
      const { message } = blueToothStore.deviceControls;
      let list = message.slice(4, message.length)?.match(/([\d\D]{2})/g);
      let switchArr = switchList.map((item) => {
        return { ...item, status: list[item.index] === '01' };
      });
      setSwitchList(switchArr);
    }, [blueToothStore.deviceControls]);

    const backScreen = () => {
      navigation.goBack();
    };
    const currentAgree = async (index) => {
      let list: Array<any> = [...switchList];
      list[index].status = !list[index]?.status;
      let arr = Array(18).fill(0);
      list.map((item) => {
        arr[item.index] = item.status ? 1 : 2;
      });
      setSwitchList([...list]);
      await blueToothStore.sendActiveMessage(settingDevicesMessage(arr));
    };

    const renderContent = useMemo(() => {
      if (settingStore.loading) {
        return <ProfilePlaceholder />;
      }
      return (
        <ScrollView style={[tw.flex1]}>
          <View style={styles.moduleView}>
            <Text style={styles.mainText}>我的设备</Text>
            {switchList?.map((item, index) => {
              return (
                <TouchableWithoutFeedback key={index.toString()} onPress={() => currentAgree(index)}>
                  <View style={[styles.labelView, !index && styles.firstBorder]}>
                    <Text style={styles.labelText}>{item.name}</Text>
                    <View style={styles.agree}>
                      <View style={styles.agreeView}>{item?.status ? <View style={styles.agreeMain} /> : null}</View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      );
    }, [settingStore.loading, switchList]);

    return (
      <BaseView ref={baseView} style={[tw.flex1, [{ backgroundColor: 'blue' }]]}>
        <StackBar title="消息设置" onBack={() => backScreen()} />
        {renderContent}
      </BaseView>
    );
  }
);

const color1 = '#0d9fa8';
const color2 = '#e3e3e3';
const color3 = '#a6a6a6';
const styles = StyleSheet.create({
  agree: {
    padding: 0,
    paddingRight: 5
  },
  agreeMain: {
    backgroundColor: color1,
    borderRadius: 50,
    height: 15,
    width: 15
  },
  agreeView: {
    alignItems: 'center',
    borderColor: color1,
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 23,
    justifyContent: 'center',
    width: 23
  },
  firstBorder: {
    borderTopWidth: 1
  },
  labelText: {
    fontSize: 18,
    marginLeft: 5
  },
  labelView: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: color2,
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  mainText: {
    color: color3,
    fontSize: 16,
    marginBottom: 10
  },
  moduleView: {
    padding: 20
  }
});
export const message_list = [
  {
    name: '来电',
    index: 0
  },
  {
    name: '短信',
    index: 1
  },
  {
    name: '微信',
    index: 2
  },
  {
    name: 'QQ',
    index: 3
  },
  {
    name: 'Facebook',
    index: 5
  },
  {
    name: 'Twitter',
    index: 6
  },
  {
    name: 'LinkedIn',
    index: 8
  },
  {
    name: 'WhatsApp',
    index: 9
  },
  {
    name: 'LINE',
    index: 10
  },
  {
    name: 'Instagram',
    index: 11
  },
  {
    name: 'Snapchat',
    index: 12
  },
  {
    name: 'Skype',
    index: 13
  },
  {
    name: 'Gmail',
    index: 14
  },
  {
    name: '其他',
    index: 17
  }
];
