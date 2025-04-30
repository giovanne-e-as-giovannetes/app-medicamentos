// Importações principais do React Native e React
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';

// Componente principal do aplicativo
export default function App() {
  // Estados para armazenar a lista de medicamentos e controlar o modal
  const [medications, setMedications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [medicationName, setMedicationName] = useState('');
  const [medicationTime, setMedicationTime] = useState('');
  const [editingId, setEditingId] = useState(null); // ID do medicamento sendo editado (se houver)

  // Efeito que verifica a cada 10 segundos se é hora de tomar algum medicamento
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      // Verifica se algum medicamento está agendado para o horário atual e ainda não foi tomado
      medications.forEach((med) => {
        if (med.time === currentTime && !med.administered) {
          Alert.alert("Hora do Remédio!", `Tome: ${med.name}`);
        }
      });
    }, 10000); // Executa a cada 10 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, [medications]);

  // Função para adicionar ou atualizar um medicamento
  const addMedication = () => {
    if (medicationName.trim() !== '' && medicationTime.trim() !== '') {
      if (editingId) {
        // Atualiza medicamento existente
        setMedications((prev) =>
          prev.map((med) =>
            med.id === editingId ? { ...med, name: medicationName, time: medicationTime } : med
          )
        );
        setEditingId(null); // Sai do modo de edição
      } else {
        // Adiciona novo medicamento
        setMedications([
          ...medications,
          {
            id: Date.now().toString(),
            name: medicationName,
            time: medicationTime,
            administered: false
          }
        ]);
      }

      // Limpa os campos e fecha o modal
      setMedicationName('');
      setMedicationTime('');
      setModalVisible(false);
    }
  };

  // Marca o medicamento como administrado
  const markAsAdministered = (id) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === id ? { ...med, administered: true } : med
      )
    );
  };

  // Exclui medicamento após confirmação
  const deleteMedication = (id) => {
    Alert.alert(
      "Deletar",
      "Tem certeza que deseja remover este medicamento?",
      [
        { text: "Cancelar" },
        {
          text: "Sim", onPress: () => {
            setMedications((prev) => prev.filter((med) => med.id !== id));
          }
        }
      ]
    );
  };

  // Preenche campos para editar medicamento
  const editMedication = (med) => {
    setEditingId(med.id);
    setMedicationName(med.name);
    setMedicationTime(med.time);
    setModalVisible(true);
  };

  // Interface visual do aplicativo
  return (
    <SafeAreaView style={styles.container}>
      {/* Título principal */}
      <Text style={styles.title}>DoseSmart</Text>

      {/* Lista de medicamentos */}
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        data={medications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.medicationItem, item.administered && styles.administered]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.medicationText}>{item.name} - {item.time}</Text>
              {item.administered && <Text style={styles.administeredText}>Administrado ✅</Text>}
            </View>

            {/* Ícones de ação: marcar como tomado, editar, excluir */}
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

      {/* Botão para adicionar novo medicamento */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setModalVisible(true);
          setEditingId(null); // Garante que será adição, não edição
        }}
      >
        <Text style={styles.addButtonText}>+ Adicionar Medicamento</Text>
      </TouchableOpacity>

      {/* Modal para adicionar ou editar medicamento */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? 'Editar Medicamento' : 'Novo Medicamento'}
            </Text>

            {/* Campo: nome do medicamento */}
            <TextInput
              style={styles.input}
              placeholder="Nome do medicamento"
              value={medicationName}
              onChangeText={setMedicationName}
            />

            {/* Campo: horário */}
            <TextInput
              style={styles.input}
              placeholder="Horário (HH:MM)"
              value={medicationTime}
              onChangeText={setMedicationTime}
              keyboardType="numbers-and-punctuation"
            />

            {/* Botões do modal */}
            <Button title={editingId ? "Atualizar" : "Salvar"} onPress={addMedication} />
            <Button title="Cancelar" onPress={() => {
              setModalVisible(false);
              setEditingId(null);
            }} color="red" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Estilos do aplicativo
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#3366CC',
  },
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
  },
  medicationText: {
    fontSize: 18,
    flexShrink: 1,
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
    marginTop: 10,
    marginBottom: 60,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
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
    resizeMode: 'contain',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
