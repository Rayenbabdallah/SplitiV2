import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  delay?: number;
  enableHover?: boolean;
}

export default function AnimatedCard({
  children,
  style,
  onPress,
  delay = 0,
  enableHover = true
}: AnimatedCardProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const shadowOpacity = useSharedValue(0.05);
  const mounted = useSharedValue(0);

  React.useEffect(() => {
    mounted.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
      delay: delay
    });
  }, [delay]);

  const handlePressIn = () => {
    if (!enableHover || !onPress) return;
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    translateY.value = withSpring(-2, { damping: 15, stiffness: 300 });
    shadowOpacity.value = withTiming(0.15, { duration: 150 });
  };

  const handlePressOut = () => {
    if (!enableHover || !onPress) return;
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 300 });
    shadowOpacity.value = withTiming(0.05, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      mounted.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    );

    const translateYValue = interpolate(
      mounted.value,
      [0, 1],
      [20, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value + translateYValue }
      ],
      opacity,
      shadowOpacity: shadowOpacity.value,
    };
  });

  const CardComponent = onPress ? Animated.createAnimatedComponent(View) : Animated.View;

  return (
    <CardComponent
      style={[styles.card, animatedStyle, style]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onPress={onPress}
    >
      {children}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
});