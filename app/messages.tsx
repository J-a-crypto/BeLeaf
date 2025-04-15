import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  FlatList,
  Image
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Message[];
}

const initialConversations: Conversation[] = [
  {
    id: '1',
    name: 'Ms. Johnson',
    role: 'Math Teacher',
    avatar: '👩‍🏫',
    lastMessage: 'How is Tommy progressing with his algebra homework?',
    timestamp: '10:30 AM',
    unreadCount: 2,
    messages: [
      {
        id: '1-1',
        text: 'Hello! I wanted to check in about Tommy\'s progress with the algebra homework from last week.',
        sender: 'other',
        timestamp: '10:25 AM',
        read: true
      },
      {
        id: '1-2',
        text: 'He seems to be struggling with the equation solving section.',
        sender: 'other',
        timestamp: '10:28 AM',
        read: true
      },
      {
        id: '1-3',
        text: 'How is Tommy progressing with his algebra homework?',
        sender: 'other',
        timestamp: '10:30 AM',
        read: false
      }
    ]
  },
  {
    id: '2',
    name: 'Mr. Smith',
    role: 'Science Teacher',
    avatar: '👨‍🔬',
    lastMessage: 'The science fair is coming up next month. Is Sarah planning to participate?',
    timestamp: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: '2-1',
        text: 'Hello! Just a reminder that the science fair is coming up next month.',
        sender: 'other',
        timestamp: 'Yesterday',
        read: true
      },
      {
        id: '2-2',
        text: 'The science fair is coming up next month. Is Sarah planning to participate?',
        sender: 'other',
        timestamp: 'Yesterday',
        read: true
      },
      {
        id: '2-3',
        text: 'Yes, she\'s working on a project about renewable energy!',
        sender: 'user',
        timestamp: 'Yesterday',
        read: true
      }
    ]
  },
  {
    id: '3',
    name: 'Mrs. Davis',
    role: 'Art Teacher',
    avatar: '👩‍🎨',
    lastMessage: 'Alex has shown great improvement in his drawing techniques.',
    timestamp: '2 days ago',
    unreadCount: 0,
    messages: [
      {
        id: '3-1',
        text: 'I wanted to let you know that Alex has been doing excellent work in art class lately.',
        sender: 'other',
        timestamp: '2 days ago',
        read: true
      },
      {
        id: '3-2',
        text: 'Alex has shown great improvement in his drawing techniques.',
        sender: 'other',
        timestamp: '2 days ago',
        read: true
      },
      {
        id: '3-3',
        text: 'That\'s wonderful to hear! He\'s been practicing at home too.',
        sender: 'user',
        timestamp: '2 days ago',
        read: true
      }
    ]
  },
  {
    id: '4',
    name: 'Principal Wilson',
    role: 'School Principal',
    avatar: '👨‍💼',
    lastMessage: 'Please remember to complete the parent survey by Friday.',
    timestamp: 'Oct 30',
    unreadCount: 1,
    messages: [
      {
        id: '4-1',
        text: 'Dear Parents, this is a reminder about our upcoming parent-teacher conference day.',
        sender: 'other',
        timestamp: 'Oct 29',
        read: true
      },
      {
        id: '4-2',
        text: 'Please remember to complete the parent survey by Friday.',
        sender: 'other',
        timestamp: 'Oct 30',
        read: false
      }
    ]
  },
  {
    id: '5',
    name: 'Coach Thompson',
    role: 'Physical Education',
    avatar: '🏃‍♂️',
    lastMessage: 'We need parent volunteers for the upcoming field day event.',
    timestamp: 'Oct 28',
    unreadCount: 0,
    messages: [
      {
        id: '5-1',
        text: 'We need parent volunteers for the upcoming field day event.',
        sender: 'other',
        timestamp: 'Oct 28',
        read: true
      },
      {
        id: '5-2',
        text: 'I\'d be happy to volunteer! What time should I arrive?',
        sender: 'user',
        timestamp: 'Oct 28',
        read: true
      },
      {
        id: '5-3',
        text: 'Great! Please arrive at 8:30 AM to help with setup.',
        sender: 'other',
        timestamp: 'Oct 28',
        read: true
      }
    ]
  }
];

