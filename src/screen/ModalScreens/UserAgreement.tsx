import React from 'react';
import { NavigatorComponentProps } from '../index';
import { WebView } from 'react-native-webview';
import BaseView from '../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { Appbar, useTheme } from 'react-native-paper';
import { t } from '../../common/tools';
import { observer } from 'mobx-react-lite';
import { SERVER_URL } from '../../common/app.config';

type Props = {};

export const UserAgreement: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();
    let url = `${SERVER_URL}/apic/protocol/index`;
    const goBack = async () => {
      navigation.goBack();
    };
    return (
      <BaseView useSafeArea={false} style={[tw.flex1]}>
        <Appbar.Header style={{ backgroundColor: colors.background }}>
          <Appbar.BackAction onPress={goBack} />
          <Appbar.Content title={t('userFeedback.userAgree')} />
        </Appbar.Header>
        <WebView source={{ uri: url }} />
      </BaseView>
    );
  }
);
