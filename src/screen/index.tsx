import React, { useEffect, useRef, useState } from 'react';
import { CardStyleInterpolators, createStackNavigator, StackNavigationOptions, StackScreenProps, TransitionSpecs } from '@react-navigation/stack';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import type { ParamListBase } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { blue500 } from 'react-native-paper/src/styles/colors';
import { t } from '../common/tools';
import { Home } from './Home';
import { ModalScreens, ModalScreensRoot } from './ModalScreens';
import { CardScreens, ScreensParamList } from './CardScreens';
import { Animated, View, Easing } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Profile } from './Profile';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BottomIconSize = 22;
const RootStack = createStackNavigator();
const BottomTabStack = createMaterialBottomTabNavigator();
const MainStack = createStackNavigator<ScreensParamList>();

const BottomTabs = observer(() => {
  const { colors } = useTheme();

  return (
    <BottomTabStack.Navigator backBehavior="none" shifting={false} activeColor={blue500} barStyle={{ backgroundColor: colors.background, height: 60 }}>
      <BottomTabStack.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: t('tabs.home'),
          tabBarIcon: ({ focused, color }) => {
            console.log(focused);
            return <Icon name={focused ? 'person' : 'account-circle'} color={color} size={BottomIconSize} />;
          }

          // tabBarIcon: ({ focused }) => {
          //   // iconRef.current?.play();
          //   // Animated.timing(progress1, {
          //   //   toValue: progress1 ? 0 : 1,
          //   //   duration: 3000,
          //   //   useNativeDriver: true
          //   // }).start(() => {
          //   //   progress1.setValue(progress1 ? 0 : 1);
          //   // });
          //   console.log(focused, progress1);
          //   return (
          //     <LottieView
          //       ref={iconRef}
          //       autoPlay={false}
          //       style={[{ width: example.width }]}
          //       // styles.lottieViewInvse
          //       source={example.getSource()}
          //       progress={focused ? progress1 : undefined}
          //       loop={false}
          //       onAnimationFinish={onAnimationFinish}
          //       enableMergePathsAndroidForKitKatAndAbove
          //       renderMode={renderMode}
          //     />
          //   );
          // }
        }}
      />
      <BottomTabStack.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: t('tabs.profile'),
          // tabBarBadge: userStore.msg,
          tabBarIcon: ({ focused, color }) => <Icon name={focused ? 'person' : 'account-circle'} color={color} size={BottomIconSize} />
          // tabBarIcon: ({ focused, color }) => <Lottie source={require('../path/to/animation.json')} progress={animationProgress.current} />
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
          options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
        />
      ))}
    </MainStack.Navigator>
  );
};

const renderFallback = () => {
  return (
    <View style={{ height: '100%', justifyContent: 'center' }}>
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
        <RootStack.Screen name="Main" component={MainScreens} options={{ headerShown: false }} />
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
