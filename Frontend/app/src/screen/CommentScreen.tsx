import React, { useState, useEffect } from "react";
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
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import {
  get_current_user,
  createComment,
  getCommentsByCampaignId,
  addReplyToComment,
} from "../utils/apiUtils";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import CONFIG from "./config";
import { Navigation } from "lucide-react-native";
const API_BASE_URL = CONFIG.API_BASE_URL;

interface Comment {
  id: number;
  campaignId: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  timestamp: string;
  likes: number;
  parentCommentId?: number | null;
  replies: Comment[];
}

export default function CommentScreen({ route }) {
  const navigation = useNavigation();
  const { fundId } = route.params;
  // console.log("campaignId", fundId);
  const [campaignId] = useState(fundId);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isReplying, setIsReplying] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight] = useState(new Animated.Value(0));
  const [inputHeight] = useState(new Animated.Value(60));
  const [visibleReplies, setVisibleReplies] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const user = await get_current_user();
        const fetchedComments = await getCommentsByCampaignId(campaignId);
        
        setCurrentUser(user);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Failed to fetch data", error);
        Alert.alert("Error", "Failed to load comments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
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
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
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
  }, [campaignId]);

  const handleAddComment = async () => {
    if (!currentUser || commentText.trim() === "") return;

    try {
      const newCommentData = {
        campaignId: campaignId,
        userId: currentUser.id,
        userName: currentUser.name || "Anonymous",
        userAvatar: currentUser.picture || "https://via.placeholder.com/40",
        content: commentText,
        createdAt: new Date().toISOString(),
        parentCommentId: null,
        likes: 0,
        replies: [],
      };

      const newComment = await createComment(newCommentData);

      setComments((prevComments) => [newComment, ...prevComments]);
      setCommentText("");
      Keyboard.dismiss();
    } catch (error) {
      console.error("Failed to add comment", error);
      Alert.alert("Error", "Failed to post comment. Please try again.");
    }
  };

  const handleAddReply = async () => {
    if (!currentUser || replyText.trim() === "" || isReplying === null) return;

    try {
      const newReplyData = {
        campaignId: campaignId,
        userId: currentUser.id,
        userName: currentUser.name || "Anonymous",
        userAvatar: currentUser.picture || "https://via.placeholder.com/40",
        content: replyText,
        createdAt: new Date().toISOString(),
        parentCommentId: isReplying,
        likes: 0,
        replies: [],
      };

      const newReply = await addReplyToComment(isReplying, newReplyData);

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === isReplying
            ? {
                ...comment,
                replies: [newReply, ...(comment.replies || [])],
              }
            : comment
        )
      );

      setReplyText("");
      setIsReplying(null);
      Keyboard.dismiss();
    } catch (error) {
      console.error("Failed to add reply", error);
      Alert.alert("Error", "Failed to post reply. Please try again.");
    }
  };

  const handleReply = (commentId: number) => {
    setIsReplying(commentId);
    setKeyboardVisible(true);
  };

  const handleCancelReply = () => {
    setIsReplying(null);
    setReplyText("");
    Keyboard.dismiss();
  };

  const toggleRepliesVisibility = (commentId: number) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

//   const handleGotoProfile = (userId) => {
//     navigation.navigate("ProfileScreen2", { userId} });
//   };

  const renderComment = ({
    item,
    depth = 0,
  }: {
    item: Comment;
    depth?: number;
  }) => (
    <View style={[styles.commentContainer, { marginLeft: depth * 16 }]}>
      <TouchableOpacity on onPress={() => 
        navigation.navigate("ProfileScreen2", { userId: item.userId })
      }>
        <Image 
          source={{ uri: `${API_BASE_URL}/user/${item.userAvatar}` || "https://via.placeholder.com/40" }} 
          style={styles.avatar} 
        />
      </TouchableOpacity>
    
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
        {item.replies && item.replies.length > 0 && (
          <TouchableOpacity onPress={() => toggleRepliesVisibility(item.id)}>
            <Text style={styles.viewRepliesText}>
              {visibleReplies[item.id]
                ? "Hide replies"
                : `View ${item.replies.length} replies`}
            </Text>
          </TouchableOpacity>
        )}
        {visibleReplies[item.id] &&
          item.replies.map((reply) =>
            renderComment({ item: reply, depth: depth + 1 })
          )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Campaign Comments</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id.toString()}
          style={styles.commentsList}
          contentContainerStyle={styles.commentsListContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No comments yet</Text>
            </View>
          }
        />
      )}

      <Animated.View
        style={[
          styles.inputContainer,
          {
            paddingBottom: keyboardHeight.interpolate({
              inputRange: [0, 300],
              outputRange: [0, Platform.OS === "ios" ? 0 : 0],
              extrapolate: "clamp",
            }),
          },
        ]}
      >
        {isReplying ? (
          <View style={styles.replyContainer}>
            <View style={styles.replyHeader}>
              <Text style={styles.replyingTo}>
                Replying to{" "}
                {comments.find((c) => c.id === isReplying)?.userName}
              </Text>
              <TouchableOpacity onPress={handleCancelReply}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <TouchableOpacity>
              <Image
                source={{ 
                  uri: `${API_BASE_URL}/user/${currentUser?.avatarUrl}` || "https://via.placeholder.com/40" 
                }}
                style={styles.avatar}
              />
              </TouchableOpacity>

              
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
                      <Ionicons
                        name="happy-outline"
                        size={24}
                        color="#8E8E8E"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.inputButton}>
                      <Ionicons
                        name="image-outline"
                        size={24}
                        color="#8E8E8E"
                      />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.sendButton,
                      !replyText.trim() && styles.sendButtonDisabled,
                    ]}
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
          <View style={styles.inputWrapper}>
            <Image
              source={{ 
                uri: currentUser?.avatarUrl || "https://via.placeholder.com/40" 
              }}
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
                  style={[
                    styles.sendButton,
                    !commentText.trim() && styles.sendButtonDisabled,
                  ]}
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
    backgroundColor: "#F9F9F9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#2196F3",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentsList: {
    flex: 1,
  },
  commentsListContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  commentContainer: {
    flexDirection: "row",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#D1D1D1",
  },
  userName: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  commentText: {
    color: "#333",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    paddingLeft: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginRight: 12,
  },
  actionButton: {
    fontSize: 12,
    color: "#2196F3",
    marginHorizontal: 8,
  },
  likeCount: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeText: {
    fontSize: 12,
    color: "#2196F3",
    marginLeft: 4,
  },
  viewRepliesText: {
    fontSize: 12,
    color: "#2196F3",
    marginTop: 4,
    paddingLeft: 8,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#D1D1D1",
    backgroundColor: "#FFFFFF",
  },
  replyContainer: {
    padding: 12,
  },
  replyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  replyingTo: {
    fontSize: 12,
    color: "#888",
  },
  cancelButton: {
    fontSize: 12,
    color: "#2196F3",
  },
  inputWrapper: {
    flexDirection: "row",
    padding: 12,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: "#D1D1D1",
  },
  input: {
    color: "#333",
    fontSize: 14,
    maxHeight: 100,
    padding: 4,
  },
  inputActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  inputButtons: {
    flexDirection: "row",
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