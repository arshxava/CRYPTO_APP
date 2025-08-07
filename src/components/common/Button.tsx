import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import {Colors} from '@/constants/Colors';
import {Typography} from '@/constants/Typography';
import {Layout} from '@/constants/Layout';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...styles[`${size}Button`],
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.gray400 : Colors.buttonPrimary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.gray300 : Colors.buttonSecondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? Colors.gray400 : Colors.buttonPrimary,
        };
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          paddingHorizontal: 8,
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.gray400 : Colors.buttonDanger,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...styles.buttonText,
      ...styles[`${size}ButtonText`],
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          color: disabled ? Colors.gray600 : Colors.white,
        };
      case 'secondary':
        return {
          ...baseStyle,
          color: disabled ? Colors.gray600 : Colors.white,
        };
      case 'outline':
        return {
          ...baseStyle,
          color: disabled ? Colors.gray400 : Colors.buttonPrimary,
        };
      case 'text':
        return {
          ...baseStyle,
          color: disabled ? Colors.gray400 : Colors.buttonPrimary,
        };
      case 'danger':
        return {
          ...baseStyle,
          color: disabled ? Colors.gray600 : Colors.white,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'text' ? Colors.buttonPrimary : Colors.white}
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: Layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  smallButton: {
    height: Layout.button.heightSmall,
    paddingHorizontal: Layout.spacing.md,
  },
  mediumButton: {
    height: Layout.button.height,
    paddingHorizontal: Layout.spacing.lg,
  },
  largeButton: {
    height: Layout.button.heightLarge,
    paddingHorizontal: Layout.spacing.xl,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: Typography.fontWeight.semibold,
  },
  smallButtonText: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.sm,
  },
  mediumButtonText: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.lineHeight.base,
  },
  largeButtonText: {
    fontSize: Typography.fontSize.lg,
    lineHeight: Typography.lineHeight.lg,
  },
});

export default Button;