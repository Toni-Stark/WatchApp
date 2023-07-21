import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useState } from 'react';

interface PropsType {
  data: any;
  cate?: any;
  value?: string;
  noBorder?: boolean;
  onPress: (val: any) => void;
  navigate: () => void;
}
export const RightSlideTab = (props): JSX.Element => {
  const { data, value, cate, onPress, navigate, noBorder }: PropsType = props;
  return (
    <TouchableOpacity style={styles.itemStyle} onPress={navigate}>
      {data.image ? <FastImage style={styles.imageIcon} source={data.image} /> : null}
      <View style={[styles.itemData, !noBorder ? styles.borderB : styles.borderNull]}>
        <Text style={styles.itemName}>{data.name}</Text>
        {data.type === 'switch' ? (
          <Switch
            trackColor={{ false: '#eceaea', true: '#00D1DE' }}
            thumbColor={cate ? '#ffffff' : '#ffffff'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              onPress(!cate);
            }}
            value={cate}
          />
        ) : (
          <View style={styles.textView}>
            <Text style={styles.textStyle}>{value}</Text>
            <FastImage style={styles.rightIcon} source={require('../../assets/home/right-gray.png')} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

let color1 = '#ffffff';
let color3 = '#e3e3e3';
const styles = StyleSheet.create({
  borderB: {
    borderBottomWidth: 0.3
  },
  borderNull: {
    borderWidth: 0
  },
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
