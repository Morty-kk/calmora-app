import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider, useAuth } from '../context/AuthContext';
import { UserProvider } from '../context/UserContext';
import AuthNavigator from './AuthNavigator';
import PatientTabs from './PatientTabs';
import PanicScreen from '../screens/patient/PanicScreen';
import TherapistHomeScreen from '../screens/therapist/TherapistHomeScreen';

const Stack = createNativeStackNavigator();

function RootStack() {
  const { isAuthenticated, role } = useAuth();
  const showTherapist = role === 'Therapist';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          {showTherapist ? (
            <Stack.Screen name="TherapistHome" component={TherapistHomeScreen} />
          ) : (
            <Stack.Screen name="Patient" component={PatientTabs} />
          )}
          <Stack.Screen name="Panic" component={PanicScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <UserProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </AuthProvider>
    </UserProvider>
  );
}
