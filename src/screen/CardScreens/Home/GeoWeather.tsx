import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, PermissionsAndroid, TouchableOpacity, Text } from 'react-native';
import { init, Geolocation } from 'react-native-amap-geolocation';
import { ScreenComponent } from '../../index';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store';
import { StackBar } from '../../../component/home/StackBar';
import { addLocationListener, start, stop } from 'react-native-amap-geolocation/lib/js';

export const GeoWeather: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { blueToothStore } = useStore();
    const [data, setData] = useState<any>({});

    useEffect(() => {}, []);

    const backScreen = () => {
      navigation.goBack();
    };

    const getGeoData = async () => {
      await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]);
      await init({
        ios: '',
        android: '7616b6ad4eabe758e2905cfb04e3fa4d'
      });
      addLocationListener((e) => {
        console.log(e);
      });
      start();
      stop();
      // Geolocation.getCurrentPosition(({ coords }) => {
      //   console.log(coords, 'location');
      // });
    };

    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.textCenter]}>
          <StackBar title="修改定位" onBack={() => backScreen()} />
          <View style={[tw.flex1, tw.p5]}>
            <TouchableOpacity style={styles.touchStyle} onPress={getGeoData}>
              <Text style={styles.touchText}>获取定位</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BaseView>
    );
  }
);

let color1 = '#9e9e9e';
let color2 = '#ffffff';
export const styles = StyleSheet.create({
  touchStyle: {
    alignItems: 'center',
    backgroundColor: color1,
    borderRadius: 5,
    padding: 15
  },
  touchText: {
    color: color2,
    fontSize: 15,
    fontWeight: 'bold'
  }
});
