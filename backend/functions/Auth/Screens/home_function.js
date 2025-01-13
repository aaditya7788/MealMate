import React, { useState, useEffect, useCallback } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { fetchCategories, fetchRecipes } from '../../../../Api/request';
import { clearAuthData, getAuthData } from '../../../LocalStorage/auth_store';

export const useHomeFunctions = () => {
  const [selectedCategory, setSelectedCategory] = useState('Vegetarian');
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [userData, setUserData] = useState(null);

  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await clearAuthData();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const data = await getAuthData();
      setUserData(data);
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await fetchCategories();
        const filteredCategories = categoryData.categories
          .filter((category) => !['Beef', 'Lamb', 'Pork'].includes(category.strCategory))
          .sort((a, b) => (a.strCategory === 'Vegetarian' ? -1 : b.strCategory === 'Vegetarian' ? 1 : 0));

        setCategories(filteredCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        setError('Error loading categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadRecipes = async () => {
      if (selectedCategory) {
        try {
          const recipesData = await fetchRecipes(selectedCategory);
          setRecipes(recipesData.meals || []);
        } catch (error) {
          console.error('Error loading recipes:', error);
          setError('Error loading recipes');
        } finally {
          setLoadingRecipes(false);
        }
      }
    };

    loadRecipes();
  }, [selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  return {
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
  };
};