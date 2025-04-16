import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";
import "./global.css";

// Screens
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import BookmarksScreen from "./screens/BookmarkScreen";
import NewsScreen from "./screens/NewsScreen";
import CoursesScreen from "./screens/CoursesScreen";
import ProfileScrren from "./screens/ProfileScreen";
import SettingsPage from "./pages/settings/SettingsPage";
import AccountPage from "./pages/settings/AccountPage";
import AboutPage from "./pages/settings/AboutPage";
import AppSettingsPage from "./pages/settings/AppSettingsPage";
import FAQPage from "./pages/settings/FAQPage";
import HelpPage from "./pages/settings/HelpPage";
import SecurityPage from "./pages/settings/SecurityPage";
import DetailsPage from "./pages/DetailsPage";
import EnrolledCourse from "./pages/EnrolledCourse";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthForm from "./pages/auth/AuthPage";
import Form from "./pages/auth/Form";
import { AuthContext } from "./contexts/AuthContext";

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
                iconName = focused ? "home" : "home-outline";
                break;
              case "Search":
                iconName = focused ? "search" : "search-outline";
                break;
              case "Bookmarks":
                iconName = focused ? "bookmark" : "bookmark-outline";
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
        <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
        <Tab.Screen name="News" component={NewsScreen} />
        <Tab.Screen name="courses" component={CoursesScreen} />
        <Tab.Screen name="Profile" component={ProfileScrren} />
      </Tab.Navigator>
    );
  }

  const { verified } = useContext(AuthContext);
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
