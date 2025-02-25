import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { supabase } from '../services/supabase';
import { Icon } from '@rneui/themed';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('verifications');
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      let query = supabase.from(activeTab === 'verifications' ? 
        'verification_requests' : 'rooms');
      
      if (activeTab === 'verifications') {
        query = query.eq('status', 'pending');
      }
      
      const { data } = await query.select('*');
      setData(data || []);
    };
    loadData();
  }, [activeTab]);

  const handleAction = async (id, action) => {
    if (activeTab === 'verifications') {
      await supabase
        .from('verification_requests')
        .update({ status: action })
        .eq('id', id);
    } else {
      await supabase.from('messages').delete().eq('room_code', id);
      await supabase.from('rooms').delete().eq('code', id);
    }
    setData(prev => prev.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'verifications' && styles.activeTab]}
          onPress={() => setActiveTab('verifications')}
        >
          <Text>Verifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'rooms' && styles.activeTab]}
          onPress={() => setActiveTab('rooms')}
        >
          <Text>Rooms</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{activeTab === 'verifications' ? item.name : `Room ${item.code}`}</Text>
            <View style={styles.actions}>
              {activeTab === 'verifications' ? (
                <>
                  <TouchableOpacity onPress={() => handleAction(item.id, 'approved')}>
                    <Icon name="check" color="green" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleAction(item.id, 'rejected')}>
                    <Icon name="close" color="red" />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={() => handleAction(item.code, 'delete')}>
                  <Icon name="delete" color="red" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: '#3498db',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
});