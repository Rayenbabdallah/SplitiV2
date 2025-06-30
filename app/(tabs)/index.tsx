import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Receipt, Users } from 'lucide-react-native';
import Header from '@/components/Header';
import GroupCard from '@/components/GroupCard';
import FinancialSummaryCard from '@/components/FinancialSummaryCard';
import AnimatedButton from '@/components/AnimatedButton';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withDelay,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

const mockGroups = [
  {
    id: '1',
    name: 'Weekend Squad',
    type: 'friends' as const,
    members: [
      { id: '1', name: 'Alex', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' },
      { id: '2', name: 'Sarah' },
      { id: '3', name: 'Mike' },
      { id: '4', name: 'Emma' },
    ],
    lastActivity: '2 hours ago',
    pendingAmount: 125.50,
    settledAmount: 890.25,
  },
  {
    id: '2',
    name: 'Apartment 4B',
    type: 'roommates' as const,
    members: [
      { id: '1', name: 'Jordan' },
      { id: '2', name: 'Taylor' },
      { id: '3', name: 'Casey' },
    ],
    lastActivity: 'Yesterday',
    pendingAmount: 0,
    settledAmount: 2450.00,
  },
  {
    id: '3',
    name: 'Marketing Team',
    type: 'work' as const,
    members: [
      { id: '1', name: 'David' },
      { id: '2', name: 'Lisa' },
      { id: '3', name: 'James' },
      { id: '4', name: 'Maria' },
      { id: '5', name: 'Tom' },
    ],
    lastActivity: '3 days ago',
    pendingAmount: 75.25,
    settledAmount: 1250.75,
  },
  {
    id: '4',
    name: 'Europe Trip 2024',
    type: 'travel' as const,
    members: [
      { id: '1', name: 'Chris' },
      { id: '2', name: 'Anna' },
      { id: '3', name: 'Ben' },
      { id: '4', name: 'Sophie' },
    ],
    lastActivity: '1 week ago',
    pendingAmount: 340.80,
    settledAmount: 5670.45,
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const [groups] = useState(mockGroups);
  const mounted = useSharedValue(0);

  React.useEffect(() => {
    mounted.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

  const handleGroupPress = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };

  const handleAddExpense = () => {
    router.push('/expense/create');
  };

  const handleCreateGroup = () => {
    router.push('/groups');
  };

  // Calculate financial summary
  const totalOwed = 245.30;
  const totalOwing = 89.75;
  const netBalance = totalOwed - totalOwing;

  const actionsAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      mounted.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      mounted.value,
      [0, 1],
      [30, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const quickActionAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      mounted.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      mounted.value,
      [0, 1],
      [40, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <View style={styles.container}>
      <Header
        title="Dashboard"
        subtitle="Manage your shared expenses"
        showNotifications={true}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FinancialSummaryCard
          totalOwed={totalOwed}
          totalOwing={totalOwing}
          netBalance={netBalance}
        />

        <Animated.View style={[styles.actionsSection, actionsAnimatedStyle]}>
          <AnimatedButton
            title="Add Expense"
            onPress={handleAddExpense}
            icon={<Plus size={20} color="#FFFFFF" />}
            style={styles.primaryAction}
          />
          
          <AnimatedButton
            title="Create Group"
            onPress={handleCreateGroup}
            variant="outline"
            icon={<Users size={20} color="#2563EB" />}
            style={styles.secondaryAction}
          />
        </Animated.View>

        <View style={styles.groupsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Groups</Text>
            <Text style={styles.sectionCount}>{groups.length}</Text>
          </View>
          
          {groups.map((group, index) => (
            <GroupCard
              key={group.id}
              id={group.id}
              name={group.name}
              type={group.type}
              members={group.members}
              lastActivity={group.lastActivity}
              pendingAmount={group.pendingAmount}
              settledAmount={group.settledAmount}
              onPress={() => handleGroupPress(group.id)}
              delay={index * 100}
            />
          ))}
        </View>

        <Animated.View style={[styles.quickActionsSection, quickActionAnimatedStyle]}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/expense/scan')}
          >
            <View style={styles.quickActionIcon}>
              <Receipt size={20} color="#2563EB" />
            </View>
            <View style={styles.quickActionContent}>
              <Text style={styles.quickActionTitle}>Scan Receipt</Text>
              <Text style={styles.quickActionSubtitle}>Auto-extract items with OCR</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  actionsSection: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  primaryAction: {
    flex: 1,
  },
  secondaryAction: {
    flex: 1,
  },
  groupsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
  },
  sectionCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  quickActionsSection: {
    marginBottom: 32,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
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
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
});