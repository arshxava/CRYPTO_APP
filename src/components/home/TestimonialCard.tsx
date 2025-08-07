import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {Colors} from '@/constants/Colors';
import {Typography} from '@/constants/Typography';
import {Layout} from '@/constants/Layout';

interface TestimonialCardProps {
  name: string;
  review: string;
  rating: number;
  style?: ViewStyle;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  review,
  rating,
  style,
}) => {
  const renderStars = () => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map(star => (
        <Icon
          key={star}
          name="star"
          size={16}
          color={star <= rating ? Colors.warning : Colors.gray300}
          style={styles.star}
        />
      ))}
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {renderStars()}
      <Text style={styles.review}>"{review}"</Text>
      <Text style={styles.name}>-- {name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 180,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  star: {
    marginRight: Layout.spacing.xs,
  },
  review: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: 24,
    fontStyle: 'italic',
    flex: 1,
    marginBottom: Layout.spacing.md,
  },
  name: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
});

export default TestimonialCard;