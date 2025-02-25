import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../services/supabase';
import { Icon } from '@rneui/themed';

export default function VerificationScreen() {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    photo: null,
    loading: false,
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setForm({ ...form, photo: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    try {
      setForm({ ...form, loading: true });

      let photoUrl = '';
      if (form.photo) {
        const photoName = `${Date.now()}.jpg`;
        const { error } = await supabase.storage
          .from('verifications')
          .upload(photoName, { uri: form.photo, type: 'image/jpeg' });

        if (error) throw error;
        photoUrl = `${supabase.storageUrl}/object/public/verifications/${photoName}`;
      }

      const { error } = await supabase
        .from('verification_requests')
        .insert([{
          name: form.name,
          contact: form.contact,
          photo_url: photoUrl,
          status: 'pending',
        }]);

      if (error) throw error;

      Alert.alert('Success', 'Verification request submitted!');
      setForm({ name: '', contact: '', photo: null, loading: false });
    } catch (error) {
      Alert.alert('Error', error.message);
      setForm({ ...form, loading: false });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get Verified</Text>

      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        {form.photo ? (
          <Image source={{ uri: form.photo }} style={styles.photo} />
        ) : (
          <Icon name="camera-alt" type="material" size={40} color="#7f8c8d" />
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        keyboardType="phone-pad"
        value={form.contact}
        onChangeText={(text) => setForm({ ...form, contact: text })}
      />

      <TouchableOpacity
        style={[styles.button, form.loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={form.loading}
      >
        <Text style={styles.buttonText}>
          {form.loading ? 'Submitting...' : 'Submit Verification'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f6fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#2c3e50',
  },
  photoButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#dfe6e9',
    alignSelf: 'center',
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  input: {
    height: 50,
    backgroundColor: 'white',
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});