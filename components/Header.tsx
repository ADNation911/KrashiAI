import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// 1. Import your custom hook
import { useLanguage } from '../src/context/LanguageContext'; // Adjust path to your context file

const Header = () => {
  // 2. Call the hook to get the toggle function and translations
  const { toggleLanguage, t } = useLanguage();

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>{t.home}</Text>
      
      {/* 3. Use the toggleLanguage function in the onPress event */}
      <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
        {/* The text now also comes from the context and will change automatically! */}
        <Text style={styles.languageButtonText}>{t.changeLanguage}</Text>
      </TouchableOpacity>
    </View>
  );
};

// Add some basic styles for the example
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  languageButtonText: {
    fontWeight: '600',
    color: '#166534', // A green color
  }
});

export default Header;