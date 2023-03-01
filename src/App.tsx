import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import AsyncStorage from '@react-native-community/async-storage';
import * as RNLocalize from 'react-native-localize';
import { StatusBar, BackHandler, ToastAndroid, TextInput, Text } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigatorStack } from './screen';
import { APP_LANGUAGE, NEAR_FUTURE, TOKEN_NAME } from './common/constants';
import { darkTheme, theme } from './common/theme';
import { useStore } from './store';
import { getStorage, hasAndroidPermission } from './common/tools';
import { observer, Observer } from 'mobx-react-lite';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import RNBootSplash from 'react-native-bootsplash';
import RNExitApp from 'react-native-exit-app';

const App = observer(() => {
  const { systemStore, blueToothStore, settingStore } = useStore();
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      enableScreens();
      await Icon.loadFont();
    })();
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  const handleBackPress = () => {
    if (settingStore.backHome && settingStore.backHome + 2000 >= Date.now()) {
      //最近2秒内按过back键，可以退出应用。
      RNExitApp.exitApp();
      RNExitApp.exitApp();
    } else {
      settingStore.backHome = Date.now();
      ToastAndroid.show('再次点击退出App', 1500);
    }
    return true;
  };

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
    getStorage(TOKEN_NAME)
      .then((res) => {
        setIsLogin(!!res);
      })
      .catch(() => {
        setIsLogin(false);
      });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(NEAR_FUTURE).then((res) => {
      if (!res) return;
      let data = JSON.parse(res);
      let list: any = [];
      for (let ind in data) {
        list.push({
          name: ind,
          value: data[ind]
        });
      }
      let datalist = {};
      list.map((item) => {
        datalist[item.name] = item.value;
      });
      AsyncStorage.setItem(NEAR_FUTURE, JSON.stringify(datalist));
    });
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
    TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, { allowFontScaling: false });
    Text.defaultProps = Object.assign({}, Text.defaultProps, { allowFontScaling: false });
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
