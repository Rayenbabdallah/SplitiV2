import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, CreditCard as Edit, Receipt } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  runOnJS
} from 'react-native-reanimated';

export default function CreateExpenseScreen() {
  const router = useRouter();
  
  // Animation values
  const scanButtonScale = useSharedValue(1);
  const manualButtonScale = useSharedValue(1);

  const handleScanReceipt = () => {
    scanButtonScale.value = withSpring(0.95, { duration: 100 }, () => {
      scanButtonScale.value = withSpring(1);
      runOnJS(() => {
        router.push('/expense/scan');
      })();
    });
  };

  const handleManualEntry = () => {
    manualButtonScale.value = withSpring(0.95, { duration: 100 }, () => {
      manualButtonScale.value = withSpring(1);
      runOnJS(() => {
        router.push('/expense/manual');
      })();
    });
  };

  const scanButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scanButtonScale.value }]
  }));

  const manualButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: manualButtonScale.value }]
  }));

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
          <Text style={styles.headerTitle}>Add Expense</Text>
          <Text style={styles.headerSubtitle}>Choose how to add your expense</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsSection}>
          <Animated.View style={scanButtonAnimatedStyle}>
            <TouchableOpacity style={styles.optionCard} onPress={handleScanReceipt}>
              <View style={styles.optionIcon}>
                <Camera size={32} color="#2563EB" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Scan Receipt</Text>
                <Text style={styles.optionDescription}>
                  Use your camera to automatically extract items and amounts from a paper receipt
                </Text>
                <View style={styles.optionFeatures}>
                  <Text style={styles.featureText}>• Auto-extract line items</Text>
                  <Text style={styles.featureText}>• OCR technology</Text>
                  <Text style={styles.featureText}>• Quick and accurate</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={manualButtonAnimatedStyle}>
            <TouchableOpacity style={styles.optionCard} onPress={handleManualEntry}>
              <View style={styles.optionIcon}>
                <Edit size={32} color="#059669" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Manual Entry</Text>
                <Text style={styles.optionDescription}>
                  Add items manually by entering names, prices, and quantities
                </Text>
                <View style={styles.optionFeatures}>
                  <Text style={styles.featureText}>• Full control over details</Text>
                  <Text style={styles.featureText}>• Custom categories</Text>
                  <Text style={styles.featureText}>• Perfect for digital receipts</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Tips for best results</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipText}>• Ensure receipt is well-lit and flat</Text>
            <Text style={styles.tipText}>• Include all items you want to split</Text>
            <Text style={styles.tipText}>• Check extracted amounts for accuracy</Text>
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
  optionsSection: {
    marginTop: 24,
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  optionContent: {
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  optionFeatures: {
    alignSelf: 'stretch',
  },
  featureText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 4,
  },
  tipsSection: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginBottom: 12,
  },
  tipsList: {
    gap: 6,
  },
  tipText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 16,
  },
});