import React, { useEffect, useMemo, useRef } from 'react';
import { Text, AppState, TouchableOpacity } from 'react-native';
import BaseView from '../component/BaseView';
import { useStore } from '../store';
import { ScreenComponent } from './index';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { HeaderBar } from '../component/home/HeaderBar';
import moment from 'moment';

export const Home: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { blueToothStore } = useStore();
    const baseView = useRef<any>(undefined);

    const setBackgroundServer = async () => {
      AppState.addEventListener('change', async (e) => {
        await initBackgroundFetch();
        if (e === 'active') {
          await removeBackgroundFetch();
        }
      });
    };

    const initBackgroundFetch = async () => {
      console.log('初始化后台任务', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
      try {
      } catch (err) {
        console.log(err);
      }
    };

    const removeBackgroundFetch = async () => {
      console.log('清除后台服务');
    };

    useEffect(() => {
      (async () => {
        await setBackgroundServer();
      })();
    }, []);
    const renderContextText = useMemo(() => {
      return (
        <TouchableOpacity
          onPress={() => {
            blueToothStore.value = 0;
          }}
          style={{ width: '100%', height: 360, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 86 }}>{blueToothStore.value}</Text>
        </TouchableOpacity>
      );
    }, [blueToothStore]);

    return (
      <BaseView ref={baseView} style={[tw.flex1]}>
        <HeaderBar openLayout={() => {}} />
        {renderContextText}
      </BaseView>
    );
  }
);
const color1 = '#00D1DE';
const color3 = '#ffffff';
const color5 = '#cecece';
const color7 = '#3d3d3d';
const color8 = '#00bac4';
const color9 = '#FF002F';
const color10 = '#8f8f8f';
const color11 = 'transparent';
