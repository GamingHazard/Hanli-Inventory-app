import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import NetInfo from "@react-native-community/netinfo";
 

import HomeScreen from "./screens/HomeScreen.js";
import SearchScreen from "./screens/SearchScreen";
import StoreScreen from "./screens/StoreScreen.js";
import Calculator from "./screens/CalculatorPage.js";
 

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  

   

  const BottomNavs = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Search":
              iconName = focused ? "search" : "search-outline";
              break;
            case "Store":
              iconName = focused ? "storefront" : "storefront-outline";
              break;
            case "Calculator":
              iconName = focused ? "calculator" : "calculator-outline";
              break;
            default:
              iconName = "ellipse";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "teal",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Store" component={StoreScreen} />
      <Tab.Screen name="Calculator" component={Calculator} />
    </Tab.Navigator>
  );

  

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator>
        <Stack.Screen
          name="/"
          component={BottomNavs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
