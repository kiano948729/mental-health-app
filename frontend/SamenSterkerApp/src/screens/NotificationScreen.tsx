import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../api/api';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

const NotificationScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notification');
      setNotifications(res.data);
    } catch (err) {
      Alert.alert('Fout', 'Kon notificaties niet ophalen');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.post(`/notification/read/${id}`);
      fetchNotifications();
    } catch (err) {
      Alert.alert('Fout', 'Kon notificatie niet bijwerken');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaties</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        refreshing={loading}
        onRefresh={fetchNotifications}
        ListEmptyComponent={<Text style={styles.empty}>Geen notificaties</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, item.isRead && styles.read]}
            onPress={() => markAsRead(item.id)}
          >
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemBody}>{item.body}</Text>
            <Text style={styles.itemDate}>{new Date(item.createdAt).toLocaleString()}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#DFF2E1' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#3E3E3E', marginBottom: 16 },
  item: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12 },
  read: { opacity: 0.5 },
  itemTitle: { fontSize: 18, fontWeight: 'bold', color: '#3E3E3E' },
  itemBody: { fontSize: 16, color: '#3E3E3E', marginTop: 4 },
  itemDate: { fontSize: 12, color: '#9DC183', marginTop: 8 },
  empty: { color: '#9DC183', textAlign: 'center', marginVertical: 8 },
});

export default NotificationScreen; 