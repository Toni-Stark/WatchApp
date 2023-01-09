import * as React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

export const PortalDialog = (props) => {
  return (
    <Portal>
      <Dialog visible={props.visible} onDismiss={props.delay}>
        <Dialog.Title>提示</Dialog.Title>
        <Dialog.Content>
          <Text style={{ fontSize: 16 }}>{props.context}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={props.open}>确定</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
