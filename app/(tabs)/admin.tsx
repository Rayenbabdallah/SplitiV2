import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { ChartBar as BarChart3, Users, Receipt, TrendingUp, TrendingDown, DollarSign, Calendar, Download } from 'lucide-react-native';
import Header from '@/components/Header';

interface AnalyticsData {
  totalUsers: number;
  activeGroups: number;
  totalExpenses: number;
  totalVolume: number;
  monthlyGrowth: number;
  avgExpensePerUser: number;
}

const mockAnalytics: AnalyticsData = {
  totalUsers: 1247,
  activeGroups: 89,
  totalExpenses: 3456,
  totalVolume: 125670.50,
  monthlyGrowth: 12.5,
  avgExpensePerUser: 100.85,
};

const mockRecentActivity = [
  { id: '1', action: 'New group created', group: 'Marketing Team', time: '2 hours ago' },
  { id: '2', action: 'Expense settled', group: 'Weekend Squad', time: '4 hours ago' },
  { id: '3', action: 'Payment completed', group: 'Apartment 4B', time: '6 hours ago' },
  { id: '4', action: 'New user joined', group: 'Europe Trip 2024', time: '8 hours ago' },
];

export default function AdminScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const periods = [
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'year', label: 'This Year' },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Analytics"
        subtitle="Admin dashboard overview"
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period.key as any)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period.key && styles.periodTextActive
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Users size={20} color="#2563EB" />
            <Text style={styles.metricValue}>{mockAnalytics.totalUsers.toLocaleString()}</Text>
            <Text style={styles.metricLabel}>Total Users</Text>
            <View style={styles.metricChange}>
              <TrendingUp size={12} color="#059669" />
              <Text style={styles.metricChangeText}>+8.2%</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <Users size={20} color="#059669" />
            <Text style={styles.metricValue}>{mockAnalytics.activeGroups}</Text>
            <Text style={styles.metricLabel}>Active Groups</Text>
            <View style={styles.metricChange}>
              <TrendingUp size={12} color="#059669" />
              <Text style={styles.metricChangeText}>+15.3%</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <Receipt size={20} color="#7C3AED" />
            <Text style={styles.metricValue}>{mockAnalytics.totalExpenses.toLocaleString()}</Text>
            <Text style={styles.metricLabel}>Total Expenses</Text>
            <View style={styles.metricChange}>
              <TrendingUp size={12} color="#059669" />
              <Text style={styles.metricChangeText}>+22.1%</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <DollarSign size={20} color="#DC2626" />
            <Text style={styles.metricValue}>${mockAnalytics.totalVolume.toLocaleString()}</Text>
            <Text style={styles.metricLabel}>Total Volume</Text>
            <View style={styles.metricChange}>
              <TrendingUp size={12} color="#059669" />
              <Text style={styles.metricChangeText}>+18.7%</Text>
            </View>
          </View>
        </View>

        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <TrendingUp size={18} color="#059669" />
              <Text style={styles.insightTitle}>Monthly Growth</Text>
            </View>
            <Text style={styles.insightValue}>+{mockAnalytics.monthlyGrowth}%</Text>
            <Text style={styles.insightDescription}>
              User engagement is up significantly this month
            </Text>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <DollarSign size={18} color="#2563EB" />
              <Text style={styles.insightTitle}>Avg. Expense per User</Text>
            </View>
            <Text style={styles.insightValue}>${mockAnalytics.avgExpensePerUser}</Text>
            <Text style={styles.insightDescription}>
              Higher than industry average of $85
            </Text>
          </View>
        </View>

        <View style={styles.activitySection}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity style={styles.exportButton}>
              <Download size={16} color="#2563EB" />
              <Text style={styles.exportText}>Export</Text>
            </TouchableOpacity>
          </View>
          
          {mockRecentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityAction}>{activity.action}</Text>
                <Text style={styles.activityGroup}>{activity.group}</Text>
              </View>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          ))}
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Usage Trends</Text>
          <View style={styles.chartPlaceholder}>
            <BarChart3 size={48} color="#94A3B8" />
            <Text style={styles.chartPlaceholderText}>
              Chart visualization would be implemented here
            </Text>
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginVertical: 16,
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
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#2563EB',
  },
  periodText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    width: '48%',
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
  metricValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 8,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricChangeText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    marginLeft: 4,
  },
  insightsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 12,
  },
  insightCard: {
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
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginLeft: 8,
  },
  insightValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  activitySection: {
    marginBottom: 24,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  exportText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    marginLeft: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 2,
  },
  activityGroup: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  activityTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  chartSection: {
    marginBottom: 32,
  },
  chartPlaceholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 48,
    alignItems: 'center',
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
  chartPlaceholderText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 12,
    textAlign: 'center',
  },
});