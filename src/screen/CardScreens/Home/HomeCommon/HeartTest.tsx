import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenComponent } from '../../../index';
import { Text } from 'react-native-paper';
import BaseView from '../../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../../store';
import { StackBar } from '../../../../component/home/StackBar';
import { allDataHeartEnd, allDataHeartStart } from '../../../../common/watch-module';
import { CirCleHeart } from '../../../../component/home/CirCleHeart';

export const HeartTest: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const animateRef = useRef<any>(undefined);
    const { blueToothStore } = useStore();
    const [value, setValue] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      let val = blueToothStore.currentDevice['-48']?.heartJump;
      if (val) {
        if (val === 1) {
          (async () => closeHeart())();
        }
        setValue(val || 0);
      }
    }, [blueToothStore.currentDevice]);
    useEffect(() => {
      return () => {
        if (isOpen) {
          blueToothStore.sendActiveWithoutMessage(allDataHeartEnd).then(() => {
            setIsOpen(false);
          });
        }
      };
    }, []);

    const backScreen = () => {
      navigation.goBack();
    };

    const openHelp = () => {
      console.log('帮助');
    };
    const openHeart = async () => {
      setIsOpen(true);
      await blueToothStore.sendActiveWithoutMessage(allDataHeartStart);
    };
    const closeHeart = () => {
      blueToothStore.sendActiveWithoutMessage(allDataHeartEnd).then(() => {
        setIsOpen(false);
      });
    };

    const useButtonCheck = useMemo(() => {
      if (isOpen) {
        return (
          <TouchableOpacity style={[styles.buttons, styles.endBtn]} onPress={closeHeart}>
            <Text style={styles.textBtn}>关闭血氧测试</Text>
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity style={[styles.buttons, styles.startBtn]} onPress={openHeart}>
          <Text style={[styles.textBtn, styles.textStart]}>打开血氧测试</Text>
        </TouchableOpacity>
      );
    }, [isOpen]);
    return (
      <BaseView ref={baseView}>
        <View style={[tw.flex1, tw.justifyCenter, tw.textCenter]}>
          <StackBar title="检测血氧" onBack={() => backScreen()} onHelp={openHelp} />
          <View style={styles.flexView}>
            <View style={styles.contextView}>
              <Animated.View style={[styles.circleView]} />
              <Animated.View style={[styles.circleCenterView]} />
              <CirCleHeart ref={animateRef} />
              <View style={styles.absoluteValues}>
                <Text style={styles.values}>{value}</Text>
              </View>
            </View>
            <View style={styles.btnView}>{useButtonCheck}</View>
          </View>
        </View>
      </BaseView>
    );
  }
);
export const styles = StyleSheet.create({
  absoluteValues: {
    alignItems: 'center',
    height: 100,
    justifyContent: 'center',
    left: '50%',
    marginLeft: -50,
    marginTop: -50,
    position: 'absolute',
    top: '50%',
    width: 100
  },
  btnView: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: 20
  },
  buttons: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    padding: 15
  },
  circleCenterView: {
    backgroundColor: 'rgba(21,227,248,0.78)',
    borderRadius: 200,
    height: 220,
    position: 'absolute',
    width: 220
  },
  circleView: {
    alignItems: 'center',
    backgroundColor: '#0cddef',
    borderRadius: 200,
    height: 300,
    justifyContent: 'center',
    position: 'absolute',
    width: 300
  },
  contextView: {
    alignItems: 'center',
    height: '60%',
    justifyContent: 'center',
    position: 'relative'
  },
  disableBtn: {
    backgroundColor: 'rgba(255,255,255,0.8)'
  },
  endBtn: {
    backgroundColor: '#d50921'
  },
  flexView: {
    backgroundColor: '#00D1DE',
    flex: 1
  },
  startBtn: {
    backgroundColor: '#ffffff'
  },
  textBtn: {
    color: '#ffffff',
    fontSize: 18
  },
  textStart: {
    color: '#00D1DE'
  },
  values: {
    color: '#ffffff',
    fontSize: 80
  }
});
