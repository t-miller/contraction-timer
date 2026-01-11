import React from 'react';
import { ContractionProvider } from './src/context/ContractionContext';
import { HomeScreen } from './src/screens/HomeScreen';

export default function App() {
  return (
    <ContractionProvider>
      <HomeScreen />
    </ContractionProvider>
  );
}
