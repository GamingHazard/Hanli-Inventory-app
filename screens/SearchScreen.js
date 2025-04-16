import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      Alert.alert('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`https://inventory-backend-41kx.onrender.com/inventory/search?q=${query}`);
      setResults(response.data); // Adjust based on API response format
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error searching inventory');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text style={styles.itemTitle}>{item.itemName}</Text>
      <Text style={styles.itemSubtitle}>Qty: {item.quantity} {item.mls}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          autoFocus
          style={styles.input}
          placeholder="Search..."
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.iconButton}>
          <Ionicons name="search-outline" size={26} color="grey" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="teal" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Search Inventory
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 0.9,
    borderColor: 'grey',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    elevation: 5,
  },
  iconButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'grey',
    elevation: 5,
  },
  resultItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemSubtitle: {
    color: 'grey',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'grey',
    fontSize: 16,
  },
});
