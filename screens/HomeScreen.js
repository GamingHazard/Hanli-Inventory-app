import { SafeAreaView, StyleSheet, View,Text, TextInput, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CreateStock from '../pages/CreateStock';
import UsedStock from '../pages/UsedStock';

const HomeScreen = () => {
  const [options, setOptions] = useState([]);
  const [category, setCategory] = useState(null);
  const [foodStuff, setFoodStuff] = useState(null);
  const [packingTools, setPackingTools] = useState(null);
  const [scale, setScale] = useState(null);
  const [remainderScale, setRemainderScale] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [remainder, setRemainder] = useState('');
  const [activeTab, setActiveTab] = useState(1);
   const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  

  useEffect(() => {
    if (category === 'Chemicals') {
      setOptions(chemicalItems);
    } else if (category === 'Food Items') {
      setOptions(foodItems);
    } else if (category === 'Packaging') {
      setOptions(packingItems);
    } else {
      setOptions([]);
    }
  }, [category]);

  return (
    <SafeAreaView style={styles.container}>
      <Text className="text-center my-20" style={{ fontWeight: 'bold', fontSize: 26 }} >My Inventory App</Text>
          <View className="flex-row px-4 my-5 justify-evenly">
        <TouchableOpacity onPress={() => handleTabClick(1)} style={{ backgroundColor: activeTab === 1 ?"teal":'whitesmoke' }} className='flex-row p-3 rounded-md'><Text style={{color:activeTab===1 ?'white':'black',fontWeight:activeTab===1?"bold":'none',fontSize:activeTab===1?20:14}}>Current Stock</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabClick(2)} style={{ backgroundColor: activeTab === 2 ?"teal":'whitesmoke' }} className='flex-row p-3 rounded-md'><Text style={{color:activeTab===2 ?'white':'black',fontWeight:activeTab===2?"bold":'none',fontSize:activeTab===2?20:14}}>Used Stock</Text></TouchableOpacity>
        </View>
      <ScrollView className="flex-1 p-2">
        {activeTab === 1 && <CreateStock />}
        {activeTab === 2 && <UsedStock />}
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    padding: 20,
  },
  dropdownContainer: {
    backgroundColor: 'whitesmoke',
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
    color: 'black',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: 'black',
  },
};
