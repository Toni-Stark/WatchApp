import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenComponent } from '../../index';
import { Text } from 'react-native-paper';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store';
import { StackBar } from '../../../component/home/StackBar';

export const BlueToothValue: ScreenComponent = observer(
  (props): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { blueToothStore } = useStore();
    const [data, setData] = useState<any>({});

    const backScreen = () => {
      props.navigation.goBack();
    };

    const openHelp = () => {
      console.log('帮助');
    };

    useEffect(() => {
      let params: any = props.route.params;
      if (params?.item) {
        setData(params.item);
      }
    }, []);

    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.justifyCenter, tw.textCenter]}>
          <StackBar title="特性值" onBack={() => backScreen()} onHelp={openHelp} />
          <View style={styles.headerLabel}>
            <Text>设备名称：{blueToothStore.devicesInfo.name}</Text>
          </View>
          <View style={styles.flexView}>
            <View style={styles.textView}>
              <Text style={styles.content}>服务UUID:</Text>
              <Text style={styles.context}>{data.serviceUUID}</Text>
            </View>
            <View style={styles.textView}>
              <Text style={styles.content}>特性UUID:</Text>
              <Text style={styles.context}>{data.uuid}</Text>
            </View>
            <View style={styles.textView}>
              <Text style={styles.content}>特性值:</Text>
              <Text style={styles.context}>{data.value}</Text>
            </View>
          </View>
        </View>
      </BaseView>
    );
  }
);
export const styles = StyleSheet.create({
  content: {
    color: '#7f7f7f',
    fontSize: 12
  },
  context: {
    color: '#000000'
  },
  flexView: {
    flex: 1
  },
  footerBtn: {
    alignItems: 'center',
    backgroundColor: '#00D1DE',
    borderRadius: 5,
    justifyContent: 'center',
    margin: 20,
    paddingVertical: 10
  },
  footerText: {
    color: '#ffffff',
    fontSize: 16
  },
  headerLabel: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%'
  },
  textView: {
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  toothItem: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e7e7e7',
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 6,
    paddingHorizontal: 15,
    paddingVertical: 7
  },
  toothMac: {
    color: '#9e9e9e',
    fontSize: 13,
    marginTop: 4
  },
  toothPoint: {
    color: '#00D1DE',
    fontSize: 16
  },
  toothTitle: {
    color: '#000000',
    fontSize: 13
  }
});
