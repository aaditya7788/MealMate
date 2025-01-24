// styles.js
import { Platform } from 'react-native';
import { wp } from './helpers/common';
import { HomeIcon, UserCircleIcon, MagnifyingGlassIcon, CalendarIcon } from "react-native-heroicons/outline";
import { theme } from './constants/theme';
import FoodPlateIcon from './Icons/FoodPlateIcon';
import UploadCirclePlusIcon from './Icons/UploadCirclePlusIcon';
import ClockSpoonForkIcon from './Icons/ClockSpoonForkIcon';
import CalendarDaysIcon from 'react-native-heroicons/outline';

const tabIcons = {
  Home: HomeIcon,
  MealPlanner: CalendarIcon,
  Profile: UserCircleIcon,
  PostRecipe: UploadCirclePlusIcon,
  Search: MagnifyingGlassIcon,
  Feed: FoodPlateIcon,
  
  // Add more screen names and their corresponding icons here
};

const getTabIcon = (routeName, focused, color, size) => {
  const IconComponent = tabIcons[routeName];
  return IconComponent ? (
    <IconComponent 
      color={focused ? theme.colors.primary : color} 
      size={size} 
    />
  ) : null;
};

export const tabNavigatorScreenOptions = ({ route }) => ({
  headerShown: false,
  tabBarIcon: ({ focused, color, size }) => getTabIcon(route.name, focused, color, size),
  tabBarActiveTintColor: theme.colors.primary,
  tabBarInactiveTintColor: 'gray',
  tabBarStyle: {
    backgroundColor: 'rgba(255,255,255,1)',
    width: wp(100),
    height: 40,
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
  },
  tabBarLabel: () => null,
});

export const stackNavigatorScreenOptions = {
  headerShown: false,
  gestureEnabled: false,
  animationEnabled: Platform.OS !== 'web',
};