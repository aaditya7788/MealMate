import React, { useState, useEffect } from 'react';
import { BackHandler, ScrollView, StyleSheet, TextInput, TouchableOpacity, Pressable, View, Text, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { hp, wp, getColumnCount } from '../../helpers/common';
import { MagnifyingGlassIcon, PowerIcon } from 'react-native-heroicons/outline';
import { fetchCategories, fetchRecipes } from '../../Api/request';
import MasonryList from '@react-native-seoul/masonry-list';
import Animated, { FadeInRight, FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { clearAuthData, getAuthData } from '../../backend/LocalStorage/auth_store';
import { Basic_url } from '../../backend/config/config';
function HomeScreen({ backgroundColor = '#fff', homeTextColor = '#fbbf24' }) {
  const [selectedCategory, setSelectedCategory] = useState('Vegetarian');
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [userData, setUserData] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const navigation = useNavigation();
  const ColumnCount = getColumnCount();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getAuthData();
      setUserData(data);
      setProfilePic(`${Basic_url}${data?.profilepic}` || null);
    };
    fetchUserData();
  }, []);

  // Fetch categories
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
      }
    };
    loadCategories();
  }, []);

  // Fetch recipes when selectedCategory changes
  useEffect(() => {
    const loadRecipes = async () => {
      if (selectedCategory) {
        try {
          const recipesData = await fetchRecipes(selectedCategory);
          setRecipes(recipesData.meals || []);
        } catch (error) {
          console.error('Error loading recipes:', error);
        }
      }
    };
    loadRecipes();
  }, [selectedCategory]);

  // Handle back button press to prevent default behavior
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true; // Prevent default back button behavior
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const handleLogout = async () => {
    try {
      await clearAuthData();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        {/* Avatar and Logout Icon */}
        <View style={styles.avatarContainer}>
          <Image
            source={profilePic ? { uri: profilePic } : require('../../assets/images/avatar.png')}
            style={styles.avatar}
          />
          <PowerIcon size={hp(4)} color="gray" onPress={handleLogout} />
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingContainer}>
          <Text style={styles.helloText}>{userData?.name || 'Loading...'}</Text>
          <Text style={styles.mainText}>
            Make your own food, stay at{' '}
            <Text style={[styles.highlightText, { color: homeTextColor }]}>home</Text>
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search for recipes"
            placeholderTextColor="gray"
            style={styles.searchInput}
            onFocus={() => navigation.navigate('Search')}
          />
          <View style={styles.searchIconContainer}>
            <MagnifyingGlassIcon size={hp(3)} strokeWidth={3} color="gray" />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category.idCategory}
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(category.strCategory)}
              >
                <Animated.View
                  entering={FadeInRight.springify().delay(index * 100)}
                  style={[
                    styles.categoryImageContainer,
                    selectedCategory === category.strCategory && styles.selectedCategory,
                  ]}
                >
                  <Image source={{ uri: category.strCategoryThumb }} style={styles.categoryImage} />
                </Animated.View>
                <Animated.Text entering={FadeInRight.springify()} style={styles.categoriesText}>
                  {category.strCategory}
                </Animated.Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.sectionTitle}>Recipes</Text>
        </View>

        {/* Recipes Section */}
        <MasonryList
          data={recipes}
          renderItem={({ item, index }) => <RecipeCard item={item} index={index} navigation={navigation} />}
          keyExtractor={(item) => item.idMeal.toString()}
          numColumns={ColumnCount}
        />
      </ScrollView>
    </View>
  );
}

const RecipeCard = ({ item, index, navigation }) => {
  const isEven = index % 2 === 0;
  return (
    <Animated.View
      entering={FadeInDown.springify()}
      style={[styles.recipeCard, { paddingLeft: isEven ? 0 : 8, paddingRight: isEven ? 8 : 0 }]}
    >
      <Pressable style={styles.recipePressable} onPress={() => navigation.navigate('Details', { recipeId: item.idMeal })}>
        <Image
          source={{ uri: item.strMealThumb }}
          style={{ width: '100%', height: index % 3 === 0 ? hp(25) : hp(38), borderRadius: 35 }}
        />
        <Text style={styles.recipeTitle}>
          {item.strMeal.length > 20 ? item.strMeal.slice(0, 20) + '...' : item.strMeal}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 56,
    paddingBottom: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 999,
    borderWidth:2,
    borderColor: '#fbbf24',
  },
  greetingContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  helloText: {
    fontSize: 18,
    marginBottom: 8,
  },
  mainText: {
    fontSize: hp(3.8),
    fontWeight: '600',
    color: '#525252',
  },
  highlightText: {
    color: '#fbbf24',
  },
  searchContainer: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: hp(1.7),
    paddingHorizontal: 12,
  },
  searchIconContainer: {
    backgroundColor: 'white',
    borderRadius: 9999,
    padding: 15,
  },
  categoriesContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  categoryItem: {
    marginRight: 16,
    alignItems: 'center',
  },
  categoryImageContainer: {
    width: hp(10),
    height: hp(10),
    borderRadius: hp(5),
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#fbbf24',
  },
  categoryImage: {
    width: hp(8),
    height: hp(8),
    borderRadius: hp(3),
  },
  categoriesText: {
    fontSize: hp(1.6),
    fontWeight: '500',
    color: '#4b5563',
  },
  sectionTitle: {
    fontSize: hp(3),
    fontWeight: 'bold',
    color: '#626262',
    marginTop: 20,
  },
  recipeCard: {
    padding: 3,
    marginTop: 10,
    marginRight: 5,
  },
  recipePressable: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 4,
  },
  recipeTitle: {
    textAlign: 'center',
    fontSize: hp(1.5),
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginLeft: 2,
  },
});

export default HomeScreen;
