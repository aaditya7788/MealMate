import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeftIcon, PlusIcon } from 'react-native-heroicons/outline';
import { hp } from '../../helpers/common';
import Animated, { FadeInRight } from 'react-native-reanimated';
import AddMealModal from '../components/AddMealModal';
import { getSpecificPost } from '../../backend/components/postRequest';
import { addMeal } from '../../backend/components/request';
import { getAuthData } from '../../backend/LocalStorage/auth_store';
import { Basic_url } from '../../backend/config/config';

const { width } = Dimensions.get('window');

const PostDetailScreen = ({ backgroundColor = '#fff', homeTextColor = '#fbbf24' }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { postId } = route.params;

  const [recipe, setRecipe] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [day, setDay] = useState('Mon');
  const [time, setTime] = useState('');
  const [mealType, setMealType] = useState('Lunch');

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        const response = await getSpecificPost(postId);
        setRecipe(response);
        setImage(`${Basic_url}${response.image}`);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipeDetail();
  }, [postId]);

  const handleAddMeal = async () => {
    const authData = await getAuthData();

    try {
      const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      const now = new Date();
      const todayIndex = now.getDay();
      const mealDayIndex = dayMap[day];

      let mealDate = new Date(now);
      if (mealDayIndex !== todayIndex) {
        const dayDifference = (mealDayIndex - todayIndex + 7) % 7;
        mealDate.setDate(mealDate.getDate() + dayDifference);
      }

      const formattedDate = mealDate.toISOString().split('T')[0].replace(/-/g, '/');

      const mealData = {
        userId: authData._id,
        day,
        date: formattedDate,
        time,
        mealType,
        title: recipe.name,
        image: recipe.image,
        recipeid: postId,
        type: 'post',
        status: 'upcoming',
      };

      console.log('Adding meal:', mealData);
      await addMeal(mealData);
      navigation.navigate('MealPlanner');
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={homeTextColor} />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load recipe details</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.mainScrollContainer}>
        {/* Recipe Image */}
        <Image source={{ uri: image }} style={styles.image} />

        {/* Back and Add Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeftIcon color={homeTextColor} size={hp(3.5)} strokeWidth={4.5} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
            <PlusIcon color="gray" size={hp(3.5)} strokeWidth={4.5} />
          </TouchableOpacity>
        </View>

        {/* Recipe Name and Type */}
        <View style={styles.recipeName}>
          <Text style={styles.name}>{recipe.name}</Text>
          <Text style={styles.recipeType}>{recipe.dietType}</Text>
        </View>

        {/* Ingredients */}
        <ScrollView
          horizontal
          style={styles.ingredientsContainer}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 0 }}
        >
          {recipe.ingredients.map((ingredient, index) => (
            <Animated.View
              key={index}
              style={styles.ingredientItem}
              entering={FadeInRight.springify().delay(100 * index)}
            >
              <Image
                style={styles.ingredientImage}
                source={{
                  uri: `https://www.themealdb.com/images/ingredients/${ingredient.name.toLowerCase()}.png`,
                }}
              />
              <View style={styles.ingredientDetails}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientMeasure}>{ingredient.quantity}</Text>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.instructions.split('\n').map((line, index) => (
            <Text key={index} style={styles.instructionText}>
              {line}
            </Text>
          ))}
        </View>

        {/* Add Meal Modal */}
        <AddMealModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          day={day}
          setDay={setDay}
          time={time}
          setTime={setTime}
          mealType={mealType}
          setMealType={setMealType}
          handleAddMeal={handleAddMeal}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainScrollContainer: {
    flexGrow: 1,
    marginBottom: 0,
  },
  image: {
    width: width * 0.95,
    height: width * 0.95,
    borderRadius: 50,
    alignSelf: 'center',
  },
  buttons: {
    position: 'absolute',
    marginTop: 20,
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: hp(1),
    backgroundColor: 'white',
    borderRadius: 999,
  },
  addButton: {
    padding: hp(1),
    backgroundColor: 'white',
    borderRadius: 999,
  },
  recipeName: {
    justifyContent: 'flex-start',
    marginLeft: 30,
  },
  name: {
    marginTop: 30,
    fontSize: 32,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.8)',
  },
  recipeType: {
    fontSize: 20,
    color: 'rgba(0,0,0,0.5)',
  },
  ingredientsContainer: {
    flexGrow: 0,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  ingredientItem: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  ingredientImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fbbf24',
  },
  ingredientDetails: {
    marginTop: 5,
    alignItems: 'center',
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ingredientMeasure: {
    fontSize: 14,
    color: 'gray',
  },
  instructionsContainer: {
    justifyContent: 'flex-start',
    marginTop: 10,
    marginLeft: 4,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.8)',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 16,
    marginVertical: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default PostDetailScreen;