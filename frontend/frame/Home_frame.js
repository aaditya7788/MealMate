import React from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { hp } from '../../helpers/common';
import { MagnifyingGlassIcon, PowerIcon } from 'react-native-heroicons/outline';
import MasonryList from '@react-native-seoul/masonry-list';
import Animated, { FadeInRight } from 'react-native-reanimated';
import RecipeCard from '../components/RecipeCard';

const Home_frame = ({ userData, backgroundColor, homeTextColor, handleLogout, categories, loadingCategories, selectedCategory, setSelectedCategory, recipes, loadingRecipes, navigation }) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style="dark" />  
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        {/* Avatar and Bell Icon */}
        <View style={styles.avatarContainer}>
          <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
          <PowerIcon size={hp(4)} color="gray" onPress={handleLogout} />
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingContainer}>
          <Text style={styles.helloText}>{userData ? userData.name : 'Loading...'}</Text>
          <Text style={styles.mainText}>
            Make your own food, stay at <Text style={[styles.highlightText, { color: homeTextColor }]}>home</Text>
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
                    entering={FadeInRight.springify().delay(index * 100)}
                    style={[styles.categoryImageContainer, selectedCategory === category.strCategory && styles.selectedCategory]}
                  >
                    <Image source={{ uri: category.strCategoryThumb }} style={styles.categoryImage} />
                  </Animated.View>
                  <Animated.Text entering={FadeInRight.springify()} style={styles.categoriesText}>
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
            renderItem={({ item, index }) => <RecipeCard item={item} index={index} navigation={navigation} />}
            keyExtractor={(item) => item.idMeal.toString()}
            numColumns={2}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
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
});

export default Home_frame;