import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddMealModal = ({ modalVisible, setModalVisible, day, setDay, time, setTime, mealType, setMealType, handleAddMeal }) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Set default day and time to the current day and time
  useEffect(() => {
    if (modalVisible) {
      const now = new Date();
      const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
      const currentTime = now.toTimeString().slice(0, 5); // Format as HH:MM
      setDay(currentDay);
      setTime(currentTime);
      setSelectedDate(now);
    }
  }, [modalVisible]);

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(selectedTime.getHours());
      updatedDate.setMinutes(selectedTime.getMinutes());
      setSelectedDate(updatedDate);

      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);

      console.log('Updated Time:', updatedDate);
    }
  };

  const onDayChange = (selectedDay) => {
    const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(selectedDay);
    const updatedDate = new Date(selectedDate);
    const currentDayIndex = updatedDate.getDay();
    const dayDifference = dayIndex - currentDayIndex;

    updatedDate.setDate(updatedDate.getDate() + dayDifference);
    setSelectedDate(updatedDate);
    setDay(selectedDay);

    console.log('Updated Day:', updatedDate);
  };

  const handleAddMealWithDebug = () => {
    console.log('Final Selected Date:', selectedDate);
    console.log('Day:', day);
    console.log('Time:', time);
    handleAddMeal();
  };

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
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <TextInput
              style={styles.input}
              placeholder="Time"
              value={time}
              editable={false}
            />
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
          <Text style={styles.label}>Select Day</Text>
          <View style={styles.daySelector}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.dayButton, day === d && styles.selectedDay]}
                onPress={() => onDayChange(d)}
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
          <TouchableOpacity style={styles.addButton} onPress={handleAddMealWithDebug}>
            <Text style={styles.addButtonText}>Add Meal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  dayButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    margin: 5,
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
  addButton: {
    backgroundColor: '#F59E0B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default AddMealModal;