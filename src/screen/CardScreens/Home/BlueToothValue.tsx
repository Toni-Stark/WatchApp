import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { Text } from 'react-native-paper';
import { StackBar } from '../../../component/home/StackBar';
import { ScreenComponent } from '../../index';
import { useStore } from '../../../store';
import BaseView from '../../../component/BaseView';

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

let color1 = '#ffffff';
let color2 = '#000000';
let color5 = '#e7e7e7';
let color6 = '#9e9e9e';
let color4 = '#00D1DE';
let color7 = '#7f7f7f';
export const styles = StyleSheet.create({
  content: {
    color: color7,
    fontSize: 12
  },
  context: {
    color: color2
  },
  flexView: {
    flex: 1
  },
  footerBtn: {
    alignItems: 'center',
    backgroundColor: color4,
    borderRadius: 5,
    justifyContent: 'center',
    margin: 20,
    paddingVertical: 10
  },
  footerText: {
    color: color1,
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
    backgroundColor: color1,
    borderColor: color5,
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
    color: color6,
    fontSize: 13,
    marginTop: 4
  },
  toothPoint: {
    color: color4,
    fontSize: 16
  },
  toothTitle: {
    color: color2,
    fontSize: 13
  }
});
