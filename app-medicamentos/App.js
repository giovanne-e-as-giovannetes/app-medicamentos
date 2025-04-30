// App.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Button, StyleSheet, Modal, TouchableOpacity, Alert, Image } from 'react-native';

export default function App() {
  const [medications, setMedications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [medicationName, setMedicationName] = useState('');
  const [medicationTime, setMedicationTime] = useState('');
  const [editingId, setEditingId] = useState(null); // <- saber se está editando

  // Checa o horário a cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      medications.forEach((med) => {
        if (med.time === currentTime && !med.administered) {
          Alert.alert("Hora do Remédio!", `Tome: ${med.name}`);
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [medications]);

  const addMedication = () => {
    if (medicationName.trim() !== '' && medicationTime.trim() !== '') {
      if (editingId) {
        setMedications((prev) =>
          prev.map((med) =>
            med.id === editingId ? { ...med, name: medicationName, time: medicationTime } : med
          )
        );
        setEditingId(null);
      } else {
        setMedications([
          ...medications,
          { id: Date.now().toString(), name: medicationName, time: medicationTime, administered: false }
        ]);
      }
      setMedicationName('');
      setMedicationTime('');
      setModalVisible(false);
    }
  };

  const markAsAdministered = (id) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === id ? { ...med, administered: true } : med
      )
    );
  };

  const deleteMedication = (id) => {
    Alert.alert(
      "Deletar",
      "Tem certeza que deseja remover este medicamento?",
      [
        { text: "Cancelar" },
        { text: "Sim", onPress: () => {
          setMedications((prev) => prev.filter((med) => med.id !== id));
        }}
      ]
    );
  };

  const editMedication = (med) => {
    setEditingId(med.id);
    setMedicationName(med.name);
    setMedicationTime(med.time);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DoseSmart</Text>

      <FlatList
        data={medications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.medicationItem, item.administered && styles.administered]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.medicationText}>{item.name} - {item.time}</Text>
              {item.administered && <Text style={styles.administeredText}>Administrado ✅</Text>}
            </View>

            <View style={styles.iconsContainer}>
              {!item.administered && (
                <TouchableOpacity onPress={() => markAsAdministered(item.id)}>
                  <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/190/190411.png' }}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => editMedication(item)}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1827/1827933.png' }}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteMedication(item.id)}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1214/1214428.png' }}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => { setModalVisible(true); setEditingId(null); }}>
        <Text style={styles.addButtonText}>+ Adicionar Medicamento</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Editar Medicamento' : 'Novo Medicamento'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do medicamento"
              value={medicationName}
              onChangeText={setMedicationName}
            />
            <TextInput
              style={styles.input}
              placeholder="Horário (HH:MM)"
              value={medicationTime}
              onChangeText={setMedicationTime}
              keyboardType="numbers-and-punctuation"
            />
            <Button title={editingId ? "Atualizar" : "Salvar"} onPress={addMedication} />
            <Button title="Cancelar" onPress={() => { setModalVisible(false); setEditingId(null); }} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0FE',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#3366CC',
  },
  medicationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
    elevation: 2,
  },
  medicationText: {
    fontSize: 18,
  },
  administered: {
    backgroundColor: '#DFF2BF',
  },
  administeredText: {
    color: '#4F8A10',
    marginTop: 5,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#3366CC',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
