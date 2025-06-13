// File: /components/UploadOptionsSheet.tsx
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function UploadOptionsSheet({ visible, onClose, onSelect }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Choose an Option</Text>

          <TouchableOpacity style={styles.optionButton} onPress={() => onSelect('repair')}>
            <Text style={styles.optionText}>Request Repair</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => onSelect('sell')}>
            <Text style={styles.optionText}>Sell a Toy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => onSelect('donate')}>
            <Text style={styles.optionText}>Donate Toy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionButton: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#888',
  },
});
