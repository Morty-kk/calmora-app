import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/patient/HomeScreen';
import ExercisesScreen from '../screens/patient/ExercisesScreen';
import DiaryScreen from '../screens/patient/DiaryScreen';
import TermsScreen from '../screens/patient/TermsScreen';
import ProfileScreen from '../screens/patient/ProfileScreen';

const Tab = createBottomTabNavigator();

const tabIcons = {
  Home: 'home-outline',
  Exercises: 'leaf-outline',
  Diary: 'book-outline',
  Terms: 'calendar-outline',
  Profile: 'person-circle-outline',
};

const PatientTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#2563eb',
      tabBarInactiveTintColor: '#94a3b8',
      tabBarStyle: { paddingBottom: 6, paddingTop: 6, height: 60 },
      tabBarIcon: ({ color, size }) => {
        const iconName = tabIcons[route.name];
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

export default PatientTabs;
