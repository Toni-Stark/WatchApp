import * as React from 'react';
import { Button, Dialog, Portal } from 'react-native-paper';
import { StyleSheet, TextInput } from 'react-native';

export const PasswordDialog = (props) => {
  return (
    <Portal>
      <Dialog visible={props.visible} onDismiss={props.delay}>
        <Dialog.Title>验证密码</Dialog.Title>
        <Dialog.Content>
          <TextInput style={styles.textInput} placeholder="请输入设备密码" onChangeText={props.input} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={props.open}>确定</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

let color1 = '#666666';
const styles = StyleSheet.create({
  textInput: {
    borderColor: color1,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: 30,
    paddingHorizontal: 10
  }
});
