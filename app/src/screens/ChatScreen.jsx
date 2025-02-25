import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { supabase } from '../services/supabase';
import { Icon } from '@rneui/themed';
import MessageBubble from '../components/MessageBubble';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bannedWords } from '../services/bannedWords';

export default function ChatScreen({ route }) {
  const { roomCode } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState('');

  // Fetch messages and set up real-time subscription
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('anonymousId');
      if (!id) {
        const newId = Math.random().toString(36).substr(2, 9);
        await AsyncStorage.setItem('anonymousId', newId);
        setUserId(newId);
      } else {
        setUserId(id);
      }
    };

    fetchUserId();

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_code', roomCode)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
      } else {
        setMessages(data || []);
      }
    };

    loadMessages();

    const subscription = supabase
      .from(`messages:room_code=eq.${roomCode}`)
      .on('INSERT', (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomCode]);

  // Send message handler
  const sendMessage = async () => {
    const messageText = newMessage.trim();
    if (!messageText) return;

    // Check for banned words
    const hasBannedWord = bannedWords.some((word) =>
      new RegExp(`\\b${word}\\b`, 'i').test(messageText)
    );
    if (hasBannedWord) {
      Alert.alert('Error', 'Message contains inappropriate content');
      return;
    }

    try {
      const alias = await AsyncStorage.getItem('userAlias');
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            room_code: roomCode,
            content: messageText,
            sender_id: userId,
            sender_alias: alias,
          },
        ]);

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isCurrentUser={item.sender_id === userId}
          />
        )}
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity onPress={sendMessage}>
          <Icon name="send" type="material" color="#3498db" size={28} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  messagesContainer: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#bdc3c7',
  },
  input: {
    flex: 1,
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
});