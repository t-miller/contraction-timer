import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { useContractions } from '../context/ContractionContext';
import { useTheme } from '../context/ThemeContext';
import { ContractionItem } from './ContractionItem';
import { Contraction } from '../types';

export function ContractionList() {
  const { state, clearHistory, saveSet } = useContractions();
  const { colors } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [setName, setSetName] = useState('');

  const handleClearHistory = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to clear all recorded contractions?')) {
        clearHistory();
      }
    } else {
      Alert.alert(
        'Clear History',
        'Are you sure you want to clear all recorded contractions?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: clearHistory },
        ]
      );
    }
  };

  const handleSaveSet = () => {
    setIsModalVisible(true);
  };

  const handleConfirmSave = () => {
    const name = setName.trim() || `Set ${state.savedSets.length + 1}`;
    saveSet(name);
    setSetName('');
    setIsModalVisible(false);
  };

  const getIntervalFromPrevious = (index: number): number | null => {
    if (index >= state.contractions.length - 1) return null;
    const current = state.contractions[index];
    const previous = state.contractions[index + 1];
    return current.startTime - (previous.endTime || previous.startTime);
  };

  const renderItem = ({ item, index }: { item: Contraction; index: number }) => (
    <ContractionItem
      contraction={item}
      intervalFromPrevious={getIntervalFromPrevious(index)}
      index={state.contractions.length - index}
    />
  );

  if (state.contractions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={[styles.emptyIconContainer, { backgroundColor: colors.surfaceSecondary }]}>
          <Text style={styles.emptyIcon}>⏱</Text>
        </View>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No contractions recorded</Text>
        <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>
          Tap the button above to start timing
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: colors.textSecondary }]}>History</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.primaryLight }]}
            onPress={handleSaveSet}
          >
            <Text style={[styles.headerButtonText, { color: colors.primary }]}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.dangerLight }]}
            onPress={handleClearHistory}
          >
            <Text style={[styles.headerButtonText, { color: colors.danger }]}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={state.contractions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Save Set</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Give this recording session a name
            </Text>
            <TextInput
              style={[styles.input, {
                borderColor: colors.border,
                backgroundColor: colors.inputBackground,
                color: colors.text
              }]}
              placeholder="e.g., Morning contractions"
              placeholderTextColor={colors.textTertiary}
              value={setName}
              onChangeText={setSetName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.surfaceSecondary }]}
                onPress={() => {
                  setSetName('');
                  setIsModalVisible(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.primary }]}
                onPress={handleConfirmSave}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 8,
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
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 340,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButton: {},
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
