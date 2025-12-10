import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerActions, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Pressable } from "react-native";
// import CustomDrawer from "../components/CustomDrawer";

import {
    DiaryScreen,
    ExercisesScreen,
    LoginScreen,
    PatientHomeScreen,
    ProfileScreen,
    SitzungenScreen,
    TermsScreen,
} from "../screens";

import PanicScreen from "../screens/patient/PanicScreen"; // ensure this file exists

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function safeOpenDrawer(navigation) {
  try {
    const parent = navigation.getParent && navigation.getParent();
    if (parent && typeof parent.openDrawer === "function") {
      parent.openDrawer();
      return;
    }
  } catch (e) {}
  if (typeof navigation.openDrawer === "function") {
    navigation.openDrawer();
    return;
  }
  try {
    navigation.dispatch && navigation.dispatch(DrawerActions.openDrawer());
  } catch (e) {}
}

function PatientDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="PatientHome"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerRight: () => (
          <Pressable
            onPress={() => safeOpenDrawer(navigation)}
            android_ripple={{ color: "#ddd", borderless: true }}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            style={{ paddingHorizontal: 16, justifyContent: "center" }}
            accessibilityLabel="Öffne Menü"
            testID="open-drawer-button"
          >
            <Ionicons name="menu" size={26} color="#0F172A" />
          </Pressable>
        ),
      })}
    >
      <Drawer.Screen name="PatientHome" component={PatientHomeScreen} options={{ title: "Home" }} />
      <Drawer.Screen name="Sitzungen" component={SitzungenScreen} options={{ title: "Sitzungen" }} />
      <Drawer.Screen name="Exercises" component={ExercisesScreen} options={{ title: "Übungen" }} />
      <Drawer.Screen name="Diary" component={DiaryScreen} options={{ title: "Tagebuch" }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: "Profil" }} />
      <Drawer.Screen name="Terms" component={TermsScreen} options={{ title: "AGB" }} />
      {/* NOTE: Panic NOT here (we register it in the top Stack) */}
    </Drawer.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* Patient Drawer */}
        <Stack.Screen name="Patient" component={PatientDrawer} />
        {/* Panic global / modal -> erreichbar von überall via navigation.navigate('Panic') */}
        <Stack.Screen
          name="Panic"
          component={PanicScreen}
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}