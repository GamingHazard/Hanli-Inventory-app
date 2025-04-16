import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome6 } from "@expo/vector-icons";
import "./global.css";

// Screens
import HomeScreen from "./screens/HomeScreen.js";
import SearchScreen from "./screens/SearchScreen";
 
import DetailsPage from "./pages/DetailsPage";
 
import AuthForm from "./pages/AuthPage";
import StoreScreen from "./screens/StoreScreen.js";
import ProfileScreen from "./screens/ProfileScreen.js";
import { AuthProvider,AuthContext } from "./context/AuthContext.js";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  function BottomNavs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case "Home":
                iconName = focused ? "home": "home-outline";
                break;
              case "Search":
                iconName = focused ? "search" : "search-outline";
                break;
              case "Store":
                iconName = focused ? "storefront" : "storefront-outline";
                break;
              case "News":
                iconName = focused ? "list" : "list-outline";
                break;
              case "Courses":
                iconName = focused ? "school" : "bag-outline";
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
  }

  // const { verified } = useContext(AuthContext);
  return (
    <AuthProvider> <SafeAreaView className="flex-1"><StatusBar hidden={ false} /><NavigationContainer>
      <Stack.Navigator>
         <Stack.Screen
              name="/"
              component={BottomNavs}
              options={{ headerShown: false }}
            />
      </Stack.Navigator>
      {/* <Stack.Navigator>
        {verified === true ? (
          <React.Fragment>
            <Stack.Screen
              name="/"
              component={BottomNavs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsPage}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Account"
              component={AccountPage}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="About"
              component={AboutPage}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="App settings"
              component={AppSettingsPage}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Frequently Asked Questions"
              component={FAQPage}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Help"
              component={HelpPage}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Security"
              component={SecurityPage}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="details"
              component={DetailsPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="enrolledCourse"
              component={EnrolledCourse}
              options={{ headerShown: false }}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Stack.Screen
              name="/"
              component={AuthForm}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="form"
              component={Form}
              options={{ headerShown: false }}
            />
          </React.Fragment>
        )}
      </Stack.Navigator> */}
    </NavigationContainer></SafeAreaView></AuthProvider>
   
  );
}
