import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Minus, Check } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BillItem {
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

const mockItems: BillItem[] = [
  { id: '1', name: 'Pizza Margherita', price: 18.50, assignedTo: [] },
  { id: '2', name: 'Caesar Salad', price: 12.00, assignedTo: [] },
  { id: '3', name: 'Coca Cola x2', price: 6.00, assignedTo: [] },
  { id: '4', name: 'Tiramisu', price: 8.50, assignedTo: [] },
  { id: '5', name: 'Service Tax', price: 4.50, assignedTo: [] },
];

const mockMembers: GroupMember[] = [
  { id: '1', name: 'Ahmed', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' },
  { id: '2', name: 'Fatima' },
  { id: '3', name: 'Mohamed' },
  { id: '4', name: 'Leila' },
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
          <ArrowLeft size={24} color="#111827" />
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
          <Text style={styles.sectionTitle}>Bill Items</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <TouchableOpacity
                style={styles.itemHeader}
                onPress={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
              >
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{item.price.toFixed(2)} TND</Text>
                </View>
                <View style={styles.assignmentStatus}>
                  {item.assignedTo.length > 0 ? (
                    <View style={styles.assignedBadge}>
                      <Check size={16} color="white" />
                      <Text style={styles.assignedCount}>{item.assignedTo.length}</Text>
                    </View>
                  ) : (
                    <View style={styles.unassignedBadge}>
                      <Plus size={16} color="#6B7280" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {selectedItem === item.id && (
                <View style={styles.assignmentPanel}>
                  <Text style={styles.assignmentTitle}>Assign to:</Text>
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
                {items.reduce((sum, item) => sum + item.price, 0).toFixed(2)} TND
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Assigned:</Text>
              <Text style={[styles.summaryValue, { color: '#10B981' }]}>
                {getTotalAssigned().toFixed(2)} TND
              </Text>
            </View>
            {getUnassignedTotal() > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Unassigned:</Text>
                <Text style={[styles.summaryValue, { color: '#E53E3E' }]}>
                  {getUnassignedTotal().toFixed(2)} TND
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !canProceed() && styles.continueButtonDisabled]}
          onPress={() => router.push('/bill/summary')}
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
  membersSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  membersList: {
    flexDirection: 'row',
  },
  memberCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  memberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#E53E3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  memberName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  itemsSection: {
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
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
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  assignmentStatus: {
    marginLeft: 12,
  },
  assignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  assignedCount: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginLeft: 4,
  },
  unassignedBadge: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 12,
  },
  assignmentPanel: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    padding: 16,
  },
  assignmentTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  assignmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  assignmentButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  assignmentButtonActive: {
    backgroundColor: '#E53E3E',
    borderColor: '#E53E3E',
  },
  assignmentButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  assignmentButtonTextActive: {
    color: 'white',
  },
  assignmentSummary: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
  },
  summarySection: {
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  footer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  continueButton: {
    backgroundColor: '#E53E3E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
});