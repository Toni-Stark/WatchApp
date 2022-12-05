import React, { useLayoutEffect, useRef, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import { TransitionPresets } from '@react-navigation/stack';
import { NavigatorComponentProps } from '../index';
import BaseView from '../../component/BaseView';
import FastImage from 'react-native-fast-image';
import { tw } from 'react-native-tailwindcss';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { t, throttle } from '../../common/tools';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Controller, useForm } from 'react-hook-form';
import { RouteProp } from '@react-navigation/native';
import { ScreensParamList } from '../CardScreens';
import { useStore } from '../../store';
import { observer } from 'mobx-react-lite';
import { ShengWangView } from '../../component/ShengWangView';

type ScreenRouteProp = RouteProp<ScreensParamList, 'Login'>;
type Props = {
  route: ScreenRouteProp;
  message?: string;
};

export const LoginByPhone: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation, route }): JSX.Element => {
    const isAndroid: boolean = Platform.OS === 'android';
    const UI_SIZE: boolean = Dimensions.get('window').height > 700;
    const LOGO_SIZE: number = isAndroid ? 90 : UI_SIZE ? 120 : 80;
    const TITLE_SIZE: number = isAndroid ? 22 : UI_SIZE ? 26 : 18;
    const BTN_INPUT_SIZE: number = UI_SIZE ? 16 : 12;
    const BTN_SMS_SIZE: number = UI_SIZE ? 14 : 12;
    const BTN_LOGIN_SIZE: number = isAndroid ? 17 : UI_SIZE ? 18 : 13;
    const { colors } = useTheme();
    const baseView = useRef<any>();
    const { control, handleSubmit, errors } = useForm();
    const { userStore } = useStore();
    const [useVerifyCode, setUseVerifyCode] = useState(true);
    const [phoneState, setPhoneState] = useState('');
    const [sysCode, setSysCode] = useState('');

    useLayoutEffect(() => {
      navigation.setOptions({
        ...TransitionPresets.ModalTransition,
        cardOverlayEnabled: true,
        gestureEnabled: true
      });
    }, [navigation]);

    const handleLogin = async (data) => {
      await userStore.downLoginTime();
      baseView.current?.showLoading({ text: t('loginByPhone.landing') });
      userStore.loginByPhone(data).then((res) => {
        baseView.current?.hideLoading();
        if (typeof res !== 'string') {
          userStore.queryUserInfo().then((resInfo) => {
            if (resInfo) {
              setPhoneState('');
              setSysCode('');
              navigation.navigate('Main', { screen: 'Home' });
            }
          });
        } else {
          baseView.current?.showMessage({ text: res });
        }
      });
    };

    const handleQuerySmsCode = async () => {
      await setUseVerifyCode(false);
      await handleSubmit(async (data) => {
        await userStore.downLoginTime();
        baseView.current?.showLoading({ text: t('loginByPhone.getting') });
        const res = await userStore.sendSms(data.phone, 1);
        baseView.current?.hideLoading();
        if (typeof res !== 'string') {
          baseView.current.showMessage({ text: t('loginByPhone.sendSuccess'), delay: 1.5 });
        } else {
          userStore.timerLogin = undefined;
          userStore.canLoginBind = false;
          baseView.current.showMessage({ text: res, delay: 1.5 });
        }
      })();
      await setUseVerifyCode(true);
    };

    const navi = (num: number) => {
      console.log(num);
      switch (num) {
        case 1:
          navigation.navigate('UserAgreement');
          break;
        case 2:
          navigation.navigate('PrivacyAgreement');
          break;
      }
    };

    const getRed = (name: string, num: number) => {
      return (
        <Text
          onPress={() => {
            navi(num);
          }}
          style={[tw.textXs, { color: colors.notification }]}
        >
          {name}
        </Text>
      );
    };

    return (
      <BaseView useSafeArea={Platform.OS === 'ios'} ref={baseView}>
        {/*<Icon name="chevron-left" size={45} color={colors.placeholder} style={[tw.mL2]} onPress={throttle(() => navigation.goBack())} />*/}
        <KeyboardAvoidingView style={[tw.flex]} behavior="padding" keyboardVerticalOffset={30}>
          <ScrollView style={[tw.hFull]}>
            <View style={[tw.flex1, tw.flexCol, tw.mT6]}>
              <View style={[tw.itemsCenter, tw.mT3]}>
                <FastImage
                  source={require('./../../assets/logo.png')}
                  style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
              <View style={[tw.mX10, tw.itemsCenter]}>
                <Text style={[tw.mT4, tw.fontMono, { fontSize: TITLE_SIZE, color: colors.primary }]}>{t('loginByPhone.welcome')}</Text>
                <Controller
                  control={control}
                  name="phone"
                  rules={{ required: { value: true, message: t('loginByPhone.mobileMust') }, pattern: /^1\d{10}$/ }}
                  defaultValue=""
                  render={({ onChange, onBlur }) => (
                    <TextInput
                      label={t('loginByPhone.phoneNum')}
                      placeholder={t('loginByPhone.pleaseInput')}
                      maxLength={11}
                      keyboardType="phone-pad"
                      style={[UI_SIZE ? tw.mT5 : tw.mT1, tw.wFull, { backgroundColor: colors.background, fontSize: BTN_INPUT_SIZE }]}
                      left={<TextInput.Icon size={20} name="cellphone" color={colors.placeholder} />}
                      onBlur={onBlur}
                      onChangeText={(phone) => {
                        onChange(phone);
                        setPhoneState(phone);
                      }}
                      value={phoneState.trim()}
                      error={errors.phone}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="verifyCode"
                  rules={useVerifyCode ? { required: true, pattern: /^\d{4}$/ } : {}}
                  defaultValue=""
                  render={({ onChange, onBlur }) => (
                    <TextInput
                      label={t('loginByPhone.SMSCode')}
                      placeholder={t('loginByPhone.pleaseSMS')}
                      maxLength={6}
                      keyboardType="number-pad"
                      style={[tw.wFull, { backgroundColor: colors.background, fontSize: BTN_INPUT_SIZE }]}
                      left={<TextInput.Icon size={20} name="numeric" color={colors.placeholder} />}
                      onBlur={onBlur}
                      onChangeText={(verifyCode) => {
                        onChange(verifyCode);
                        setSysCode(verifyCode);
                      }}
                      value={sysCode}
                      error={errors.verifyCode}
                    />
                  )}
                />
                <View style={[tw.wFull, tw.itemsEnd, tw.mT2, { opacity: userStore.canLoginBind ? 0.2 : 0.9 }]}>
                  <Button mode="outlined" compact labelStyle={[{ fontSize: BTN_SMS_SIZE }]} onPress={throttle(handleQuerySmsCode)}>
                    {t('loginByPhone.getSMS')}
                  </Button>
                </View>
                <Button
                  mode="contained"
                  style={[tw.wFull, StatusBar.currentHeight && StatusBar.currentHeight > 30 ? tw.mT6 : tw.mT2, tw.p1]}
                  labelStyle={[{ fontSize: BTN_LOGIN_SIZE }]}
                  onPress={handleSubmit(handleLogin)}
                >
                  {t('loginByName.login')}
                </Button>

                <View style={[tw.flexRow, tw.itemsCenter, tw.justifyCenter, UI_SIZE ? tw.mT4 : tw.mT2]}>
                  <TouchableOpacity
                    onPress={throttle(() => {
                      navigation.navigate('LoginByName');
                    })}
                  >
                    <Text style={[{ fontSize: 14, color: colors.placeholder }]}>{t('loginByPhone.userLogin')}</Text>
                  </TouchableOpacity>
                  <View style={[tw.mX2, { borderRightWidth: 1, borderRightColor: colors.disabled, height: '100%' }]} />
                  <TouchableOpacity
                    onPress={throttle(() => {
                      userStore.roleSelectionModal = false;
                      navigation.navigate('Register');
                    })}
                  >
                    <Text style={[{ fontSize: 14, color: colors.placeholder }]}>立即注册</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[tw.mX5, tw.flexRow, tw.selfCenter, tw.alignCenter, UI_SIZE ? tw.mT16 : tw.mT3]}>
                <Text style={[tw.textXs, tw.mX1, tw.textCenter, { color: colors.placeholder }]}>
                  <Icon style={[tw.selfCenter]} name="copyright" size={12} color={colors.placeholder} />
                  {t('loginByName.loginOne')}
                  {getRed(t('loginByName.loginTwo'), 1)}
                  {t('loginByName.and')}
                  {getRed(t('loginByName.loginThree'), 2)}
                </Text>
              </View>
              <ShengWangView />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </BaseView>
    );
  }
);
