import React, { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import MoodSelector from '../components/MoodSelector';
import JournalEntry from '../components/JournalEntry';
import AiAdvice from '../components/AiAdvice';
import api from '../api/api';

const HomeScreen: React.FC = () => {
  const [mood, setMood] = useState<number | null>(null);
  const [journal, setJournal] = useState('');
  const [advice, setAdvice] = useState('');

  // Progress opslaan via backend
  const handleSave = async (text: string) => {
    if (!mood) {
      Alert.alert('Kies een humeur', 'Selecteer eerst je stemming.');
      return;
    }
    try {
      await api.post('/progress/save', { mood, journalText: text });
      setJournal(text);
      Alert.alert('Opgeslagen', 'Je dagboeknotitie is opgeslagen!');
    } catch (err: any) {
      Alert.alert('Fout', err?.response?.data || 'Kon niet opslaan.');
    }
  };

  // AI-advies ophalen via backend
  const handleGetAdvice = async () => {
    if (!mood || !journal) {
      Alert.alert('Vul alles in', 'Kies een humeur en schrijf een notitie.');
      return;
    }
    try {
      const res = await api.post('/ai/advise', { mood, userText: journal });
      setAdvice(res.data.advice);
    } catch (err: any) {
      Alert.alert('Fout', err?.response?.data || 'AI-advies ophalen mislukt.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3E3E3E', marginBottom: 16 }}>Welkom terug, Anna 🌿</Text>
        <Text style={{ fontSize: 18, color: '#3E3E3E', marginBottom: 8 }}>Hoe voel je je vandaag?</Text>
        <MoodSelector onSelect={setMood} />
        <JournalEntry onSubmit={handleSave} />
        <Text style={{ fontSize: 16, color: '#3E3E3E', marginBottom: 8 }}>Wat zegt je coach?</Text>
        <View style={{ width: '100%' }}>
          <AiAdvice advice={advice} />
        </View>
        <View style={{ marginBottom: 32 }}>
          <Text onPress={handleGetAdvice} style={{ color: '#9DC183', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginTop: 8 }}>
            Vraag advies aan AI
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen; 