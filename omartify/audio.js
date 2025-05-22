import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const AudioScreen = () => {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [audioURI, setAudioURI] = useState(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita permiso para grabar audio');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
    } catch (error) {
      console.error('Error al iniciar la grabación:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioURI(uri);
      setRecording(null);
      Alert.alert('Grabación guardada', `Audio guardado en: ${uri}`);
    } catch (error) {
      console.error('Error al detener la grabación:', error);
    }
  };

  const reproducirAudio = async () => {
    if (!audioURI) return;

    const { sound } = await Audio.Sound.createAsync({ uri: audioURI });
    setSound(sound);
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎙️ Grabadora de audio</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={recording ? stopRecording : startRecording}
      >
        <Ionicons
          name={recording ? 'stop-circle' : 'mic'}
          size={24}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.buttonText}>
          {recording ? 'Detener grabación' : 'Iniciar grabación'}
        </Text>
      </TouchableOpacity>

      {audioURI && (
        <>
          <View style={styles.info}>
            <Text style={styles.label}>Audio guardado:</Text>
            <Text style={styles.uri}>{audioURI}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={reproducirAudio}>
            <Ionicons name="play-circle" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Reproducir audio</Text>
          </TouchableOpacity>
        </>
      )}
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  info: {
    marginBottom: 15,
  },
  label: {
    color: '#bbb',
    marginBottom: 5,
  },
  uri: {
    fontSize: 12,
    color: '#888',
  },
});

export default AudioScreen;