const MessagesScreen = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const filteredConversations = conversations.filter(
    conversation => 
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationSelect = (conversation: Conversation) => {
    // Mark all messages as read when opening a conversation
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversation.id) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({ ...msg, read: true }))
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setActiveConversation(
      updatedConversations.find(conv => conv.id === conversation.id) || null
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMsg: Message = {
      id: `${activeConversation.id}-${activeConversation.messages.length + 1}`,
      text: newMessage.trim(),
      sender: 'user',
      timestamp: currentTime,
      read: true
    };
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation.id) {
        return {
          ...conv,
          lastMessage: newMessage.trim(),
          timestamp: currentTime,
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setActiveConversation(
      updatedConversations.find(conv => conv.id === activeConversation.id) || null
    );
    setNewMessage('');
    
    // Scroll to bottom after sending a message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleBackToList = () => {
    setActiveConversation(null);
  };

  // Scroll to bottom when opening a conversation
  useEffect(() => {
    if (activeConversation) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [activeConversation]);

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity 
      style={styles.conversationItem} 
      onPress={() => handleConversationSelect(item)}
    >
      <Text style={styles.avatar}>{item.avatar}</Text>
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.name}</Text>
          <Text style={styles.conversationTime}>{item.timestamp}</Text>
        </View>
        <Text style={styles.conversationRole}>{item.role}</Text>
        <Text 
          style={[
            styles.conversationLastMessage,
            item.unreadCount > 0 && styles.unreadMessage
          ]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: activeConversation ? activeConversation.name : "Messages",
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFCF9' },
          headerTintColor: '#5e17eb',
          headerLeft: () => (
            <TouchableOpacity
              onPress={activeConversation ? handleBackToList : () => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#5e17eb" />
            </TouchableOpacity>
          ),
          headerRight: activeConversation ? () => (
            <TouchableOpacity style={styles.headerButton}>
              <MaterialIcons name="more-vert" size={24} color="#5e17eb" />
            </TouchableOpacity>
          ) : undefined
        }}
      />
      
      {!activeConversation ? (
        // Conversations List View
        <>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#757575" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search messages..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#757575" />
              </TouchableOpacity>
            )}
          </View>
          
          <FlatList
            data={filteredConversations}
            renderItem={renderConversationItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.conversationsList}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialIcons name="chat-bubble-outline" size={60} color="#CCCCCC" />
                <Text style={styles.emptyStateText}>No conversations found</Text>
              </View>
            }
          />
          
          <TouchableOpacity style={styles.newMessageButton}>
            <MaterialIcons name="edit" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </>
      ) : (
        // Active Conversation View
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationRole}>{activeConversation.role}</Text>
          </View>
          
          <ScrollView 
            ref={scrollViewRef}
            contentContainerStyle={styles.messagesContainer}
          >
            {activeConversation.messages.map(message => (
              <View 
                key={message.id} 
                style={[
                  styles.messageItem, 
                  message.sender === 'user' ? styles.userMessage : styles.otherMessage
                ]}
              >
                <View 
                  style={[
                    styles.messageBubble, 
                    message.sender === 'user' ? styles.userBubble : styles.otherBubble
                  ]}
                >
                  <Text style={styles.messageText}>{message.text}</Text>
                </View>
                <Text style={styles.messageTime}>{message.timestamp}</Text>
                {message.sender === 'user' && (
                  <MaterialIcons
                    name={message.read ? "done-all" : "done"}
                    size={14}
                    color={message.read ? "#5e17eb" : "#757575"}
                    style={styles.readStatus}
                  />
                )}
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <MaterialIcons name="attach-file" size={24} color="#5e17eb" />
            </TouchableOpacity>
            
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            
            <TouchableOpacity 
              style={[
                styles.sendButton,
                !newMessage.trim() && styles.sendButtonDisabled
              ]}
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <MaterialIcons name="send" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFCF9',
  },
  backButton: {
    marginLeft: 10,
  },
  headerButton: {
    marginRight: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  conversationsList: {
    paddingBottom: 80, // Make room for the new message button
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    fontSize: 36,
    marginRight: 15,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  conversationTime: {
    fontSize: 12,
    color: '#757575',
  },
  conversationRole: {
    fontSize: 13,
    color: '#5e17eb',
    fontWeight: '500',
    marginBottom: 4,
  },
  conversationLastMessage: {
    fontSize: 14,
    color: '#757575',
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#333333',
  },
  unreadBadge: {
    backgroundColor: '#5e17eb',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 10,
    textAlign: 'center',
  },
  newMessageButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#5e17eb',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  conversationHeader: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  messageItem: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#5e17eb',
    borderBottomRightRadius: 5,
  },
  otherBubble: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#333333',
  },
  messageTime: {
    fontSize: 12,
    color: '#757575',
    alignSelf: 'flex-end',
    marginTop: 4,
    marginRight: 5,
  },
  readStatus: {
    alignSelf: 'flex-end',
    marginRight: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  attachButton: {
    marginRight: 10,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#5e17eb',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#C0C0C0',
  },
});

export default MessagesScreen; 