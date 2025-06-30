import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Users, ChevronRight, CircleAlert as AlertCircle } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import PulsingDot from './PulsingDot';

interface Member {
  id: string;
  name: string;
  avatar?: string;
}

interface GroupCardProps {
  id: string;
  name: string;
  type: 'friends' | 'roommates' | 'work' | 'travel';
  members: Member[];
  lastActivity?: string;
  pendingAmount?: number;
  settledAmount?: number;
  onPress: () => void;
  delay?: number;
}

export default function GroupCard({
  name,
  type,
  members,
  lastActivity,
  pendingAmount = 0,
  settledAmount = 0,
  onPress,
  delay = 0,
}: GroupCardProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const shadowOpacity = useSharedValue(0.05);
  const mounted = useSharedValue(0);
  const chevronRotation = useSharedValue(0);

  React.useEffect(() => {
    mounted.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
      delay: delay
    });
  }, [delay]);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    translateY.value = withSpring(-2, { damping: 15, stiffness: 300 });
    shadowOpacity.value = withTiming(0.15, { duration: 150 });
    chevronRotation.value = withSpring(15, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 300 });
    shadowOpacity.value = withTiming(0.05, { duration: 150 });
    chevronRotation.value = withSpring(0, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    runOnJS(onPress)();
  };

  const getTypeColor = () => {
    switch (type) {
      case 'friends':
        return '#2563EB';
      case 'roommates':
        return '#059669';
      case 'work':
        return '#7C3AED';
      case 'travel':
        return '#DC2626';
      default:
        return '#64748B';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'friends':
        return 'Friends';
      case 'roommates':
        return 'Roommates';
      case 'work':
        return 'Work';
      case 'travel':
        return 'Travel';
      default:
        return 'Group';
    }
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

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={1}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.groupName}>{name}</Text>
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor() + '15' }]}>
              <Text style={[styles.typeText, { color: getTypeColor() }]}>
                {getTypeLabel()}
              </Text>
            </View>
          </View>
          <Animated.View style={chevronAnimatedStyle}>
            <ChevronRight size={16} color="#94A3B8" />
          </Animated.View>
        </View>

        <View style={styles.membersSection}>
          <View style={styles.avatarsContainer}>
            {members.slice(0, 4).map((member, index) => (
              <Animated.View
                key={member.id}
                style={[
                  styles.avatar,
                  { zIndex: 4 - index, marginLeft: index > 0 ? -8 : 0 }
                ]}
                entering={withSpring}
              >
                {member.avatar ? (
                  <Image source={{ uri: member.avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>
                      {member.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </Animated.View>
            ))}
            {members.length > 4 && (
              <View style={[styles.avatar, styles.moreAvatar]}>
                <Text style={styles.moreText}>+{members.length - 4}</Text>
              </View>
            )}
          </View>
          <Text style={styles.membersCount}>{members.length} members</Text>
        </View>

        <View style={styles.financialSection}>
          <View style={styles.amountRow}>
            <View style={styles.amountItem}>
              <Text style={styles.amountLabel}>Pending</Text>
              <Text style={[styles.amountValue, { color: pendingAmount > 0 ? '#DC2626' : '#64748B' }]}>
                ${pendingAmount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.amountItem}>
              <Text style={styles.amountLabel}>Settled</Text>
              <Text style={[styles.amountValue, { color: '#059669' }]}>
                ${settledAmount.toFixed(2)}
              </Text>
            </View>
          </View>
          {pendingAmount > 0 && (
            <View style={styles.alertRow}>
              <PulsingDot color="#DC2626" size={6} />
              <Text style={styles.alertText}>Outstanding balance</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.lastActivity}>{lastActivity || 'No recent activity'}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 6,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  membersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  moreAvatar: {
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  moreText: {
    fontSize: 8,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  membersCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  financialSection: {
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  amountItem: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  alertText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#DC2626',
    marginLeft: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  lastActivity: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
});