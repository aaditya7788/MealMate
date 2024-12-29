import React, { useState, useEffect } from 'react';
import { BackHandler, ScrollView, StyleSheet, TextInput, TouchableOpacity, Pressable, View, Text, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { hp,wp,getColumnCount} from '../../helpers/common';
import { BellIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { fetchCategories, fetchRecipes } from '../../Api/request';
import MasonryList from '@react-native-seoul/masonry-list';
import Animated, { BounceInRight, FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function HomeScreen({ backgroundColor = '#fff', homeTextColor = '#fbbf24' }) {
  const [selectedCategory, setSelectedCategory] = useState('Vegetarian');
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  const ColumnCount = getColumnCount();
  const navigation = useNavigation();

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await fetchCategories();
        let filteredCategories = categoryData.categories.filter(
          (category) => category.strCategory !== 'Beef' && category.strCategory !== 'Lamb' && category.strCategory !== 'Pork'
        );

        // Sort categories to place "Vegetarian" and "Vegan" first
        filteredCategories = filteredCategories.sort((a, b) => {
          if (a.strCategory === 'Vegetarian') return -1;
          if (b.strCategory === 'Vegetarian') return 1;
          return 0;
        });

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

  // Fetch recipes when selectedCategory changes
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
    React.useCallback(() => {
      const onBackPress = () => {
        // Prevent default back button behavior
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const renderCategorySkeleton = () => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryImageContainer}>
        <Skeleton circle width={hp(8)} height={hp(8)} />
      </View>
      <Skeleton width={hp(10)} height={hp(2)} />
    </View>
  );

  const renderRecipeSkeleton = () => (
    <View style={styles.recipeCard}>
      <Skeleton width="100%" height={hp(25)} style={{ borderRadius: 35 }} />
      <Skeleton width="80%" height={hp(2)} style={{ marginTop: 8, alignSelf: 'center' }} />
    </View>
  );

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style='dark' />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Avatar and bell icon */}
        <View style={styles.avatarContainer}>
          <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
          <BellIcon size={hp(4)} color="gray" />
        </View>

        {/* Greeting and punchline */}
        <View style={styles.greetingContainer}>
          <Text style={styles.helloText}>Hello Adi!</Text>
          <View>
            <Text style={styles.mainText}>Make your own food</Text>
          </View>
          <Text style={styles.mainText}>
            stay at <Text style={[styles.highlightText, { color: homeTextColor }]}>home</Text>
          </Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput onPress={()=>navigation.navigate('Search')}
            placeholder="Search for recipes"
            placeholderTextColor={'gray'}
            style={styles.searchInput}
          />
          <View style={styles.searchIconContainer}>
            <MagnifyingGlassIcon size={hp(3)} strokeWidth={3} color="gray" />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {loadingCategories ? (
      <Text>Loading categories...</Text>
    ) : (
      categories.map((category, index) => (
        <TouchableOpacity 
          key={category.idCategory}
          style={styles.categoryItem}
          onPress={() => setSelectedCategory(category.strCategory)}
        >
          <Animated.View 
            entering={FadeInRight.springify().delay(index*100)} 
            style={[
              styles.categoryImageContainer,
              selectedCategory === category.strCategory && styles.selectedCategory
            ]}
          >
            <Image source={{ uri: category.strCategoryThumb }} style={styles.categoryImage} />
          </Animated.View>
          <Animated.Text 
            entering={FadeInRight.springify()
      .damping(30)
      .mass(5)
      .stiffness(10)
      .overshootClamping(false)
      .restDisplacementThreshold(0.1)
      .restSpeedThreshold(5)} 
            style={styles.categoriesText}
          >
            {category.strCategory}
          </Animated.Text>
        </TouchableOpacity>
      ))
    )}
  </ScrollView>
  <Text style={styles.sectionTitle}>Recipes</Text>
</View>


        {/* Recipes Section */}
        {loadingRecipes ? (
          <Text>Loading recipes...</Text>
        ) : (
          <MasonryList
            data={recipes}
            renderItem={({ item, index }) => <RecipeCard item={item} index={index}  navigation={navigation}/>}
            keyExtractor={(item) => item.idMeal.toString()}
            numColumns={ColumnCount}  // Adjust as needed
          />
        )}
      </ScrollView>
    </View>
  );
}

const RecipeCard = ({ item, index, navigation }) => {
  let isEven = index % 2 === 0;
  index = item.idMeal;
  return (
    <Animated.View 
      entering={FadeInDown.springify()
        .damping(30)
        .mass(5)
        .stiffness(10)
        .overshootClamping(false)
        .restDisplacementThreshold(0.1)
        .restSpeedThreshold(5)} 
      style={[styles.recipeCard, { paddingLeft: isEven ? 0 : 8, paddingRight: isEven ? 8 : 0 }]}
    >
      <Pressable 
        style={styles.recipePressable} 
        onPress={() => navigation.navigate('Details', { recipeId: item.idMeal })}
      >
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
    height: hp(5),
    width: hp(5),
  },
  greetingContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  helloText: {
    fontSize: hp(1.8),
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
    paddingVertical: 0,
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