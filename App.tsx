import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ContractionProvider } from './src/context/ContractionContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { SavedSetsScreen } from './src/screens/SavedSetsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

interface TabIconProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
  color: string;
}

function TabIcon({ icon, label, focused, color }: TabIconProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.tabIconContainer}>
      <View style={[
        styles.tabIconBackground,
        focused && { backgroundColor: colors.primaryLight }
      ]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.tabLabel, { color, fontWeight: focused ? '600' : '500' }]}>{label}</Text>
    </View>
  );
}

function AppContent() {
  const { colors, isDark } = useTheme();

  const navigationTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.surface,
          border: colors.border,
          primary: colors.primary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: colors.surface,
          border: colors.border,
          primary: colors.primary,
        },
      };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarStyle: {
            height: 80,
            paddingTop: 12,
            paddingBottom: 12,
            borderTopWidth: 0,
            justifyContent: 'center',
            backgroundColor: colors.surface,
            boxShadow: `0 -4px 12px ${colors.shadow}14`,
            elevation: 10,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarAccessibilityLabel: 'Timer tab - track contractions',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon="timer-outline" label="Timer" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Saved Sets"
          component={SavedSetsScreen}
          options={{
            tabBarAccessibilityLabel: 'Saved sets tab - view saved contraction sets',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon="folder-outline" label="Saved" focused={focused} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarAccessibilityLabel: 'Settings tab - app preferences',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon="settings-outline" label="Settings" focused={focused} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },
  tabIconBackground: {
    width: 48,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ContractionProvider>
          <AppContent />
        </ContractionProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
