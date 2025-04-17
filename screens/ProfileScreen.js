import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);

  // Load history from AsyncStorage on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem('history');
        if (stored) setHistory(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load history', error);
      }
    };
    loadHistory();
  }, []);

  // Save a new entry to AsyncStorage and state
  const saveHistory = async (entry) => {
    try {
      const updated = [...history, entry];
      setHistory(updated);
      await AsyncStorage.setItem('history', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save history', error);
    }
  };

  const handlePress = (value) => {
    if (value === 'C') {
      setInput('');
    } else if (value === '⌫') {
      setInput(input.slice(0, -1));
    } else if (value === '=') {
      try {
        const sanitized = input.replace(/×/g, '*').replace(/÷/g, '/');
        const result = eval(sanitized);
        const entry = `${input} = ${result}`;
        saveHistory(entry);
        setInput(result.toString());
      } catch (error) {
        alert('Invalid Expression');
      }
    } else {
      setInput(input + value);
    }
  };

  const buttons = [
    ['C', '⌫', '÷', '×'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3'],
    ['0', '='],
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.display}>{input || '0'}</Text>
      {buttons.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((btn) => (
            <TouchableOpacity
              key={btn}
              style={styles.button}
              onPress={() => handlePress(btn)}
            >
              <Text style={styles.buttonText}>{btn}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <Text style={styles.historyTitle}>History</Text>
      <ScrollView style={styles.historyContainer}>
        {history.slice().reverse().map((item, idx) => (
          <Text key={idx} style={styles.historyItem}>{item}</Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
  },
  display: {
    fontSize: 40,
    textAlign: 'right',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 24,
  },
  historyTitle: {
    fontSize: 20,
    marginTop: 30,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  historyContainer: {
    maxHeight: 150,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  historyItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
});

export default Calculator;