import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  SectionList,
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
  const [loading, setLoading] = useState(true);

  const initialLayout = { width: Dimensions.get("window").width };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryRes = await axios.get(
          "https://inventory-backend-41kx.onrender.com/inventory"
        );
        const inv = inventoryRes.data;
        setStockData(inv);
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
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderScene = ({ route }) => {
    const itemsInCat = stockData.filter((item) => item.category === route.key);

    // group items by creation date (YYYY-MM-DD)
    const grouped = itemsInCat.reduce((acc, item) => {
      const dateKey = new Date(item.postedDate).toISOString().split("T")[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {});

    // build sections sorted by date descending
    const sections = Object.keys(grouped)
      .sort((a, b) => new Date(b) - new Date(a))
      .map((dateKey) => ({ title: dateKey, data: grouped[dateKey] }));

    return (
      <View style={styles.scene}>
        <SectionList
          sections={sections}
          keyExtractor={(item) => item._id}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          renderItem={({ item }) => {
            const availableQty = parseFloat(item.quantity) || 0;
            const isLow = availableQty < 3;
            return (
              <TouchableOpacity
                style={[styles.listItem, isLow && styles.lowStockItem]}
                onPress={() => navigation.navigate("details", { item })}
              >
                <Text style={styles.itemTitle}>{item.itemName}</Text>
                <Text style={styles.itemSub}>
                  Available: {availableQty} {item.scale}
                </Text>
              </TouchableOpacity>
            );
          }}
          stickySectionHeadersEnabled={false}
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { justifyContent: "center", alignItems: "center" },
  scene: { flex: 1, backgroundColor: "#fdfdfd", padding: 10 },
  tabbar: { backgroundColor: "#e42527" },
  indicator: { backgroundColor: "white", fontSize: 18 },
  sectionHeader: {
    backgroundColor: "#ddd",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 10,
  },
  listItem: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: "whitesmoke",
  },
  lowStockItem: {
    backgroundColor: "#ffe5e5",
  },
  itemTitle: { fontSize: 18, fontWeight: "bold" },
  itemSub: { fontSize: 14, color: "gray", marginTop: 4 },
  noDataText: { fontSize: 18, color: "gray" },
});
