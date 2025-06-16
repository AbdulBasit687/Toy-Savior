import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function UploadOptionsSheet({ visible, onClose, onSelect, selected }) {
  const [current, setCurrent] = useState(selected);

  const handleSelect = (option: string) => {
    setCurrent(option);
    onSelect(option);
  };


  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Choose an Option</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.optionButton, current === 'repair' && styles.selected]}
            onPress={() => handleSelect('repair')}
          >
            <Text style={[styles.optionText, current === 'repair' && styles.selectedText]}>
              Request Repair
            </Text>
            {current === 'repair' && <Ionicons name="checkmark" size={20} color="#fff" />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, selected === 'sell' && styles.selected]}
            onPress={() => handleSelect('sell')}
          >
            <Text style={[styles.optionText, selected === 'sell' && styles.selectedText]}>
              Sell a Toy
            </Text>
            {selected === 'sell' && <Ionicons name="checkmark" size={20} color="#fff" />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, selected === 'donate' && styles.selected]}
            onPress={() => handleSelect('donate')}
          >
            <Text style={[styles.optionText, selected === 'donate' && styles.selectedText]}>
              Donate Toy
            </Text>
            {selected === 'donate' && <Ionicons name="checkmark" size={20} color="#fff" />}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    paddingLeft: 80,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'BalooTammudu2-SemiBold',
  },
  clearText: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'ABeeZee-Regular',
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 342,
    height: 56
  },
  selected: {
    backgroundColor: '#F4B731',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'ABeeZee-Regular',
    color: '#000',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'ABeeZee-Regular',
  },
});
