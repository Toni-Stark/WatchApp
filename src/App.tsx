import React, { useEffect, useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-community/async-storage';
import { BackHandler, Platform, StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigatorStack } from './screen';
import { APP_LANGUAGE, TOKEN_NAME, USER_AGREEMENT } from './common/constants';
import { darkTheme, theme } from './common/theme';
import { useStore } from './store';
import { BootAnimation } from './screen/BootAnimation';
import { getStorage, hasAndroidPermission } from './common/tools';
import { observer, Observer } from 'mobx-react-lite';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import RNBootSplash from 'react-native-bootsplash';

const App = observer(() => {
  const { systemStore, blueToothStore, weChatStore } = useStore();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [blueTooth, setBlueTooth] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      enableScreens();
      await Icon.loadFont();
    })();
  }, []);

  useEffect(() => {
    // (async () => {
    //   await AsyncStorage.setItem(TOKEN_NAME, '2398472394782387');
    // })();
    // (async () => {
    //   await AsyncStorage.removeItem(TOKEN_NAME);
    // })();
    getStorage(TOKEN_NAME)
      .then((res) => {
        setIsLogin(!!res);
      })
      .catch(() => {
        setIsLogin(false);
      });
  }, []);

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
    RNBootSplash.hide();
    (async () => {
      await hasAndroidPermission();
      const rePowered = await BluetoothStateManager.getState();
      if (rePowered === 'PoweredOn') {
        await blueToothStore.setManagerInit();
      }
      setBlueTooth(true);
    })();
  }, []);

  const outApp = async (isClean?: boolean) => {
    BackHandler.exitApp();
    BackHandler.exitApp();
    BackHandler.exitApp();
    BackHandler.exitApp();
  };

  const showScreens = () => {
    if (systemStore.showBootAnimation || !blueTooth) {
      return <BootAnimation />;
    }
    // if (Platform.OS === 'android' && !isLogin) {
    //   return (
    //     <WeChatOnePassLogin
    //       isComponent={true}
    //       outApp={async () => {
    //         await outApp();
    //       }}
    //       goInApp={async (e) => {
    //         await goInApp(e);
    //       }}
    //     />
    //   );
    // }
    return <NavigatorStack isRoot={isLogin} />;
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
