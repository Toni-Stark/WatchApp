import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

export const StackBar = (props) => {
  return (
    <>
      <View style={styles.header}>
        {!props?.noTitle ? (
          <TouchableOpacity onPress={props.onBack}>
            <FastImage style={styles.image} source={require('../../assets/home/back.png')} />
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {props?.search ? (
          <View style={styles.searchView}>
            <TextInput style={styles.input} onChangeText={props.onChange} value={props.value} placeholder="查找收藏词条" />
          </View>
        ) : (
          <Text style={styles.title}>{props.title}</Text>
        )}
        {/*{!props?.noTitle ? (*/}
        {/*  <TouchableOpacity onPress={props.onHelp}>*/}
        {/*    <Text style={styles.label}>帮助</Text>*/}
        {/*  </TouchableOpacity>*/}
        {/*) : (*/}
        <View style={styles.labelView} />
        {/*)}*/}
      </View>
    </>
  );
};

let color1 = '#00D1DE';
let color2 = '#f2f2f2';
let color3 = '#EEF3F4';
let color4 = '#ffffff';
let color5 = '#D4D8DA';

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: color1,
    borderBottomColor: color2,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    position: 'relative',
    width: '100%'
  },
  image: {
    borderRadius: 60,
    height: 28,
    width: 28
  },
  input: {
    backgroundColor: color3,
    flex: 1,
    paddingVertical: 2
  },
  label: {
    color: color4,
    fontSize: 14
  },
  labelView: {
    width: 25
  },
  logo: {
    height: 28,
    marginRight: 28,
    width: 28
  },
  searchView: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 50,
    paddingHorizontal: 10,
    overflow: 'hidden',
    borderColor: color5,
    borderStyle: 'solid',
    borderWidth: 1,
    marginVertical: 2,
    backgroundColor: color3
  },
  title: {
    color: color4,
    fontSize: 17
  }
});
