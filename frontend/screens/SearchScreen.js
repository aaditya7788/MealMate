import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { hp, wp } from '../../helpers/common';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { theme } from '../../constants/theme';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { fetchsearchRecipes } from '../../Api/request';
import { fetch_name_Userdata } from '../../backend/components/request';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('Profile');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const Navigation = useNavigation();
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Focus the search input when the component mounts
    searchInputRef.current.focus();
  }, []);

  const handleSearch = async () => {
    if (searchText.trim()) {
      setIsSearching(true);

      // Fetch search results based on active tab
      const results = activeTab === 'Profile' ? await searchProfiles(searchText) : await searchRecipes(searchText);
      setSearchResults(results);

      setSearchText('');
    }
  };

  console.log('search result:',searchResults);

  const searchProfiles = async (query) => {
    // Fetch profiles using the fetch_name_Userdata function
    const data = await fetch_name_Userdata(query);
    console.log('data name:',data);
    return data.map(user => ({
      id: user._id,
      name: user.name,
      description: user.description,
    }));
  };

  const searchRecipes = async (query) => {
    // Fetch recipes using the fetchsearchRecipes function
    const data = await fetchsearchRecipes(query);
    return data.meals.map(meal => ({
      id: meal.idMeal,
      title: meal.strMeal,
      category: meal.strCategory,
    }));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Search Container */}
      <Animated.View style={styles.Search} entering={FadeInUp.springify().duration(1000).delay(500)}>
        <View style={styles.searchContainer}>
          <TextInput
            ref={searchInputRef}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search for recipes or profiles"
            placeholderTextColor={'gray'}
            style={styles.searchInput}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchIconContainer} onPress={handleSearch}>
            <MagnifyingGlassIcon size={hp(3)} strokeWidth={3} color="gray" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Search History */}
      <Animated.View style={styles.SearchHistoryContainer} entering={FadeInDown.springify().duration(2000).delay(500)}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Profile' && styles.activeTab]}
            onPress={() => setActiveTab('Profile')}
          >
            <Text style={[styles.tabText, activeTab === 'Profile' && styles.activeTabText]}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Recipe' && styles.activeTab]}
            onPress={() => setActiveTab('Recipe')}
          >
            <Text style={[styles.tabText, activeTab === 'Recipe' && styles.activeTabText]}>Recipe</Text>
          </TouchableOpacity>
        </View>

        {/* Search Results */}
        <ScrollView style={[styles.searchResultsContainer, isSearching && styles.searchResultsContainerActive]}>
          {searchResults.map((result) => (
            <View key={result.id} style={styles.resultItem}>
              {activeTab === 'Profile' ? (
                <>
                  <TouchableOpacity onPress={() => navigation.navigate('SearchProfile', { uid: result.id })}>
                    <Text style={styles.resultTitle}>{result.name}</Text>
                  </TouchableOpacity>
                  <Text style={styles.resultDescription}>{result.description}</Text>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={() => Navigation.navigate('Details', { recipeId: result.id })}>
                    <Text style={styles.resultTitle}>{result.title}</Text>
                  </TouchableOpacity>
                  <Text style={styles.resultDescription}>{result.category}</Text>
                </>
              )}
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Search: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp(95),
    borderBottomStartRadius: 40,
    borderBottomEndRadius: 40,
    backgroundColor: theme.colors.primary,
    paddingTop: 90,
    paddingBottom: 20,
  },
  searchContainer: {
    color: 'white',
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999,
    backgroundColor: 'white',
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
  SearchHistoryContainer: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.neutral(0.1),
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    width: wp(95),
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 10,
    backgroundColor: 'gray',
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  activeTabText: {
    color: 'white',
  },
  searchResultsContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
    borderRadius: 40,
  },
  searchResultsContainerActive: {
    backgroundColor: theme.colors.neutral(0.1),
  },
  resultItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultDescription: {
    fontSize: 14,
    color: 'gray',
  },
});

export default SearchScreen;