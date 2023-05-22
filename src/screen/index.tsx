import React from 'react';
import { CardStyleInterpolators, createStackNavigator, StackNavigationOptions, StackScreenProps, TransitionSpecs } from '@react-navigation/stack';
import { ActivityIndicator } from 'react-native-paper';
import type { ParamListBase } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { observer } from 'mobx-react-lite';
import { View } from 'react-native';
import { ModalScreens, ModalScreensRoot } from './ModalScreens';
import { CardScreens, ScreensParamList } from './CardScreens';
import { TabBar } from './RouterOptions/TabBar';
import { Profile } from './Profile';
import { t } from '../common/tools';
import { Home } from './Home';

const RootStack = createStackNavigator();
const BottomTabStack = createBottomTabNavigator();
const MainStack = createStackNavigator<ScreensParamList>();

const BottomTabs = observer(() => {
  return (
    <BottomTabStack.Navigator tabBar={(props) => <TabBar {...props} />}>
      <BottomTabStack.Screen
        key="Home"
        name="Home"
        component={Home}
        options={{
          tabBarLabel: t('tabs.home')
          // tabBarIcon: ({ focused, color }) => {
          //   console.log(focused);
          //   return <Icon name={focused ? 'person' : 'account-circle'} color={color} size={BottomIconSize} />;
          // }
          // tabBarIcon: ({ focused, color }) => {
          //   iconRef.current?.play();
          //   Animated.timing(progress, {
          //     toValue: progress ? 0 : 1,
          //     duration: 3000,
          //     useNativeDriver: true
          //   }).start(() => {
          //     progress.setValue(progress ? 0 : 1);
          //   });
          //   console.log(focused, color);
          //   return (

          //   );
          // }
        }}
      />
      <BottomTabStack.Screen
        key="Profile"
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: t('tabs.profile')
        }}
      />
    </BottomTabStack.Navigator>
  );
});

const MainScreens = () => {
  return (
    <MainStack.Navigator>
      <RootStack.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={{
          headerShown: false,
          gestureEnabled: false,
          transitionSpec: { open: TransitionSpecs.FadeInFromBottomAndroidSpec, close: TransitionSpecs.FadeInFromBottomAndroidSpec }
        }}
      />
      {CardScreens.map((screen) => (
        <RootStack.Screen
          name={screen.name}
          component={screen.component}
          key={screen.name}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: { open: TransitionSpecs.FadeInFromBottomAndroidSpec, close: TransitionSpecs.FadeInFromBottomAndroidSpec }
          }}
        />
      ))}
    </MainStack.Navigator>
  );
};

const renderFallback = () => {
  return (
    <View style={{ height: '100%', justifyContent: 'center', backgroundColor: '#00D1DE' }}>
      <ActivityIndicator />
    </View>
  );
};

const linking = {
  prefixes: ['xueyue://'],
  screens: {
    initialRouteName: 'Home',
    Lesson: {
      path: 'lesson/:id'
    },
    Homework: {
      path: 'homework/:id'
    },
    LessonDetail: {
      path: 'lesson-detail/:id'
    },
    NotFound: '*'
  }
};

export const NavigatorStack = observer((props: any) => {
  return (
    <NavigationContainer linking={linking} fallback={renderFallback()}>
      <RootStack.Navigator mode="modal">
        {!props?.isRoot
          ? ModalScreensRoot.map((screen) => (
              <RootStack.Screen name={screen.name} component={screen.component} key={screen.name} options={{ headerShown: false }} />
            ))
          : null}
        <RootStack.Screen
          name="Main"
          component={MainScreens}
          options={{
            headerShown: false,
            transitionSpec: { open: TransitionSpecs.FadeInFromBottomAndroidSpec, close: TransitionSpecs.FadeInFromBottomAndroidSpec }
          }}
        />
        {ModalScreens.map((screen) => (
          <RootStack.Screen name={screen.name} component={screen.component} key={screen.name} options={{ headerShown: false }} />
        ))}
      </RootStack.Navigator>
    </NavigationContainer>
  );
});

export type NavigatorComponentProps = StackScreenProps<ParamListBase> & {
  options?: StackNavigationOptions;
};

export type ScreenComponent = React.FC<NavigatorComponentProps>;

export interface ScreenList {
  name: string;
  component: ScreenComponent | React.FC<any>;
}
