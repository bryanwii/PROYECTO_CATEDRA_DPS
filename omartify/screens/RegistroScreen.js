import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen({ navigation }) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

 const handleRegister = async () => {
  if (!user || !password) {
    Alert.alert('Error', 'Por favor completa todos los campos');
    return;
  }

  if (user.length < 4 || password.length < 4) {
  Alert.alert('Error', 'El usuario y la contraseña deben tener al menos 4 caracteres');
  return;
}

  try {
    const storedUsers = await AsyncStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const userExists = users.find((u) => u.username === user);
    if (userExists) {
      Alert.alert('Error', 'El usuario ya existe');
      return;
    }

    const newUser = { username: user, password };
    users.push(newUser);
    await AsyncStorage.setItem('users', JSON.stringify(users));
    Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión');
    navigation.navigate('Login');
  } catch (e) {
    Alert.alert('Error', 'Ocurrió un error al registrarse');
    console.log(e);
  }
};



  return (
    <LinearGradient colors={['#000000', '#0A0F25']} style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput
        placeholder="Usuario"
        placeholderTextColor="#aaa"
        value={user}
        onChangeText={setUser}
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.secondaryButton]} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Volver al Login</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 26,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2c2c2c',
  },
  button: {
    backgroundColor: '#2E86DE',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#3742fa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});




