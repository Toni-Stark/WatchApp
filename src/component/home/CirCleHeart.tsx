import React, { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Animated } from 'react-native';

export const CirCleHeart = forwardRef((props, ref) => {
  let valueSize: any = new Animated.Value(170);

  useImperativeHandle(
    ref,
    () => ({
      animate: async () => {
        await Animated.loop(
          await Animated.sequence([
            await Animated.parallel([
              await Animated.timing(valueSize, {
                toValue: 260,
                duration: 2000,
                useNativeDriver: false
              })
            ]),
            await Animated.parallel([
              await Animated.timing(valueSize, {
                toValue: 170,
                duration: 2000,
                useNativeDriver: false
              })
            ])
          ])
        ).start();
      }
    }),
    []
  );
  return (
    <Animated.View
      style={[
        styles.circleMaxView,
        {
          width: valueSize,
          height: valueSize
        }
      ]}
    />
  );
});

const styles = StyleSheet.create({
  circleMaxView: {
    backgroundColor: 'rgba(15,233,252,0.89)',
    borderRadius: 200,
    height: 170,
    position: 'absolute',
    width: 170
  }
});
