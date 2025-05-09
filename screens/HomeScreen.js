import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import RNPickerSelect from "react-native-picker-select";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CreateStock from "../pages/CreateStock";
import Juice from "../pages/Juice";

const HomeScreen = () => {
  const [options, setOptions] = useState([]);
  const [category, setCategory] = useState(null);

  const [activeTab, setActiveTab] = useState(1);
  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  useEffect(() => {
    if (category === "Chemicals") {
      setOptions(chemicalItems);
    } else if (category === "Food Items") {
      setOptions(foodItems);
    } else if (category === "Packaging") {
      setOptions(packingItems);
    } else {
      setOptions([]);
    }
  }, [category]);

  return (
    <SafeAreaView style={styles.container}>
      <Text
        className="text-center my-20"
        style={{ fontWeight: "bold", fontSize: 26 }}
      >
        My Inventory App
      </Text>
      <View className="flex-row px-4 py-2 my-5 justify-evenly align-middle">
        <TouchableOpacity
          className="p-3 rounded-md"
          onPress={() => handleTabClick(1)}
          style={{
            backgroundColor: activeTab === 1 ? "#e42527" : "whitesmoke",
          }}
        >
          <Text
            style={{
              color: activeTab === 1 ? "white" : "black",
              fontWeight: activeTab === 1 ? "bold" : "none",
              fontSize: activeTab === 1 ? 20 : 14,
            }}
          >
            Current Stock
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-3 rounded-md"
          onPress={() => handleTabClick(2)}
          style={{
            backgroundColor: activeTab === 2 ? "#e42527" : "whitesmoke",
          }}
        >
          <Text
            style={{
              color: activeTab === 2 ? "white" : "black",
              fontWeight: activeTab === 2 ? "bold" : "none",
              fontSize: activeTab === 2 ? 20 : 14,
            }}
          >
            Juice Cycles
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 p-2">
        {activeTab === 1 && (
          <View>
            <CreateStock />
          </View>
        )}
        {activeTab === 2 && (
          <View>
            <Juice />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
    padding: 20,
  },
  dropdownContainer: {
    backgroundColor: "whitesmoke",
    elevation: 10,
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "black",
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: "black",
  },
};
