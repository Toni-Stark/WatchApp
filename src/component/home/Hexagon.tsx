import React from 'react';
import { StyleSheet, View } from 'react-native';

export const Hexagon = (props) => {
  return (
    <View style={styles.first}>
      <View style={styles.second}>
        <View style={[styles.third, { backgroundColor: props.color }]}>
          {props.border ? (
            <View style={[styles.first, { width: 32, height: 28 }]}>
              <View style={styles.second}>
                <View style={[styles.third, { backgroundColor: '#f2f2f2' }]}>{props.children}</View>
              </View>
            </View>
          ) : (
            props.children
          )}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  first: { height: 40, overflow: 'hidden', transform: [{ rotateZ: '120deg' }], width: 32 },
  second: {
    height: '100%',
    overflow: 'hidden',
    transform: [{ rotateZ: '-60deg' }],
    width: '100%'
  },
  third: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    transform: [{ rotateZ: '-60deg' }],
    width: '100%'
  }
});
