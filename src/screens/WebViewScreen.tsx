import React from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {RootStackScreenProps} from '../types/Navigation';
import {Colors} from '@/constants/Colors';

type WebViewScreenProps = RootStackScreenProps<'WebView'>;

const WebViewScreen: React.FC<WebViewScreenProps> = ({route}) => {
  const {url} = route.params;

  return (
    <View style={styles.container}>
      <WebView
        source={{uri: url}}
        style={styles.webview}
        startInLoadingState={true}
        scalesPageToFit={true}
        bounces={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  webview: {
    flex: 1,
  },
});

export default WebViewScreen;