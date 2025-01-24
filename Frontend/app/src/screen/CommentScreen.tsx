import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
interface CommentScreenProps {
  route: {
    params: {
      fundId: number;
    };
  };
}

interface Comment {
  id: number;
  userId: number;
  userName: string;
  userProfilePic: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: Comment[];
}


export default function CommentScreen({ route }: CommentScreenProps) {
  const { fundId } = route.params;
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      userId: 1,
      userName: "Fred Quattrone",
      userProfilePic: "https://via.placeholder.com/40",
      content: "This is an excellent survival RPG! I put in many hours and really enjoy jumping into it.",
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 2,
      replies: [
        {
          id: 2,
          userId: 2,
          userName: "Cindy Blay",
          userProfilePic: "https://via.placeholder.com/40",
          content: "hello dear i have a question for you can you text me private and lets talk about it i cant say it here in public",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          likes: 0,
          replies: [],
        },
      ],
    },
    {
      id: 3,
      userId: 3,
      userName: "Alan Williams",
      userProfilePic: "https://via.placeholder.com/40",
      content: "If you're into exploring and building and some fairly gentle (on default settings) combat/missions/dungeons then this is the game for you. I love it, but mostly because I love the exploring side of things.",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 1,
      replies: [],
    },
    {
      id: 4,
      userId: 4,
      userName: "Gio Warblood",
      userProfilePic: "https://via.placeholder.com/40",
      content: "EPIC game especially if you love building!",
      createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 9,
      replies: [],
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [visibleReplies, setVisibleReplies] = useState<{ [key: number]: boolean }>({});
  const flatListRef = useRef<FlatList>(null);

  const scrollToComment = (commentId: number) => {
    const index = comments.findIndex(comment => comment.id === commentId);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5
      });
    }
  };

  const handlePostComment = () => {
    if (newComment.trim() === '') return;

    const newCommentData: Comment = {
      id: Date.now(),
      userId: 999,
      userName: "Current User",
      userProfilePic: "https://via.placeholder.com/40",
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
    };

    if (replyingTo) {
      setComments(comments.map(comment => {
        if (comment.id === replyingTo) {
          return {
            ...comment,
            replies: [...comment.replies, newCommentData],
          };
        }
        return comment;
      }));
      setReplyingTo(null);
    } else {
      setComments([...comments, newCommentData]);
    }

    setNewComment('');
  };

  const renderComment = ({ item, depth = 0 }: { item: Comment; depth?: number }) => (
    <View style={[styles.commentContainer, { marginLeft: depth * 16 }]}>
      <Image source={{ uri: item.userProfilePic }} style={styles.profilePic} />
      <View style={styles.commentContent}>
        <View style={styles.commentBubble}>
          <View style={styles.commentHeader}>
            <Text style={styles.userName}>{item.userName}</Text>
            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="ellipsis-horizontal" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.commentText}>{item.content}</Text>
        </View>
        
        <View style={styles.commentActions}>
          <Text style={styles.timeAgo}>{formatTimeAgo(item.createdAt)}</Text>
          <TouchableOpacity>
            <Text style={styles.actionButton}>Like{item.likes > 0 ? ` · ${item.likes}` : ''}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              setReplyingTo(item.id);
              setTimeout(() => scrollToComment(item.id), 100);
            }}
          >
            <Text style={styles.actionButton}>Reply</Text>
          </TouchableOpacity>
        </View>

        {item.replies.length > 0 && (
          <TouchableOpacity
            style={styles.viewRepliesButton}
            onPress={() => setVisibleReplies(prev => ({
              ...prev,
              [item.id]: !prev[item.id]
            }))}
          >
            <Text style={styles.viewRepliesText}>
              {visibleReplies[item.id] ? 'Hide replies' : `View ${item.replies.length} ${item.replies.length === 1 ? 'reply' : 'replies'}`}
            </Text>
          </TouchableOpacity>
        )}

        {visibleReplies[item.id] && item.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {item.replies.map(reply => renderComment({ item: reply, depth: depth + 1 }))}
          </View>
        )}

        {replyingTo === item.id && (
          <View style={styles.replyInputContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.replyProfilePic}
            />
            <View style={styles.replyInputWrapper}>
              <TextInput
                style={styles.replyInput}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Write a reply..."
                multiline
              />
              <View style={styles.replyActions}>
                <TouchableOpacity onPress={() => setReplyingTo(null)}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.replyButton,
                    !newComment.trim() && styles.replyButtonDisabled,
                  ]}
                  onPress={handlePostComment}
                  disabled={!newComment.trim()}
                >
                  <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      enabled
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enshrouded Game's post</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={comments}
        renderItem={renderComment}
        keyExtractor={item => item.id.toString()}
        style={styles.commentsList}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({
                index: info.index,
                animated: true,
                viewPosition: 0.5
              });
            }
          });
        }}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
      />

      <View style={styles.inputContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/40" }}
          style={styles.inputProfilePic}
        />
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Write a comment..."
            multiline
          />
          <View style={styles.inputActions}>
            <View style={styles.inputButtons}>
              <TouchableOpacity style={styles.inputButton}>
                <Ionicons name="happy-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputButton}>
                <Ionicons name="image-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputButton}>
                <Ionicons name="gift-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                styles.sendButton,
                !newComment.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handlePostComment}
              disabled={!newComment.trim()}
            >
              <Ionicons name="send" size={24} color={newComment.trim() ? "#2196F3" : "#666"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentsList: {
    paddingBottom: 600,
    flex: 1,
  },
  commentContainer: {
    flexDirection: 'row',
    padding: 12,
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: '#f0f2f5',
    borderRadius: 12,
    padding: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  moreButton: {
    padding: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 8,
  },
  timeAgo: {
    fontSize: 12,
    color: '#666',
    marginRight: 12,
  },
  actionButton: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginHorizontal: 8,
  },
  viewRepliesButton: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
  viewRepliesText: {
    color: '#2196F3',
    fontSize: 13,
    fontWeight: '500',
  },
  repliesContainer: {
    marginTop: 8,
  },
  replyInputContainer: {
    flexDirection: 'row',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  replyProfilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  replyInputWrapper: {
    flex: 1,
  },
  replyInput: {
    backgroundColor: '#f0f2f5',
    borderRadius: 16,
    padding: 8,
    fontSize: 14,
    maxHeight: 100,
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButton: {
    color: '#666',
    fontSize: 14,
    marginRight: 12,
  },
  replyButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  replyButtonDisabled: {
    backgroundColor: '#ccc',
  },
  replyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputProfilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    padding: 12,
    fontSize: 14,
    maxHeight: 100,
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  inputButtons: {
    flexDirection: 'row',
  },
  inputButton: {
    padding: 4,
    marginRight: 8,
  },
  sendButton: {
    padding: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

function formatTimeAgo(createdAt: string): string {
  const timeAgo = new Date(createdAt);
  const now = new Date();
  const diffInMs = now.getTime() - timeAgo.getTime();
  
  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}