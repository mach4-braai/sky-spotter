import React from 'react';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4488ff',
        tabBarInactiveTintColor: '#666688',
        tabBarStyle: {
          backgroundColor: '#0a0a1a',
          borderTopColor: '#1a1a2e',
        },
        headerStyle: { backgroundColor: '#0a0a1a' },
        headerTintColor: '#e0e0ff',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Nearby',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'airplane', android: 'flight', web: 'flight' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="incoming"
        options={{
          title: 'Incoming',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'arrow.down.circle', android: 'south', web: 'south' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
