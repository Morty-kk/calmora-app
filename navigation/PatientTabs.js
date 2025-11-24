import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DiaryScreen from '../screens/patient/DiaryScreen';
import ExercisesScreen from '../screens/patient/ExercisesScreen';
import HomeScreen from '../screens/patient/HomeScreen';
import ProfileScreen from '../screens/patient/ProfileScreen';
import TermsScreen from '../screens/patient/TermsScreen';

const Tab = createBottomTabNavigator();

const tabIcon = {
  Home: 'home',
  Exercises: 'fitness',
  Diary: 'book',
  Terms: 'calendar',
  Profile: 'person',
};

export default function PatientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1D4ED8',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarIcon: ({ color, size }) => {
          const iconName = tabIcon[route.name];
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Exercises" component={ExercisesScreen} options={{ title: 'Übungen' }} />
      <Tab.Screen name="Diary" component={DiaryScreen} options={{ title: 'Tagebuch' }} />
      <Tab.Screen name="Terms" component={TermsScreen} options={{ title: 'Termine' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}
