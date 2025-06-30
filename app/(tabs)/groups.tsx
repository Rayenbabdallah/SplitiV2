import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Search } from 'lucide-react-native';
import Header from '@/components/Header';
import GroupCard from '@/components/GroupCard';
import AnimatedFilterTabs from '@/components/AnimatedFilterTabs';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
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
  {
    id: '5',
    name: 'Coffee Lovers',
    type: 'friends' as const,
    members: [
      { id: '1', name: 'Sam' },
      { id: '2', name: 'Riley' },
    ],
    lastActivity: '2 weeks ago',
    pendingAmount: 0,
    settledAmount: 156.30,
  },
];

export default function GroupsScreen() {
  const router = useRouter();
  const [groups] = useState(mockGroups);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'friends' | 'roommates' | 'work' | 'travel'>('all');
  const mounted = useSharedValue(0);
  const createButtonScale = useSharedValue(1);

  React.useEffect(() => {
    mounted.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

  const handleGroupPress = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };

  const handleCreateGroup = () => {
    createButtonScale.value = withSpring(0.95, { duration: 100 }, () => {
      createButtonScale.value = withSpring(1);
    });
    // Navigate to create group screen
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || group.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filters = [
    { key: 'all', label: 'All', count: groups.length },
    { key: 'friends', label: 'Friends', count: groups.filter(g => g.type === 'friends').length },
    { key: 'roommates', label: 'Roommates', count: groups.filter(g => g.type === 'roommates').length },
    { key: 'work', label: 'Work', count: groups.filter(g => g.type === 'work').length },
    { key: 'travel', label: 'Travel', count: groups.filter(g => g.type === 'travel').length },
  ];

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
      [20, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const createButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: createButtonScale.value }],
  }));

  return (
    <View style={styles.container}>
      <Header
        title="Groups"
        subtitle="Manage your expense groups"
      />
      
      <Animated.View style={[styles.searchSection, searchAnimatedStyle]}>
        <View style={styles.searchContainer}>
          <Search size={16} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
        </View>
        
        <Animated.View style={createButtonAnimatedStyle}>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
            <Plus size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <AnimatedFilterTabs
        filters={filters}
        selectedFilter={selectedFilter}
        onFilterChange={(filter) => setSelectedFilter(filter as any)}
        activeColor="#2563EB"
        inactiveColor="#64748B"
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.groupsList}>
          {filteredGroups.map((group, index) => (
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

        {filteredGroups.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No groups found</Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? 'Try adjusting your search or filters'
                : 'Create your first group to start splitting expenses'
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
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
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
  createButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  groupsList: {
    paddingBottom: 32,
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