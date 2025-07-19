import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setDisplayName(res.data.displayName || '');
      setEmail(res.data.email || '');
    } catch (err: any) {
      if (err?.response?.status === 401) {
        await AsyncStorage.removeItem('token');
        navigation.replace('Login');
      }
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await api.put('/auth/profile', { displayName });
      setIsEditing(false);
      Alert.alert('Succes', 'Profiel bijgewerkt!');
    } catch (err: any) {
      Alert.alert('Fout', err?.response?.data || 'Kon profiel niet bijwerken.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Uitloggen',
      'Weet je zeker dat je wilt uitloggen?',
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Uitloggen',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profiel</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Naam</Text>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Jouw naam"
            />
            <View style={styles.buttonRow}>
              <Button title="Opslaan" color="#9DC183" onPress={handleUpdateProfile} disabled={loading} />
              <Button title="Annuleren" color="#9DC183" onPress={() => setIsEditing(false)} />
            </View>
          </View>
        ) : (
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{displayName || 'Geen naam ingesteld'}</Text>
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.editButton}>Bewerken</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Button title="Uitloggen" color="#FF6B6B" onPress={handleLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#DFF2E1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3E3E3E',
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#9DC183',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E3E3E',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#9DC183',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    color: '#3E3E3E',
  },
  editButton: {
    color: '#9DC183',
    fontWeight: 'bold',
  },
  editContainer: {
    gap: 12,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#3E3E3E',
    borderWidth: 1,
    borderColor: '#DFF2E1',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
});

export default ProfileScreen; 