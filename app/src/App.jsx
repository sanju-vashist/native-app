import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NamePromptModal from './components/NamePromptModal';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import VerificationScreen from './screens/VerificationScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import AdminDashboard from './screens/AdminDashboard';

const Stack = createStackNavigator();

export default function App() {
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkName = async () => {
      const name = await AsyncStorage.getItem('userAlias');
      if (!name) setShowNamePrompt(true);
      setLoading(false);
    };
    checkName();
  }, []);

  if (loading) return null; // Prevent rendering before AsyncStorage check

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      </Stack.Navigator>

      {showNamePrompt && (
        <NamePromptModal
          visible={showNamePrompt}
          onSave={async (name) => {
            await AsyncStorage.setItem('userAlias', name);
            setShowNamePrompt(false);
          }}
        />
      )}
    </NavigationContainer>
  );
}
