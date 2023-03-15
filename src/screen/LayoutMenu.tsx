import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useStore } from '../store';

export const LayoutMenu = () => {
  let image = require('../assets/logo.png');
  const { weChatStore } = useStore();
  const { avatar, nickname } = weChatStore.userInfo;
  if (avatar) image = { uri: avatar };
  return (
    <View style={styles.content}>
      <View style={styles.context}>
        <View style={styles.moduleView}>
          <View style={styles.fastView}>
            <FastImage style={styles.labelIcon} source={image} resizeMode={FastImage.resizeMode.cover} />
          </View>
          <View style={styles.labelView}>
            <Text style={styles.textView}>{nickname}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

let color1 = '#ffffff';
let color2 = '#00D1DE';
let color3 = '#f1f1f1';
let color4 = '#242424';
const styles = StyleSheet.create({
  content: {
    backgroundColor: color2,
    height: '100%',
    padding: 8
  },
  context: {
    backgroundColor: color1,
    borderRadius: 10,
    flex: 1,
    padding: 8
  },
  fastView: {
    alignItems: 'center',
    backgroundColor: color3,
    borderRadius: 200,
    display: 'flex',
    height: 50,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 50
  },
  labelIcon: {
    borderRadius: 200,
    height: 46,
    width: 46
  },
  labelView: {
    alignItems: 'center',
    flex: 1
  },
  moduleView: {
    alignItems: 'center',
    backgroundColor: color2,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingVertical: 10
  },
  textView: {
    color: color1,
    fontSize: 23,
    fontWeight: 'bold'
  }
});
