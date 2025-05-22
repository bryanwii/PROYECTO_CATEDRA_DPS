import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Reproductor from './Reproductor';
import { Ionicons } from '@expo/vector-icons';

const PlayList = ({ favoritos, eliminarDeFavoritos }) => {
  const [previewActual, setPreviewActual] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tus favoritos</Text>
      <FlatList
        data={favoritos}
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
            <TouchableOpacity
              onPress={() => eliminarDeFavoritos(item.id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={24} color="tomato" />
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
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
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
  deleteButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
});

export default PlayList;

