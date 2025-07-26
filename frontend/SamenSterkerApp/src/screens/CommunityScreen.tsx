import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput, Button } from 'react-native';
import api from '../api/api';
import CommentsList from '../components/CommentsList';
import CommentInput from '../components/CommentInput';

interface CommunityPost {
  id: string;
  anonymousName: string;
  mood: number;
  message: string;
  likes: number;
  timestamp: string;
  isLiked: boolean;
}

const CommunityScreen: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [shareMood, setShareMood] = useState<number | null>(null);
  const [openComments, setOpenComments] = useState<{ [postId: string]: boolean }>({});

  useEffect(() => {
    loadCommunityPosts();
  }, []);

  const loadCommunityPosts = async () => {
    try {
      const res = await api.get('/community/posts');
      setPosts(res.data);
    } catch (err: any) {
      Alert.alert('Fout', 'Kon community posts niet laden.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await api.post(`/community/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post
      ));
    } catch (err: any) {
      Alert.alert('Fout', 'Kon post niet liken.');
    }
  };

  const handleShare = async () => {
    if (!shareMood || !shareMessage.trim()) {
      Alert.alert('Vul alles in', 'Kies een stemming en schrijf een bericht.');
      return;
    }
    try {
      await api.post('/community/posts', { mood: shareMood, message: shareMessage });
      setShowShareModal(false);
      setShareMessage('');
      setShareMood(null);
      loadCommunityPosts(); // Herlaad posts
      Alert.alert('Gedeeld!', 'Je bericht is anoniem gedeeld met de community.');
    } catch (err: any) {
      Alert.alert('Fout', 'Kon bericht niet delen.');
    }
  };

  const toggleComments = (postId: string) => {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
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

  const renderPost = ({ item }: { item: CommunityPost }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Text style={styles.anonymousName}>{item.anonymousName}</Text>
        <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
      </View>
      <Text style={styles.message}>{item.message}</Text>
      <View style={styles.postFooter}>
        <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.likeButton}>
          <Text style={[styles.likeIcon, item.isLiked && styles.likedIcon]}>
            {item.isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.likeCount}>{item.likes}</Text>
        </TouchableOpacity>
        <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleComments(item.id)} style={{ marginTop: 8 }}>
        <Text style={{ color: '#9DC183', fontWeight: 'bold' }}>
          {openComments[item.id] ? 'Verberg reacties' : 'Toon reacties'}
        </Text>
      </TouchableOpacity>
      {openComments[item.id] && (
        <View style={{ marginTop: 8 }}>
          <CommentsList postId={item.id} />
          <CommentInput postId={item.id} onCommentAdded={() => {}} />
        </View>
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
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <TouchableOpacity onPress={() => setShowShareModal(true)} style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Delen</Text>
        </TouchableOpacity>
      </View>
      
      {posts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nog geen berichten</Text>
          <Text style={styles.emptySubtext}>Wees de eerste om iets te delen!</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}

      <Modal visible={showShareModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Deel met community</Text>
            <Text style={styles.modalSubtitle}>Je bericht wordt anoniem gedeeld</Text>
            
            <View style={styles.moodSelector}>
              {[1, 2, 3, 4, 5].map(mood => (
                <TouchableOpacity
                  key={mood}
                  onPress={() => setShareMood(mood)}
                  style={[styles.moodButton, shareMood === mood && styles.selectedMood]}
                >
                  <Text style={styles.moodButtonEmoji}>{getMoodEmoji(mood)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.shareInput}
              placeholder="Schrijf je bericht..."
              value={shareMessage}
              onChangeText={setShareMessage}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <Button title="Annuleren" color="#9DC183" onPress={() => setShowShareModal(false)} />
              <Button title="Delen" color="#9DC183" onPress={handleShare} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF2E1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3E3E3E',
  },
  shareButton: {
    backgroundColor: '#9DC183',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
    padding: 24,
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
    padding: 24,
    paddingTop: 0,
  },
  post: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#9DC183',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  anonymousName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9DC183',
  },
  moodEmoji: {
    fontSize: 24,
  },
  message: {
    fontSize: 16,
    color: '#3E3E3E',
    lineHeight: 24,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  likedIcon: {
    fontSize: 20,
  },
  likeCount: {
    fontSize: 14,
    color: '#3E3E3E',
  },
  timestamp: {
    fontSize: 12,
    color: '#9DC183',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E3E3E',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#9DC183',
    textAlign: 'center',
    marginBottom: 20,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  moodButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  selectedMood: {
    backgroundColor: '#9DC183',
  },
  moodButtonEmoji: {
    fontSize: 24,
  },
  shareInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#3E3E3E',
    borderWidth: 1,
    borderColor: '#DFF2E1',
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default CommunityScreen; 