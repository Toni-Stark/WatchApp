import React, { useEffect, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import BaseView from '../../component/BaseView';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../../store';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-community/async-storage';
import { USER_AGREEMENT } from '../../common/constants';
import RNBootSplash from 'react-native-bootsplash';
import { NavigatorComponentProps } from '../index';
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
    if (agree) {
      baseView.current.showLoading({ text: '登录中' });
      const result: any = await weChatStore.checkWeChatInstall();
      console.log(result);
      if (result) {
        await AsyncStorage.setItem(USER_AGREEMENT, 'Happy every day');
        const res: any = await weChatStore.userWeChatLogin({ code: result.code });
        baseView.current.hideLoading();
        if (res?.success) {
          return props.navigation.navigate('Main');
        }
        baseView.current.showToast({ text: res.msg, delay: 1.5 });
      }
    } else {
      baseView.current.showToast({ text: '请阅读并同意用户协议', delay: 1 });
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
        <View style={styles.titleView}>
          <Text style={styles.title}>欢迎，请登录</Text>
          <View style={styles.imageView}>
            <FastImage style={styles.image} source={require('../../assets/logo.png')} />
          </View>
          <TouchableOpacity style={styles.buttonView} onPress={currentLogin}>
            <FastImage style={styles.wechat} source={require('../../assets/home/white-wechat.png')} />
            <Text style={styles.buttonText}>微信一键登录</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.user}>
          <TouchableOpacity style={styles.agree} onPress={currentAgree}>
            <View style={styles.agreeView}>{agree ? <View style={styles.agreeMain} /> : null}</View>
          </TouchableOpacity>
          <View style={styles.userText}>
            <Text>我已阅读并同意</Text>
            <TouchableOpacity
              onPress={async () => {
                await openUserAgreement(1);
              }}
            >
              <Text style={styles.userMain}>《用户协议》</Text>
            </TouchableOpacity>
            <Text>和</Text>
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
      {currentSwitch}
    </BaseView>
  );
});
const color1 = '#00D1DE';
const color3 = '#ffffff';
const color4 = '#0dcd4c';
const color6 = '#ea97b9';

const styles = StyleSheet.create({
  agree: {
    padding: 15,
    paddingRight: 5
  },
  agreeMain: {
    backgroundColor: color3,
    borderRadius: 50,
    height: 8,
    width: 8
  },
  agreeView: {
    alignItems: 'center',
    borderColor: color3,
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 13,
    justifyContent: 'center',
    width: 13
  },
  buttonText: {
    color: color3,
    fontSize: 17
  },
  buttonView: {
    alignItems: 'center',
    backgroundColor: color4,
    borderRadius: 30,
    flexDirection: 'row',
    height: 45,
    justifyContent: 'center',
    marginTop: 50,
    width: '82%'
  },
  container: {
    alignItems: 'center',
    backgroundColor: color1,
    flex: 1,
    justifyContent: 'space-between'
  },
  image: {
    height: 70,
    width: 70
  },
  imageView: {
    alignItems: 'center',
    backgroundColor: color3,
    borderRadius: 100,
    height: 90,
    justifyContent: 'center',
    marginVertical: 20,
    padding: 20,
    width: 90
  },
  title: {
    color: color3,
    fontSize: 25
  },
  titleView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 150,
    width: '100%'
  },
  user: {
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: 'row',
    height: 80,
    justifyContent: 'center'
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
    height: 35,
    marginLeft: -30,
    marginRight: 10,
    width: 35
  }
});
