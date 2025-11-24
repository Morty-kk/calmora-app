import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/patient/HomeScreen';
import DiaryScreen from '../screens/patient/DiaryScreen';
import ExercisesScreen from '../screens/patient/ExercisesScreen';
import ProfileScreen from '../screens/patient/ProfileScreen';
import TermsScreen from '../screens/patient/TermsScreen';

const Tab = createBottomTabNavigator();

export default function PatientTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Übungen" component={ExercisesScreen} />
      <Tab.Screen name="Tagebuch" component={DiaryScreen} />
      <Tab.Screen name="Termine" component={TermsScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
