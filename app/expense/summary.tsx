import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, DollarSign, Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PersonSplit {
  id: string;
  name: string;
  avatar?: string;
  amount: number;
  items: string[];
}

const mockSplits: PersonSplit[] = [
  {
    id: '1',
    name: 'Alex',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    amount: 32.81,
    items: ['Grilled Salmon', 'Wine Bottle (shared)', 'Service Charge (shared)', 'Tax (shared)'],
  },
  {
    id: '2',
    name: 'Sarah',
    amount: 28.19,
    items: ['Caesar Salad', 'Wine Bottle (shared)', 'Service Charge (shared)', 'Tax (shared)'],
  },
  {
    id: '3',
    name: 'Mike',
    amount: 34.19,
    items: ['Pasta Carbonara', 'Wine Bottle (shared)', 'Service Charge (shared)', 'Tax (shared)'],
  },
  {
    id: '4',
    name: 'Emma',
    amount: 37.56,
    items: ['Wine Bottle (shared)', 'Service Charge (shared)', 'Tax (shared)'],
  },
];

export default function SummaryScreen() {
  const router = useRouter();
  
  const totalAmount = mockSplits.reduce((sum, split) => sum + split.amount, 0);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Split Summary</Text>
          <Text style={styles.headerSubtitle}>Review before sending</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.totalSection}>
          <View style={styles.totalCard}>
            <DollarSign size={28} color="#2563EB" />
            <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
            <Text style={styles.totalLabel}>Total Bill</Text>
            <View style={styles.totalMeta}>
              <Users size={14} color="#64748B" />
              <Text style={styles.totalMetaText}>{mockSplits.length} people</Text>
            </View>
          </View>
        </View>

        <View style={styles.splitsSection}>
          <Text style={styles.sectionTitle}>Individual Splits</Text>
          {mockSplits.map((split) => (
            <View key={split.id} style={styles.splitCard}>
              <View style={styles.splitHeader}>
                <View style={styles.splitUser}>
                  <View style={styles.splitAvatar}>
                    {split.avatar ? (
                      <Image source={{ uri: split.avatar }} style={styles.avatarImage} />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                          {split.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.splitName}>{split.name}</Text>
                </View>
                <View style={styles.splitAmount}>
                  <Text style={styles.splitAmountValue}>${split.amount.toFixed(2)}</Text>
                  <Text style={styles.splitAmountLabel}>to pay</Text>
                </View>
              </View>
              
              <View style={styles.splitItems}>
                <Text style={styles.splitItemsLabel}>Items:</Text>
                {split.items.map((item, index) => (
                  <Text key={index} style={styles.splitItem}>• {item}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.paymentCard}>
            <Text style={styles.paymentTitle}>Available Payment Methods</Text>
            <Text style={styles.paymentText}>
              Members can pay using Flouci, Orange Money, or mark as paid with cash
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => router.push('/expense/payment')}
        >
          <Text style={styles.sendButtonText}>
            Send Payment Requests
          </Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  totalSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  totalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    minWidth: 200,
  },
  totalAmount: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 8,
  },
  totalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalMetaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginLeft: 4,
  },
  splitsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 12,
  },
  splitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  splitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  splitUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  splitAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  splitName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
  },
  splitAmount: {
    alignItems: 'flex-end',
  },
  splitAmountValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
  },
  splitAmountLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  splitItems: {
    marginTop: 8,
  },
  splitItemsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 4,
  },
  splitItem: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 16,
  },
  paymentSection: {
    marginBottom: 20,
  },
  paymentCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  paymentTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  paymentText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#1E40AF',
    lineHeight: 16,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  sendButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});