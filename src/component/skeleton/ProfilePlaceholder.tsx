import React from 'react';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { View } from 'react-native';
import { tw } from 'react-native-tailwindcss';

export const ProfilePlaceholder = (): JSX.Element => {
  const renderContent = (counts: number) => {
    const view: Array<JSX.Element> = [];
    for (let i = 0; i < counts; i++) {
      const percent = Math.ceil(50 + Math.random() * 50);
      view.push(
        <Placeholder key={i} Animation={Fade}>
          <PlaceholderLine width={percent} />
          <PlaceholderLine />
        </Placeholder>
      );
    }
    return view;
  };

  return (
    <View style={[tw.m4]}>
      <Placeholder Animation={Fade}>
        <Placeholder Animation={Fade} style={{ marginBottom: 20, marginLeft: 110 }}>
          <View style={{ marginTop: 40 }}></View>
        </Placeholder>
      </Placeholder>
      <PlaceholderLine height={100} style={{ marginBottom: 30, marginTop: 20, borderRadius: 5 }} />
      {renderContent(5)}
    </View>
  );
};
