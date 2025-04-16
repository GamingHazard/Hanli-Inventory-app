import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import axios from 'axios';

const StoreScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [usedStockData, setUsedStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both inventory (created stock) and used stock concurrently.
        const [inventoryResponse, usedStockResponse] = await Promise.all([
          axios.get('https://inventory-backend-41kx.onrender.com/inventory'),
          axios.get('https://inventory-backend-41kx.onrender.com/usedstock')
        ]);
        
        const inventoryData = inventoryResponse.data;
        const usedStock = usedStockResponse.data;

        setStockData(inventoryData);
        setUsedStockData(usedStock);

        // Create routes based on the inventory data.
        const newRoutes = inventoryData.map((item, idx) => ({
          key: item._id ? item._id.toString() : idx.toString(),
          title: item.itemName || `Stock ${idx + 1}`,
        }));
        setRoutes(newRoutes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderScene = ({ route }) => {
    // Find the created stock item based on the route key.
    const item = stockData.find(
      (stock) => (stock._id ? stock._id.toString() : '') === route.key
    );

    if (!item) {
      return (
        <View style={styles.scene}>
          <Text>No Data</Text>
        </View>
      );
    }

    // Convert created stock quantity to a number.
    const createdQuantity = parseFloat(item.quantity) || 0;

    // Sum up the total used quantity that matches the same category and item.
    const totalUsedQuantity = usedStockData
      .filter(
        (used) =>
          used.category === item.category &&
          used.item === item.item
      )
      .reduce((sum, used) => sum + (parseFloat(used.quantity) || 0), 0);

    // Compute the difference.
    const remainingQuantity = createdQuantity - totalUsedQuantity;

    return (
      <View style={styles.scene}>
        <Text style={styles.title}>{item.itemName}</Text>
        <Text style={styles.detail}>Category: {item.category}</Text>
        <Text style={styles.detail}>
          Created Quantity: {item.quantity} {item.scale}
        </Text>
        {item.remainder ? (
          <Text style={styles.detail}>
            Remainder: {item.remainder} {item.remainderScale || ''}
          </Text>
        ) : null}
        <Text style={styles.detail}>
          Used Quantity: {totalUsedQuantity}
        </Text>
        <Text style={[styles.detail, { fontWeight: 'bold' }]}>
          Remaining: {remainingQuantity}
        </Text>
      </View>
    );
  };

  const initialLayout = { width: Dimensions.get('window').width };

  if (loading) {
    return (
      <View style={[styles.container, styles.loaderContainer]}>
        <ActivityIndicator size="large" color="tomato" />
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
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: 'tomato' }}
          />
        )}
      />
    </View>
  );
};

export default StoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdfdfd',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    marginVertical: 4,
  },
  noDataText: {
    fontSize: 18,
    color: 'gray',
  },
});
