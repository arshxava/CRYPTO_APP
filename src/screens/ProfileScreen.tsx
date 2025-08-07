import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {RootStackScreenProps} from '../types/Navigation';
import {Colors} from '@/constants/Colors';
import {Typography} from '@/constants/Typography';

type ProfileScreenProps = RootStackScreenProps<'Profile'>;

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.placeholder}>Profile implementation coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: 20,
  },
  placeholder: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default ProfileScreen;