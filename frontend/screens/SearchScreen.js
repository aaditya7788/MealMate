import React from 'react'
import { useState,useEffect } from 'react'
import { View,Text,StyleSheet,TextInput } from 'react-native'
import { hp,wp } from '../../helpers/common'
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { theme } from '../../constants/theme'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { BounceOutDown } from 'react-native-reanimated'
const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const saveSearchHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      const newHistory = [searchText, ...searchHistory.filter(item => item !== searchText)].slice(0, 5);
      setSearchHistory(newHistory);
      saveSearchHistory(newHistory);
      navigation.navigate('Search', { query: searchText });
      setSearchText('');
    }
  };

  const removeHistoryItem = (item) => {
    const newHistory = searchHistory.filter(historyItem => historyItem !== item);
    setSearchHistory(newHistory);
    saveSearchHistory(newHistory);
  };

  return (


    <View style={styles.container}>

    {/* Search Container */}
      <Animated.View style={styles.Search} entering={FadeInUp.springify().duration(1000).delay(500)}>
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
      </Animated.View>

        {/* Search History */}
      <View style={styles.SearchHistoryContainer}>
        <Text style={styles.SearchHistoryText}>Text</Text>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Search: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp(95),
    borderBottomStartRadius:40,
    borderBottomEndRadius:40,
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
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp(95),
    marginTop: wp(5),
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: theme.colors.neutral(0.2),
    flex:1,
    borderTopStartRadius:40,
    borderTopEndRadius:40,
  },
  SearchHistoryText: {
    justifyContent: 'flex-start',
    paddingHorizontal:30,
    paddingVertical:20,
    borderRadius:20,
    borderColor: 'black',
    backgroundColor: 'black',
    backgroundColor: 'white'
  }
})

export default SearchScreen
