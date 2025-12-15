import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigation } from './src/components/navigation/root.navigation';

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigation />
    </NavigationContainer>
  );
}
