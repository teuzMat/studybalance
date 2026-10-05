import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Platform, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../theme/colors';

// Calcula a largura responsiva para o gráfico
const screenWidth = Dimensions.get('window').width;
const containerWidth = Platform.OS === 'web' ? screenWidth * 0.6 : screenWidth;
const chartWidth = containerWidth - 48; // Desconta o padding (24 de cada lado)

export default function Dashboard({ navigation }) {
  const [checkIn, setCheckIn] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const carregarDados = async () => {
    setLoading(true);
    try {
      const dadosSalvos = await AsyncStorage.getItem('@studybalance_checkin');
      if (dadosSalvos) {
        const dadosConvertidos = JSON.parse(dadosSalvos);
        const dataCheckIn = new Date(dadosConvertidos.data);
        const hoje = new Date();
        
        if (dataCheckIn.toDateString() === hoje.toDateString()) {
          setCheckIn(dadosConvertidos);
        } else {
          setCheckIn(null);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    } finally {
      setLoading(false);
    }
  };

  const calcularIndice = () => {
    if (!checkIn) return 0;
    let score = 50;
    if (checkIn.sono === '> 8h' || checkIn.sono === '7 a 8h') score += 30;
    else if (checkIn.sono === '6 a 7h') score += 15;
    else if (checkIn.sono === '5 a 6h') score -= 15;
    else score -= 30;

    if (checkIn.humor === 'Ótimo' || checkIn.humor === 'Bem') score += 20;
    else if (checkIn.humor === 'Normal') score += 10;
    else score -= 20;

    return Math.max(0, Math.min(100, score));
  };

  const indice = calcularIndice();

  // Dados do Gráfico (Simulando os últimos 6 dias + o dia de hoje)
  const chartData = {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Hoje"],
    datasets: [
      {
        data: [60, 50, 75, 40, 85, 90, checkIn ? indice : 0],
        color: (opacity = 1) => `rgba(0, 100, 192, ${opacity})`, // Azul Study
        strokeWidth: 3 // Espessura da linha
      }
    ],
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Olá, Estudante!</Text>
          <Text style={styles.subtitleText}>Pronto para equilibrar sua rotina hoje?</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
        ) : (
          <>
            {/* NOVO: GRÁFICO DE EVOLUÇÃO */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Evolução Semanal</Text>
              <Text style={styles.cardDescription}>Acompanhe o seu Índice de Equilíbrio</Text>
              
              <LineChart
                data={chartData}
                width={chartWidth}
                height={220}
                yAxisSuffix="%"
                chartConfig={{
                  backgroundColor: colors.surface,
                  backgroundGradientFrom: colors.surface,
                  backgroundGradientTo: colors.surface,
                  decimalPlaces: 0,
                  color: (opacity = 1) => colors.border, // Cor das linhas de fundo
                  labelColor: (opacity = 1) => colors.textMuted, // Cor dos textos (Seg, Ter...)
                  propsForDots: {
                    r: "5",
                    strokeWidth: "2",
                    stroke: colors.secondary // Verde Balance nas bolinhas
                  }
                }}
                bezier // Deixa a linha suave/curvada
                style={{
                  marginVertical: 10,
                  borderRadius: 16,
                  marginLeft: -10 // Ajuste fino para alinhar à esquerda do card
                }}
              />
            </View>

            {/* Card do Índice de Equilíbrio Atual */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Índice de Hoje</Text>
              {checkIn ? (
                <>
                  <Text style={[styles.scoreText, { color: indice >= 70 ? colors.success : indice >= 40 ? colors.tertiary : 'red' }]}>
                    {indice}%
                  </Text>
                  <Text style={styles.cardDescription}>
                    Humor: <Text style={{ fontWeight: 'bold' }}>{checkIn.humor}</Text> 
                    {'\n'}Sono: <Text style={{ fontWeight: 'bold' }}>{checkIn.sono}</Text>
                  </Text>
                </>
              ) : (
                <>
                  <Text style={[styles.scoreText, { color: colors.textMuted, fontSize: 24, marginTop: 15 }]}>Pendente</Text>
                  <Text style={styles.cardDescription}>Faça o check-in de hoje para calcularmos seu índice.</Text>
                </>
              )}
            </View>

            {!checkIn ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Check-in de Saúde</Text>
                <Text style={styles.cardDescription}>Você ainda não registrou como está se sentindo hoje.</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Check-in')}>
                  <Text style={styles.buttonText}>Fazer Check-in</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.card, { backgroundColor: colors.primary }]}>
                <Text style={[styles.cardTitle, { color: colors.surface }]}>Tudo certo por hoje! ✅</Text>
                <Text style={[styles.cardDescription, { color: colors.surface, opacity: 0.9, marginTop: 10, marginBottom: 0 }]}>
                  Vá para a aba "Foco" e utilize o Pomodoro para estudar sem se esgotar.
                </Text>
              </View>
            )}
          </>
        )}
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // O wrapper segura a cor de fundo em 100% da tela (útil na web)
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // O container limita a largura em 60% na web e centraliza
  container: {
    flex: 1,
    width: Platform.OS === 'web' ? '60%' : '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 30 },
  logo: { width: 200, height: 100 },
  welcomeSection: { marginBottom: 24 },
  welcomeText: { fontSize: 26, fontWeight: 'bold', color: colors.textMain },
  subtitleText: { fontSize: 16, color: colors.textMuted, marginTop: 6 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.primary },
  scoreText: { fontSize: 42, fontWeight: '900', marginVertical: 10 },
  cardDescription: { fontSize: 15, color: colors.textMuted, lineHeight: 22, marginBottom: 16 },
  button: { backgroundColor: colors.tertiary, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: colors.surface, fontSize: 16, fontWeight: 'bold' },
});