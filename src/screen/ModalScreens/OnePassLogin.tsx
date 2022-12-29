import React, { useRef } from 'react';
import { useTheme } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import BaseView from '../../component/BaseView';
import RNBootSplash from 'react-native-bootsplash';
import { Text, View } from 'react-native';

export type Props = {};
export const OnePassLogin: React.FunctionComponent<Props> = observer((props) => {
  const { colors } = useTheme();
  const loading = useRef<any>(undefined);
  RNBootSplash.hide();

  return (
    <BaseView useSafeArea={false} ref={loading}>
      <View>
        <Text>微信登录</Text>
      </View>
    </BaseView>
  );
});
