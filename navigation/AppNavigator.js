import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import PatientTabs from './PatientTabs';
import { useAuth } from '../context/AuthContext';
import PanicScreen from '../screens/patient/PanicScreen';

const Stack = createNativeStackNavigator();

const TherapistPlaceholder = () => null;

const AppNavigator = () => {
  const { token, role } = useAuth();
  const isAuthenticated = Boolean(token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : role === 'therapist' ? (
        <Stack.Screen name="Therapist" component={TherapistPlaceholder} />
      ) : (
        <Stack.Screen name="PatientTabs" component={PatientTabs} />
      )}
      <Stack.Screen name="Panic" component={PanicScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
