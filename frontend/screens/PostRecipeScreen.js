import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  RefreshControl,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { postRecipe, uploadRecipeImage, searchIngredients } from '../../backend/components/postRequest';
import { getAuthData } from '../../backend/LocalStorage/auth_store';

const PostRecipeScreen = () => {
  const [image, setImage] = useState(null);
  const [recipeName, setRecipeName] = useState('');
  const [dietType, setDietType] = useState('Veg');
  const [mealType, setMealType] = useState('Breakfast');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [instructions, setInstructions] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleSearchIngredients = async (query) => {
    if (query.length > 0) {
      try {
        const results = await searchIngredients(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching ingredients:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    const authdata = await getAuthData();
    const recipeData = {
      uid: authdata._id, // Replace with actual UID
      name: recipeName,
      dietType,
      mealType,
      instructions,
      ingredients,
    };

    try {
      // Step 1: Create the post without the image to get the post_id
      const response = await postRecipe(recipeData);
      const postId = response.post._id;
      console.log('Recipe posted successfully:', postId);

      // Step 2: Rename the image file to post_id.format
      if (image) {
        const filename = `${postId}.jpg`; // Assuming the image is in jpg format
        const formData = new FormData();
        const match = /\.(\w+)$/.exec(image.split('/').pop());
        const type = match ? `image/${match[1]}` : `image`;
        formData.append('image', { uri: image, name: filename, type });

        // Step 3: Upload the image with the new name
        const imageResponse = await uploadRecipeImage(postId, formData);
        console.log('Image uploaded successfully:', imageResponse);
      }
    } catch (error) {
      console.error('Error posting recipe:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Reset all state variables to their initial values
    setImage(null);
    setRecipeName('');
    setDietType('Veg');
    setMealType('Breakfast');
    setIngredients([{ name: '', quantity: '' }]);
    setInstructions('');
    setSearchResults([]);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <FlatList
      style={styles.container}
      data={[]}
      ListHeaderComponent={
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Post Recipe</Text>
          </View>

          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="add" size={50} color="#ccc" />
                <Text style={styles.imagePickerText}>Pick an image</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.nameContainer}>
            <Text style={styles.label}>Recipe Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter recipe name"
              value={recipeName}
              onChangeText={setRecipeName}
            />
          </View>

          <View style={styles.dietTypeContainer}>
            <Text style={styles.label}>Diet Type</Text>
            {['Veg', 'Non-Veg', 'Vegan'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.dietTypeButton,
                  dietType === type && styles.selectedDietType,
                ]}
                onPress={() => setDietType(type)}
              >
                <Text
                  style={[
                    styles.dietTypeText,
                    dietType === type && styles.selectedDietTypeText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.mealTypeContainer}>
            <Text style={styles.label}>Meal Type</Text>
            {['Breakfast', 'Lunch', 'Dinner'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.mealTypeButton,
                  mealType === type && styles.selectedMealType,
                ]}
                onPress={() => setMealType(type)}
              >
                <Text
                  style={[
                    styles.mealTypeText,
                    mealType === type && styles.selectedMealTypeText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.ingredientsContainer}>
            <Text style={styles.label}>Ingredients</Text>
            {ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Ingredient"
                  value={ingredient.name}
                  onChangeText={(text) => {
                    handleIngredientChange(index, 'name', text);
                    handleSearchIngredients(text);
                  }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Quantity"
                  value={ingredient.quantity}
                  onChangeText={(text) =>
                    handleIngredientChange(index, 'quantity', text)
                  }
                />
              </View>
            ))}
            <TouchableOpacity onPress={handleAddIngredient}>
              <Text style={styles.addIngredientText}>+ Add Ingredient</Text>
            </TouchableOpacity>
          </View>

          {searchResults.length > 0 && (
            <View style={styles.searchResultsContainer}>
              {searchResults.map((result, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.searchResultItem}
                  onPress={() => {
                    const newIngredients = [...ingredients];
                    newIngredients[ingredients.length - 1].name = result.name;
                    setIngredients(newIngredients);
                    setSearchResults([]);
                  }}
                >
                  <Text style={styles.searchResultText}>{result.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.instructionsContainer}>
            <Text style={styles.label}>Instructions</Text>
            <TextInput
              style={[styles.input, styles.instructionsInput]}
              multiline
              placeholder="Enter instructions"
              value={instructions}
              onChangeText={setInstructions}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Recipe</Text>
          </TouchableOpacity>
        </View>
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#ccc',
    fontSize: 18,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  nameContainer: {
    marginBottom: 20,
  },
  dietTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  dietTypeButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  selectedDietType: {
    backgroundColor: '#F59E0B',
  },
  dietTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedDietTypeText: {
    color: '#fff',
  },
  mealTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedMealTypeText: {
    color: '#fff',
  },
  ingredientsContainer: {
    marginBottom: 20,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  addIngredientText: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchResultsContainer: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchResultText: {
    fontSize: 16,
  },
  instructionsContainer: {
    marginBottom: 20,
  },
  instructionsInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#F59E0B',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 80, // Ensure there's space at the bottom
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PostRecipeScreen; 