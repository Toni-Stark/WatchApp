import React, { useState } from 'react';
import LottieView from 'lottie-react-native';
import { AnimatedLottieViewProps } from 'lottie-react-native/packages/core/lib/typescript/LottieView.types';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { EXAMPLES } from '../../lottie/constants';

export const TabBar = ({ state, descriptors, navigation }) => {
  // console.log('state', state);
  // console.log('descriptors', descriptors);
  // console.log('navigation', navigation);
  let list: any = [];
  state.routes.map(() => {
    list.push(new Animated.Value(0));
  });
  const [progress] = useState(list);
  const [renderMode] = useState<AnimatedLottieViewProps['renderMode']>('AUTOMATIC');
  return (
    <View style={styles.tabStyle}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
        const onPress = function () {
          Animated.timing(progress[index], {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true
          }).start();
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            // accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            style={styles.btnStyle}
            onPress={onPress}
          >
            <View style={{ height: 25, width: 25 }}>
              <LottieView
                autoPlay={false}
                style={[{ width: EXAMPLES[index].width }]}
                source={route.name === 'Home' ? EXAMPLES[index].getSource() : EXAMPLES[index].getSource()}
                progress={isFocused ? progress[index] : undefined}
                loop={false}
                enableMergePathsAndroidForKitKatAndAbove
                renderMode={renderMode}
              />
            </View>
            <Text style={{ color: isFocused ? activeColor : disableColor }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
const backColor = '#ffffff';
const bTopColor = '#efefef';
const borderColor = '#ffffff';
const activeColor = '#00D1DE';
const disableColor = '#666666';
const styles = StyleSheet.create({
  btnStyle: { alignItems: 'center', backgroundColor: backColor, borderColor: borderColor, borderWidth: 1, flex: 1, justifyContent: 'center' },
  tabStyle: { borderColor: bTopColor, borderStyle: 'solid', borderTopWidth: 1, flexDirection: 'row', height: 60 }
});
