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
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const UsedStock = () => {
  // Form states
  const [options, setOptions] = useState([]);
  const [category, setCategory] = useState(null);
  const [foodStuff, setFoodStuff] = useState(null);
  const [scale, setScale] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState(""); // New state for description
  const [loading, setLoading] = useState(false);

  // List state for multiple items
  const [usedStockList, setUsedStockList] = useState([]);

  const scales = [
    { label: "Tins", value: "Tins" },
    { label: "Sachets", value: "Sachets" },
    { label: "Pcs", value: "Pcs" },
    { label: "Kgs", value: "Kgs" },
    { label: "Ltrs", value: "Ltrs" },
    { label: "Bags", value: "Bags" },
    { label: "Boxes", value: "Boxes" },
    { label: "Sachets", value: "Sachets" },
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
    { label: "Sodium Dehydroacette", value: "Sodium Dehydroacette" },
    { label: "Tri Sodium Ethyn", value: "Tri Sodium Ethyn" },
    {
      label: "Sodium Carboxymethyl Cellulose (CMC)",
      value: "Sodium Carboxymethyl Cellulose (CMC)",
    },
    { label: "Titanium Dioxide", value: "Titanium Dioxide" },
    { label: "Xanthon Gum", value: "Xanthon Gum" },
    { label: "Food Aditive", value: "Food Aditive" },
    { label: "Sweetener", value: "Sweetener" },
  ];

  const packingItems = [
    { label: "Boxes", value: "Boxes" },
    { label: "Labels", value: "Labels" },
    { label: "Cups", value: "Cups" },
    { label: "Seal Tape", value: "Seal Tape" },
  ];

  // Update options depending on the category selected
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

  // Handle adding a used stock item to the list
  const handleAddItem = () => {
    if (!category || !foodStuff || !quantity) {
      Alert.alert("Please fill in category, item, and quantity.");
      return;
    }
    const newStock = {
      id: Date.now(), // Unique id (demo purposes)
      category,
      item: foodStuff,
      quantity,
      scale,
      description, // Include the description field
    };
    setUsedStockList([...usedStockList, newStock]);
    // Reset form fields
    setCategory(null);
    setFoodStuff(null);
    setQuantity("");
    setScale(null);
    setDescription(""); // Reset description field
  };

  // Handle deleting a used stock item
  const handleDeleteItem = (id) => {
    const filteredList = usedStockList.filter((stock) => stock.id !== id);
    setUsedStockList(filteredList);
  };

  const saveToStock = async () => {
    setLoading(true);
    if (usedStockList.length === 0) {
      Alert.alert("No used stock items to submit.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://inventory-backend-41kx.onrender.com/usedstock",
        {
          usedStock: usedStockList,
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Used stock submitted successfully!");
        setUsedStockList([]); // Clear list after successful submission
      } else {
        Alert.alert("Failed to submit used stock. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("There was an error submitting your used stock.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={[styles.title, { textAlign: "center" }]}>Used Stock</Text>

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

        {/* Quantity and Scale */}
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
              placeholder={{ label: "Scale", value: null }}
              items={scales}
              style={pickerSelectStyles}
              value={scale}
            />
          </View>
        </View>

        {/* Add Item Button */}
        <TouchableOpacity onPress={handleAddItem} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Item</Text>
          <Ionicons
            name="add"
            size={26}
            color="white"
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>

        {/* Display Used Stock List */}
        {usedStockList.length > 0 && (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>Used Stock List</Text>
            {usedStockList.map((stock) => (
              <View key={stock.id} style={styles.listItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemText}>
                    Category: {stock.category}
                  </Text>
                  <Text style={styles.itemText}>Item: {stock.item}</Text>
                  <Text style={styles.itemText}>
                    Description: {stock.description}
                  </Text>
                  <Text style={styles.itemText}>
                    Quantity: {stock.quantity} {stock.scale || ""}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteItem(stock.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ))}
            {/* Submit All Button */}
            <TouchableOpacity onPress={saveToStock} style={styles.submitButton}>
              {loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Save to stock</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UsedStock;

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
  listContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 10,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "whitesmoke",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  itemText: {
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
