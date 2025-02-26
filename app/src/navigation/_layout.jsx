import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { HapticPressable } from '../components/HapticTab';
import { useThemeColor } from '../hooks/useThemeColor';
import { IconSymbol } from '../components/IconSymbols';

export default function TabLayout() {
  const colorScheme = useColorScheme(); 

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopWidth: 0,
          elevation: 5,
          shadowOpacity: 0.1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rooms"
        options={{
          title: 'Rooms',
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
