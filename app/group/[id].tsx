import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Plus, Users, Receipt, DollarSign, Calendar, CreditCard } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedButton from '@/components/AnimatedButton';
import AnimatedCard from '@/components/AnimatedCard';
import PulsingDot from '@/components/PulsingDot';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  balance: number; // positive = they owe you, negative = you owe them
}

interface GroupExpense {
  id: string;
  title: string;
  amount: number;
  date: string;
  paidBy: string;
  participants: string[];
  status: 'settled' | 'pending';
  yourShare: number;
}

const mockGroupData = {
  '1': {
    id: '1',
    name: 'Weekend Squad',
    type: 'friends' as const,
    members: [
      { id: '1', name: 'Alex', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', balance: 0 },
      { id: '2', name: 'Sarah', balance: 45.50 },
      { id: '3', name: 'Mike', balance: -32.25 },
      { id: '4', name: 'Emma', balance: 18.75 },
    ],
    expenses: [
      {
        id: '1',
        title: 'Weekend Dinner',
        amount: 89.75,
        date: '2024-01-12',
        paidBy: 'Alex',
        participants: ['1', '2', '3', '4'],
        status: 'pending' as const,
        yourShare: 22.44,
      },
      {
        id: '2',
        title: 'Movie Tickets',
        amount: 48.00,
        date: '2024-01-10',
        paidBy: 'Sarah',
        participants: ['1', '2', '3'],
        status: 'settled' as const,
        yourShare: 16.00,
      },
      {
        id: '3',
        title: 'Coffee Run',
        amount: 24.60,
        date: '2024-01-08',
        paidBy: 'Mike',
        participants: ['1', '2', '3', '4'],
        status: 'pending' as const,
        yourShare: 6.15,
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Apartment 4B',
    type: 'roommates' as const,
    members: [
      { id: '1', name: 'Jordan', balance: 0 },
      { id: '2', name: 'Taylor', balance: 125.30 },
      { id: '3', name: 'Casey', balance: -89.50 },
    ],
    expenses: [
      {
        id: '1',
        title: 'Grocery Shopping',
        amount: 156.30,
        date: '2024-01-14',
        paidBy: 'Jordan',
        participants: ['1', '2', '3'],
        status: 'settled' as const,
        yourShare: 52.10,
      },
      {
        id: '2',
        title: 'Utilities Bill',
        amount: 245.80,
        date: '2024-01-01',
        paidBy: 'Taylor',
        participants: ['1', '2', '3'],
        status: 'pending' as const,
        yourShare: 81.93,
      },
    ],
  },
  '3': {
    id: '3',
    name: 'Marketing Team',
    type: 'work' as const,
    members: [
      { id: '1', name: 'David', balance: 0 },
      { id: '2', name: 'Lisa', balance: 28.50 },
      { id: '3', name: 'James', balance: -15.75 },
      { id: '4', name: 'Maria', balance: 42.20 },
      { id: '5', name: 'Tom', balance: -31.05 },
    ],
    expenses: [
      {
        id: '1',
        title: 'Team Lunch at Bistro',
        amount: 240.50,
        date: '2024-01-15',
        paidBy: 'David',
        participants: ['1', '2', '3', '4', '5'],
        status: 'pending' as const,
        yourShare: 48.10,
      },
    ],
  },
  '4': {
    id: '4',
    name: 'Europe Trip 2024',
    type: 'travel' as const,
    members: [
      { id: '1', name: 'Chris', balance: 0 },
      { id: '2', name: 'Anna', balance: 180.25 },
      { id: '3', name: 'Ben', balance: -95.40 },
      { id: '4', name: 'Sophie', balance: 245.55 },
    ],
    expenses: [
      {
        id: '1',
        title: 'Hotel Booking',
        amount: 480.00,
        date: '2024-01-10',
        paidBy: 'Chris',
        participants: ['1', '2', '3', '4'],
        status: 'pending' as const,
        yourShare: 120.00,
      },
      {
        id: '2',
        title: 'Flight Tickets',
        amount: 1200.00,
        date: '2024-01-05',
        paidBy: 'Anna',
        participants: ['1', '2', '3', '4'],
        status: 'settled' as const,
        yourShare: 300.00,
      },
    ],
  },
};

export default function GroupDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const mounted = useSharedValue(0);

  React.useEffect(() => {
    mounted.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

  const groupData = mockGroupData[id as string];

  if (!groupData) {
    return (
      <View style={styles.container}>
        <Text>Group not found</Text>
      </View>
    );
  }

  // Calculate what you owe to the group
  const yourDebts = groupData.members.filter(member => member.balance < 0);
  const totalYouOwe = yourDebts.reduce((sum, member) => sum + Math.abs(member.balance), 0);
  
  // Calculate what the group owes you
  const yourCredits = groupData.members.filter(member => member.balance > 0);
  const totalOwedToYou = yourCredits.reduce((sum, member) => sum + member.balance, 0);

  const pendingExpenses = groupData.expenses.filter(expense => expense.status === 'pending');
  const settledExpenses = groupData.expenses.filter(expense => expense.status === 'settled');

  const handleAddExpense = () => {
    router.push('/expense/create');
  };

  const handlePayDebts = () => {
    router.push('/expense/payment');
  };

  const getTypeColor = () => {
    switch (groupData.type) {
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

  const headerAnimatedStyle = useAnimatedStyle(() => {
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

  const balanceAnimatedStyle = useAnimatedStyle(() => {
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

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Animated.View style={[styles.headerContent, headerAnimatedStyle]}>
          <Text style={styles.headerTitle}>{groupData.name}</Text>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor() + '15' }]}>
            <Text style={[styles.typeText, { color: getTypeColor() }]}>
              {groupData.type.charAt(0).toUpperCase() + groupData.type.slice(1)}
            </Text>
          </View>
        </Animated.View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Summary */}
        <Animated.View style={[styles.balanceSection, balanceAnimatedStyle]}>
          <View style={styles.balanceGrid}>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>You owe</Text>
              <Text style={[styles.balanceValue, { color: totalYouOwe > 0 ? '#DC2626' : '#64748B' }]}>
                ${totalYouOwe.toFixed(2)}
              </Text>
              {totalYouOwe > 0 && (
                <View style={styles.debtIndicator}>
                  <PulsingDot color="#DC2626" size={4} />
                  <Text style={styles.debtText}>Outstanding</Text>
                </View>
              )}
            </View>
            
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>You're owed</Text>
              <Text style={[styles.balanceValue, { color: totalOwedToYou > 0 ? '#059669' : '#64748B' }]}>
                ${totalOwedToYou.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Pay Button - Only show if user owes money */}
          {totalYouOwe > 0 && (
            <View style={styles.payButtonContainer}>
              <AnimatedButton
                title={`Pay $${totalYouOwe.toFixed(2)}`}
                onPress={handlePayDebts}
                icon={<CreditCard size={20} color="#FFFFFF" />}
                style={styles.payButton}
              />
              <Text style={styles.payButtonSubtext}>
                Settle all outstanding balances
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Members Section */}
        <View style={styles.membersSection}>
          <Text style={styles.sectionTitle}>Members</Text>
          <View style={styles.membersList}>
            {groupData.members.map((member, index) => (
              <AnimatedCard key={member.id} delay={index * 100} style={styles.memberCard}>
                <View style={styles.memberInfo}>
                  <View style={styles.memberAvatar}>
                    {member.avatar ? (
                      <Image source={{ uri: member.avatar }} style={styles.avatarImage} />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                          {member.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.memberDetails}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    {member.balance !== 0 && (
                      <Text style={[
                        styles.memberBalance,
                        { color: member.balance > 0 ? '#059669' : '#DC2626' }
                      ]}>
                        {member.balance > 0 ? 'owes you' : 'you owe'} ${Math.abs(member.balance).toFixed(2)}
                      </Text>
                    )}
                    {member.balance === 0 && (
                      <Text style={styles.memberBalanceSettled}>All settled up</Text>
                    )}
                  </View>
                </View>
              </AnimatedCard>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <AnimatedButton
              title="Add Expense"
              onPress={handleAddExpense}
              icon={<Plus size={18} color="#FFFFFF" />}
              style={styles.actionButton}
            />
            <AnimatedButton
              title="View History"
              onPress={() => router.push('/history')}
              variant="outline"
              icon={<Receipt size={18} color="#2563EB" />}
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* Recent Expenses */}
        <View style={styles.expensesSection}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          
          {pendingExpenses.length > 0 && (
            <View style={styles.expenseCategory}>
              <Text style={styles.categoryTitle}>Pending</Text>
              {pendingExpenses.map((expense, index) => (
                <AnimatedCard key={expense.id} delay={index * 50} style={styles.expenseCard}>
                  <View style={styles.expenseHeader}>
                    <View style={styles.expenseInfo}>
                      <Text style={styles.expenseTitle}>{expense.title}</Text>
                      <Text style={styles.expenseDate}>
                        {new Date(expense.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Text>
                    </View>
                    <View style={styles.expenseAmount}>
                      <Text style={styles.expenseTotal}>${expense.amount.toFixed(2)}</Text>
                      <Text style={styles.expenseShare}>Your share: ${expense.yourShare.toFixed(2)}</Text>
                    </View>
                  </View>
                  <View style={styles.expenseFooter}>
                    <Text style={styles.expensePaidBy}>Paid by {expense.paidBy}</Text>
                    <View style={styles.expenseStatus}>
                      <PulsingDot color="#D97706" size={4} />
                      <Text style={styles.expenseStatusText}>Pending</Text>
                    </View>
                  </View>
                </AnimatedCard>
              ))}
            </View>
          )}

          {settledExpenses.length > 0 && (
            <View style={styles.expenseCategory}>
              <Text style={styles.categoryTitle}>Settled</Text>
              {settledExpenses.slice(0, 3).map((expense, index) => (
                <AnimatedCard key={expense.id} delay={index * 50} style={styles.expenseCard}>
                  <View style={styles.expenseHeader}>
                    <View style={styles.expenseInfo}>
                      <Text style={styles.expenseTitle}>{expense.title}</Text>
                      <Text style={styles.expenseDate}>
                        {new Date(expense.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Text>
                    </View>
                    <View style={styles.expenseAmount}>
                      <Text style={styles.expenseTotal}>${expense.amount.toFixed(2)}</Text>
                      <Text style={styles.expenseShare}>Your share: ${expense.yourShare.toFixed(2)}</Text>
                    </View>
                  </View>
                  <View style={styles.expenseFooter}>
                    <Text style={styles.expensePaidBy}>Paid by {expense.paidBy}</Text>
                    <View style={styles.expenseStatus}>
                      <View style={styles.settledDot} />
                      <Text style={[styles.expenseStatusText, { color: '#059669' }]}>Settled</Text>
                    </View>
                  </View>
                </AnimatedCard>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 60,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  balanceSection: {
    marginVertical: 20,
  },
  balanceGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
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
  balanceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  debtIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  debtText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#DC2626',
    marginLeft: 6,
  },
  payButtonContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  payButton: {
    backgroundColor: '#DC2626',
    shadowColor: '#DC2626',
    width: '100%',
  },
  payButtonSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  membersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 16,
  },
  membersList: {
    gap: 8,
  },
  memberCard: {
    padding: 12,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 2,
  },
  memberBalance: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  memberBalanceSettled: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  expensesSection: {
    marginBottom: 32,
  },
  expenseCategory: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 12,
  },
  expenseCard: {
    marginBottom: 8,
    padding: 12,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  expenseAmount: {
    alignItems: 'flex-end',
  },
  expenseTotal: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  expenseShare: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  expensePaidBy: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  expenseStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseStatusText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#D97706',
    marginLeft: 6,
  },
  settledDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
});