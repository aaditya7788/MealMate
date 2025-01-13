import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { hp } from '../../helpers/common';

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

export default RecipeCard;