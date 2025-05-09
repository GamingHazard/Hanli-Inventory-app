import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "Pending items";

const CreateStock = () => {
  // Form states
  const [options, setOptions] = useState([]);
  const [category, setCategory] = useState(null);
  const [foodStuff, setFoodStuff] = useState(null);
  const [scale, setScale] = useState(null);
  const [remainderScale, setRemainderScale] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [remainder, setRemainder] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Inventory list
  const [inventoryList, setInventoryList] = useState([]);

  // Data lists
  const remainderscales = [
    { label: "Tins", value: "Tins" },
    { label: "Sachets", value: "Sachets" },
    { label: "Pcs", value: "Pcs" },
    { label: "Kgs", value: "Kgs" },
    { label: "Ltrs", value: "Ltrs" },
    { label: "Rolls", value: "Rolls" },
  ];
  const scales = [
    { label: "Bags", value: "Bags" },
    { label: "Boxes", value: "Boxes" },
    { label: "Sachets", value: "Sachets" },
    { label: "Rolls", value: "Rolls" },
  ];
  const categories = [
    { label: "Chemicals", value: "Chemicals" },
    { label: "Food Items", value: "Food Items" },
    { label: "Packaging", value: "Packaging" },
  ];

  const foodItems = [
    { label: "Tartrazine", value: "Tartrazine" },
    { label: "Sunset Yellow", value: "Sunset Yellow" },
    { label: "Mango Flavour", value: "Mango Flavour" },
    { label: "Ananas Flavour", value: "Ananas Flavour" },
    { label: "Yoghurt Flavour", value: "Yoghurt Flavour" },
    { label: "Newzealand Milk Powder", value: "Newzealand Milk Powder" },
    { label: "Silcon Oil", value: "Silcon Oil" },
    { label: "Double Tumeric Flavour", value: "Double Tumeric Flavour" },
    { label: "Allura Red", value: "Allura Red" },
    { label: "Apple Caramel", value: "Apple Caramel" },
  ];

  const chemicalItems = [
    { label: "Potassium Srobate", value: "Potassium Srobate" },
    { label: "Citric Acid", value: "Citric Acid" },
    { label: "Tri Sodium Citrate", value: "Tri Sodium Citrate" },
    { label: "Sodium Dehydroacetate", value: "Sodium Dehydroacetate" },
    { label: "Tri Sodium Ethyn", value: "Tri Sodium Ethyn" },
    {
      label: "Sodium Carboxymethyl Cellulose (CMC)",
      value: "Sodium Carboxymethyl Cellulose (CMC)",
    },
    { label: "Titanium Dioxide", value: "Titanium Dioxide" },
    { label: "Xanthon Gum", value: "Xanthon Gum" },
    { label: "Food Aditive", value: "Food Aditive" },
    { label: "Sweetener", value: "Sweetener" },
    { label: "Malic Acid", value: "Malic Acid" },
  ];

  const packingItems = [
    { label: "Boxes", value: "Boxes" },
    { label: "Labels", value: "Labels" },
    { label: "Cups", value: "Cups" },
    { label: "Seal Tape", value: "Seal Tape" },
  ];

  // Load saved inventory once on mount
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          setInventoryList(JSON.parse(json));
        }
      } catch (e) {
        console.warn("Failed to load inventory:", e);
      }
    })();
  }, []);

  // Update options when category changes
  useEffect(() => {
    switch (category) {
      case "Chemicals":
        setOptions(chemicalItems);
        break;
      case "Food Items":
        setOptions(foodItems);
        break;
      case "Packaging":
        setOptions(packingItems);
        break;
      default:
        setOptions([]);
    }
  }, [category]);

  // Persist helper
  const persist = async (newList) => {
    setInventoryList(newList);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.warn("Failed to save inventory:", e);
    }
  };

  // Add inventory item
  const handleAddInventory = async () => {
    if (!category || !foodStuff || !quantity) {
      Alert.alert("Please fill in category, item, and quantity");
      return;
    }

    const newItem = {
      id: Date.now(),
      category,
      item: foodStuff,
      quantity,
      scale,
      remainder,
      remainderScale,
      description,
    };

    const newList = [...inventoryList, newItem];
    await persist(newList);

    // Reset form
    setCategory(null);
    setFoodStuff(null);
    setQuantity("");
    setScale(null);
    setRemainder("");
    setRemainderScale(null);
    setDescription("");
  };

  // Delete inventory item
  const handleDeleteInventory = async (id) => {
    const newList = inventoryList.filter((inv) => inv.id !== id);
    await persist(newList);
  };

  // Submit all inventory to backend
  const saveStock = async () => {
    setLoading(true);
    if (inventoryList.length === 0) {
      Alert.alert("No inventory to submit.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://inventory-backend-41kx.onrender.com/inventory",
        { inventories: inventoryList }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Inventory submitted successfully!");
        // clear local list and storage
        await AsyncStorage.removeItem(STORAGE_KEY);
        setInventoryList([]);
      } else {
        Alert.alert("Failed to submit inventory. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("There was an error submitting your inventory.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={[styles.title, { textAlign: "center" }]}>
          Create New Stock
        </Text>

        {/* Category Picker */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.dropdownContainer}>
          <RNPickerSelect
            onValueChange={(value) => setCategory(value)}
            placeholder={{ label: "Select Category", value: null }}
            items={categories}
            style={pickerSelectStyles}
            value={category}
          />
        </View>

        {/* Item Picker */}
        <Text style={styles.label}>Item</Text>
        <View style={styles.dropdownContainer}>
          <RNPickerSelect
            onValueChange={(value) => setFoodStuff(value)}
            placeholder={{ label: "Select Item", value: null }}
            items={options}
            style={pickerSelectStyles}
            disabled={!category}
            value={foodStuff}
          />
        </View>

        {/* Description Input */}
        <Text style={styles.label}>Description</Text>
        <View
          className="  rounded-md"
          style={{ backgroundColor: "whitesmoke", width: "100%" }}
        >
          <TextInput
            style={{
              backgroundColor: "whitesmoke",
              borderRadius: 10,
              margin: 10,
            }}
            placeholder="Enter item description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Quantity Input with Scale */}
        <Text style={styles.label}>Quantity</Text>
        <View style={[styles.rowContainer, { backgroundColor: "whitesmoke" }]}>
          <TextInput
            keyboardType="number-pad"
            style={styles.textInput}
            placeholder="Enter quantity"
            value={quantity}
            onChangeText={setQuantity}
          />
          <View style={styles.scalePicker}>
            <RNPickerSelect
              onValueChange={(value) => setScale(value)}
              placeholder={{ label: "scale", value: null }}
              items={scales}
              value={scale}
              style={pickerSelectStyles}
            />
          </View>
        </View>

        {/* Remainder Input with Scale */}
        <Text style={styles.label}>Remainders</Text>
        <View style={[styles.rowContainer, { backgroundColor: "whitesmoke" }]}>
          <TextInput
            disabled={!quantity}
            keyboardType="number-pad"
            style={styles.textInput}
            placeholder="Enter remainders..."
            value={remainder}
            onChangeText={setRemainder}
          />
          <View style={styles.scalePicker}>
            <RNPickerSelect
              onValueChange={(value) => setRemainderScale(value)}
              placeholder={{ label: "scale", value: null }}
              items={remainderscales}
              value={remainderScale}
              disabled={!quantity || !scale}
              style={pickerSelectStyles}
            />
          </View>
        </View>

        {/* Add Inventory Item Button */}
        <TouchableOpacity onPress={handleAddInventory} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Item</Text>
          <Ionicons
            name="add"
            size={26}
            color="white"
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>

        {/* Display Added Inventory Items */}
        {inventoryList.length > 0 && (
          <View style={styles.inventoryContainer}>
            <Text style={styles.inventoryTitle}>Inventory List</Text>
            {inventoryList.map((inv) => (
              <View key={inv.id} style={styles.inventoryItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inventoryText}>
                    Category: {inv.category}
                  </Text>
                  <Text style={styles.inventoryText}>Item: {inv.item}</Text>
                  <Text style={styles.inventoryText}>
                    Description: {inv.description}
                  </Text>
                  <Text style={styles.inventoryText}>
                    Quantity: {inv.quantity} {inv.scale || ""}
                  </Text>
                  <Text style={styles.inventoryText}>
                    Remainders: {inv.remainder} {inv.remainderScale || ""}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteInventory(inv.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Submit All Inventory Items Button */}
            <TouchableOpacity onPress={saveStock} style={styles.submitButton}>
              {loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <Text style={styles.submitButtonText}>save Inventory</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateStock;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 26,
    marginBottom: 16,
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
  },
  dropdownContainer: {
    backgroundColor: "whitesmoke",

    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 5,
    borderRadius: 10,
  },
  textInput: {
    width: "70%",
    padding: 8,
    borderRadius: 4,
  },
  scalePicker: {
    width: 100,
    backgroundColor: "white",
    flex: 1,
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 0.9,
    borderColor: "lightgrey",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#e42527",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginVertical: 12,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  inventoryContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 10,
  },
  inventoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  inventoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "whitesmoke",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  inventoryText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    marginVertical: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
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
