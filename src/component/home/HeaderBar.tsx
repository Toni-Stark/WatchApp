import React from 'react';
import { StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { tw } from 'react-native-tailwindcss';

export const HeaderBar = (props) => {
  return (
    <>
      <View style={[tw.flexRow, tw.pX3, tw.pY2, tw.itemsCenter, tw.justifyBetween, [{ backgroundColor: '#00D1DE' }], styles.header]}>
        <TouchableWithoutFeedback onPress={props.openLayout}>
          {/*<FastImage*/}
          {/*  style={[tw.w8, tw.h8, { borderRadius: 50 }]}*/}
          {/*  source={require('../../assets/home/header-assets.png')}*/}
          {/*  resizeMode={FastImage.resizeMode.cover}*/}
          {/*/>*/}
          <View style={[tw.w8, tw.h8]} />
        </TouchableWithoutFeedback>
        {props?.search ? (
          <View style={[tw.flexRow, tw.mX1, tw.borderR5, tw.pX1, tw.borderB2]}>
            <TextInput style={[tw.pY1]} onChangeText={props.onChange} value={props.value} placeholder="查找收藏词条" />
          </View>
        ) : (
          <Text style={styles.textStyle}>数据面板</Text>
        )}
        <View>
          {/*<FastImage style={[tw.w8, tw.h8, { borderRadius: 50 }]} source={require('../../assets/home/share.png')} resizeMode={FastImage.resizeMode.cover} />*/}
          <View style={[tw.w8, tw.h8]} />
        </View>
      </View>
    </>
  );
};

let color1 = '#f2f2f2';
let color2 = '#ffffff';
const styles = StyleSheet.create({
  header: {
    borderBottomColor: color1,
    borderBottomWidth: 1,
    borderStyle: 'solid'
  },
  textStyle: { color: color2, fontSize: 17, fontWeight: 'bold', height: 43, lineHeight: 43 }
});
