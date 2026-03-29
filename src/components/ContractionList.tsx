import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useContractions } from '../context/ContractionContext';
import { useTheme } from '../context/ThemeContext';
import { useSaveSetModal } from '../hooks';
import { ContractionItem } from './ContractionItem';

export function ContractionList() {
  const { state, clearHistory, saveSet } = useContractions();
  const { colors } = useTheme();
  const modal = useSaveSetModal({
    onSave: saveSet,
    fallbackName: `Set ${state.savedSets.length + 1}`,
  });

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

  const getIntervalFromPrevious = useCallback((index: number): number | null => {
    if (index >= state.contractions.length - 1) return null;
    const current = state.contractions[index];
    const previous = state.contractions[index + 1];
    return current.startTime - (previous.endTime || previous.startTime);
  }, [state.contractions]);

  if (state.contractions.length === 0) {
    return (
      <View style={styles.emptyContainer} testID="empty-state">
        <View style={[styles.emptyIconContainer, { backgroundColor: colors.surfaceSecondary }]} testID="empty-state-icon">
          <Ionicons name="timer-outline" size={32} color={colors.textSecondary} />
        </View>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]} testID="empty-state-text">No contractions recorded</Text>
        <Text style={[styles.emptyHint, { color: colors.textTertiary }]} testID="empty-state-hint">
          Tap the button above to start timing
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} testID="contraction-list">
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: colors.textSecondary }]} testID="history-header" accessibilityRole="header" aria-level={2}>History</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.primaryLight }]}
            onPress={modal.open}
            testID="save-button"
            accessibilityRole="button"
            accessibilityLabel="Save contractions"
          >
            <Text style={[styles.headerButtonText, { color: colors.primary }]}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.dangerLight }]}
            onPress={handleClearHistory}
            testID="clear-button"
            accessibilityRole="button"
            accessibilityLabel="Clear history"
          >
            <Text style={[styles.headerButtonText, { color: colors.danger }]}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.listContent}>
        {state.contractions.map((item, index) => (
          <ContractionItem
            key={item.id}
            contraction={item}
            intervalFromPrevious={getIntervalFromPrevious(index)}
            index={state.contractions.length - index}
          />
        ))}
      </View>

      <Modal
        visible={modal.isVisible}
        transparent
        animationType="fade"
        onRequestClose={modal.cancel}
        accessibilityViewIsModal={true}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface, boxShadow: `0 10px 20px ${colors.shadow}26` }]}
            accessibilityLabel="Save contractions dialog"
          >
            <Text style={[styles.modalTitle, { color: colors.text }]} testID="modal-title">Save Set</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]} testID="modal-subtitle">
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
              value={modal.setName}
              onChangeText={modal.updateSetName}
              autoFocus
              accessibilityLabel="Set name input"
              accessibilityHint="Enter a name for this contraction set"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.surfaceSecondary }]}
                onPress={modal.cancel}
                testID="modal-cancel-button"
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text style={[styles.modalButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.primary }]}
                onPress={modal.save}
                testID="modal-save-button"
                accessibilityRole="button"
                accessibilityLabel="Save set"
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
  container: {},
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
