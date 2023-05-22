import React, { useMemo, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import BaseView from '../../../component/BaseView';
import { ProfilePlaceholder } from '../../../component/skeleton/ProfilePlaceholder';
import { StackBar } from '../../../component/home/StackBar';
import { ScreenComponent } from '../../index';
import { useStore } from '../../../store';
import { settingDevicesLang } from '../../../common/watch-module';

export const LanguageSet: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    const { settingStore, blueToothStore } = useStore();
    const baseView = useRef<any>(undefined);
    const [switchValue, setSwitchValue] = useState<number>(1);
    const [switchList] = useState<any>(language_list);

    const backScreen = () => {
      navigation.goBack();
    };
    const currentAgree = async (val) => {
      setSwitchValue(val);
      await blueToothStore.sendActiveMessage(settingDevicesLang(val));
    };

    const renderContent = useMemo(() => {
      if (settingStore.loading) {
        return <ProfilePlaceholder />;
      }
      return (
        <ScrollView style={[tw.flex1]}>
          <View style={styles.moduleView}>
            <Text style={styles.mainText}>我的设备</Text>
            {switchList.map((item, index) => {
              return (
                <TouchableWithoutFeedback key={index.toString()} onPress={() => currentAgree(item.value)}>
                  <View style={[styles.labelView, !index && styles.firstBorder]}>
                    <Text style={styles.labelText}>{item.name}</Text>
                    <View style={styles.agree}>
                      <View style={styles.agreeView}>{switchValue === item.value ? <View style={styles.agreeMain} /> : null}</View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      );
    }, [settingStore.loading, switchValue]);

    return (
      <BaseView ref={baseView} style={[tw.flex1, [{ backgroundColor: 'blue' }]]}>
        <StackBar title="语言设置" onBack={() => backScreen()} />
        {renderContent}
      </BaseView>
    );
  }
);

const color1 = '#0d9fa8';
const color2 = '#e3e3e3';
const color3 = '#a6a6a6';
const styles = StyleSheet.create({
  agree: {
    padding: 0,
    paddingRight: 5
  },
  agreeMain: {
    backgroundColor: color1,
    borderRadius: 50,
    height: 15,
    width: 15
  },
  agreeView: {
    alignItems: 'center',
    borderColor: color1,
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 23,
    justifyContent: 'center',
    width: 23
  },
  firstBorder: {
    borderTopWidth: 1
  },
  headerStart: {
    flexDirection: 'row'
  },
  labelIcon: {
    height: 25,
    width: 25
  },
  labelText: {
    fontSize: 18,
    marginLeft: 5
  },
  labelView: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: color2,
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  mainText: {
    color: color3,
    fontSize: 16,
    marginBottom: 10
  },
  moduleView: {
    padding: 20
  }
});
export const language_list = [
  {
    name: '简体中文',
    value: 1
  },
  {
    name: 'English',
    value: 2
  }
  // {
  //   name: 'にほんご',
  //   value: 3
  // },
  // {
  //   name: '한국어',
  //   value: 4
  // },
  // {
  //   name: 'Deutsch',
  //   value: 5
  // },
  // {
  //   name: 'Россия',
  //   value: 6
  // },
  // {
  //   name: 'castellano',
  //   value: 7
  // },
  // {
  //   name: 'italiano',
  //   value: 8
  // },
  // {
  //   name: 'En français',
  //   value: 9
  // },
  // {
  //   name: 'Tiếng Việt',
  //   value: 10
  // },
  // {
  //   name: 'Português',
  //   value: 11
  // },
  // {
  //   name: 'ภาษาไทย',
  //   value: 12
  // },
  // {
  //   name: 'فارسی',
  //   value: 13
  // },
  // {
  //   name: 'Svenska',
  //   value: 14
  // },
  // {
  //   name: 'Turkish',
  //   value: 15
  // },
  // {
  //   name: 'svenska',
  //   value: 16
  // },
  // {
  //   name: 'Čeština',
  //   value: 17
  // }
];
