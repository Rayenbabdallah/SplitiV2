import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolateColor,
  runOnJS
} from 'react-native-reanimated';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
}

export default function AnimatedButton({
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary',
  disabled = false,
  icon,
  loading = false
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const backgroundProgress = useSharedValue(0);

  const handlePressIn = () => {
    if (disabled || loading) return;
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    backgroundProgress.value = withTiming(1, { duration: 150 });
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    backgroundProgress.value = withTiming(0, { duration: 150 });
  };

  const handlePress = () => {
    if (disabled || loading) return;
    runOnJS(onPress)();
  };

  const getColors = () => {
    switch (variant) {
      case 'primary':
        return {
          background: '#2563EB',
          pressedBackground: '#1D4ED8',
          text: '#FFFFFF',
          border: '#2563EB'
        };
      case 'secondary':
        return {
          background: '#F1F5F9',
          pressedBackground: '#E2E8F0',
          text: '#0F172A',
          border: '#E2E8F0'
        };
      case 'outline':
        return {
          background: '#FFFFFF',
          pressedBackground: '#F8FAFC',
          text: '#2563EB',
          border: '#2563EB'
        };
      default:
        return {
          background: '#2563EB',
          pressedBackground: '#1D4ED8',
          text: '#FFFFFF',
          border: '#2563EB'
        };
    }
  };

  const colors = getColors();

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      backgroundProgress.value,
      [0, 1],
      [colors.background, colors.pressedBackground]
    );

    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
      opacity: disabled ? 0.5 : opacity.value,
    };
  });

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={1}
      disabled={disabled || loading}
    >
      <Animated.View style={[
        styles.button,
        { borderColor: colors.border },
        variant === 'outline' && styles.outlineButton,
        animatedStyle,
        style
      ]}>
        {icon && <Animated.View style={styles.icon}>{icon}</Animated.View>}
        <Text style={[
          styles.text,
          { color: colors.text },
          textStyle
        ]}>
          {loading ? 'Loading...' : title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  outlineButton: {
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  icon: {
    marginRight: 8,
  },
});