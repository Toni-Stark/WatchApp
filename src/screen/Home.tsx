import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, AppState } from 'react-native';
import BaseView from '../component/BaseView';
import { useStore } from '../store';
import { ScreenComponent } from './index';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { HeaderBar } from '../component/home/HeaderBar';
import moment from 'moment';
import BackgroundFetch from 'react-native-background-fetch';

let type = 0;
export const Home: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { blueToothStore } = useStore();
    const baseView = useRef<any>(undefined);
    const [configureOptions] = useState({
      minimumFetchInterval: 1,
      enableHeadless: true,
      forceAlarmManager: true,
      stopOnTerminate: false,
      startOnBoot: true
    }); // 默认后台运行配置项

    useEffect(() => {
      (async () => await setBackgroundServer())();
    }, []);

    const setBackgroundServer = async () => {
      AppState.addEventListener('change', async (e) => {
        if (e === 'background') {
          await initBackgroundFetch();
        }
        if (e === 'active') {
          console.log('进入前台');
        }
      });
    };

    const addEvent = () => {
      // 用Promise模拟长时间的任务
      console.log('发出新通知');
      blueToothStore.value = blueToothStore.value + 1;
    };

    const initBackgroundFetch = async () => {
      type = 1;
      console.log('初始化后台任务', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
      try {
        await BackgroundFetch.configure(
          configureOptions,
          async (taskId) => {
            console.log('添加后台任务', taskId, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
            await addEvent();
            BackgroundFetch.finish(taskId);
          },
          (taskId) => {
            console.warn('后台任务超时: ', taskId, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
            BackgroundFetch.finish(taskId);
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

    const updateMenuState = () => {
      console.log('打开分享链接');
    };

    const renderContextCenter = useMemo(() => {
      return (
        <TouchableOpacity
          style={{ width: '100%', height: 350, justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            blueToothStore.value = 0;
          }}
        >
          <Text style={{ fontSize: 75 }}>{blueToothStore.value}</Text>
        </TouchableOpacity>
      );
    }, [blueToothStore.value]);

    return (
      <BaseView ref={baseView} style={[tw.flex1]}>
        <HeaderBar openLayout={() => updateMenuState()} />
        {/*{renderContext}*/}
        {renderContextCenter}
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

const styles = StyleSheet.create({
  barText: {
    color: color5,
    fontSize: 16
  },
  battery: {
    borderColor: color3,
    borderRadius: 2,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    height: 15,
    marginLeft: 10,
    padding: 1,
    paddingLeft: 0,
    width: 37
  },
  batteryContent: {
    backgroundColor: color3,
    flex: 1,
    height: '100%',
    marginLeft: 1
  },
  cap: {
    fontSize: 12
  },
  endTitle: {
    color: color7,
    fontSize: 16
  },
  endValue: {
    fontSize: 19
  },
  evalTitle: {
    color: color3,
    marginTop: 2,
    textAlign: 'center'
  },
  footerText: {
    marginTop: 3
  },
  header: {
    alignItems: 'center',
    backgroundColor: color1,
    height: 260,
    justifyContent: 'center',
    position: 'relative',
    width: '100%'
  },
  headerTitle: {
    fontSize: 18
  },
  iconPosi: {
    position: 'absolute',
    right: 10,
    top: 5
  },
  imageIcon: {
    height: 23,
    width: 23
  },
  labelColor: {
    color: color3
  },
  labelData: {
    fontSize: 15
  },
  labelRe: {
    fontSize: 18
  },
  labelText: {
    fontSize: 13
  },
  labelView: {
    borderColor: color3,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 3
  },
  linkModule: {
    backgroundColor: color8,
    height: 50,
    width: '100%'
  },
  linkStatus: {
    backgroundColor: color9,
    height: 50,
    width: '100%'
  },
  mainTitle: {
    color: color3,
    fontFamily: 'SimpleLineIcons',
    fontSize: 35,
    textAlign: 'center'
  },
  resultText: {
    fontSize: 18
  },
  resultView: {
    backgroundColor: color3,
    borderRadius: 15,
    flex: 1,
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  tabBar: {
    alignItems: 'center',
    flex: 1
  },
  tabRow: {
    flexDirection: 'row'
  },
  tableEnd: {
    alignItems: 'flex-end'
  },
  tableHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tableItem: {
    backgroundColor: color3,
    marginBottom: 15,
    width: '48%'
  },
  tableItemLinear: {
    padding: 10
  },
  tableList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  tableStart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    flex: 1,
    paddingTop: 15
  },
  timeHeader: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  timeTitle: {
    fontSize: 12,
    paddingVertical: 10
  },
  triangle: {
    borderColor: color11,
    borderStyle: 'solid',
    borderTopColor: color10,
    borderTopWidth: 8,
    borderWidth: 5,
    height: 0,
    marginTop: 3,
    width: 0
  }
});
