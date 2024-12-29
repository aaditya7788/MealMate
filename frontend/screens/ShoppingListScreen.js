import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ShoppingListScreen = () => {
  const [newItem, setNewItem] = useState('');

  const categories = [
    {
      title: 'Fruits & Vegetables',
      items: [
        { name: 'Spinach', quantity: '2 bunches', checked: false },
        { name: 'Apples', quantity: '6 pieces', checked: true },
        { name: 'Bananas', quantity: '1 bunch', checked: false },
      ]
    },
    {
      title: 'Protein',
      items: [
        { name: 'Chicken Breast', quantity: '500g', checked: false },
        { name: 'Eggs', quantity: '12 pieces', checked: false },
        { name: 'Salmon', quantity: '400g', checked: true },
      ]
    },
    {
      title: 'Grains',
      items: [
        { name: 'Brown Rice', quantity: '1kg', checked: false },
        { name: 'Quinoa', quantity: '500g', checked: true },
      ]
    },
  ];

  const renderCategory = (category) => (
    <View key={category.title} style={styles.category}>
      <Text style={styles.categoryTitle}>{category.title}</Text>
      {category.items.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <TouchableOpacity style={styles.checkbox}>
            {item.checked && (
              <Ionicons name="checkmark-circle" size={24} color="#F59E0B" />
            )}
            {!item.checked && (
              <Ionicons name="ellipse-outline" size={24} color="#ddd" />
            )}
          </TouchableOpacity>
          <View style={styles.itemInfo}>
            <Text style={[
              styles.itemName,
              item.checked && styles.checkedItem
            ]}>{item.name}</Text>
            <Text style={styles.itemQuantity}>{item.quantity}</Text>
          </View>
          <TouchableOpacity style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping List</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#F59E0B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="print-outline" size={24} color="#F59E0B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Item Section */}
      <View style={styles.addSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add new item"
            value={newItem}
            onChangeText={setNewItem}
          />
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Shopping List */}
      <ScrollView style={styles.list}>
        {categories.map(category => renderCategory(category))}
      </ScrollView>

      {/* Summary Footer */}
      <View style={styles.footer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Items:</Text>
          <Text style={styles.summaryValue}>8</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Completed:</Text>
          <Text style={styles.summaryValue}>3</Text>
        </View>
        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear Completed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  addSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  category: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  checkedItem: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    padding: 5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  clearButtonText