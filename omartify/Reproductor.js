import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import { Audio } from 'expo-av';

const Reproductor = ({ url }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
   
    return () => {
      if (sound) {
        sound.unloadAsync().catch(() => {});
      }
    };
  }, [sound]);

  const reproducir = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error al reproducir el sonido:', error);
    }
  };

  const pausar = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error al pausar el sonido:', error);
    }
  };

  return (
    <View style={{ marginTop: 10 }}>
      <Button
        title={isPlaying ? 'Pausar' : 'Reproducir'}
        onPress={isPlaying ? pausar : reproducir}
      />
    </View>
  );
};

export default Reproductor;
  
