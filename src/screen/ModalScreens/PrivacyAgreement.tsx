import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { SERVER_URL } from '../../common/app.config';
import { NavigatorComponentProps } from '../index';
import { t } from '../../common/tools';
import BaseView from '../../component/BaseView';

type Props = {};

export const PrivacyAgreement: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();
    let url = `${SERVER_URL}/protocol/index`;
    const goBack = async () => {
      navigation.goBack();
    };
    return (
      <BaseView useSafeArea={false} style={[tw.flex1]}>
        <Appbar.Header style={{ backgroundColor: colors.background }}>
          <Appbar.BackAction onPress={goBack} />
          <Appbar.Content title={t('aboutDetail.privacyAgree')} />
        </Appbar.Header>
        <WebView source={{ uri: url }} />
      </BaseView>
    );
  }
);
