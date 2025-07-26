import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { addComment } from '../api/api';

interface CommentInputProps {
  postId: string;
  onCommentAdded: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ postId, onCommentAdded }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await addComment(postId, message);
      setMessage('');
      onCommentAdded();
    } catch (err) {
      setError('Kon reactie niet plaatsen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Schrijf een reactie..."
        value={message}
        onChangeText={setMessage}
        editable={!loading}
      />
      <Button title="Verzenden" color="#9DC183" onPress={handleSend} disabled={loading || !message.trim()} />
      {loading && <ActivityIndicator style={{ marginTop: 4 }} color="#9DC183" />}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 8,
    backgroundColor: '#F2F8F2',
    borderRadius: 8,
    margin: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#9DC183',
    marginBottom: 6,
    fontSize: 15,
  },
  error: {
    color: 'red',
    marginTop: 4,
    fontSize: 13,
  },
});

export default CommentInput; 