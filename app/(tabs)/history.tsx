import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput } from 'react-native';
import { Calendar, Search, Download, CircleCheck as CheckCircle, Clock, Circle as XCircle } from 'lucide-react-native';
import Header from '@/components/Header';
import AnimatedFilterTabs from '@/components/AnimatedFilterTabs';
import AnimatedCard from '@/components/AnimatedCard';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

interface HistoryItem {
  id: string;
  title: string;
  group: string;
  date: string;
  amount: number;
  yourShare: number;
  status: 'settled' | 'pending' | 'cancelled';
  participants: number;
}

const mockHistory: HistoryItem[] = [
  {
    id: '1',
    title: 'Team Lunch at Bistro',
    group: 'Marketing Team',
    date: '2024-01-15',
    amount: 240.50,
    yourShare: 48.10,
    status: 'settled',
    participants: 5,
  },
  {
    id: '2',
    title: 'Grocery Shopping',
    group: 'Apartment 4B',
    date: '2024-01-14',
    amount: 156.30,
    yourShare: 52.10,
    status: 'pending',
    participants: 3,
  },
  {
    id: '3',
    title: 'Weekend Dinner',
    group: 'Weekend Squad',
    date: '2024-01-12',
    amount: 89.75,
    yourShare: 22.44,
    status: 'settled',
    participants: 4,
  },
  {
    id: '4',
    title: 'Hotel Booking',
    group: 'Europe Trip 2024',
    date: '2024-01-10',
    amount: 480.00,
    yourShare: 120.00,
    status: 'pending',
    participants: 4,
  },
  {
    id: '5',
    title: 'Coffee Run',
    group: 'Weekend Squad',
    date: '2024-01-08',
    amount: 24.60,
    yourShare: 6.15,
    status: 'cancelled',
    participants: 4,
  },
];

export default function HistoryScreen() {
  const [history] = useState(mockHistory);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'settled' | 'pending' | 'cancelled'>('all');
  const mounted = useSharedValue(0);
  const exportButtonScale = useSharedValue(1);

  React.useEffect(() => {
    mounted.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.group.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'settled':
        return <CheckCircle size={16} color="#059669" />;
      case 'pending':
        return <Clock size={16} color="#D97706" />;
      case 'cancelled':
        return <XCircle size={16} color="#DC2626" />;
      default:
        return <Clock size={16} color="#64748B" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'settled':
        return '#059669';
      case 'pending':
        return '#D97706';
      case 'cancelled':
        return '#DC2626';
      default:
        return '#64748B';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'settled':
        return 'Settled';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const totalSettled = history
    .filter(item => item.status === 'settled')
    .reduce((sum, item) => sum + item.yourShare, 0);

  const totalPending = history
    .filter(item => item.status === 'pending')
    .reduce((sum, item) => sum + item.yourShare, 0);

  const filters = [
    { key: 'all', label: 'All', count: history.length },
    { key: 'settled', label: 'Settled', count: history.filter(h => h.status === 'settled').length },
    { key: 'pending', label: 'Pending', count: history.filter(h => h.status === 'pending').length },
    { key: 'cancelled', label: 'Cancelled', count: history.filter(h => h.status === 'cancelled').length },
  ];

  const summaryAnimatedStyle = useAnimatedStyle(() => {
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

  const searchAnimatedStyle = useAnimatedStyle(() => {
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

  const exportButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: exportButtonScale.value }],
  }));

  const handleExport = () => {
    exportButtonScale.value = withSpring(0.95, { duration: 100 }, () => {
      exportButtonScale.value = withSpring(1);
    });
    // Handle export functionality
  };

  return (
    <View style={styles.container}>
      <Header
        title="History"
        subtitle="Track your expense history"
      />
      
      <Animated.View style={[styles.summarySection, summaryAnimatedStyle]}>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <CheckCircle size={20} color="#059669" />
            <Text style={styles.summaryValue}>${totalSettled.toFixed(2)}</Text>
            <Text style={styles.summaryLabel}>Settled</Text>
          </View>
          <View style={styles.summaryCard}>
            <Clock size={20} color="#D97706" />
            <Text style={styles.summaryValue}>${totalPending.toFixed(2)}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.searchSection, searchAnimatedStyle]}>
        <View style={styles.searchContainer}>
          <Search size={16} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search expenses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
        </View>
        
        <Animated.View style={exportButtonAnimatedStyle}>
          <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
            <Download size={16} color="#2563EB" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <AnimatedFilterTabs
        filters={filters}
        selectedFilter={filter}
        onFilterChange={(newFilter) => setFilter(newFilter as any)}
        activeColor="#2563EB"
        inactiveColor="#64748B"
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.historyList}>
          {filteredHistory.map((item, index) => (
            <AnimatedCard key={item.id} delay={index * 50} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View style={styles.historyTitleSection}>
                  <Text style={styles.historyTitle}>{item.title}</Text>
                  <Text style={styles.historyGroup}>{item.group}</Text>
                </View>
                <View style={styles.statusSection}>
                  <View style={styles.statusBadge}>
                    {getStatusIcon(item.status)}
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(item.status) }
                      ]}
                    >
                      {getStatusText(item.status)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.historyDetails}>
                <View style={styles.detailItem}>
                  <Calendar size={14} color="#64748B" />
                  <Text style={styles.detailText}>
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
                <Text style={styles.participants}>
                  {item.participants} people
                </Text>
              </View>

              <View style={styles.historyFooter}>
                <View style={styles.amountSection}>
                  <Text style={styles.totalAmount}>
                    Total: ${item.amount.toFixed(2)}
                  </Text>
                  <Text style={styles.yourShare}>
                    Your share: ${item.yourShare.toFixed(2)}
                  </Text>
                </View>
              </View>
            </AnimatedCard>
          ))}
        </View>

        {filteredHistory.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No expenses found</Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? 'Try adjusting your search or filters'
                : filter === 'all'
                ? 'Start splitting expenses to see your history here'
                : `No ${filter} expenses found. Try a different filter.`
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  summarySection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  summaryValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    marginLeft: 8,
  },
  exportButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  historyList: {
    paddingBottom: 32,
  },
  historyCard: {
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  historyTitleSection: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 2,
  },
  historyGroup: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  statusSection: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginLeft: 4,
  },
  participants: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  historyFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  amountSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  yourShare: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});