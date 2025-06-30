import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import { DollarSign, Users, Receipt } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  // Animation values
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(30);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);
  const backgroundOpacity = useSharedValue(1);
  const iconScale1 = useSharedValue(0);
  const iconScale2 = useSharedValue(0);
  const iconScale3 = useSharedValue(0);
  const iconRotation1 = useSharedValue(0);
  const iconRotation2 = useSharedValue(0);
  const iconRotation3 = useSharedValue(0);
  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(0.1);

  React.useEffect(() => {
    // Start the animation sequence
    const startAnimation = () => {
      // Background circle animation
      circleScale.value = withSpring(1, { damping: 15, stiffness: 100 });
      circleOpacity.value = withTiming(0.05, { duration: 800 });

      // Logo scale and fade in
      logoScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 150 }));
      logoOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));

      // Text animations
      textOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
      textTranslateY.value = withDelay(600, withSpring(0, { damping: 15, stiffness: 200 }));

      // Tagline animation
      taglineOpacity.value = withDelay(900, withTiming(1, { duration: 400 }));
      taglineTranslateY.value = withDelay(900, withSpring(0, { damping: 15, stiffness: 200 }));

      // Floating icons animation
      iconScale1.value = withDelay(1200, withSpring(1, { damping: 10, stiffness: 150 }));
      iconScale2.value = withDelay(1400, withSpring(1, { damping: 10, stiffness: 150 }));
      iconScale3.value = withDelay(1600, withSpring(1, { damping: 10, stiffness: 150 }));

      // Icon rotations
      iconRotation1.value = withDelay(1200, withSpring(360, { damping: 15, stiffness: 100 }));
      iconRotation2.value = withDelay(1400, withSpring(-360, { damping: 15, stiffness: 100 }));
      iconRotation3.value = withDelay(1600, withSpring(360, { damping: 15, stiffness: 100 }));

      // Exit animation
      setTimeout(() => {
        backgroundOpacity.value = withTiming(0, { duration: 500 }, () => {
          runOnJS(onAnimationComplete)();
        });
      }, 2800);
    };

    startAnimation();
  }, []);

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const circleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
    opacity: circleOpacity.value,
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  const icon1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale1.value },
      { rotate: `${iconRotation1.value}deg` }
    ],
  }));

  const icon2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale2.value },
      { rotate: `${iconRotation2.value}deg` }
    ],
  }));

  const icon3AnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale3.value },
      { rotate: `${iconRotation3.value}deg` }
    ],
  }));

  return (
    <Animated.View style={[styles.container, backgroundAnimatedStyle]}>
      {/* Background Circle */}
      <Animated.View style={[styles.backgroundCircle, circleAnimatedStyle]} />
      
      {/* Floating Icons */}
      <Animated.View style={[styles.floatingIcon, styles.icon1, icon1AnimatedStyle]}>
        <DollarSign size={24} color="#2563EB" />
      </Animated.View>
      
      <Animated.View style={[styles.floatingIcon, styles.icon2, icon2AnimatedStyle]}>
        <Users size={20} color="#059669" />
      </Animated.View>
      
      <Animated.View style={[styles.floatingIcon, styles.icon3, icon3AnimatedStyle]}>
        <Receipt size={22} color="#7C3AED" />
      </Animated.View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logoIcon}>
            <DollarSign size={48} color="#FFFFFF" />
          </View>
        </Animated.View>

        {/* App Name */}
        <Animated.View style={textAnimatedStyle}>
          <Text style={styles.appName}>Spliti</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={taglineAnimatedStyle}>
          <Text style={styles.tagline}>Split expenses, share moments</Text>
        </Animated.View>
      </View>

      {/* Bottom Gradient */}
      <View style={styles.bottomGradient} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundCircle: {
    position: 'absolute',
    width: width * 2,
    height: width * 2,
    borderRadius: width,
    backgroundColor: '#2563EB',
    top: -width * 0.5,
  },
  content: {
    alignItems: 'center',
    zIndex: 2,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoIcon: {
    transform: [{ rotate: '-15deg' }],
  },
  appName: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  floatingIcon: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  icon1: {
    top: height * 0.25,
    left: width * 0.15,
  },
  icon2: {
    top: height * 0.35,
    right: width * 0.12,
  },
  icon3: {
    bottom: height * 0.25,
    left: width * 0.2,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'transparent',
  },
});