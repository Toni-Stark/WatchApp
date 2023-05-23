import React, { useEffect, useState } from 'react';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as RNLocalize from 'react-native-localize';
import RNBootSplash from 'react-native-bootsplash';
import RNExitApp from 'react-native-exit-app';
import { StatusBar, TextInput, Text, BackHandler, ToastAndroid } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { observer, Observer } from 'mobx-react-lite';
import { enableScreens } from 'react-native-screens';
import { APP_LANGUAGE, NEAR_FUTURE, TOKEN_NAME } from './common/constants';
import { getStorage, hasAndroidPermission } from './common/tools';
import { darkTheme, theme } from './common/theme';
import { NavigatorStack } from './screen';
import { useStore } from './store';
import { en, registerTranslation } from 'react-native-paper-dates';

registerTranslation('en', en);
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
      return true;
    }
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
    // AsyncStorage.removeItem(NEAR_FUTURE);

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
        <SafeAreaProvider style={{ backgroundColor: '#00D1DE' }}>
          <StatusBar backgroundColor="#00D1DE" barStyle={'light-content'} hidden={false} />
          <PaperProvider theme={systemStore.colorMode === 'dark' ? darkTheme : theme}>
            {/*<SideMenu menu={LayoutMenu()}>{showScreens()}</SideMenu>*/}
            {showScreens()}
          </PaperProvider>
        </SafeAreaProvider>
      )}
    </Observer>
  );
});

export default App;
