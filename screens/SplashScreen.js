// components/Splash.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
 
import Icon from 'react-native-vector-icons/FontAwesome';

const Splash = ({ isOnline }) => {
  return (
    <View style={styles.container}>
      <Icon name={isOnline ? "wifi" : "wifi-off"} size={64} color={isOnline ? "green" : "red"} />
      <Text style={styles.text}>{isOnline ? "You're online!" : "No Internet Connection"}</Text>
      <ActivityIndicator size="large" color="teal" />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    marginVertical: 20,
  },
});
