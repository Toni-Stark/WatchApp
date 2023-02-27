import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

export const RightSlideTab = (props): JSX.Element => {
  const { data, cate, onPress } = props;
  return (
    <TouchableOpacity style={styles.itemStyle} onPress={onPress}>
      {data.image ? <FastImage style={styles.imageIcon} source={data.image} /> : null}
      <View style={[styles.itemData, cate ? styles.borderB : styles.borderNull]}>
        <Text style={styles.itemName}>{data.name}</Text>
        <View style={styles.textView}>
          <Text style={styles.textStyle}>{data.value}</Text>
          <FastImage style={styles.rightIcon} source={require('../../assets/home/right-gray.png')} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

let color1 = '#ffffff';
let color2 = '#00D1DE';
let color3 = '#e3e3e3';
let color4 = '#a6a6a6';
const styles = StyleSheet.create({
  imageIcon: {
    height: 30,
    marginRight: 15,
    width: 30
  },
  itemData: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    borderColor: color3,
    justifyContent: 'space-between',
    paddingRight: 15
  },
  borderNull: {
    borderWidth: 0
  },
  borderB: {
    borderBottomWidth: 0.3
  },
  itemName: {
    fontSize: 15
  },
  itemStyle: {
    alignItems: 'center',
    backgroundColor: color1,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    paddingLeft: 15
  },
  rightIcon: {
    height: 16,
    width: 16
  },
  textStyle: {
    fontSize: 15,
    marginRight: 10
  },
  textView: {
    alignItems: 'center',
    flexDirection: 'row'
  }
});
