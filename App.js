import React, { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import NetInfo from "@react-native-community/netinfo";

import HomeScreen from "./screens/HomeScreen.js";
import SearchScreen from "./screens/SearchScreen";
import StoreScreen from "./screens/StoreScreen.js";
import Calculator from "./screens/CalculatorPage.js";
import "./global.css";
import DetailsPage from "./pages/DetailsPage.js";

// Prevent auto-hide of splash
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Simulate loading tasks, like fetching data or loading fonts
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

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
        tabBarActiveTintColor: "#e42527",
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
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator>
          <Stack.Screen
            name="/"
            component={BottomNavs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="details"
            component={DetailsPage}
            options={{ headerShown: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
