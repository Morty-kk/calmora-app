import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectRoleScreen from '../screens/auth/SelectRoleScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterPatientScreen from '../screens/auth/RegisterPatientScreen';
import RegisterTherapistScreen from '../screens/auth/RegisterTherapistScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SelectRole" component={SelectRoleScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="RegisterPatient" component={RegisterPatientScreen} />
    <Stack.Screen name="RegisterTherapist" component={RegisterTherapistScreen} />
    <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
