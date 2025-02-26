import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticPressable(props) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}

const HapticTab = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Haptic Tab</Text>
      <HapticPressable style={styles.button}>
        <Text style={styles.buttonText}>Press Me</Text>
      </HapticPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HapticTab;
