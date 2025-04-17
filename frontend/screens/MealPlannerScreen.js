import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchMeals, updateMealStatus, deleteMeal } from '../../backend/components/request';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Basic_url } from '../../backend/config/config';

const MealPlannerScreen = () => {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [selectedTab, setSelectedTab] = useState('Upcoming'); // Default tab set to "Upcoming"
  const [meals, setMeals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const tabs = ['Upcoming', 'Completed']; // Tabs for meal status
  const navigation = useNavigation();

  const loadMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMeals(selectedDay); // Fetch meals for the selected day

      // Check and update the status of each meal
      for (const meal of data) {
        const formattedDate = meal.date.replace(/\//g, '-'); // Format date to ISO 8601
        const mealDateTime = new Date(`${formattedDate}T${meal.time}:00`);
        const now = new Date();

        if (mealDateTime < now) {
          await updateMealStatus(meal._id); // Update the meal's status
        }
      }

      const filteredMeals = data.filter((meal) =>
        selectedTab === 'Upcoming' ? meal.status === 'upcoming' : meal.status === 'completed'
      );
      setMeals((prevMeals) => ({ ...prevMeals, [selectedDay]: filteredMeals }));
    } catch (err) {
      setError('Failed to load meals');
      console.error('Error fetching meals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMealPress = (meal) => {
    // console.log('Mealxyz:', meal.recipeid);
    if (meal.type === 'recipe') {
      navigation.navigate('Details', { recipeId: meal.recipeid });
    } else if (meal.type === 'post') {
      navigation.navigate('PostDetails', { postId: meal.recipeid });
    }
  };

  const handleDeleteMeal = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this meal?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMeal(id); // Call the deleteMeal function
              loadMeals(); // Reload meals after deletion
            } catch (error) {
              console.error('Error deleting meal:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    loadMeals();
  }, [selectedDay, selectedTab]);

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [selectedDay, selectedTab])
  );

  const renderMealCard = (meal) => (
    <TouchableOpacity onPress={() => handleMealPress(meal)} style={styles.mealCard}>
      <Image
        source={{ uri: meal.type === 'recipe' ? meal.image : Basic_url + meal.image }}
        style={styles.mealImage}
      />
      <View style={styles.mealInfo}>
        <Text style={styles.mealType}>{meal.mealType}</Text>
        <Text style={styles.mealTitle}>{meal.title}</Text>
        <Text style={styles.mealTime}>{meal.time}</Text>
      </View>
      {selectedTab === 'Upcoming' && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleDeleteMeal(meal._id)} // Trigger delete confirmation
        >
          <Ionicons name="trash" size={20} color="#F59E0B" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderDayButton = ({ item: day }) => (
    <TouchableOpacity
      style={[styles.dayButton, selectedDay === day && styles.selectedDay]}
      onPress={() => setSelectedDay(day)}
    >
      <Text style={[styles.dayText, selectedDay === day && styles.selectedDayText]}>{day}</Text>
    </TouchableOpacity>
  );

  const renderTabButton = (tab) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabButton, selectedTab === tab && styles.selectedTab]}
      onPress={() => setSelectedTab(tab)}
    >
      <Text style={[styles.tabText, selectedTab === tab && styles.selectedTabText]}>{tab}</Text>
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
      return <Text style={styles.noMealsText}>No meals found for this day.</Text>;
    }

    return (
      <FlatList
        data={meals[selectedDay]}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => renderMealCard(item)}
        contentContainerStyle={styles.mealList}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meal Planner</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Feed')}>
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

      {/* Tabs */}
      <View style={styles.tabsContainer}>{tabs.map((tab) => renderTabButton(tab))}</View>

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
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedTab: {
    backgroundColor: '#F59E0B',
  },
  tabText: {
    fontWeight: '600',
    color: '#666',
  },
  selectedTabText: {
    color: '#fff',
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

export default MealPlannerScreen;