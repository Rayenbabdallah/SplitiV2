import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, DollarSign } from 'lucide-react-native';
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
    name: 'Ahmed',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    amount: 15.25,
    items: ['Pizza Margherita (shared)', 'Service Tax (shared)'],
  },
  {
    id: '2',
    name: 'Fatima',
    amount: 12.75,
    items: ['Caesar Salad', 'Service Tax (shared)'],
  },
  {
    id: '3',
    name: 'Mohamed',
    amount: 15.25,
    items: ['Pizza Margherita (shared)', 'Service Tax (shared)'],
  },
  {
    id: '4',
    name: 'Leila',
    amount: 8.25,
    items: ['Coca Cola x2', 'Tiramisu', 'Service Tax (shared)'],
  },
];

export default function SummaryScreen() {
  const router = useRouter();
  
  const totalAmount = mockSplits.reduce((sum, split) => sum + split.amount, 0);
  const tax = 4.50;
  const subtotal = totalAmount - tax;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Split Summary</Text>
          <Text style={styles.headerSubtitle}>Review before payment</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.totalSection}>
          <View style={styles.totalCard}>
            <DollarSign size={32} color="#E53E3E" />
            <Text style={styles.totalAmount}>{totalAmount.toFixed(2)} TND</Text>
            <Text style={styles.totalLabel}>Total Bill</Text>
          </View>
        </View>

        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>Bill Breakdown</Text>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Subtotal:</Text>
              <Text style={styles.breakdownValue}>{subtotal.toFixed(2)} TND</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Service Tax:</Text>
              <Text style={styles.breakdownValue}>{tax.toFixed(2)} TND</Text>
            </View>
            <View style={[styles.breakdownRow, styles.breakdownTotal]}>
              <Text style={styles.breakdownTotalLabel}>Total:</Text>
              <Text style={styles.breakdownTotalValue}>{totalAmount.toFixed(2)} TND</Text>
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
                  <Text style={styles.splitAmountValue}>{split.amount.toFixed(2)} TND</Text>
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
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <View style={styles.paymentCard}>
            <Text style={styles.paymentText}>
              Members will be able to pay using Flouci or Orange Money
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => router.push('/bill/payment')}
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    position: 'absolute',
    left: 20,
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
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  totalSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  totalCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    minWidth: 200,
  },
  totalAmount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  breakdownSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  breakdownCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  breakdownValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  breakdownTotal: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  breakdownTotalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  breakdownTotalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#E53E3E',
  },
  splitsSection: {
    marginBottom: 24,
  },
  splitCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    backgroundColor: '#E53E3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  splitName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  splitAmount: {
    alignItems: 'flex-end',
  },
  splitAmountValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#E53E3E',
  },
  splitAmountLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  splitItems: {
    marginTop: 8,
  },
  splitItemsLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  splitItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  paymentSection: {
    marginBottom: 24,
  },
  paymentCard: {
    backgroundColor: '#E53E3E20',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E53E3E40',
  },
  paymentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B91C1C',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sendButton: {
    backgroundColor: '#E53E3E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
});