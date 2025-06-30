import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolateColor,
  runOnJS
} from 'react-native-reanimated';

interface FilterOption {
  key: string;
  label: string;
  count: number;
}

interface AnimatedFilterTabsProps {
  filters: FilterOption[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  activeColor?: string;
  inactiveColor?: string;
}

export default function AnimatedFilterTabs({
  filters,
  selectedFilter,
  onFilterChange,
  activeColor = '#2563EB',
  inactiveColor = '#64748B'
}: AnimatedFilterTabsProps) {
  
  const handleFilterPress = (filterKey: string) => {
    if (filterKey !== selectedFilter) {
      onFilterChange(filterKey);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollView}
      >
        {filters.map((filter) => {
          const isSelected = selectedFilter === filter.key;
          
          return (
            <FilterTab
              key={filter.key}
              filter={filter}
              isSelected={isSelected}
              onPress={() => handleFilterPress(filter.key)}
              activeColor={activeColor}
              inactiveColor={inactiveColor}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

interface FilterTabProps {
  filter: FilterOption;
  isSelected: boolean;
  onPress: () => void;
  activeColor: string;
  inactiveColor: string;
}

function FilterTab({ filter, isSelected, onPress, activeColor, inactiveColor }: FilterTabProps) {
  const scale = useSharedValue(1);
  const backgroundProgress = useSharedValue(isSelected ? 1 : 0);
  const textProgress = useSharedValue(isSelected ? 1 : 0);

  React.useEffect(() => {
    backgroundProgress.value = withSpring(isSelected ? 1 : 0, {
      damping: 20,
      stiffness: 200,
    });
    textProgress.value = withSpring(isSelected ? 1 : 0, {
      damping: 20,
      stiffness: 200,
    });
  }, [isSelected]);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    runOnJS(onPress)();
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      backgroundProgress.value,
      [0, 1],
      ['#FFFFFF', activeColor]
    );

    return {
      backgroundColor,
      transform: [{ scale: scale.value }],
      borderColor: interpolateColor(
        backgroundProgress.value,
        [0, 1],
        ['#E2E8F0', activeColor]
      ),
      shadowOpacity: interpolateColor(
        backgroundProgress.value,
        [0, 1],
        [0.05, 0.15]
      ),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      textProgress.value,
      [0, 1],
      [inactiveColor, '#FFFFFF']
    );

    return { color };
  });

  const animatedCountStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      backgroundProgress.value,
      [0, 1],
      ['#F1F5F9', '#FFFFFF']
    );

    const color = interpolateColor(
      textProgress.value,
      [0, 1],
      ['#94A3B8', activeColor]
    );

    return {
      backgroundColor,
      color,
    };
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
      style={styles.touchableArea}
    >
      <Animated.View style={[styles.filterButton, animatedContainerStyle]}>
        <Animated.Text style={[styles.filterText, animatedTextStyle]}>
          {filter.label}
        </Animated.Text>
        <Animated.View style={[styles.filterCount, animatedCountStyle]}>
          <Animated.Text style={[styles.filterCountText, animatedCountStyle]}>
            {filter.count}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  scrollView: {
    flexGrow: 0,
  },
  contentContainer: {
    paddingRight: 16,
  },
  touchableArea: {
    marginRight: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 6,
    elevation: 3,
    minHeight: 44,
    minWidth: 60,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
  filterCount: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  filterCountText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
});