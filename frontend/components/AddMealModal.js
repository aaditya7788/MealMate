import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet, Modal } from 'react-native';

const AddMealModal = ({ modalVisible, setModalVisible, day, setDay, time, setTime, mealType, setMealType, handleAddMeal }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Meal</Text>
          <TextInput
            style={styles.input}
            placeholder="Time"
            value={time}
            onChangeText={setTime}
          />
          <Text style={styles.label}>Select Day</Text>
          <View style={styles.daySelector}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.dayButton, day === d && styles.selectedDay]}
                onPress={() => setDay(d)}
              >
                <Text style={[styles.dayText, day === d && styles.selectedDayText]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Select Meal Type</Text>
          <View style={styles.mealTypeSelector}>
            {['Breakfast', 'Lunch', 'Dinner'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.mealTypeButton, mealType === type && styles.selectedMealType]}
                onPress={() => setMealType(type)}
              >
                <Text style={[styles.mealTypeText, mealType === type && styles.selectedMealTypeText]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button title="Add Meal" onPress={handleAddMeal} color={'#F59E0B'}/>
          <Button title="Cancel" onPress={() => setModalVisible(false)} color={'#ddd'}/>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  daySelector: {
    flexDirection: 'row',
    //justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  dayButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  selectedDay: {
    backgroundColor: '#F59E0B',
  },
  dayText: {
    fontWeight: '600',
    color: '#666',
  },
  selectedDayText: {
    color: '#fff',
  },
  mealTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  mealTypeButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  selectedMealType: {
    backgroundColor: '#F59E0B',
  },
  mealTypeText: {
    fontWeight: '600',
    color: '#666',
  },
  selectedMealTypeText: {
    color: '#fff',
  },
});

export default AddMealModal;