import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Modal,
  ScrollView
} from 'react-native';

export default function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [color, setColor] = useState('');
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [msgModal, setMsg] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);

  const PORT = 3000;

  const addUser = () => {
    fetch(`http://localhost:${PORT}/add/`, {
      method: 'POST',
      body: JSON.stringify({ name, age, color }),
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    })
      .then(res => res.json())
      .then(data => {
        setMsg(data.msg || "User successfully added!");
        setModalVisible(true);
        setName('');
        setAge('');
        setColor('');
      })
      .catch(error => {
        console.error("Add error:", error);
        setMsg("Something went wrong while adding the user.");
        setModalVisible(true);
      });
  };

  const fetchUsers = () => {
    fetch(`http://localhost:${PORT}/`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(error => {
        console.error("Fetch error:", error);
      });
  };

  const deleteUser = (id) => {
    fetch(`http://localhost:${PORT}/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    })
      .then(res => res.json())
      .then(data => {
        setMsg(data.msg || "User deleted!");
        setModalVisible(true);
        fetchUsers();
      })
      .catch(error => {
        console.error("Delete error:", error);
        setMsg("Something went wrong while deleting the user.");
        setModalVisible(true);
      });
  };

  const updateUser = () => {
    if (!editingUserId) return;

    fetch(`http://localhost:${PORT}/update/${editingUserId}`, {
      method: 'PUT',
      body: JSON.stringify({ name, age, color }),
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    })
      .then(res => res.json())
      .then(data => {
        setMsg(data.msg || "User updated!");
        setModalVisible(true);
        setName('');
        setAge('');
        setColor('');
        setEditingUserId(null);
        fetchUsers();
      })
      .catch(error => {
        console.error("Update error:", error);
        setMsg("Something went wrong while updating the user.");
        setModalVisible(true);
      });
  };

  const editUser = (user) => {
    setName(user.name);
    setAge(String(user.age));
    setColor(user.color);
    setEditingUserId(user._id);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>User Form</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Favorite color"
        value={color}
        onChangeText={setColor}
      />

      <View style={styles.buttonContainer}>
        <Button
          title={editingUserId ? "UPDATE USER" : "ADD USER"}
          onPress={editingUserId ? updateUser : addUser}
        />
      </View>

      {users.length > 0 && (
        <View style={styles.userList}>
          <Text style={styles.listTitle}>Registered Users</Text>
          <ScrollView style={styles.userScroll} showsVerticalScrollIndicator={false}>
            {users.map(user => (
              <View key={user._id} style={styles.userItem}>
                <Text style={styles.userText}>👤 {user.name}</Text>
                <Text style={styles.userText}>🎂 {user.age} years</Text>
                <Text style={styles.userText}>🎨 {user.color}</Text>
                <View style={styles.inlineButtons}>
                  <Button title="Update" onPress={() => editUser(user)} />
                  <Button title="Delete" color="red" onPress={() => deleteUser(user._id)} />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
)}


      <View style={styles.buttonContainer}>
        <Button title="SHOW USERS" onPress={fetchUsers} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{msgModal}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#f9f9f9'
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20
  },
  userScroll: {
    maxHeight: 300,
    width: '100%'
  },  
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff'
  },
  buttonContainer: {
    marginVertical: 10,
    width: '60%'
  },
  userList: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center'
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10
  },
  userItem: {
    width: '90%',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  userText: {
    fontSize: 16,
    marginBottom: 5
  },
  inlineButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center'
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  }
});
