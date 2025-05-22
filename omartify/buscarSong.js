import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import Reproductor from './Reproductor';
import { Ionicons } from '@expo/vector-icons';

const BuscarSong = ({ agregarAFavoritos, handleLogout }) => {
  const [query, setQuery] = useState('');
  const [canciones, setCanciones] = useState([]);
  const [previewActual, setPreviewActual] = useState(null);

  const buscar = async () => {
    if (!query.trim()) return;

    try {
      const respuesta = await fetch(
        `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=10`
      );
      const data = await respuesta.json();

      if (data.data.length === 0) {
        Alert.alert('No se encontraron canciones', 'Prueba con otra búsqueda');
      }

      setCanciones(data.data);
    } catch (error) {
      console.error('Error al buscar canciones:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={24} color="lightgray" />
      </TouchableOpacity>

      <TextInput
        placeholder="Buscar canción..."
        placeholderTextColor="#ccc"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
        onSubmitEditing={buscar}
      />

      <FlatList
        data={canciones}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.artist}>{item.artist.name}</Text>
            <TouchableOpacity onPress={() => setPreviewActual(item.preview)}>
              <Image source={{ uri: item.album.cover_medium }} style={styles.image} />
            </TouchableOpacity>
            {item.preview ? (
              previewActual === item.preview && <Reproductor url={item.preview} />
            ) : (
              <Text style={styles.noPreview}>No hay preview disponible</Text>
            )}
            <TouchableOpacity onPress={() => agregarAFavoritos(item)} style={styles.starButton}>
              <Ionicons name="star-outline" size={24} color="#ffd700" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderColor: '#222',
    borderWidth: 1,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  artist: {
    color: '#bbb',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  noPreview: {
    color: '#888',
    fontStyle: 'italic',
  },
  starButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
});

export default BuscarSong;

