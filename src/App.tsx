import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-community/async-storage';
import { BackHandler, Platform, StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigatorStack } from './screen';
import { APP_LANGUAGE, TOKEN_NAME } from './common/constants';
import { darkTheme, theme } from './common/theme';
import { useStore } from './store';
import { getStorage, hasAndroidPermission, versionThanOld } from './common/tools';
import { observer, Observer } from 'mobx-react-lite';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { appConfig } from './common/app.config';
import RNBootSplash from 'react-native-bootsplash';

const App = observer(() => {
  const { systemStore, blueToothStore, settingStore } = useStore();
  const [isLogin, setIsLogin] = useState<boolean>(false);

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
    setTimeout(() => {
      RNBootSplash.hide();
    }, 2000);
    (async () => {
      await hasAndroidPermission();
      const rePowered = await BluetoothStateManager.getState();
      if (rePowered === 'PoweredOn') {
        await blueToothStore.setManagerInit();
      }
    })();
  }, []);

  const showScreens = () => {
    // if (systemStore.showBootAnimation || !blueTooth) {
    //   return <BootAnimation />;
    // }
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
          <StatusBar backgroundColor="#66b8ae" barStyle={'light-content'} hidden={false} />
          <PaperProvider theme={systemStore.colorMode === 'dark' ? darkTheme : theme}>{showScreens()}</PaperProvider>
        </SafeAreaProvider>
      )}
    </Observer>
  );
});

export default App;
