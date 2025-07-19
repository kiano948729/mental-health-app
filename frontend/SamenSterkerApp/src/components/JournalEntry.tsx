import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

interface JournalEntryProps {
  onSubmit: (text: string) => void;
}

const JournalEntry: React.FC<JournalEntryProps> = ({ onSubmit }) => {
  const [text, setText] = useState('');
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Wil je iets delen?"
        placeholderTextColor="#9DC183"
        value={text}
        onChangeText={setText}
        multiline
      />
      <Button
        title="Opslaan"
        color="#9DC183"
        onPress={() => {
          if (text.trim()) {
            onSubmit(text);
            setText('');
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    minHeight: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    fontSize: 16,
    color: '#3E3E3E',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DFF2E1',
  },
});

export default JournalEntry; 