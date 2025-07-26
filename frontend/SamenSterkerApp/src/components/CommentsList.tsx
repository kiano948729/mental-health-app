import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { getComments } from '../api/api';

interface Comment {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
}

interface CommentsListProps {
  postId: string;
  onRefresh?: () => void;
}

const CommentsList: React.FC<CommentsListProps> = ({ postId, onRefresh }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getComments(postId);
      setComments(res.data);
    } catch (err) {
      setError('Kon reacties niet laden.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const onPullRefresh = async () => {
    setRefreshing(true);
    await loadComments();
    if (onRefresh) onRefresh();
  };

  if (loading) return <ActivityIndicator style={{ margin: 16 }} color="#9DC183" />;
  if (error) return <Text style={{ color: 'red', margin: 16 }}>{error}</Text>;
  if (comments.length === 0) return <Text style={{ margin: 16, color: '#3E3E3E' }}>Nog geen reacties</Text>;

  return (
    <FlatList
      data={comments}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.comment}>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString('nl-NL')}</Text>
        </View>
      )}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onPullRefresh} />}
      contentContainerStyle={{ paddingBottom: 8 }}
    />
  );
};

const styles = StyleSheet.create({
  comment: {
    backgroundColor: '#F2F8F2',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  message: {
    color: '#3E3E3E',
    fontSize: 15,
  },
  timestamp: {
    color: '#9DC183',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'right',
  },
});

export default CommentsList; 