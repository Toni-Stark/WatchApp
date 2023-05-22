import React from 'react';
import { Button } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { Text } from 'react-native';
import { ScreenComponent } from '../index';
import { t } from '../../common/tools';
import BaseView from '../../component/BaseView';

export const NotFound: ScreenComponent = observer(
  ({ navigation }): JSX.Element => {
    return (
      <BaseView>
        <Text>{t('notFound.noPage')}</Text>
        <Button mode="contained" onPress={() => navigation.navigate('Home')}>
          {t('notFound.goHome')}
        </Button>
      </BaseView>
    );
  }
);
