// apps/(tabs)/components/RoleSelector.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RoleSelector = () => {
  const [selected, setSelected] = useState<'Repairer' | 'User'>('Repairer');

  return (
    <View style={styles.container}>
      {['Repairer', 'User'].map(role => (
        <TouchableOpacity
          key={role}
          style={[
            styles.roleButton,
            selected === role && styles.selected,
          ]}
          onPress={() => setSelected(role as any)}
        >
          <Text style={selected === role ? styles.selectedText : styles.text}>
            {role}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RoleSelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#F4B731',
  },
  text: {
    color: '#333',
  },
  selectedText: {
    fontWeight: 'bold',
  },
});
