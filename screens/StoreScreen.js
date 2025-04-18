import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const StoreScreen = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [usedStockData, setUsedStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialLayout = { width: Dimensions.get("window").width };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, usedStockRes] = await Promise.all([
          axios.get("https://inventory-backend-41kx.onrender.com/inventory"),
          axios.get("https://inventory-backend-41kx.onrender.com/usedstock"),
        ]);

        const inv = inventoryRes.data;
        setStockData(inv);
        setUsedStockData(usedStockRes.data);

        // derive unique categories for tabs
        const cats = Array.from(new Set(inv.map((i) => i.category)));
        const tabs = cats.map((c) => ({ key: c, title: c }));
        setRoutes(tabs);
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderScene = ({ route }) => {
    const itemsInCat = stockData.filter((item) => item.category === route.key);

    return (
      <View style={styles.scene}>
        <FlatList
          data={itemsInCat}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const usedQty = usedStockData
              .filter(
                (u) => u.category === item.category && u.item === item.item
              )
              .reduce((sum, u) => sum + (parseFloat(u.quantity) || 0), 0);

            return (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() =>
                  navigation.navigate("StockDetail", { item, usedQty })
                }
              >
                <View>
                  <Text style={styles.itemTitle}>{item.itemName}</Text>
                  <Text style={styles.itemSub}>
                    Created: {item.quantity} {item.scale}
                  </Text>
                  <Text style={styles.itemSub}>
                    Used: {usedQty}, Remaining:{" "}
                    {parseFloat(item.quantity) - usedQty}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loaderContainer]}>
        <ActivityIndicator size="large" color="teal" />
      </View>
    );
  }

  if (!loading && stockData.length === 0) {
    return (
      <View style={[styles.container, styles.loaderContainer]}>
        <Text style={styles.noDataText}>No records found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={styles.indicator}
            style={styles.tabbar}
          />
        )}
      />
    </View>
  );
};

export default StoreScreen;

// Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { justifyContent: "center", alignItems: "center" },
  scene: { flex: 1, backgroundColor: "#fdfdfd", padding: 10 },
  tabbar: { backgroundColor: "#e42527" },
  indicator: { backgroundColor: "white", fontSize: 18 },
  listItem: {
    backgroundColor: "whitesmoke",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  itemTitle: { fontSize: 18, fontWeight: "bold" },
  itemSub: { fontSize: 14, color: "gray", marginTop: 4 },
  noDataText: { fontSize: 18, color: "gray" },
});
