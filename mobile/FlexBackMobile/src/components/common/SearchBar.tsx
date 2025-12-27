import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  containerStyle?: ViewStyle;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  placeholder = 'Tìm kiếm...',
  onChangeText,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Feather name="search" size={18} color="#888" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
});

export default SearchBar;
