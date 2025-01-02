import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MealPlannerScreen = () => {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const mealPlan = {
    Mon: {
      breakfast: {
        title: 'Oatmeal Bowl',
        calories: '320 kcal',
        image: require('../../assets/images/logo.png'),
        time: '8:00 AM',
      },
      lunch: {
        title: 'Chicken Salad',
        calories: '450 kcal',
        image: require('../../assets/images/logo.png'),
        time: '12:30 PM',
      },
      dinner: {
        title: 'Grilled Salmon',
        calories: '580 kcal',
        image: require('../../assets/images/logo.png'),
        time: '7:00 PM',
      },
      snacks: {
        title: 'Greek Yogurt',
        calories: '150 kcal',
        image: require('../../assets/images/logo.png'),
        time: '4:00 PM',
      },
    },
  };

  const renderMealCard = (meal, mealType) => (
    <View style={styles.mealCard}>
      <Image source={meal.image} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <Text style={styles.mealType}>{mealType}</Text>
        <Text style={styles.mealTitle}>{meal.title}</Text>
        <Text style={styles.mealTime}>{meal.time}</Text>
        <Text style={styles.mealCalories}>{meal.calories}</Text>
      </View>
      <TouchableOpacity style={styles.editButton}>
        <Ionicons name="pencil" size={20} color="#F59E0B" />
      </TouchableOpacity>
    </View>
  );

  const renderDayButton = ({ item: day }) => (
    <TouchableOpacity
      style={[styles.dayButton, selectedDay === day && styles.selectedDay]}
      onPress={() => setSelectedDay(day)}
    >
      <Text style={[styles.dayText, selectedDay === day && styles.selectedDayText]}>{day}</Text>
    </TouchableOpacity>
  );

  const renderMealList = () => {
    if (!mealPlan[selectedDay]) {
      return <ActivityIndicator size="large" color="#F59E0B" />;
    }

    return (
      <FlatList
        data={Object.entries(mealPlan[selectedDay] || {})}
        keyExtractor={([type]) => type}
        renderItem={({ item: [type, meal] }) =>
          renderMealCard(meal, type.charAt(0).toUpperCase() + type.slice(1))
        }
        contentContainerStyle={styles.mealList}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meal Planner</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color="#F59E0B" />
        </TouchableOpacity>
      </View>

      {/* Calendar Strip */}
      <View style={styles.calendarStrip}>
        <FlatList
          data={days}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={renderDayButton}
        />
      </View>

      {/* Nutrition Summary */}
      <View style={styles.nutritionSummary}>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>1,500</Text>
          <Text style={styles.nutritionLabel}>Calories</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>120g</Text>
          <Text style={styles.nutritionLabel}>Protein</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>45g</Text>
          <Text style={styles.nutritionLabel}>Fat</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>180g</Text>
          <Text style={styles.nutritionLabel}>Carbs</Text>
        </View>
      </View>

      {/* Meal List */}
      {renderMealList()}
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
  calendarStrip: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    width: 60,
    alignItems: 'center',
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
  nutritionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
  },
  mealList: {
    padding: 15,
  },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 15,
  },
  mealType: {
    color: '#F59E0B',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  mealTime: {
    color: '#666',
    fontSize: 12,
  },
  mealCalories: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  editButton: {
    padding: 5,
  },
});

export default MealPlannerScreen;
