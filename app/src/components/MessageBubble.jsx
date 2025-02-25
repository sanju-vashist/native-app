import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ message, isCurrentUser }) {
  return (
    <View style={[styles.container, isCurrentUser ? styles.right : styles.left]}>
      <Text style={styles.name}>{message.sender_alias}</Text>
      <Text style={styles.message}>{message.content}</Text>
      <Text style={styles.time}>
        {new Date(message.created_at).toLocaleTimeString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 15,
    marginVertical: 5,
  },
  right: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  left: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
  },
  time: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
});