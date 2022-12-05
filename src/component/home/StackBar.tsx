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
        {!props?.noTitle ? (
          <TouchableOpacity onPress={props.onHelp}>
            <Text style={styles.label}>帮助</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: '#00D1DE',
    borderBottomColor: '#f2f2f2',
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
    backgroundColor: '#EEF3F4',
    flex: 1,
    paddingVertical: 2
  },
  label: {
    color: '#ffffff',
    fontSize: 14
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
    borderColor: '#D4D8DA',
    borderStyle: 'solid',
    borderWidth: 1,
    marginVertical: 2,
    backgroundColor: '#EEF3F4'
  },
  title: {
    color: '#ffffff',
    fontSize: 17
  }
});
