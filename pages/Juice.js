// src/components/JuiceTracker.js
import React, { useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";

const JUICE_INGREDIENTS = {
  mango: {
    potassiumSorbate: 300,
    sodiumDehydroacetate: 210,
    trisodiumEthylyne: 150,
    sweetener: 1000,
    titaniumDioxide: 80,
    citricAcid: 3500,
    xanthanGum: 2000,
    sodiumCarboxymethylCellulose: 2000,
    siliconOil: 10,
    tartrazine: 300,
    sunsetYellow: 15,
    mangoFlavour: 700,
    sodiumCitrate: 500,
  },
  pineapple: {
    potassiumSorbate: 300,
    sodiumDehydroacetate: 200,
    sodiumCitrate: 500,
    titaniumDioxide: 500,
    sweetener: 1010,
    trisodiumEthylyne: 150,
    ananas: 3500,
    yoghurt: 3500,
    tartrazine: 10,
    citricAcid: 400,
    xanthanGum: 2500,
    sodiumCarboxymethylCellulose: 2000,
    newZealandMilkPowder: 500,
  },
};

export default function JuiceTracker() {
  const [selectedJuice, setSelectedJuice] = useState("mango");
  const [formValues, setFormValues] = useState({
    ...JUICE_INGREDIENTS["mango"],
  });
  const [cycles, setCycles] = useState([]);
  const [isSendingAll, setIsSendingAll] = useState(false);

  const sendCycleToBackend = async (cycle) => {
    try {
      const response = await axios.post(
        "https://inventory-backend-41kx.onrender.com/cycle",
        cycle,
        { headers: { "Content-Type": "application/json" } }
      );
      if (![200, 201].includes(response.status)) {
        console.error("Failed to send cycle:", response.statusText);
      } else {
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Cycle Added",
          text2: "Your cycles have been saved.",
        });
      }
    } catch (error) {
      console.error("Error sending cycle to backend:", error);
      throw error;
    }
  };

  const sendAllCycles = async () => {
    if (cycles.length === 0) return;
    setIsSendingAll(true);
    try {
      for (const cycle of cycles) {
        await sendCycleToBackend(cycle);
      }
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Sync Complete",
        text2: "All cycles have been saved successfully.",
      });
      // clear the list after successful sync
      setCycles([]);
    } catch (error) {
      console.error("Error sending all cycles:", error);
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Sync Failed",
        text2: "There was an error syncing cycles.",
      });
    } finally {
      setIsSendingAll(false);
    }
  };

  const handleSelectJuice = (juiceType) => {
    setSelectedJuice(juiceType);
    setFormValues({ ...JUICE_INGREDIENTS[juiceType] });
  };

  const handleChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const handleAddCycle = () => {
    if (!selectedJuice) return;
    const timestamp = new Date().toISOString();
    const newCycle = {
      id: cycles.length + 1,
      juiceType: selectedJuice,
      ingredients: formValues,
      createdAt: timestamp,
    };

    setCycles((prev) => [...prev, newCycle]);
    sendCycleToBackend(newCycle)
      .then(() => {
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Cycle Added",
          text2: "Your cycle has been saved.",
        });
      })
      .catch(() => {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Save Failed",
          text2: "Failed to save your cycle.",
        });
      });

    // Keep the current juice selection and form values intact
  };

  const handleDeleteCycle = (id) => {
    setCycles((prev) => prev.filter((cycle) => cycle.id !== id));
  };

  const renderIngredientInput = (key, value) => (
    <View style={styles.inputRow} key={key}>
      <Text style={styles.label}>{labelCase(key)} (g)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(value)}
        onChangeText={(text) => handleChange(key, text)}
      />
    </View>
  );

  const renderCycle = ({ item }) => (
    <View style={styles.cycleItem}>
      <View style={styles.cycleHeader}>
        <Text style={styles.cycleTitle}>
          Cycle {item.id}:{" "}
          {item.juiceType.charAt(0).toUpperCase() + item.juiceType.slice(1)}
        </Text>
        <TouchableOpacity
          onPress={() => handleDeleteCycle(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.cycleText}>
        Created: {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  const labelCase = (str) =>
    str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Juice Making Tracker</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.juiceButton,
            selectedJuice === "mango" && styles.selectedButton,
          ]}
          onPress={() => handleSelectJuice("mango")}
        >
          <Text style={styles.buttonText}>Mango</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.juiceButton,
            selectedJuice === "pineapple" && styles.selectedButton,
          ]}
          onPress={() => handleSelectJuice("pineapple")}
        >
          <Text style={styles.buttonText}>Pineapple</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>
          {labelCase(selectedJuice)} Ingredients
        </Text>
        {Object.entries(formValues).map(([key, val]) =>
          renderIngredientInput(key, val)
        )}
        <TouchableOpacity style={styles.addButton} onPress={handleAddCycle}>
          <Text style={styles.addButtonText}>Add Cycle</Text>
        </TouchableOpacity>
      </View>

      {cycles.length > 0 && (
        <View style={styles.cyclesContainer}>
          <Text style={styles.sectionTitle}>Cycles</Text>
          <FlatList
            data={cycles}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderCycle}
          />
          <TouchableOpacity
            style={[styles.syncButton, isSendingAll && styles.disabledButton]}
            onPress={sendAllCycles}
            disabled={isSendingAll}
          >
            {isSendingAll ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.syncButtonText}>Save All Cycles</Text>
            )}
          </TouchableOpacity>
          <Toast />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  juiceButton: { backgroundColor: "#e0e0e0", padding: 12, borderRadius: 8 },
  selectedButton: { backgroundColor: "#a0e0a0" },
  buttonText: { fontSize: 16, fontWeight: "bold", textAlign: "center" },
  formContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  formTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  label: { flex: 1, fontSize: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cyclesContainer: { marginTop: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  cycleItem: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 6,
  },
  cycleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cycleTitle: { fontSize: 18, fontWeight: "bold" },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  deleteButtonText: { color: "#fff", fontSize: 12 },
  cycleText: { fontSize: 16, marginLeft: 8, marginTop: 4 },
  syncButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  syncButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  disabledButton: { opacity: 0.6 },
});
