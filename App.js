import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppRoutes from './src/routes/AppRoutes';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <AppRoutes />
    </NavigationContainer>
  );
}