import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import api from '../api/api';

interface ProgressEntry {
  id: string;
  mood: number;
  journalText: string;
  timestamp: string;
}

const ProgressScreen: React.FC = () => {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const res = await api.get('/progress/history');
      setEntries(res.data);
    } catch (err: any) {
      Alert.alert('Fout', 'Kon voortgang niet laden.');
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😞', '😕', '😐', '🙂', '😄'];
    return emojis[mood - 1] || '😐';
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderEntry = ({ item }: { item: ProgressEntry }) => (
    <View style={styles.entry}>
      <View style={styles.entryHeader}>
        <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
        <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
      </View>
      {item.journalText && (
        <Text style={styles.journalText}>{item.journalText}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Laden...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jouw Voortgang</Text>
      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nog geen entries</Text>
          <Text style={styles.emptySubtext}>Begin met het invullen van je stemming en dagboek!</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          renderItem={renderEntry}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
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
    marginBottom: 24,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#3E3E3E',
    marginTop: 50,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E3E3E',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#9DC183',
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  entry: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#9DC183',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodEmoji: {
    fontSize: 24,
  },
  date: {
    fontSize: 14,
    color: '#9DC183',
    fontWeight: '500',
  },
  journalText: {
    fontSize: 16,
    color: '#3E3E3E',
    lineHeight: 24,
  },
});

export default ProgressScreen; 