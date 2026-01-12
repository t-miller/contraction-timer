import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { ContractionProvider } from './src/context/ContractionContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { SavedSetsScreen } from './src/screens/SavedSetsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ContractionProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#2196F3',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              borderTopWidth: 1,
              borderTopColor: '#E0E0E0',
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Text style={{ fontSize: 20, color }}>⏱</Text>
              ),
            }}
          />
          <Tab.Screen
            name="Saved Sets"
            component={SavedSetsScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Text style={{ fontSize: 20, color }}>📁</Text>
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ContractionProvider>
  );
}
