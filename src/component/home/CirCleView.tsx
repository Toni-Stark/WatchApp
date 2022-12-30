import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Circle, Svg } from 'react-native-svg';

const AnimatedCircle: any = Animated.createAnimatedComponent(Circle);
export const CirCleView = (props) => {
  const dashArray = [Math.PI * 2 * 102];
  let scale: any = new Animated.Value(Math.PI * 2 * 102);
  const useCircle = useMemo(() => {
    const config: any = {
      toValue: Math.PI * 2 * (props.target || 102),
      duration: 1500,
      useNativeDriver: true
    };
    Animated.timing(scale, config).start();
    return (
      <AnimatedCircle
        cx="119"
        cy="120"
        r="102"
        stroke="#ffffff"
        strokeWidth="8"
        strokeLinecap="round"
        fill="transparent"
        strokeDasharray={dashArray}
        strokeDashoffset={scale}
        transform={`rotate(-90, 119, 120)`}
      />
    );
  }, [props.target]);

  return (
    <View>
      <FastImage style={styles.headerImage} source={require('../../assets/home/watch-banner.jpg')} />
      <Svg height="240" width="240">
        {useCircle}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    height: 240,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 240
  }
});
