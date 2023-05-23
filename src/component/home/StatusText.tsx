import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const StatusText = (props) => {
  const { dataLogCat, info } = props;
  let isNull = true;
  let isOut = false;
  if (info) {
    isOut = true;
  }
  for (let i in dataLogCat) {
    if (dataLogCat.hasOwnProperty(i) && dataLogCat[i] !== null) {
      isNull = false;
    }
  }
  return (
    <View style={styles.loadingView}>
      {isOut && isNull ? <Text style={[styles.labelColor, styles.labelReady]}>正在读取数据...</Text> : null}
      {/*{!isOut && isNull ? <Text style={[styles.labelColor, styles.labelReady]}>正在重连设备...</Text> : null}*/}
      {/*<Text style={[styles.labelColor, styles.labelRe]}>: {blueToothStore.dataLogCat.power ? '读取中' : '已完成'}</Text>*/}
      {dataLogCat.power !== null ? <Text style={[styles.labelColor, styles.labelRe]}>设备电量：{dataLogCat.power ? '读取中' : '已完成'}</Text> : null}
      {dataLogCat.list !== null ? <Text style={[styles.labelColor, styles.labelRe]}>实时数据：{dataLogCat.list ? '读取中' : '已完成'}</Text> : null}
      {dataLogCat.battery !== null ? <Text style={[styles.labelColor, styles.labelRe]}>实时体温：{dataLogCat.battery ? '读取中' : '已完成'}</Text> : null}
      {dataLogCat['new-date'] !== null ? (
        <Text style={[styles.labelColor, styles.labelRe]}>实时数据：{dataLogCat['new-date'] ? '读取中' : '已完成'}</Text>
      ) : null}
      {dataLogCat.temperature !== null ? (
        <Text style={[styles.labelColor, styles.labelRe]}>实时血压：{dataLogCat.temperature ? '读取中' : '已完成'}</Text>
      ) : null}
      {dataLogCat['heart-jump'] !== null ? (
        <Text style={[styles.labelColor, styles.labelRe]}>实时心率：{dataLogCat['heart-jump'] ? '读取中' : '已完成'}</Text>
      ) : null}
    </View>
  );
};

let color3 = '#EEF3F4';

const styles = StyleSheet.create({
  labelColor: {
    color: color3
  },
  labelRe: {
    fontSize: 15
  },
  labelReady: {
    fontSize: 18
  },
  loadingView: {
    flex: 1,
    paddingHorizontal: 20
  }
});
