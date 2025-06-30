import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Trash2, DollarSign, Package, Hash } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolateColor,
  runOnJS
} from 'react-native-reanimated';

interface ExpenseItem {
  id: string;
  name: string;
  price: string;
  quantity: string;
}

export default function ManualEntryScreen() {
  const router = useRouter();
  const [items, setItems] = useState<ExpenseItem[]>([
    { id: '1', name: '', price: '', quantity: '1' }
  ]);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [tax, setTax] = useState('');
  const [tip, setTip] = useState('');

  // Animation values
  const addButtonScale = useSharedValue(1);
  const submitButtonScale = useSharedValue(1);

  const addItem = () => {
    // Animate button press
    addButtonScale.value = withSpring(0.95, { duration: 100 }, () => {
      addButtonScale.value = withSpring(1);
    });

    const newItem: ExpenseItem = {
      id: Date.now().toString(),
      name: '',
      price: '',
      quantity: '1'
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof ExpenseItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return total + (price * quantity);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = parseFloat(tax) || 0;
    const tipAmount = parseFloat(tip) || 0;
    return subtotal + taxAmount + tipAmount;
  };

  const validateAndContinue = () => {
    if (!expenseTitle.trim()) {
      Alert.alert('Error', 'Please enter an expense title');
      return;
    }

    const validItems = items.filter(item => 
      item.name.trim() && item.price.trim() && parseFloat(item.price) > 0
    );

    if (validItems.length === 0) {
      Alert.alert('Error', 'Please add at least one valid item');
      return;
    }

    // Animate submit button
    submitButtonScale.value = withSpring(0.95, { duration: 100 }, () => {
      submitButtonScale.value = withSpring(1);
      runOnJS(() => {
        router.push('/expense/assign');
      })();
    });
  };

  const addButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addButtonScale.value }]
  }));

  const submitButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submitButtonScale.value }]
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
          <Text style={styles.headerTitle}>Manual Entry</Text>
          <Text style={styles.headerSubtitle}>Add items manually</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.sectionTitle}>Expense Details</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Expense Title</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="e.g., Team Lunch, Grocery Shopping"
              value={expenseTitle}
              onChangeText={setExpenseTitle}
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.itemsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Items</Text>
            <Animated.View style={addButtonAnimatedStyle}>
              <TouchableOpacity style={styles.addButton} onPress={addItem}>
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add Item</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {items.map((item, index) => (
            <Animated.View 
              key={item.id} 
              style={styles.itemCard}
              entering={withSpring}
              exiting={withTiming}
            >
              <View style={styles.itemHeader}>
                <View style={styles.itemNumber}>
                  <Text style={styles.itemNumberText}>{index + 1}</Text>
                </View>
                {items.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeItem(item.id)}
                  >
                    <Trash2 size={16} color="#DC2626" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.itemInputs}>
                <View style={styles.nameInputContainer}>
                  <View style={styles.inputIconContainer}>
                    <Package size={16} color="#64748B" />
                  </View>
                  <TextInput
                    style={styles.nameInput}
                    placeholder="Item name"
                    value={item.name}
                    onChangeText={(value) => updateItem(item.id, 'name', value)}
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.priceQuantityRow}>
                  <View style={styles.priceInputContainer}>
                    <View style={styles.inputIconContainer}>
                      <DollarSign size={16} color="#64748B" />
                    </View>
                    <TextInput
                      style={styles.priceInput}
                      placeholder="0.00"
                      value={item.price}
                      onChangeText={(value) => updateItem(item.id, 'price', value)}
                      keyboardType="decimal-pad"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  <View style={styles.quantityInputContainer}>
                    <View style={styles.inputIconContainer}>
                      <Hash size={16} color="#64748B" />
                    </View>
                    <TextInput
                      style={styles.quantityInput}
                      placeholder="1"
                      value={item.quantity}
                      onChangeText={(value) => updateItem(item.id, 'quantity', value)}
                      keyboardType="number-pad"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>
              </View>

              {item.name && item.price && (
                <View style={styles.itemTotal}>
                  <Text style={styles.itemTotalText}>
                    ${((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1)).toFixed(2)}
                  </Text>
                </View>
              )}
            </Animated.View>
          ))}
        </View>

        <View style={styles.additionalSection}>
          <Text style={styles.sectionTitle}>Additional Charges</Text>
          
          <View style={styles.additionalInputs}>
            <View style={styles.additionalInputContainer}>
              <Text style={styles.additionalLabel}>Tax</Text>
              <View style={styles.additionalInputWrapper}>
                <DollarSign size={16} color="#64748B" />
                <TextInput
                  style={styles.additionalInput}
                  placeholder="0.00"
                  value={tax}
                  onChangeText={setTax}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            <View style={styles.additionalInputContainer}>
              <Text style={styles.additionalLabel}>Tip</Text>
              <View style={styles.additionalInputWrapper}>
                <DollarSign size={16} color="#64748B" />
                <TextInput
                  style={styles.additionalInput}
                  placeholder="0.00"
                  value={tip}
                  onChangeText={setTip}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>${calculateSubtotal().toFixed(2)}</Text>
            </View>
            {parseFloat(tax) > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax:</Text>
                <Text style={styles.summaryValue}>${parseFloat(tax).toFixed(2)}</Text>
              </View>
            )}
            {parseFloat(tip) > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tip:</Text>
                <Text style={styles.summaryValue}>${parseFloat(tip).toFixed(2)}</Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${calculateTotal().toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Animated.View style={submitButtonAnimatedStyle}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={validateAndContinue}
          >
            <Text style={styles.continueButtonText}>Continue to Assignment</Text>
          </TouchableOpacity>
        </Animated.View>
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
  titleSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 12,
  },
  inputContainer: {
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
  inputLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  itemsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  itemCard: {
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemNumberText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  removeButton: {
    padding: 4,
  },
  itemInputs: {
    gap: 12,
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FAFBFC',
  },
  inputIconContainer: {
    marginRight: 8,
  },
  nameInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    paddingVertical: 12,
  },
  priceQuantityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInputContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FAFBFC',
  },
  priceInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    paddingVertical: 12,
  },
  quantityInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FAFBFC',
  },
  quantityInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    paddingVertical: 12,
    textAlign: 'center',
  },
  itemTotal: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'flex-end',
  },
  itemTotalText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
  },
  additionalSection: {
    marginBottom: 24,
  },
  additionalInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  additionalInputContainer: {
    flex: 1,
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
  additionalLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 8,
  },
  additionalInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FAFBFC',
  },
  additionalInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    paddingVertical: 12,
    marginLeft: 8,
  },
  summarySection: {
    marginBottom: 24,
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
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
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
  continueButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});