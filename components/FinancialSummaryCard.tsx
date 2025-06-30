import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  withDelay
} from 'react-native-reanimated';

interface FinancialSummaryCardProps {
  totalOwed: number;
  totalOwing: number;
  netBalance: number;
}

export default function FinancialSummaryCard({
  totalOwed,
  totalOwing,
  netBalance,
}: FinancialSummaryCardProps) {
  const isPositive = netBalance >= 0;
  const mounted = useSharedValue(0);
  const owedProgress = useSharedValue(0);
  const owingProgress = useSharedValue(0);
  const balanceProgress = useSharedValue(0);

  React.useEffect(() => {
    mounted.value = withSpring(1, { damping: 15, stiffness: 100 });
    
    owedProgress.value = withDelay(200, withTiming(1, { duration: 800 }));
    owingProgress.value = withDelay(400, withTiming(1, { duration: 800 }));
    balanceProgress.value = withDelay(600, withTiming(1, { duration: 800 }));
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      mounted.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      mounted.value,
      [0, 1],
      [20, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const owedAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      owedProgress.value,
      [0, 1],
      [0.8, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  const owingAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      owingProgress.value,
      [0, 1],
      [0.8, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  const balanceAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      balanceProgress.value,
      [0, 1],
      [0.9, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <View style={styles.header}>
        <DollarSign size={20} color="#2563EB" />
        <Text style={styles.title}>Financial Summary</Text>
      </View>
      
      <View style={styles.summaryGrid}>
        <Animated.View style={[styles.summaryItem, owedAnimatedStyle]}>
          <TrendingUp size={16} color="#059669" />
          <Text style={styles.summaryLabel}>You're owed</Text>
          <Text style={[styles.summaryValue, { color: '#059669' }]}>
            ${totalOwed.toFixed(2)}
          </Text>
        </Animated.View>
        
        <Animated.View style={[styles.summaryItem, owingAnimatedStyle]}>
          <TrendingDown size={16} color="#DC2626" />
          <Text style={styles.summaryLabel}>You owe</Text>
          <Text style={[styles.summaryValue, { color: '#DC2626' }]}>
            ${totalOwing.toFixed(2)}
          </Text>
        </Animated.View>
      </View>
      
      <Animated.View style={[styles.netBalanceSection, balanceAnimatedStyle]}>
        <Text style={styles.netBalanceLabel}>Net Balance</Text>
        <Text style={[
          styles.netBalanceValue,
          { color: isPositive ? '#059669' : '#DC2626' }
        ]}>
          {isPositive ? '+' : ''}${Math.abs(netBalance).toFixed(2)}
        </Text>
        <Text style={styles.netBalanceDescription}>
          {isPositive 
            ? 'You are owed more than you owe'
            : 'You owe more than you are owed'
          }
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginLeft: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 4,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  netBalanceSection: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  netBalanceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  netBalanceValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  netBalanceDescription: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
  },
});