import React, { useState, useEffect } from 'react';
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
import { fetchMeals } from '../../backend/components/request';
import { useNavigation } from '@react-navigation/native';

const MealPlannerScreen = () => {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [meals, setMeals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const Navigation = useNavigation();

  useEffect(() => {
    const loadMeals = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMeals(selectedDay);
        // console.log('Data:', data);
        setMeals((prevMeals) => ({ ...prevMeals, [selectedDay]: data }));
      } catch (err) {
        setError('Failed to load meals');
        console.error('Error fetching meals:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, [selectedDay]);

  const renderMealCard = (meal, mealType) => (
    <View style={styles.mealCard}>
      <Image source={{ uri: meal.image }} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <Text style={styles.mealType}>{mealType}</Text>
        <Text style={styles.mealTitle}>{meal.title}</Text>
        <Text style={styles.mealTime}>{meal.time}</Text>
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
    if (loading) {
      return <ActivityIndicator size="large" color="#F59E0B" />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (!meals[selectedDay] || meals[selectedDay].length === 0) {
      return <Text style={styles.noMealsText}>No meals planned for today.</Text>;
    }

    return (
      <FlatList
        data={meals[selectedDay]}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => renderMealCard(item, item.type)}
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
          <Ionicons name="add-circle" size={24} color="#F59E0B" onPress={()=>Navigation.navigate('Home')}/>
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  noMealsText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#666',
  },
});

export default MealPlannerScreen;``