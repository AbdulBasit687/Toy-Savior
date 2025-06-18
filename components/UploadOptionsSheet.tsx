import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function UploadOptionsSheet({ visible, onClose, onSelect, selected }) {
  const [current, setCurrent] = useState(selected);

  useEffect(() => {
    setCurrent(selected);
  }, [selected]);

  const handleSelect = (option: string) => {
    setCurrent(option);
    onSelect(option);
    onClose(); // Optional: auto-close on selection
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

          {[
            { key: 'repair', label: 'Request Repair' },
            { key: 'sell', label: 'Sell a Toy' },
            { key: 'donate', label: 'Donate Toy' },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.optionButton,
                current === item.key && styles.selected,
              ]}
              onPress={() => handleSelect(item.key)}
            >
              <Text
                style={[
                  styles.optionText,
                  current === item.key && styles.selectedText,
                ]}
              >
                {item.label}
              </Text>
              {current === item.key && (
                <Ionicons name="checkmark" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
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
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'BalooTammudu2-SemiBold',
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
    width: screenWidth - 40,
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
});
