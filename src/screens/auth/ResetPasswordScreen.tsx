import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';

import {AuthStackScreenProps} from '../../types/Navigation';
import {Colors} from '../../constants/Colors';
import {Typography} from '../../constants/Typography';
import {Layout} from '../../constants/Layout';

import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

type ResetPasswordScreenProps = AuthStackScreenProps<'ResetPassword'>;

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({navigation, route}) => {
  const {token} = route.params;
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      password: '',
      confirmPassword: '',
    };

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Password Reset Successful',
        'Your password has been successfully reset. You can now sign in with your new password.',
        [
          {
            text: 'Sign In',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      
      <View style={styles.header}>
        <Text style={styles.title}>New Password</Text>
        <Text style={styles.subtitle}>
          Enter your new password below.
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="New Password"
          placeholder="Enter new password"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry
          error={errors.password}
          leftIcon="lock-closed"
          required
        />

        <Input
          label="Confirm New Password"
          placeholder="Confirm new password"
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange('confirmPassword', value)}
          secureTextEntry
          error={errors.confirmPassword}
          leftIcon="lock-closed"
          required
        />

        <View style={styles.passwordRequirements}>
          <Text style={styles.requirementsTitle}>Password Requirements:</Text>
          <Text style={styles.requirementText}>• At least 8 characters</Text>
          <Text style={styles.requirementText}>• One uppercase letter</Text>
          <Text style={styles.requirementText}>• One lowercase letter</Text>
          <Text style={styles.requirementText}>• One number</Text>
        </View>

        <Button
          title="Reset Password"
          onPress={handleResetPassword}
          loading={isLoading}
          disabled={isLoading}
          fullWidth
          style={styles.resetButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Remember your password? </Text>
        <Button
          title="Sign In"
          onPress={() => navigation.navigate('Login')}
          variant="text"
          style={styles.signInButton}
          textStyle={styles.signInButtonText}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing['2xl'],
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing['2xl'],
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    marginBottom: Layout.spacing.xl,
  },
  passwordRequirements: {
    backgroundColor: Colors.surface,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.md,
  },
  requirementsTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  requirementText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.xs,
  },
  resetButton: {
    marginTop: Layout.spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  signInButton: {
    paddingHorizontal: 0,
  },
  signInButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
});

export default ResetPasswordScreen;