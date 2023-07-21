import React, { useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import RNBootSplash from 'react-native-bootsplash';
import FastImage from 'react-native-fast-image';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { NEAR_FUTURE, USER_AGREEMENT } from '../../common/constants';
import { useStore } from '../../store';
import BaseView from '../../component/BaseView';

export type Props = {
  outApp: () => void;
  goInApp: (e: any) => void;
  isComponent?: boolean;
  navigation?: any;
};
export const WeChatOnePassLogin = observer((props: Props) => {
  const baseView = useRef<any>(undefined);
  const { weChatStore, blueToothStore } = useStore();
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    RNBootSplash.hide();
    (async () => await blueToothStore.removeBlueToothListen())();
  }, []);

  const currentAgree = () => {
    setAgree(!agree);
  };
  const currentLogin = async () => {
    try {
      if (agree) {
        await AsyncStorage.removeItem(NEAR_FUTURE);
        baseView.current.showLoading({ text: '登录中' });
        const result: any = await weChatStore.checkWeChatInstall();
        if (result) {
          await AsyncStorage.setItem(USER_AGREEMENT, 'Happy every day');
          const res: any = await weChatStore.userWeChatLogin({ code: result.code });
          baseView.current.hideLoading();
          if (res?.success) {
            return props.navigation.replace('Main');
          }
          baseView.current.showToast({ text: res.msg, delay: 1.5 });
        }
      } else {
        baseView.current.showToast({ text: '请阅读并同意用户协议', delay: 1 });
      }
    } catch (err) {
      if (err) {
        baseView.current.hideLoading();
        baseView.current.showToast({ text: '请点击确认登录', delay: 1.5 });
      }
    }
  };

  const openUserAgreement = async (e) => {
    if (e === 1) {
      props.navigation.navigate('UserAgreement');
    }
    if (e === 2) {
      props.navigation.navigate('PrivacyAgreement');
    }
  };

  const currentSwitch = useMemo(() => {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#66b8ae', '#4dada3', '#34a092', '#157b6e']}
          style={styles.titleView}
          start={{ x: 0.0, y: 0 }}
          end={{ x: 0, y: 1.0 }}
          locations={[0.1, 0.4, 0.8, 1]}
        >
          <Text style={styles.title}>欢迎，请登录</Text>
          <View style={styles.imageView}>
            <FastImage style={styles.image} source={require('../../assets/logo.png')} />
          </View>
        </LinearGradient>
        <View style={styles.buttonFooter}>
          <TouchableOpacity style={styles.buttonView} onPress={currentLogin}>
            <LinearGradient
              // colors={['#5ba49b', '#44978d', '#2c8a7e', '#157d70']}
              colors={['#66b8ae', '#4dada3', '#34a092', '#157b6e']}
              style={styles.buttonCenter}
              start={{ x: 0.0, y: 0 }}
              end={{ x: 1.5, y: 1.5 }}
              locations={[0.1, 0.4, 0.8, 1]}
            >
              <FastImage style={styles.wechat} source={require('../../assets/home/wechat1.png')} />
              <Text style={styles.buttonText}>微信一键登录</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.user}>
          <TouchableOpacity style={styles.agree} onPress={currentAgree}>
            <View style={styles.agreeView}>{agree ? <View style={styles.agreeMain} /> : null}</View>
          </TouchableOpacity>
          <View style={styles.userText}>
            <Text style={styles.agreeText}>我已阅读并同意</Text>
            <TouchableOpacity
              onPress={async () => {
                await openUserAgreement(1);
              }}
            >
              <Text style={styles.userMain}>《用户协议》</Text>
            </TouchableOpacity>
            <Text style={styles.agreeText}>和</Text>
            <TouchableOpacity
              onPress={async () => {
                await openUserAgreement(2);
              }}
            >
              <Text style={styles.userMain}>《隐私政策》</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [agree]);

  return (
    <BaseView useSafeArea={false} ref={baseView}>
      <StatusBar backgroundColor="#66b8ae" barStyle={'light-content'} hidden={false} />
      {currentSwitch}
    </BaseView>
  );
});
// const color1 = '#00D1DE';
const color1 = '#46b2a5';
const color3 = '#ffffff';
const color4 = '#f8f7f2';
const color6 = '#d51313';

const styles = StyleSheet.create({
  agree: {
    padding: 15,
    paddingRight: 5
  },
  agreeMain: {
    backgroundColor: color1,
    borderRadius: 50,
    height: 8,
    width: 8
  },
  agreeText: {
    color: color1
  },
  agreeView: {
    alignItems: 'center',
    borderColor: color1,
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 13,
    justifyContent: 'center',
    width: 13
  },
  buttonCenter: {
    alignItems: 'center',
    borderRadius: 30,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonFooter: {
    alignItems: 'center',
    flex: 1,
    width: '100%'
  },
  buttonText: {
    color: color4,
    fontSize: 17
  },
  buttonView: {
    height: 45,
    marginTop: 100,
    width: '82%'
  },
  buttonViewChild: {},
  container: {
    alignItems: 'center',
    backgroundColor: color4,
    flex: 1,
    justifyContent: 'space-between'
  },
  image: {
    height: 80,
    width: 80
  },
  imageView: {
    alignItems: 'center',
    backgroundColor: color4,
    borderRadius: 100,
    height: 110,
    justifyContent: 'center',
    marginTop: 30,
    marginVertical: 20,
    padding: 20,
    width: 110
  },
  title: {
    color: color4,
    fontSize: 28,
    fontWeight: 'bold'
  },
  titleView: {
    alignItems: 'center',
    backgroundColor: color1,
    borderBottomLeftRadius: 440,
    borderBottomRightRadius: 440,
    height: '45%',
    paddingTop: 100,
    width: '175%'
  },
  user: {
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: 'row',
    height: 80,
    justifyContent: 'center',
    paddingBottom: 30
  },
  userMain: {
    color: color6
  },
  userText: {
    alignItems: 'center',
    color: color3,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  wechat: {
    height: 28,
    marginLeft: -30,
    marginRight: 10,
    width: 28
  }
});
