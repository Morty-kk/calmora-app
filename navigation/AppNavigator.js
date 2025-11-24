import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PatientTabs from './PatientTabs';
import PanicScreen from '../screens/patient/PanicScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Patient" component={PatientTabs} />
        <Stack.Screen name="Panic" component={PanicScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
