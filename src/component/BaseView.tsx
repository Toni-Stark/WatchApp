import * as React from 'react';
import { forwardRef, ForwardRefExoticComponent, useImperativeHandle, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Dialog, Modal, Portal, Snackbar, Text, useTheme } from 'react-native-paper';
import { Platform, StyleProp, View, ViewStyle, ScrollView } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { tw } from 'react-native-tailwindcss';
import { getBottomSpace, throttle } from '../common/tools';
import { Chase } from 'react-native-animated-spinkit';
import { downloadApk } from 'rn-app-upgrade';
import AnimatedBar from 'react-native-animated-bar';

interface BaseViewProps {
  ref?: any;
  useSafeArea?: boolean;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  error?: boolean;
  onRefresh?: () => void;
  onSubmit?: () => void;
  onDismiss?: () => void;
  needUpdate?: boolean;
  data?: any;
  children: React.ReactNode;
}

const BaseView: ForwardRefExoticComponent<BaseViewProps> = forwardRef(
  (props, ref): JSX.Element => {
    const { colors } = useTheme();
    const { window } = useDimensions();
    const { useSafeArea = true, scroll = false, style = {}, error = false, onRefresh = null, needUpdate = false } = props;
    const styleCopy = { backgroundColor: colors.background, height: window.height };
    Object.assign(styleCopy, style);
    const [showLoading, setShowLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('载入中...');
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState('加載中...');
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [messageDelay, setMessageDelay] = useState(5);
    const [aboveTab, setAboveTab] = useState(false);
    const [downloadSolid, setDownloadSolid] = useState<any>(undefined);
    const timer = useRef<any>();

    useImperativeHandle(
      ref,
      () => ({
        showLoading: (param?: { text?: string; delay?: number }) => {
          const delay = param?.delay || 0;
          const text = param?.text || '载入中...';
          setLoadingText(text);
          setShowLoading(true);
          if (delay > 0) {
            if (timer.current !== undefined) {
              clearTimeout(timer.current);
            }
            timer.current = setTimeout(() => {
              setShowLoading(false);
            }, 1000 * delay);
          }
        },
        hideLoading: () => {
          setShowLoading(false);
          if (timer.current !== undefined) {
            clearTimeout(timer.current);
          }
        },
        showToast: (param?: { text?: string; delay?: number }) => {
          const delay = param?.delay || 0;
          const text = param?.text || '载入中...';
          setToastText(text);
          setShowToast(true);
          if (delay > 0) {
            if (timer.current !== undefined) {
              clearTimeout(timer.current);
            }
            timer.current = setTimeout(() => {
              setShowToast(false);
            }, 1000 * delay);
          }
        },
        showMessage: (param: { text: string; delay?: number; aboveTab?: boolean }) => {
          if (param.text) {
            setAboveTab(param.aboveTab || false);
            setMessage(param.text);
            setMessageDelay(param.delay || 5);
            setShowMessage(true);
          }
        }
      }),
      []
    );

    const renderLoading = () => {
      return (
        <Portal>
          <Modal visible={showLoading} dismissable={false} onDismiss={() => setShowLoading(false)} contentContainerStyle={[tw.flexRow]}>
            <View style={[tw.justifyCenter, tw.itemsCenter, tw.roundedLg, tw.pY4, tw.pX6, { backgroundColor: colors.surface }]}>
              <Chase size={36} color={colors.primary} />
              <Text style={[tw.mT2, tw.fontLight, { fontSize: 10 }]}>{loadingText}</Text>
            </View>
          </Modal>
        </Portal>
      );
    };
    const renderToast = () => {
      return (
        <Portal>
          <Modal visible={showToast} dismissable={false} onDismiss={() => setShowToast(false)} contentContainerStyle={[tw.flexRow]}>
            <View style={[tw.justifyCenter, tw.itemsCenter, tw.roundedLg, tw.pY4, tw.pX6, { backgroundColor: colors.surface }]}>
              <Text style={[tw.fontLight, { fontSize: 14 }]}>{toastText}</Text>
            </View>
          </Modal>
        </Portal>
      );
    };

    const renderMessage = () => {
      const hackHeightOfAndroid = Platform.OS === 'android' ? 25 : 0;
      const heightOfTab = 60 + getBottomSpace() + hackHeightOfAndroid;
      return (
        <Snackbar
          style={{ marginBottom: aboveTab ? heightOfTab : hackHeightOfAndroid, backgroundColor: colors.background }}
          visible={showMessage}
          duration={messageDelay * 1000}
          onDismiss={() => {
            setShowMessage(false);
            setMessage('');
          }}
          action={{
            label: '关闭',
            onPress: () => {
              setShowMessage(false);
              setMessage('');
            }
          }}
        >
          <Text>{message}</Text>
        </Snackbar>
      );
    };

    const handleRefresh = () => {
      if (onRefresh !== null) {
        onRefresh();
      }
    };
    const updateDevices = async () => {
      downloadApk({
        interval: 666, // listen to upload progress event, emit every 666ms
        apkUrl: props.data.url,
        downloadInstall: true,
        callback: {
          onProgress: (received, total, percent) => {
            setDownloadSolid({
              received,
              total,
              percent,
              count: percent ? percent / 100 : 0
            });
          },
          onFailure: (errorMessage, statusCode) => {
            console.log(errorMessage, statusCode, '错误内容');
          },
          onComplete: () => {
            console.log('下载完成');
            dismiss();
          }
        }
      });
    };
    let dismiss = async () => {
      if (downloadSolid) {
        return;
      }
      if (props?.onDismiss) {
        await props.onDismiss();
      }
    };
    let submit = async () => {
      if (props?.onSubmit) {
        props.onSubmit();
        await updateDevices();
      }
    };
    const globalUpdateDialog = () => {
      if (!props?.data?.ver) {
        return null;
      }

      return (
        <Portal>
          <Dialog visible={needUpdate} onDismiss={() => dismiss()}>
            <Dialog.Title>重要更新</Dialog.Title>
            {downloadSolid ? (
              <Dialog.Content>
                <View style={[tw.flexRow, [{ width: '100%' }]]}>
                  <View style={[tw.flexCol, [{ flex: 1 }]]}>
                    <AnimatedBar
                      progress={downloadSolid?.count || 0}
                      barColor="#00D1DE"
                      borderColor="#00bac4"
                      fillStyle={{ backgroundColor: '#ffffff', borderRadius: 8 }}
                      wrapStyle={{ borderRadius: 8 }}
                      barStyle={{ borderRadius: 7 }}
                      height={16}
                      duration={600}
                    />
                  </View>
                  <View style={{ marginLeft: 10, width: 40 }}>
                    <Text>{downloadSolid?.percent}%</Text>
                  </View>
                </View>
              </Dialog.Content>
            ) : (
              <Dialog.Content>
                <Text>为了您的正常使用，建议立即更新最新版本的智能手表App v{props?.data.ver}</Text>
                {props.data?.desc ? (
                  <View style={[tw.mT5]}>
                    <Text>更新内容</Text>
                    <Text>{props.data.desc}</Text>
                  </View>
                ) : null}
              </Dialog.Content>
            )}
            <Dialog.Actions>
              {downloadSolid ? (
                <View style={[tw.flex1, tw.flexRow, tw.justifyCenter, tw.pB5]}>
                  <Text style={{ fontSize: 15 }}>
                    {downloadSolid.received} / {downloadSolid.total}
                  </Text>
                </View>
              ) : (
                <Button onPress={() => submit()}>更新</Button>
              )}
            </Dialog.Actions>
          </Dialog>
        </Portal>
      );
    };

    const renderContent = () => {
      if (error) {
        return (
          <View style={[tw.flex1, tw.itemsCenter, tw.justifyCenter, tw.m16, tw.pB24]}>
            <Text style={[tw.mT4]}>网络异常，请重试！</Text>
            <Button mode="contained" icon="wifi-strength-alert-outline" style={[tw.mT4]} onPress={throttle(handleRefresh)}>
              重试
            </Button>
          </View>
        );
      } else {
        if (scroll) {
          return (
            <ScrollView overScrollMode="always" style={{ ...styleCopy }}>
              {props.children}
            </ScrollView>
          );
        } else {
          return props.children;
        }
      }
    };

    if (useSafeArea) {
      return (
        <SafeAreaView style={{ ...styleCopy }}>
          {renderContent()}
          {renderLoading()}
          {renderToast()}
          {renderMessage()}
          {globalUpdateDialog()}
        </SafeAreaView>
      );
    }
    return (
      <View style={{ ...styleCopy }}>
        {renderContent()}
        {renderLoading()}
        {renderToast()}
        {renderMessage()}
        {globalUpdateDialog()}
      </View>
    );
  }
);

export default BaseView;
