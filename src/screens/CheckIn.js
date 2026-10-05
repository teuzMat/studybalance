import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';

export default function CheckIn({ navigation }) {
  const [humorSelecionado, setHumorSelecionado] = useState(null);
  const [sonoSelecionado, setSonoSelecionado] = useState(null);

  const humores = [
    { id: 1, emoji: '😫', label: 'Exausto' },
    { id: 2, emoji: '🙁', label: 'Estressado' },
    { id: 3, emoji: '😐', label: 'Normal' },
    { id: 4, emoji: '🙂', label: 'Bem' },
    { id: 5, emoji: '😁', label: 'Ótimo' },
  ];

  const horasSono = ['< 5h', '5 a 6h', '6 a 7h', '7 a 8h', '> 8h'];

  const salvarCheckIn = async () => {
    if (!humorSelecionado || !sonoSelecionado) {
      Alert.alert('Ops!', 'Por favor, selecione seu humor e suas horas de sono de hoje.');
      return;
    }

    try {
      const dadosCheckIn = {
        data: new Date().toISOString(),
        humor: humorSelecionado,
        sono: sonoSelecionado,
      };

      await AsyncStorage.setItem('@studybalance_checkin', JSON.stringify(dadosCheckIn));

      Alert.alert('Check-in Realizado!', 'Seus dados foram salvos. Continue priorizando o seu bem-estar!');
      
      setHumorSelecionado(null);
      setSonoSelecionado(null);
      
      navigation.navigate('Início');

    } catch (error) {
      Alert.alert('Erro', 'Houve um problema ao salvar seu check-in.');
      console.error(error);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Check-in Diário</Text>
          <Text style={styles.subtitle}>Como está o seu nível de energia hoje?</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Como você está se sentindo?</Text>
          <View style={styles.emojiContainer}>
            {humores.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.emojiButton,
                  humorSelecionado === item.label && styles.emojiButtonActive
                ]}
                onPress={() => setHumorSelecionado(item.label)}
              >
                <Text style={styles.emojiText}>{item.emoji}</Text>
                <Text style={[
                  styles.emojiLabel,
                  humorSelecionado === item.label && styles.emojiLabelActive
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Quantas horas você dormiu?</Text>
          <View style={styles.sleepContainer}>
            {horasSono.map((horas, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.sleepButton,
                  sonoSelecionado === horas && styles.sleepButtonActive
                ]}
                onPress={() => setSonoSelecionado(horas)}
              >
                <Text style={[
                  styles.sleepText,
                  sonoSelecionado === horas && styles.sleepTextActive
                ]}>
                  {horas}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={salvarCheckIn}>
          <Text style={styles.saveButtonText}>Salvar Check-in</Text>
        </TouchableOpacity>
        
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    width: Platform.OS === 'web' ? '60%' : '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 8,
  },
  section: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textMain,
    marginBottom: 16,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emojiButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  emojiButtonActive: {
    backgroundColor: colors.background,
    borderColor: colors.tertiary,
  },
  emojiText: {
    fontSize: 28,
    marginBottom: 4,
  },
  emojiLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  emojiLabelActive: {
    color: colors.tertiary,
    fontWeight: 'bold',
  },
  sleepContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sleepButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sleepButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sleepText: {
    fontSize: 14,
    color: colors.textMain,
    fontWeight: '500',
  },
  sleepTextActive: {
    color: colors.surface,
  },
  saveButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacer: {
    height: 40,
  }
});