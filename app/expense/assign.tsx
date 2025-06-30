import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Check, Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ExpenseItem {
  id: string;
  name: string;
  price: number;
  assignedTo: string[];
}

interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
}

const mockItems: ExpenseItem[] = [
  { id: '1', name: 'Grilled Salmon', price: 28.50, assignedTo: [] },
  { id: '2', name: 'Caesar Salad', price: 16.00, assignedTo: [] },
  { id: '3', name: 'Pasta Carbonara', price: 22.00, assignedTo: [] },
  { id: '4', name: 'Wine Bottle', price: 45.00, assignedTo: [] },
  { id: '5', name: 'Service Charge', price: 12.50, assignedTo: [] },
  { id: '6', name: 'Tax', price: 8.75, assignedTo: [] },
];

const mockMembers: GroupMember[] = [
  { id: '1', name: 'Alex', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' },
  { id: '2', name: 'Sarah' },
  { id: '3', name: 'Mike' },
  { id: '4', name: 'Emma' },
];

export default function AssignItemsScreen() {
  const router = useRouter();
  const [items, setItems] = useState(mockItems);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const toggleItemAssignment = (itemId: string, memberId: string) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const isAssigned = item.assignedTo.includes(memberId);
          return {
            ...item,
            assignedTo: isAssigned
              ? item.assignedTo.filter(id => id !== memberId)
              : [...item.assignedTo, memberId]
          };
        }
        return item;
      })
    );
  };

  const assignToAll = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            assignedTo: mockMembers.map(member => member.id)
          };
        }
        return item;
      })
    );
  };

  const getMemberName = (memberId: string) => {
    return mockMembers.find(member => member.id === memberId)?.name || 'Unknown';
  };

  const getTotalAssigned = () => {
    return items.reduce((total, item) => {
      return item.assignedTo.length > 0 ? total + item.price : total;
    }, 0);
  };

  const getUnassignedTotal = () => {
    return items.reduce((total, item) => {
      return item.assignedTo.length === 0 ? total + item.price : total;
    }, 0);
  };

  const canProceed = () => {
    return items.every(item => item.assignedTo.length > 0);
  };

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
          <Text style={styles.headerTitle}>Assign Items</Text>
          <Text style={styles.headerSubtitle}>Tap items to assign to people</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.membersSection}>
          <Text style={styles.sectionTitle}>Group Members</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.membersList}>
            {mockMembers.map((member) => (
              <View key={member.id} style={styles.memberCard}>
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
                <Text style={styles.memberName}>{member.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Expense Items</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <TouchableOpacity
                style={styles.itemHeader}
                onPress={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
              >
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                </View>
                <View style={styles.assignmentStatus}>
                  {item.assignedTo.length > 0 ? (
                    <View style={styles.assignedBadge}>
                      <Check size={14} color="#FFFFFF" />
                      <Text style={styles.assignedCount}>{item.assignedTo.length}</Text>
                    </View>
                  ) : (
                    <View style={styles.unassignedBadge}>
                      <Plus size={14} color="#64748B" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {selectedItem === item.id && (
                <View style={styles.assignmentPanel}>
                  <View style={styles.assignmentHeader}>
                    <Text style={styles.assignmentTitle}>Assign to:</Text>
                    <TouchableOpacity
                      style={styles.assignAllButton}
                      onPress={() => assignToAll(item.id)}
                    >
                      <Users size={14} color="#2563EB" />
                      <Text style={styles.assignAllText}>All</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.assignmentGrid}>
                    {mockMembers.map((member) => (
                      <TouchableOpacity
                        key={member.id}
                        style={[
                          styles.assignmentButton,
                          item.assignedTo.includes(member.id) && styles.assignmentButtonActive
                        ]}
                        onPress={() => toggleItemAssignment(item.id, member.id)}
                      >
                        <Text
                          style={[
                            styles.assignmentButtonText,
                            item.assignedTo.includes(member.id) && styles.assignmentButtonTextActive
                          ]}
                        >
                          {member.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  {item.assignedTo.length > 0 && (
                    <Text style={styles.assignmentSummary}>
                      Assigned to: {item.assignedTo.map(id => getMemberName(id)).join(', ')}
                    </Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Assignment Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Bill:</Text>
              <Text style={styles.summaryValue}>
                ${items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Assigned:</Text>
              <Text style={[styles.summaryValue, { color: '#059669' }]}>
                ${getTotalAssigned().toFixed(2)}
              </Text>
            </View>
            {getUnassignedTotal() > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Unassigned:</Text>
                <Text style={[styles.summaryValue, { color: '#DC2626' }]}>
                  ${getUnassignedTotal().toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !canProceed() && styles.continueButtonDisabled]}
          onPress={() => router.push('/expense/summary')}
          disabled={!canProceed()}
        >
          <Text style={styles.continueButtonText}>
            Continue to Summary
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
  membersSection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 12,
  },
  membersList: {
    flexDirection: 'row',
  },
  memberCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  memberName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#0F172A',
  },
  itemsSection: {
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  assignmentStatus: {
    marginLeft: 12,
  },
  assignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  assignedCount: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  unassignedBadge: {
    backgroundColor: '#F1F5F9',
    padding: 6,
    borderRadius: 12,
  },
  assignmentPanel: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    padding: 16,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  assignmentTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
  },
  assignAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  assignAllText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    marginLeft: 4,
  },
  assignmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  assignmentButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  assignmentButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  assignmentButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  assignmentButtonTextActive: {
    color: '#FFFFFF',
  },
  assignmentSummary: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 8,
  },
  summarySection: {
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  continueButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  continueButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});