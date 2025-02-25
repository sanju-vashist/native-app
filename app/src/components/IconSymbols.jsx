import { Ionicons } from '@expo/vector-icons';

export const IconSymbol = ({ name, color, size }) => (
  <Ionicons name={name} size={size} color={color} />
);

import React from 'react';
import { View, Text } from 'react-native';

export function IconSymbol() {
  return (
    <View>
      <Text>IconSymbol Component</Text>
    </View>
  );
}