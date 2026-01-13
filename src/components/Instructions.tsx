import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export function Instructions() {
  const { colors } = useTheme();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.iconButton, { backgroundColor: colors.surfaceSecondary }]}
        onPress={() => setShowModal(true)}
        accessibilityLabel="Instructions"
        accessibilityHint="Tap to view app instructions"
      >
        <Text style={styles.icon}>ℹ️</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>How to Use</Text>

            <View style={styles.instructionsList}>
              <Text style={[styles.instructionItem, { color: colors.textSecondary }]}>
                1. Tap the button when a contraction starts
              </Text>
              <Text style={[styles.instructionItem, { color: colors.textSecondary }]}>
                2. Tap again when it ends
              </Text>
              <Text style={[styles.instructionItem, { color: colors.textSecondary }]}>
                3. View your history and statistics below
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>Got it</Text>
            </TouchableOpacity>

            <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
              Your data is private and stored only on this device.
              This app is a timing tool only and does not provide medical advice. Always consult your healthcare provider.
            </Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsList: {
    width: '100%',
    marginBottom: 20,
  },
  instructionItem: {
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'left',
  },
  disclaimerText: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.7,
  },
  privacyText: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
  },
});
