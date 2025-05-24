import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

import BuscarSong from './buscarSong';
import PlayList from './playList';
import AudioScreen from './audio';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegistroScreen'; 

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainApp({ favoritos, agregarAFavoritos, eliminarDeFavoritos, handleLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Buscar') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Favoritos') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === 'Audio') {
            iconName = focused ? 'mic' : 'mic-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name='Buscar'>
        {() => <BuscarSong agregarAFavoritos={agregarAFavoritos} handleLogout={handleLogout} />}
      </Tab.Screen>
      <Tab.Screen name='Favoritos'>
        {() => (
          <PlayList
            favoritos={favoritos}
            eliminarDeFavoritos={eliminarDeFavoritos}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name='Audio' component={AudioScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await AsyncStorage.getItem('currentUser');
        setIsLoggedIn(!!user);
      } catch (e) {
        console.log('Error al revisar login:', e);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const agregarAFavoritos = (cancion) => {
    setFavoritos((prev) => {
      if (prev.some((fav) => fav.id === cancion.id)) {
        return prev;
      }
      return [...prev, cancion];
    });
  };

  const eliminarDeFavoritos = (id) => {
    setFavoritos((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('currentUser');
    setIsLoggedIn(false);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="MainApp">
            {() => (
              <MainApp
                favoritos={favoritos}
                agregarAFavoritos={agregarAFavoritos}
                eliminarDeFavoritos={eliminarDeFavoritos}
                handleLogout={handleLogout}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login">
              {({ navigation }) => (
                <LoginScreen navigation={navigation} handleLoginApp={handleLogin} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Registro" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}






