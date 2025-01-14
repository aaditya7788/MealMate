import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeftIcon, PlusIcon } from 'react-native-heroicons/outline';
import { HeartIcon } from 'react-native-heroicons/solid';
import { getCon, hp } from '../../helpers/common';
import { fetchDetails } from '../../Api/request';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInRight, RollInLeft } from 'react-native-reanimated';
const DetailScreen = ({ backgroundColor = '#fff', homeTextColor = '#fbbf24' }) => {
  const route = useRoute();
  const { recipeId } = route.params || {};
  const Navigation = useNavigation();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const data = await fetchDetails(recipeId);
        setRecipe(data.meals[0]);
      } catch (error) {
        console.error('Error loading recipe:', error);
        setError('Error loading recipe');
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [recipeId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={homeTextColor} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No recipe found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style='light' />

      <ScrollView contentContainerStyle={styles.mainScrollContainer}>
        {/* Recipe Image */}
        <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />

        {/* Back and Favorite Buttons */}
        <View style={styles.Buttons}>
          <TouchableOpacity style={styles.BackButton} onPressOut={() => Navigation.goBack()}>
            <ChevronLeftIcon color={homeTextColor} size={hp(3.5)} strokeWidth={4.5} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.FavButton}>
            <HeartIcon color={'gray'} size={hp(3.5)} strokeWidth={4.5} />
          </TouchableOpacity>
        </View>

        {/* Recipe Name and Type */}
        <View style={styles.RecipeName}>
          <Text style={styles.Name}>{recipe.strMeal}</Text>
          <Text style={styles.RecipeType}>{recipe.strArea}</Text>
        </View>

        {/* Ingredients Horizontal ScrollView */}
        <ScrollView 
          horizontal 
          style={styles.ingredientsContainer}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 0 }}
        >
          {Object.keys(recipe)
            .filter(key => key.startsWith('strIngredient') && recipe[key])
            .map((key, index) => (
              <Animated.View key={index} style={styles.ingredientItem} entering={FadeInRight.springify().delay(100*index)}>
                <Image
                  style={styles.ingredientImage}
                  source={{ uri: `https://www.themealdb.com/images/ingredients/${recipe[key].toLowerCase()}.png` }}
                />
                <View style={styles.ingredientDetails}>
                  <Text style={styles.ingredientName}>{recipe[key]}</Text>
                  <Text style={styles.ingredientMeasure}>{recipe[`strMeasure${index + 1}`]}</Text>
                </View>
              </Animated.View>
            ))}
        </ScrollView>

        {/* Instructions Section */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.strInstructions.split('\n').map((line, index) => (
            <Text key={index} style={styles.instructionText}>
              {line}
            </Text>
          ))}
        </View>

        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainScrollContainer: {
    flexGrow: 1,
    marginBottom: 0,
  },
  image: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 200,
    height: 200,
    borderRadius: 50,
    padding: 190,
    backgroundColor: 'black',
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
    justifyContent: getCon('flex-start', 'flex-end'),
    marginLeft: 30,
    justifyContent: 'flex-start',
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
  videoContainer: {
    justifyContent: 'flex-start',
    marginTop: 10,
    marginLeft: 4,
    paddingHorizontal: 20,
    marginBottom: 10
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
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default DetailScreen;
