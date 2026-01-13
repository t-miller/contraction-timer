import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useContractions } from '../context/ContractionContext';
import { useTheme } from '../context/ThemeContext';
import { ContractionSet } from '../types';

export function SavedSetsScreen() {
  const navigation = useNavigation();
  const { state, loadSet, deleteSet } = useContractions();
  const { colors } = useTheme();

  const handleLoadSet = (set: ContractionSet) => {
    const doLoad = () => {
      loadSet(set.id);
      navigation.navigate('Home' as never);
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Load "${set.name}"? This will replace your current contractions.`)) {
        doLoad();
      }
    } else {
      Alert.alert(
        'Load Set',
        `Load "${set.name}"? This will replace your current contractions.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Load', onPress: doLoad },
        ]
      );
    }
  };

  const handleDeleteSet = (set: ContractionSet) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Delete "${set.name}"? This cannot be undone.`)) {
        deleteSet(set.id);
      }
    } else {
      Alert.alert(
        'Delete Set',
        `Delete "${set.name}"? This cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteSet(set.id) },
        ]
      );
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }: { item: ContractionSet }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, boxShadow: `0 2px 8px ${colors.cardShadow}` }]}
      onPress={() => handleLoadSet(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
          <Text style={styles.icon}>📋</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.setName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.setMeta, { color: colors.textSecondary }]}>
            {item.contractions.length} contraction{item.contractions.length !== 1 ? 's' : ''}
          </Text>
          <Text style={[styles.setDate, { color: colors.textTertiary }]}>
            {formatDate(item.createdAt)} at {formatTime(item.createdAt)}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: colors.dangerLight }]}
          onPress={() => handleDeleteSet(item)}
        >
          <Text style={[styles.deleteButtonText, { color: colors.danger }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Saved Sets</Text>
        <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
          {state.savedSets.length} saved recording{state.savedSets.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {state.savedSets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconContainer, { backgroundColor: colors.surfaceSecondary }]}>
            <Text style={styles.emptyIcon}>📁</Text>
          </View>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No saved sets</Text>
          <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>
            Save your contractions from the Home screen to access them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={state.savedSets}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  icon: {
    fontSize: 22,
  },
  cardInfo: {
    flex: 1,
  },
  setName: {
    fontSize: 17,
    fontWeight: '600',
  },
  setMeta: {
    fontSize: 14,
    marginTop: 2,
  },
  setDate: {
    fontSize: 12,
    marginTop: 2,
  },
  deleteButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 280,
  },
});
