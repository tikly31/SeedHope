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
  Keyboard,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Comment {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
}

export default function CommentScreen({ navigation }) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      userId: 1,
      userName: "Fred Quattrone",
      userAvatar: "https://via.placeholder.com/40",
      content: "This is an excellent survival RPG! I put in many hours and really enjoy jumping into it.",
      timestamp: "3w",
      likes: 2,
      replies: []
    },
    {
      id: 2,
      userId: 2,
      userName: "Alan Williams",
      userAvatar: "https://via.placeholder.com/40",
      content: "If you're into exploring and building and some fairly gentle (on default settings) combat/missions/dungeons then this is the game for you. I love it, but mostly because I love the exploring side of things.",
      timestamp: "2w",
      likes: 1,
      replies: []
    }
  ]);

  const [isReplying, setIsReplying] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [commentText, setCommentText] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight] = useState(new Animated.Value(0));
  const [inputHeight] = useState(new Animated.Value(60));
  const [visibleReplies, setVisibleReplies] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => {
        setKeyboardVisible(true);
        Animated.parallel([
          Animated.timing(keyboardHeight, {
            toValue: e.endCoordinates.height,
            duration: 250,
            useNativeDriver: false,
          }),
          Animated.timing(inputHeight, {
            toValue: 120,
            duration: 250,
            useNativeDriver: false,
          }),
        ]).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        Animated.parallel([
          Animated.timing(keyboardHeight, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
          }),
          Animated.timing(inputHeight, {
            toValue: 60,
            duration: 250,
            useNativeDriver: false,
          }),
        ]).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleReply = (commentId: number) => {
    setIsReplying(commentId);
    setKeyboardVisible(true);
  };

  const handleCancelReply = () => {
    setIsReplying(null);
    setReplyText('');
    Keyboard.dismiss();
  };

  const handleAddComment = () => {
    if (commentText.trim() === '') return;

    const newComment: Comment = {
      id: Date.now(),
      userId: 999, // Assuming a placeholder user ID
      userName: "Current User",
      userAvatar: "https://via.placeholder.com/40",
      content: commentText,
      timestamp: "Just now",
      likes: 0,
      replies: [],
    };

    setComments(prevComments => [newComment, ...prevComments]);
    setCommentText('');
    Keyboard.dismiss();
  };

  const handleAddReply = () => {
    if (replyText.trim() === '' || isReplying === null) return;

    const newReply: Comment = {
      id: Date.now(),
      userId: 999, // Assuming a placeholder user ID
      userName: "Current User",
      userAvatar: "https://via.placeholder.com/40",
      content: replyText,
      timestamp: "Just now",
      likes: 0,
      replies: [],
    };

    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === isReplying
          ? { ...comment, replies: [newReply, ...comment.replies] }
          : comment
      )
    );

    setReplyText('');
    setIsReplying(null);
    Keyboard.dismiss();
  };

  const toggleRepliesVisibility = (commentId: number) => {
    setVisibleReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const renderComment = ({ item, depth = 0 }: { item: Comment; depth?: number }) => (
    <View style={[styles.commentContainer, { marginLeft: depth * 16 }]}>
      <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentBubble}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.commentText}>{item.content}</Text>
        </View>
        <View style={styles.actionContainer}>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
          <TouchableOpacity>
            <Text style={styles.actionButton}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleReply(item.id)}>
            <Text style={styles.actionButton}>Reply</Text>
          </TouchableOpacity>
          {item.likes > 0 && (
            <View style={styles.likeCount}>
              <Text style={styles.likeText}>👍 {item.likes}</Text>
            </View>
          )}
        </View>
        {item.replies.length > 0 && (
          <TouchableOpacity onPress={() => toggleRepliesVisibility(item.id)}>
            <Text style={styles.viewRepliesText}>
              {visibleReplies[item.id] ? 'Hide replies' : `View ${item.replies.length} replies`}
            </Text>
          </TouchableOpacity>
        )}
        {visibleReplies[item.id] && item.replies.map(reply => renderComment({ item: reply, depth: depth + 1 }))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enshrouded Game's post</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={item => item.id.toString()}
        style={styles.commentsList}
        contentContainerStyle={styles.commentsListContent}
      />

      <Animated.View
        style={[
          styles.inputContainer,
          {
            paddingBottom: keyboardHeight.interpolate({
              inputRange: [0, 300],
              outputRange: [0, Platform.OS === 'ios' ? 0 : 0],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        {isReplying ? (
          // Reply Input
          <View style={styles.replyContainer}>
            <View style={styles.replyHeader}>
              <Text style={styles.replyingTo}>
                Replying to {comments.find(c => c.id === isReplying)?.userName}
              </Text>
              <TouchableOpacity onPress={handleCancelReply}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <Image
                source={{ uri: "https://via.placeholder.com/40" }}
                style={styles.avatar}
              />
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Write a reply..."
                  placeholderTextColor="#8E8E8E"
                  value={replyText}
                  onChangeText={setReplyText}
                  multiline
                />
                <View style={styles.inputActions}>
                  <View style={styles.inputButtons}>
                    <TouchableOpacity style={styles.inputButton}>
                      <Ionicons name="happy-outline" size={24} color="#8E8E8E" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.inputButton}>
                      <Ionicons name="image-outline" size={24} color="#8E8E8E" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={[styles.sendButton, !replyText.trim() && styles.sendButtonDisabled]}
                    disabled={!replyText.trim()}
                    onPress={handleAddReply}
                  >
                    <Ionicons 
                      name="send" 
                      size={24} 
                      color={replyText.trim() ? "#2196F3" : "#8E8E8E"} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ) : (
          // Main Comment Input
          <View style={styles.inputWrapper}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.avatar}
            />
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Write a comment..."
                placeholderTextColor="#8E8E8E"
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <View style={styles.inputActions}>
                <View style={styles.inputButtons}>
                  <TouchableOpacity style={styles.inputButton}>
                    <Ionicons name="happy-outline" size={24} color="#8E8E8E" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inputButton}>
                    <Ionicons name="image-outline" size={24} color="#8E8E8E" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inputButton}>
                    <Ionicons name="gift-outline" size={24} color="#8E8E8E" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
                  disabled={!commentText.trim()}
                  onPress={handleAddComment}
                >
                  <Ionicons 
                    name="send" 
                    size={24} 
                    color={commentText.trim() ? "#2196F3" : "#8E8E8E"} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9', // Light background color
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1', // Light border
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Dark text color
  },
  commentsList: {
    flex: 1,
  },
  commentsListContent: {
    paddingBottom: 16,
  },
  commentContainer: {
    flexDirection: 'row',
    padding: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: '#FFFFFF', // White background for comments
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#D1D1D1', // Light border for bubbles
  },
  userName: {
    fontWeight: 'bold',
    color: '#333', // Dark text for the username
    marginBottom: 4,
  },
  commentText: {
    color: '#333', // Dark text color for comment content
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingLeft: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#888', // Light gray for timestamps
    marginRight: 12,
  },
  actionButton: {
    fontSize: 12,
    color: '#2196F3', // Blue color for buttons
    marginHorizontal: 8,
  },
  likeCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    fontSize: 12,
    color: '#2196F3', // Blue like text
    marginLeft: 4,
  },
  viewRepliesText: {
    fontSize: 12,
    color: '#2196F3', // Blue for the view replies button
    marginTop: 4,
    paddingLeft: 8,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#D1D1D1', // Light border for the input section
    backgroundColor: '#FFFFFF', // White background for input area
  },
  replyContainer: {
    padding: 12,
  },
  replyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  replyingTo: {
    fontSize: 12,
    color: '#888', // Light gray for "replying to"
  },
  cancelButton: {
    fontSize: 12,
    color: '#2196F3', // Blue cancel button text
  },
  inputWrapper: {
    flexDirection: 'row',
    padding: 12,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: '#F1F1F1', // Light background for text input
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#D1D1D1', // Light border for text input
  },
  input: {
    color: '#333', // Dark text color for input
    fontSize: 14,
    maxHeight: 100,
    padding: 4,
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
    padding: 8,
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

