// apps/(tabs)/components/SocialButton.tsx
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  icon: 'google' | 'apple' | 'facebook';
  label: string;
}

const SocialButton = ({ icon, label }: Props) => {
  return (
    <TouchableOpacity style={styles.button}>
      <FontAwesome name={icon} size={20} style={styles.icon} />
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

export default SocialButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#F4F4F4',
    borderRadius: 20,
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
});
