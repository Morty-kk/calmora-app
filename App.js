import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <UserProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </UserProvider>
  );
}
