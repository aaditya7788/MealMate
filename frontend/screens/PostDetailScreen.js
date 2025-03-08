import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Image, TouchableOpacity, StatusBar, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeftIcon, PlusIcon } from 'react-native-heroicons/outline';
import { hp } from '../../helpers/common';
import Animated, { FadeInRight } from 'react-native-reanimated';
import AddMealModal from '../components/AddMealModal';
import { getSpecificPost } from '../../backend/components/postRequest';
import { addMeal } from '../../backend/components/request';
import { getAuthData } from '../../backend/LocalStorage/auth_store';
import { Basic_url } from '../../backend/config/config';

const { width, height } = Dimensions.get('window');

const PostDetailScreen = ({ backgroundColor = '#fff', homeTextColor = '#fbbf24' }) => {
  const Navigation = useNavigation();
  const route = useRoute();
  const { postId } = route.params;
  console.log('Recipe ID:', postId);

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
    const authdata = await getAuthData();
    try {
      const mealData = {
        userId: authdata._id, // Replace with actual userId
        day,
        time,
        mealType, // Use mealType instead of meal_type
        title: recipe.name,
        image: recipe.image,
        type: 'post',
      };
      // console.log('Adding meal:', mealData);
      await addMeal(mealData);
      Navigation.navigate('MealPlanner');
      setModalVisible(false);
      // Optionally, you can show a success message or refresh the meal list
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

        {/* Back and Favorite Buttons */}
        <View style={styles.Buttons}>
          <TouchableOpacity style={styles.BackButton} onPressOut={() => Navigation.goBack()}>
            <ChevronLeftIcon color={homeTextColor} size={hp(3.5)} strokeWidth={4.5} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.FavButton}>
            <PlusIcon color={'gray'} size={hp(3.5)} strokeWidth={4.5} />
          </TouchableOpacity>
        </View>

        {/* Recipe Name and Type */}
        <View style={styles.RecipeName}>
          <Text style={styles.Name}>{recipe.name}</Text>
          <Text style={styles.RecipeType}>{recipe.dietType}</Text>
        </View>

        {/* Ingredients Horizontal ScrollView */}
        <ScrollView 
          horizontal 
          style={styles.ingredientsContainer}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 0 }}
        >
          {recipe.ingredients.map((ingredient, index) => (
            <Animated.View key={index} style={styles.ingredientItem} entering={FadeInRight.springify().delay(100*index)}>
              <Image
                style={styles.ingredientImage}
                source={{ uri: `https://www.themealdb.com/images/ingredients/${ingredient.name.toLowerCase()}.png` }}
              />
              <View style={styles.ingredientDetails}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientMeasure}>{ingredient.quantity}</Text>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Instructions Section */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.instructions.split('\n').map((line, index) => (
            <Text key={index} style={styles.instructionText}>
              {line}
            </Text>
          ))}
        </View>

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
  Buttons: {
    position: 'absolute',
    marginTop: 20,
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  BackButton: {
    padding: hp(1),
    backgroundColor: 'white',
    borderRadius: 999,
  },
  FavButton: {
    padding: hp(1),
    backgroundColor: 'white',
    borderRadius: 999,
  },
  RecipeName: {
    justifyContent: 'flex-start',
    marginLeft: 30,
  },
  Name: {
    marginTop: 30,
    fontSize: 32,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.8)',
  },
  RecipeType: {
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