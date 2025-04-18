import { StyleSheet, Text, View } from "react-native";
import React from "react";

const DetailsPage = ({ route }) => {
  const { item } = route.params; // ✅ this is how it's passed in react-navigation

  const savedDate = item.postedDate;
  const date = new Date(savedDate);
  return (
    <View className="p-3 flex-1">
      <View className="flex-row p-3  bg-white my-4 rounded-md">
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          Date Recorded:{" "}
        </Text>
        <Text style={{ fontSize: 20 }}>{date.toLocaleDateString()}</Text>
      </View>
      <View className="flex-row p-3  bg-white my-4 rounded-md">
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>Time: </Text>
        <Text style={{ fontSize: 20 }}>{date.toLocaleTimeString()}</Text>
      </View>
      <View className="flex-row p-3  bg-white my-4 rounded-md">
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>Item: </Text>
        <Text selectable style={{ fontSize: 20 }}>
          {item.itemName}
        </Text>
      </View>

      <View className="flex-row p-3  bg-white my-4 rounded-md">
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>Quantity: </Text>
        <Text selectable style={{ fontSize: 20 }}>
          {item.quantity} {item.scale}
        </Text>
      </View>
      <View
        style={{ height: 200 }}
        className="flex-row p-3  bg-white my-4 rounded-md"
      >
        <Text style={{ fontSize: 20 }}>{item.description}</Text>
      </View>
    </View>
  );
};

export default DetailsPage;

const styles = StyleSheet.create({});
