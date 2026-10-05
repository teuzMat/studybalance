import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Importação de ícones nativos do Expo
import { Ionicons } from '@expo/vector-icons'; 

import Dashboard from '../screens/Dashboard';
import Pomodoro from '../screens/Pomodoro';
import CheckIn from '../screens/CheckIn';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function AppRoutes() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Esconde o cabeçalho padrão
        tabBarActiveTintColor: colors.primary, // Azul Study quando selecionado
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 10,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Início') iconName = 'home-outline';
          else if (route.name === 'Foco') iconName = 'timer-outline';
          else if (route.name === 'Check-in') iconName = 'happy-outline';
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={Dashboard} />
      <Tab.Screen name="Foco" component={Pomodoro} />
      <Tab.Screen name="Check-in" component={CheckIn} />
    </Tab.Navigator>
  );
}