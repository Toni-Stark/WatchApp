import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-community/async-storage';
import { Appearance, BackHandler, Platform, StatusBar } from 'react-native';
import { Provider as PaperProvider, useTheme } from 'react-native-paper';
import { NavigatorStack } from './screen';
import { APP_COLOR_MODE, APP_LANGUAGE, TEST_TOKEN, TOKEN_NAME, USER_AGREEMENT } from './common/constants';
import { darkTheme, theme } from './common/theme';
import { useStore } from './store';
import { BootAnimation } from './screen/BootAnimation';
import { delay, getStorage, hasAndroidPermission } from './common/tools';
import { UserStore } from './store/UserStore';
import { observer, Observer } from 'mobx-react-lite';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { WeChatOnePassLogin } from './screen/ModalScreens/WeChatOnePassLogin';

const App = observer(() => {
  const { colors } = useTheme();
  const { systemStore, userStore, blueToothStore, weChatStore } = useStore();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [blueTooth, setBlueTooth] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      enableScreens();
      await Icon.loadFont();
    })();
  }, []);

  useEffect(() => {
    getStorage(TOKEN_NAME)
      .then((res) => {
        setIsLogin(!!res);
      })
      .catch(() => {
        setIsLogin(false);
      });
  }, []);

  useEffect(() => {
    const handleColorModeChange = async (preferences: Appearance.AppearancePreferences) => {
      const colorModeStore = await AsyncStorage.getItem(APP_COLOR_MODE);
      if (colorModeStore === 'system') {
        await systemStore.setColorModeConfig({
          mode: Appearance.getColorScheme(),
          saveSetting: false,
          backgroundColorStatusBar: colors.background,
          isSys: true
        });
      }
    };
    (async () => {
      const colorModeStore = await AsyncStorage.getItem(APP_COLOR_MODE);
      if (colorModeStore === 'system') {
        await systemStore.setColorModeConfig({ mode: 'system', saveSetting: true, backgroundColorStatusBar: colors.background, isSys: true });
      }
      if (colorModeStore === 'light') {
        await systemStore.setColorModeConfig({ mode: 'light', saveSetting: true, backgroundColorStatusBar: colors.background, isSys: false });
      }
      if (colorModeStore === 'dark') {
        await systemStore.setColorModeConfig({ mode: 'dark', saveSetting: true, backgroundColorStatusBar: colors.background, isSys: false });
      }
    })();

    Appearance.addChangeListener(delay(handleColorModeChange));

    return () => {
      Appearance.removeChangeListener(handleColorModeChange);
    };
  }, [colors.background, systemStore]);

  useEffect(() => {
    const handleLocalizationChange = async () => {
      const language = await AsyncStorage.getItem(APP_LANGUAGE);
      await systemStore.setI18nConfig(language);
    };

    (async () => {
      await handleLocalizationChange();
    })();

    RNLocalize.addEventListener('change', handleLocalizationChange);

    return () => {
      RNLocalize.removeEventListener('change', handleLocalizationChange);
    };
  }, [systemStore]);

  useEffect(() => {
    // UserStore.getToken().then(async (token) => {
    //   if (token) {
    //     const res = await userStore.queryUserInfo();
    //     if (res) {
    //       console.log('登录成功');
    //     }
    //   } else {
    //     // await userStore.rootWechat();
    //   }
    // });
  }, [userStore]);

  useEffect(() => {
    (async () => {
      await hasAndroidPermission();
      const rePowered = await BluetoothStateManager.getState();
      if (rePowered === 'PoweredOn') {
        await blueToothStore.setManagerInit();
      }
      setBlueTooth(true);
    })();
  }, []);

  const goInApp = async (e) => {
    await AsyncStorage.setItem(USER_AGREEMENT, 'Happy every day');
    const res = await weChatStore.userWeChatLogin({ code: e.code });
    if (res?.success) {
      setIsLogin(true);
    }
  };
  const outApp = async (isClean?: boolean) => {
    if (!isClean) {
      await AsyncStorage.removeItem(USER_AGREEMENT);
      getStorage(USER_AGREEMENT)
        .then((res) => {
          setIsLogin(!!res);
        })
        .catch(() => {
          setIsLogin(false);
        });
    }
    BackHandler.exitApp();
    BackHandler.exitApp();
    BackHandler.exitApp();
    BackHandler.exitApp();
  };

  const showScreens = () => {
    // if (systemStore.showBootAnimation || !blueTooth) {
    //   return <BootAnimation />;
    // }
    // console.log('运行几次');
    // if (Platform.OS === 'android' && !isLogin) {
    //   return (
    //     <WeChatOnePassLogin
    //       outApp={async () => {
    //         await outApp();
    //       }}
    //       goInApp={async (e) => {
    //         // await goInApp(e);
    //         setIsLogin(true);
    //       }}
    //     />
    //   );
    // }
    return <NavigatorStack />;
  };
  return (
    <Observer>
      {() => (
        <SafeAreaProvider>
          <StatusBar backgroundColor="#00D1DE" barStyle={'light-content'} hidden={false} />
          <PaperProvider theme={systemStore.colorMode === 'dark' ? darkTheme : theme}>{showScreens()}</PaperProvider>
        </SafeAreaProvider>
      )}
    </Observer>
  );
});

export default App;
