// File: /app/components/RoleSelector.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RoleSelector = ({ selectedRole, setSelectedRole }) => {
  return (
    <View style={styles.container}>
      {['repairer', 'user'].map(role => (
        <TouchableOpacity
          key={role}
          style={[
            styles.roleButton,
            selectedRole === role && styles.selected,
          ]}
          onPress={() => setSelectedRole(role)}
        >
          <Text style={selectedRole === role ? styles.selectedText : styles.text}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
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
    fontFamily: 'ABeeZee-Regular',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'ABeeZee-Regular',
  },
});
