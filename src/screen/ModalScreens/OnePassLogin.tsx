import React, { useRef, useState } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import BaseView from '../../component/BaseView';
import { ScreenComponent } from '../index';
import { useStore } from '../../store';

export const OnePassLogin: ScreenComponent = observer(
  (props): JSX.Element => {
    const baseView = useRef<any>(undefined);
    const { weChatStore } = useStore();
    const [status, setStatus] = useState(1);
    const [agree, setAgree] = useState(false);
    RNBootSplash.hide();

    const currentAgree = () => {
      setAgree(!agree);
    };
    const checkStatus = (val) => {
      setStatus(val);
    };
    const currentLogin = async () => {
      if (agree) {
        baseView.current.showLoading({ text: '登录中', delay: 1 });
        const result = await weChatStore.checkWeChatInstall();
        console.log(result, 'code');
        if (result) {
          props.navigation.goBack();
        }
      } else {
        baseView.current.showToast({ text: '请阅读并同意用户协议', delay: 1 });
      }
    };

    return (
      <BaseView useSafeArea={false} ref={baseView}>
        <View style={styles.container}>
          <View style={styles.titleView}>
            <Text style={styles.title}>欢迎，请登录</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={status === 1 ? styles.startView : styles.endView}>
                <TouchableWithoutFeedback onPress={() => checkStatus(1)}>
                  <View style={status === 1 ? styles.start : styles.startEnd}>
                    <Text style={status === 1 ? styles.startText : styles.endText}>快速登录</Text>
                  </View>
                </TouchableWithoutFeedback>
                <View style={styles.endOpa} />
              </View>
              <View style={status === 2 ? styles.startView : styles.endView}>
                <TouchableWithoutFeedback onPress={() => checkStatus(2)}>
                  <View style={status === 2 ? styles.endStart : styles.end}>
                    <Text style={status === 2 ? styles.startText : styles.endText}>商户登录/注册</Text>
                  </View>
                </TouchableWithoutFeedback>
                <View style={styles.endOpa} />
              </View>
            </View>
            <View style={styles.contentView}>
              <View style={status === 1 ? styles.contentButton : styles.rightButton}>
                <TouchableOpacity style={styles.buttonView} onPress={currentLogin}>
                  <Text style={styles.buttonText}>本机微信一键登录</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.user}>
              <TouchableOpacity style={styles.agree} onPress={currentAgree}>
                <View style={styles.agreeView}>{agree ? <View style={styles.agreeMain} /> : null}</View>
              </TouchableOpacity>
              <Text style={styles.userText}>
                我已阅读并同意<Text style={styles.userMain}>《用户协议》</Text>
              </Text>
            </View>
          </View>
        </View>
      </BaseView>
    );
  }
);
const color1 = '#00D1DE';
const color2 = '#0d9fa8';
const color3 = '#ffffff';
const color4 = '#3f3f3f';
const color5 = '#cecece';
const color6 = '#ea97b9';

const styles = StyleSheet.create({
  agree: {
    padding: 15,
    paddingRight: 5
  },
  agreeMain: {
    backgroundColor: color2,
    borderRadius: 50,
    height: 8,
    width: 8
  },
  agreeView: {
    alignItems: 'center',
    borderColor: color2,
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
    backgroundColor: color1,
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    marginTop: 50,
    width: '88%'
  },
  container: {
    alignItems: 'center',
    backgroundColor: color1,
    flex: 1,
    justifyContent: 'center'
  },
  content: {
    // height: '50%',
    // backgroundColor: '#ffffff'
    width: '78%'
  },
  contentButton: {
    alignItems: 'center',
    backgroundColor: color3,
    borderTopRightRadius: 15,
    height: 150,
    justifyContent: 'center',
    padding: 20
  },
  contentView: {
    backgroundColor: color2
  },
  end: {
    alignItems: 'center',
    backgroundColor: color2,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flex: 1,
    justifyContent: 'center',
    zIndex: 50
  },
  endOpa: {
    backgroundColor: color3,
    bottom: 0,
    height: '50%',
    position: 'absolute',
    width: '100%',
    zIndex: 30
  },
  endStart: {
    alignItems: 'center',
    backgroundColor: color3,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flex: 1,
    justifyContent: 'center',
    zIndex: 50
  },
  endText: {
    color: color5
  },
  endView: {
    backgroundColor: color1,
    position: 'relative',
    width: '60%'
  },
  header: {
    flexDirection: 'row',
    height: 50,
    marginTop: 40
  },
  rightButton: {
    alignItems: 'center',
    backgroundColor: color3,
    borderTopLeftRadius: 15,
    height: 150,
    justifyContent: 'center',
    padding: 20
  },
  start: {
    alignItems: 'center',
    backgroundColor: color3,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flex: 1,
    justifyContent: 'center',
    zIndex: 50
  },
  startEnd: {
    alignItems: 'center',
    backgroundColor: color2,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flex: 1,
    justifyContent: 'center',
    zIndex: 50
  },
  startText: {
    color: color4,
    fontSize: 16
  },
  startView: {
    backgroundColor: color1,
    width: '40%'
  },
  title: {
    color: color3,
    fontSize: 25
  },
  titleView: {
    marginTop: -100
  },
  user: {
    alignItems: 'center',
    backgroundColor: color3,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center'
  },
  userMain: {
    color: color6
  },
  userText: {}
});
