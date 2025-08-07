import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Button from '../common/Button';
import {Colors} from '../../constants/Colors';
import {Typography} from '../../constants/Typography';
import {Layout} from '../../constants/Layout';

const {width, height} = Dimensions.get('window');

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  onButtonPress: () => void;
  backgroundImage?: string;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  description,
  buttonText,
  onButtonPress,
  backgroundImage,
}) => {
  const renderContent = () => (
    <LinearGradient
      colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)']}
      style={styles.overlay}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
        
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
        
        <Button
          title={buttonText}
          onPress={onButtonPress}
          variant="primary"
          size="large"
          style={styles.button}
        />
      </View>
    </LinearGradient>
  );

  if (backgroundImage) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={{uri: backgroundImage}}
          style={styles.backgroundImage}
          resizeMode="cover">
          {renderContent()}
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.solidBackground]}>
      <View style={styles.content}>
        <Text style={[styles.title, {color: Colors.text}]}>{title}</Text>
        
        {subtitle && (
          <Text style={[styles.subtitle, {color: Colors.textSecondary}]}>
            {subtitle}
          </Text>
        )}
        
        {description && (
          <Text style={[styles.description, {color: Colors.textSecondary}]}>
            {description}
          </Text>
        )}
        
        <Button
          title={buttonText}
          onPress={onButtonPress}
          variant="primary"
          size="large"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: height * 0.5,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  solidBackground: {
    backgroundColor: Colors.surface,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Layout.spacing.xl,
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
    lineHeight: Typography.lineHeight['4xl'],
  },
  subtitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
    lineHeight: Typography.lineHeight.xl,
  },
  description: {
    fontSize: Typography.fontSize.base,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Layout.spacing['2xl'],
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  button: {
    paddingHorizontal: Layout.spacing['2xl'],
  },
});

export default HeroBanner;