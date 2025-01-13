import React from 'react';
import { Text } from 'react-native';
import Home_frame from '../frame/Home_frame';
import { useHomeFunctions } from '../../backend/functions/Auth/Screens/home_function';

function HomeScreen({ backgroundColor = '#fff', homeTextColor = '#fbbf24' }) {
  const {
    selectedCategory,
    setSelectedCategory,
    categories,
    recipes,
    error,
    loadingCategories,
    loadingRecipes,
    userData,
    handleLogout,
    navigation,
  } = useHomeFunctions();

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <Home_frame
      userData={userData}
      backgroundColor={backgroundColor}
      homeTextColor={homeTextColor}
      handleLogout={handleLogout}
      categories={categories}
      loadingCategories={loadingCategories}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      recipes={recipes}
      loadingRecipes={loadingRecipes}
      navigation={navigation}
    />
  );
}

export default HomeScreen;