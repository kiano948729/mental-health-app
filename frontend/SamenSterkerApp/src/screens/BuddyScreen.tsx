import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../api/api';

interface BuddyRelation {
  id: string;
  userId: string;
  buddyId: string;
  status: string;
  createdAt: string;
}

const BuddyScreen: React.FC = () => {
  const [buddies, setBuddies] = useState<BuddyRelation[]>([]);
  const [requests, setRequests] = useState<BuddyRelation[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchBuddies = async () => {
    try {
      const res = await api.get('/buddy');
      setBuddies(res.data);
    } catch (err) {
      Alert.alert('Fout', 'Kon buddies niet ophalen');
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await api.get('/buddy/requests');
      setRequests(res.data);
    } catch (err) {
      // geen alert, requests zijn optioneel
    }
  };

  useEffect(() => {
    fetchBuddies();
    fetchRequests();
  }, []);

  const handleAddBuddy = async () => {
    if (!search) return;
    setLoading(true);
    try {
      // Zoek gebruiker op e-mail (vereist backend endpoint, hier placeholder)
      const userRes = await api.get(`/profile/by-email/${search}`); // <-- dit endpoint moet je backend nog maken
      const buddyId = userRes.data.id;
      await api.post('/buddy/request', { buddyId });
      Alert.alert('Verzoek verstuurd!');
      setSearch('');
      fetchRequests();
    } catch (err: any) {
      Alert.alert('Fout', err?.response?.data || 'Kon buddy niet toevoegen');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (relationId: string, accept: boolean) => {
    try {
      await api.post('/buddy/respond', { relationId, accept });
      fetchBuddies();
      fetchRequests();
    } catch (err) {
      Alert.alert('Fout', 'Kon verzoek niet verwerken');
    }
  };

  const handleRemove = async (relationId: string) => {
    try {
      await api.delete(`/buddy/${relationId}`);
      fetchBuddies();
    } catch (err) {
      Alert.alert('Fout', 'Kon buddy niet verwijderen');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buddies</Text>
      <FlatList
        data={buddies}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Nog geen buddies</Text>}
        renderItem={({ item }) => (
          <View style={styles.buddyItem}>
            <Text style={styles.buddyText}>Buddy: {item.userId} / {item.buddyId}</Text>
            <TouchableOpacity onPress={() => handleRemove(item.id)}>
              <Text style={styles.remove}>Verwijder</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.subtitle}>Buddy-verzoeken</Text>
      <FlatList
        data={requests}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Geen openstaande verzoeken</Text>}
        renderItem={({ item }) => (
          <View style={styles.buddyItem}>
            <Text style={styles.buddyText}>Van: {item.userId}</Text>
            <TouchableOpacity onPress={() => handleRespond(item.id, true)}>
              <Text style={styles.accept}>Accepteer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRespond(item.id, false)}>
              <Text style={styles.reject}>Weiger</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.subtitle}>Buddy toevoegen</Text>
      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-mail van buddy"
          value={search}
          onChangeText={setSearch}
        />
        <Button title={loading ? 'Even wachten...' : 'Verzoek'} onPress={handleAddBuddy} disabled={loading} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#DFF2E1' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#3E3E3E', marginBottom: 16 },
  subtitle: { fontSize: 20, fontWeight: 'bold', color: '#3E3E3E', marginTop: 24, marginBottom: 8 },
  buddyItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 8 },
  buddyText: { fontSize: 16, color: '#3E3E3E' },
  remove: { color: '#E57373', fontWeight: 'bold', marginLeft: 12 },
  accept: { color: '#9DC183', fontWeight: 'bold', marginLeft: 12 },
  reject: { color: '#E57373', fontWeight: 'bold', marginLeft: 12 },
  empty: { color: '#9DC183', textAlign: 'center', marginVertical: 8 },
  addContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 12, fontSize: 16, marginRight: 8, borderWidth: 1, borderColor: '#DFF2E1' },
});

export default BuddyScreen; 