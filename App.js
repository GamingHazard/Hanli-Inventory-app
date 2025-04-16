import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import NetInfo from "@react-native-community/netinfo";
import * as SplashScreen from "expo-splash-screen";

import HomeScreen from "./screens/HomeScreen.js";
import SearchScreen from "./screens/SearchScreen";
import StoreScreen from "./screens/StoreScreen.js";
import ProfileScreen from "./screens/ProfileScreen.js";
import DetailsPage from "./pages/DetailsPage";
import AuthForm from "./pages/AuthPage";
import Splash from "./screens/SplashScreen.js"; // your custom splash component

SplashScreen.preventAutoHideAsync(); // Keep native splash until ready

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [isAppReady, setAppReady] = useState(false);
  const [isOnline, setIsOnline] = useState(null);

  // Check internet and prepare app
  useEffect(() => {
    const prepare = async () => {
      const net = await NetInfo.fetch();
      setIsOnline(net.isConnected);
      // Simulate some load like font/assets check
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAppReady(true);
      await SplashScreen.hideAsync(); // Hide native splash
    };
    prepare();
  }, []);

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
            case "Profile":
              iconName = focused ? "person" : "person-outline";
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
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );

  // Show custom splash while preparing app
  if (!isAppReady) {
    return <Splash isOnline={isOnline} />;
  }

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
