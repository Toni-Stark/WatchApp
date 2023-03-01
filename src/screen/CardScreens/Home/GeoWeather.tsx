import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, PermissionsAndroid, TouchableOpacity, Text, ScrollView } from 'react-native';
import { init, Geolocation } from 'react-native-amap-geolocation';
import { ScreenComponent } from '../../index';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import LinearGradient from 'react-native-linear-gradient';
import { StackBar } from '../../../component/home/StackBar';
import { addLocationListener, start, stop } from 'react-native-amap-geolocation/lib/js';
import moment from 'moment';
import { getWeek } from '../../../common/tools';
import FastImage from 'react-native-fast-image';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { ProfilePlaceholder } from '../../../component/skeleton/ProfilePlaceholder';

export const GeoWeather: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const [data, setData] = useState<any>(undefined);
    const [loading, setLoading] = useState<any>(true);

    useEffect(() => {
      addLocationListener((e) => {
        if (e) {
          stop();
          getWeather(e);
        }
      });
      (async () => await getGeoData())();
    }, []);

    const backScreen = () => {
      navigation.goBack();
    };

    const getWeather = (e) => {
      let weatherUrl = 'https://restapi.amap.com/v3/weather/weatherInfo';
      let webKey = '554ba62e047b6431be1a6042ffd900f2';
      fetch(`${weatherUrl}?key=${webKey}&extensions=all&city=${e?.adCode}`)
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson?.info === 'OK') {
            setData(responseJson.forecasts[0]);
            baseView?.current?.hideLoading();
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    };

    const getGeoData = async () => {
      !loading && baseView?.current?.showLoading({ text: '加载中...' });
      await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]);
      await init({
        ios: '',
        android: '7616b6ad4eabe758e2905cfb04e3fa4d'
      });
      start();
    };

    const getUrl = (str, bool) => {
      if (str.indexOf('阴') !== -1) {
        if (bool) return require('../../../assets/weather/yintian.png');
        return require('../../../assets/weather/yintian_1.png');
      }
      if (str.indexOf('雨') !== -1) {
        return require('../../../assets/weather/xiaoyu.png');
      }
      if (str.indexOf('雪') !== -1) {
        return require('../../../assets/weather/icon_daxue.png');
      }
      if (str.indexOf('云') !== -1) {
        // if (bool)
        return require('../../../assets/weather/Group.png');
        // return require('../../../assets/weather/wanduoyun.png');
      }
      if (str.indexOf('晴') !== -1) {
        if (bool) return require('../../../assets/weather/qingtian.png');
        return require('../../../assets/weather/night1.png');
      }
    };

    const currentContext = useMemo(() => {
      if (!data) return;
      return (
        <View style={styles.cityCard}>
          <Text style={styles.city}>
            {data.province}-{data.city}
          </Text>
          {data.casts.map((item, index) => (
            <LinearGradient
              key={index}
              colors={['#bdf6ff', '#07bec4']}
              style={styles.dayCard}
              start={{ x: 0.3, y: 0.75 }}
              end={{ x: 0.9, y: 1.0 }}
              locations={[0.1, 0.8]}
            >
              <Text style={styles.dayWeek}>
                {moment(item.date).format('MM月DD日')} 星期{getWeek(item.week)}
              </Text>
              <View style={styles.tabStyles}>
                <View style={styles.tabItems}>
                  <Text style={[styles.tabWeather, styles.colorBlue]}>{item.dayweather}</Text>
                  <Text style={[styles.tabC, styles.colorBlue]}>
                    {item.daytemp_float}°C / {item.daytemp}°C
                  </Text>
                </View>
                <View style={styles.textContext}>
                  <Text style={[styles.light, styles.colorBlue]}>{'<=白天'}</Text>
                  <View style={styles.tabView}>
                    <Text style={[styles.tabW]}>
                      {item.nightwind}&nbsp;{item.nightpower}&nbsp;级
                    </Text>
                  </View>
                  <Text style={[styles.night, styles.colorWhite]}>{'晚上=>'}</Text>
                </View>
                <View style={styles.tabItems}>
                  <Text style={[styles.tabWeather, styles.colorWhite]}>{item.nightweather}</Text>
                  <Text style={[styles.tabC, styles.colorWhite]}>
                    {item.nighttemp_float}°C / {item.nighttemp}°C
                  </Text>
                </View>
              </View>
              <FastImage resizeMode="contain" style={styles.leftImage} source={getUrl(item.dayweather, true)} />
              <FastImage resizeMode="contain" style={styles.rightImage} source={getUrl(item.nightweather, false)} />
            </LinearGradient>
          ))}
        </View>
      );
    }, [data]);

    const mainContext = useMemo(() => {
      if (loading) {
        return <ProfilePlaceholder />;
      }
      return (
        <ScrollView style={[styles.scrollStyle]}>
          {currentContext}
          <TouchableOpacity onPress={getGeoData}>
            <LinearGradient
              colors={['#07bec4', '#07bec5']}
              style={styles.touchStyle}
              start={{ x: 0.3, y: 0.75 }}
              end={{ x: 0.9, y: 1.0 }}
              locations={[0.1, 0.8]}
            >
              <Text style={styles.touchText}>同步天气预报</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      );
    }, [loading, data]);

    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.textCenter]}>
          <StackBar title="天气预报" onBack={() => backScreen()} />
          {mainContext}
        </View>
      </BaseView>
    );
  }
);

let color1 = '#9e9e9e';
let color2 = '#ffffff';
let color3 = '#f8f8f8';
let color5 = '#00bac4';
let color4 = '#00bac4';

export const styles = StyleSheet.create({
  city: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15
  },
  cityCard: {},
  colorBlue: {
    color: color5
  },
  colorWhite: {
    color: color2
  },
  dayCard: {
    backgroundColor: color2,
    borderRadius: 10,
    marginVertical: 5,
    overflow: 'hidden',
    padding: 10,
    position: 'relative'
  },
  dayWeek: {
    color: color4,
    fontSize: 14,
    fontWeight: 'bold'
  },
  leftImage: {
    bottom: -15,
    height: 85,
    left: -20,
    opacity: 0.7,
    position: 'absolute',
    width: 85,
    zIndex: 50
  },
  light: {
    alignSelf: 'flex-start',
    fontSize: 12,
    marginLeft: -17
  },
  night: {
    alignSelf: 'flex-end',
    fontSize: 12,
    marginRight: -17
  },
  rightImage: {
    bottom: -15,
    height: 85,
    opacity: 0.5,
    position: 'absolute',
    right: -20,
    width: 85,
    zIndex: 50
  },
  scrollStyle: {
    backgroundColor: color3,
    flex: 1,
    paddingBottom: 30,
    paddingHorizontal: 15
  },
  tabC: {
    fontSize: 13
  },
  tabItems: {
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  tabStyles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    zIndex: 90
  },
  tabW: {
    fontSize: 12,
    color: color5
  },
  tabWeather: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  textContext: {
    alignItems: 'center'
  },
  touchStyle: {
    alignItems: 'center',
    backgroundColor: color1,
    borderRadius: 5,
    marginBottom: 50,
    marginTop: 15,
    padding: 15
  },
  touchText: {
    color: color2,
    fontSize: 15,
    fontWeight: 'bold'
  },
  tabView: {
    backgroundColor: '#ffffff',
    marginVertical: 5,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 5
  }
});
