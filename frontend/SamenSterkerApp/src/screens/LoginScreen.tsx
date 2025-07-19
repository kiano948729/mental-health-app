import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import * as Notifications from 'expo-notifications';
import { saveExpoPushToken } from '../api/api';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => { 
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      await AsyncStorage.setItem('token', res.data.token);
      // Expo push token ophalen en opslaan
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus === 'granted') {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        const expoToken = tokenData.data;
        try {
          await saveExpoPushToken(expoToken);
        } catch (e) {
          // niet kritisch
        }
      }
      navigation.replace('MainTabs');
    } catch (err: any) {
      console.log('Login error:', err?.response);
      Alert.alert('Login mislukt', err?.response?.data || 'Controleer je gegevens.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inloggen</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Wachtwoord"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={loading ? 'Even wachten...' : 'Inloggen'} color="#9DC183" onPress={handleLogin} disabled={loading} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 16 }}>
        <Text style={{ color: '#9DC183', textAlign: 'center' }}>Nog geen account? Registreren</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#DFF2E1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3E3E3E',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    fontSize: 16,
    color: '#3E3E3E',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DFF2E1',
  },
});

export default LoginScreen; 