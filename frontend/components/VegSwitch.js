import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, RefreshControl, ScrollView } from 'react-native';

const VegSwitch = () => {
  const [isVeg, setIsVeg] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.text}>{isVeg ? 'Veg' : 'Any'}</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#fbbf24' }}
        thumbColor={isVeg ? '#fff' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => {
          setIsVeg(previousState => !previousState);
          onRefresh();
        }}
        value={isVeg}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginRight: 10,
  },
});

export default VegSwitch;
