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
import { useNavigation } from '@react-navigation/native';

const PostRecipeScreen = () => {
  const [image, setImage] = useState(null);
  const [recipeName, setRecipeName] = useState('');
  const [dietType, setDietType] = useState('Veg');
  const [mealType, setMealType] = useState('Breakfast');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [instructions, setInstructions] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [errors, setErrors] = useState({});

  const navigation = useNavigation();

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

  const handleRemoveIngredient = (index) => {
    if (ingredients.length > 1) {
      const updated = ingredients.filter((_, i) => i !== index);
      setIngredients(updated);
    }
  };


  const validateFields = () => {
    const newErrors = {};

    if (!image) {
      Alert.alert('Validation Error', 'Please select an image.');
      newErrors.image = true;
    }

    if (!recipeName.trim()) newErrors.recipeName = '! Recipe name is required';
    if (!instructions.trim()) newErrors.instructions = '! Instructions are required';

    const ingredientErrors = ingredients.map((ingredient) => {
      const errors = {};
      if (!ingredient.name.trim()) errors.name = '! Name is required';
      if (!ingredient.quantity.trim()) errors.quantity = '! Quantity is required';
      return errors;
    });

    newErrors.ingredients = ingredientErrors;

    const hasErrors =
      Object.keys(newErrors).length > 1 || // image/instructions/recipeName
      ingredientErrors.some((err) => Object.keys(err).length > 0);

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    const authdata = await getAuthData();
    const recipeData = {
      uid: authdata._id,
      name: recipeName,
      dietType,
      mealType,
      instructions,
      ingredients,
    };

    try {
      const response = await postRecipe(recipeData);
      const postId = response.post._id;

      if (image) {
        const filename = `${postId}.jpg`;
        const formData = new FormData();
        const match = /\.(\w+)$/.exec(image.split('/').pop());
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('image', { uri: image, name: filename, type });
        await uploadRecipeImage(postId, formData);
      }

      Alert.alert('Success', 'Recipe posted successfully!');
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error posting recipe:', error);
      Alert.alert('Error', 'Failed to post the recipe');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setImage(null);
    setRecipeName('');
    setDietType('Veg');
    setMealType('Breakfast');
    setIngredients([{ name: '', quantity: '' }]);
    setInstructions('');
    setSearchResults([]);
    setErrors({});
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <FlatList
      style={styles.container}
      data={[]}
      ListHeaderComponent={
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Post Recipe</Text>

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

          {/* Recipe Name */}
          <View style={styles.nameContainer}>
            <Text style={styles.label}>Recipe Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter recipe name"
              value={recipeName}
              onChangeText={setRecipeName}
            />
            {errors.recipeName && <Text style={styles.errorText}>{errors.recipeName}</Text>}
          </View>

          {/* Diet Type */}
          <Text style={styles.label}>Diet Type</Text>
          <View style={styles.buttonRow}>
            {['Veg', 'Non-Veg', 'Vegan'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.typeButton, dietType === type && styles.selectedButton]}
                onPress={() => setDietType(type)}
              >
                <Text style={[styles.buttonText, dietType === type && styles.selectedButtonText]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Meal Type */}
          <Text style={styles.label}>Meal Type</Text>
          <View style={styles.buttonRow}>
            {['Breakfast', 'Lunch', 'Dinner'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.typeButton, mealType === type && styles.selectedButton]}
                onPress={() => setMealType(type)}
              >
                <Text style={[styles.buttonText, mealType === type && styles.selectedButtonText]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Ingredients */}
          <Text style={styles.label}>Ingredients</Text>
          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientRow}>
              <View style={styles.ingredientInputs}>
                <TextInput
                  style={[styles.input, styles.ingredientInput]}
                  placeholder="Ingredient"
                  value={ingredient.name}
                  onChangeText={(text) => {
                    handleIngredientChange(index, 'name', text);
                    handleSearchIngredients(text);
                  }}
                />
                <TextInput
                  style={[styles.input, styles.quantityInput]}
                  placeholder="Qty"
                  value={ingredient.quantity}
                  onChangeText={(text) => handleIngredientChange(index, 'quantity', text)}
                />
                <TouchableOpacity
                  onPress={() => handleRemoveIngredient(index)}
                  disabled={ingredients.length === 1}
                  style={[
                    styles.removeButton,
                    ingredients.length === 1 && styles.removeButtonDisabled,
                  ]}
                >
                  <Text style={styles.removeButtonText}>–</Text>
                </TouchableOpacity>
              </View>

              {/* Error Display */}
              {errors.ingredients?.[index]?.name && (
                <Text style={styles.errorText}>{errors.ingredients[index].name}</Text>
              )}
              {errors.ingredients?.[index]?.quantity && (
                <Text style={styles.errorText}>{errors.ingredients[index].quantity}</Text>
              )}
            </View>
          ))}

          {/* Add Ingredient */}
          <TouchableOpacity onPress={handleAddIngredient}>
            <Text style={styles.addIngredientText}>+ Add Ingredient</Text>
          </TouchableOpacity>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <View style={styles.searchResultsContainer}>
              {searchResults.map((result, index) => (
                <TouchableOpacity
                  key={index}
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

          {/* Instructions */}
          <Text style={styles.label}>Instructions</Text>
          <TextInput
            style={[styles.input, styles.instructionsInput]}
            placeholder="Enter instructions"
            multiline
            value={instructions}
            onChangeText={setInstructions}
          />
          {errors.instructions && <Text style={styles.errorText}>{errors.instructions}</Text>}

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Recipe</Text>
          </TouchableOpacity>
        </View>
      }
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  imagePickerText: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 10,
  },
  nameContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  typeButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  selectedButton: {
    backgroundColor: '#F59E0B',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#fff',
  },
  ingredientRow: {
    marginBottom: 10,
  },
  addIngredientText: {
    color: '#F59E0B',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  searchResultsContainer: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  searchResultText: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
    marginBottom: 80,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  ingredientRow: {
    marginBottom: 10,
  },
  ingredientInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientInput: {
    flex: 2,
    marginRight: 5,
  },
  quantityInput: {
    flex: 1,
    marginRight: 5,
  },
  removeButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  removeButtonDisabled: {
    backgroundColor: '#eee',
  },
  removeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PostRecipeScreen;
