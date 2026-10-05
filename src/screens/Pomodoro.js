import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { colors } from '../theme/colors';

// Configuração obrigatória para notificações nativas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Pomodoro() {
  const TEMPO_FOCO = 25 * 60;
  const TEMPO_PAUSA = 5 * 60;

  const [tempo, setTempo] = useState(TEMPO_FOCO);
  const [ativo, setAtivo] = useState(false);
  const [modoFoco, setModoFoco] = useState(true);

  const [tarefa, setTarefa] = useState('');
  const [ciclosCompletos, setCiclosCompletos] = useState(0);

  // 1. Pede permissão apenas se NÃO for Web
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        try {
          const { status } = await Notifications.requestPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Aviso', 'Ative as notificações para ser avisado quando o tempo acabar!');
          }
        } catch (error) {
          console.log("Erro ao pedir permissão", error);
        }
      }
    })();
  }, []);

  // 2. Dispara Notificação Nativa (Celular) ou Alerta Simples (Web)
  const dispararNotificacao = async (focoTerminado) => {
    const titulo = focoTerminado ? "🎯 Foco Concluído!" : "☕ Pausa Finalizada!";
    const mensagem = focoTerminado 
      ? "Excelente trabalho! Levante, beba uma água e aproveite seus 5 minutos de pausa." 
      : "Descanso concluído. Vamos voltar para a missão?";

    if (Platform.OS === 'web') {
      // Na Web, exibe um alerta do navegador para não quebrar o app
      alert(`${titulo}\n\n${mensagem}`);
    } else {
      // No Celular, dispara a notificação push nativa
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: titulo,
            body: mensagem,
            sound: true,
          },
          trigger: null,
        });
      } catch (error) {
        console.log("Erro na notificação", error);
      }
    }
  };

  // 3. Lógica do Relógio
  useEffect(() => {
    let intervalo = null;

    if (ativo && tempo > 0) {
      intervalo = setInterval(() => {
        setTempo((t) => t - 1);
      }, 1000);
    } else if (tempo === 0 && ativo) {
      setAtivo(false);
      clearInterval(intervalo);
      
      // Dispara o alerta assim que o tempo zera
      dispararNotificacao(modoFoco);
      
      if (modoFoco) {
        setCiclosCompletos((c) => c + 1);
        setModoFoco(false);
        setTempo(TEMPO_PAUSA);
      } else {
        setModoFoco(true);
        setTempo(TEMPO_FOCO);
      }
    }

    return () => clearInterval(intervalo);
  }, [ativo, tempo, modoFoco]);

  const formatarTempo = () => {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  const alternarModo = (foco) => {
    setModoFoco(foco);
    setAtivo(false);
    setTempo(foco ? TEMPO_FOCO : TEMPO_PAUSA);
  };

  const iniciarOuPausar = () => {
    Keyboard.dismiss(); 
    setAtivo(!ativo);
  };

  return (
    <View style={styles.wrapper}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <Text style={styles.title}>Foco Direcionado</Text>
          <Text style={styles.subtitle}>Um passo de cada vez para evitar a exaustão.</Text>
        </View>

        {!ativo && tempo === TEMPO_FOCO && modoFoco ? (
          <View style={styles.taskInputContainer}>
            <Text style={styles.inputLabel}>Qual a sua missão de agora?</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Estudar React Native..."
              placeholderTextColor={colors.textMuted}
              value={tarefa}
              onChangeText={setTarefa}
              maxLength={35}
            />
          </View>
        ) : (
          <View style={styles.activeTaskContainer}>
            <Text style={styles.activeTaskLabel}>
              {modoFoco ? '🎯 Focando em:' : '☕ Pausa merecida após:'}
            </Text>
            <Text style={styles.activeTaskText}>{tarefa || 'Estudo Livre'}</Text>
          </View>
        )}

        <View style={styles.scoreContainer}>
          <Ionicons name="flame" size={20} color={colors.secondary} />
          <Text style={styles.scoreText}>{ciclosCompletos} Ciclos Concluídos hoje</Text>
        </View>

        <View style={[styles.timerContainer, !modoFoco && styles.timerContainerPausa]}>
          <Text style={[styles.timerText, !modoFoco && styles.timerTextPausa]}>
            {formatarTempo()}
          </Text>
          <Text style={styles.timerLabel}>
            {modoFoco ? 'minutos de foco' : 'minutos de pausa'}
          </Text>
        </View>

        <View style={styles.modeContainer}>
          <TouchableOpacity style={[styles.modeButton, modoFoco && styles.modeButtonActiveFoco]} onPress={() => alternarModo(true)}>
            <Text style={[styles.modeText, modoFoco && styles.modeTextActive]}>Foco</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modeButton, !modoFoco && styles.modeButtonActivePausa]} onPress={() => alternarModo(false)}>
            <Text style={[styles.modeText, !modoFoco && styles.modeTextActive]}>Pausa</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={[styles.actionButton, ativo ? styles.buttonPause : styles.buttonStart]} onPress={iniciarOuPausar}>
            <Ionicons name={ativo ? "pause" : "play"} size={24} color={colors.surface} />
            <Text style={styles.actionButtonText}>{ativo ? 'Pausar' : 'Iniciar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonReset} onPress={() => alternarModo(modoFoco)}>
            <Ionicons name="refresh" size={24} color={colors.textMain} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1, width: Platform.OS === 'web' ? '60%' : '100%',
    alignSelf: 'center', paddingHorizontal: 24,
  },
  header: { marginTop: 60, marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.primary },
  subtitle: { fontSize: 15, color: colors.textMuted, marginTop: 6, textAlign: 'center' },
  taskInputContainer: { marginBottom: 15 },
  inputLabel: { fontSize: 14, fontWeight: 'bold', color: colors.textMain, marginBottom: 8 },
  input: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, padding: 16, fontSize: 16, color: colors.textMain,
  },
  activeTaskContainer: { alignItems: 'center', marginBottom: 15, paddingVertical: 10 },
  activeTaskLabel: { fontSize: 14, color: colors.textMuted, marginBottom: 4 },
  activeTaskText: { fontSize: 20, fontWeight: 'bold', color: colors.textMain },
  scoreContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface, paddingVertical: 8, paddingHorizontal: 16,
    borderRadius: 20, alignSelf: 'center', marginBottom: 30, borderWidth: 1, borderColor: colors.border,
  },
  scoreText: { marginLeft: 8, fontSize: 14, fontWeight: 'bold', color: colors.textMuted },
  timerContainer: {
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface,
    width: 240, height: 240, borderRadius: 120, alignSelf: 'center', marginBottom: 30,
    borderWidth: 8, borderColor: colors.primary,
  },
  timerContainerPausa: { borderColor: colors.secondary },
  timerText: { fontSize: 56, fontWeight: 'bold', color: colors.primary },
  timerTextPausa: { color: colors.secondary },
  timerLabel: { fontSize: 14, color: colors.textMuted, marginTop: -5 },
  modeContainer: {
    flexDirection: 'row', justifyContent: 'center', marginBottom: 30,
    backgroundColor: '#E5E7EB', borderRadius: 30, padding: 4, alignSelf: 'center',
  },
  modeButton: { paddingVertical: 8, paddingHorizontal: 24, borderRadius: 26 },
  modeButtonActiveFoco: { backgroundColor: colors.primary },
  modeButtonActivePausa: { backgroundColor: colors.secondary },
  modeText: { fontSize: 14, color: colors.textMuted, fontWeight: 'bold' },
  modeTextActive: { color: colors.surface },
  actionContainer: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  actionButton: {
    flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 24,
    borderRadius: 12, minWidth: 160, alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  buttonStart: { backgroundColor: colors.tertiary }, 
  buttonPause: { backgroundColor: colors.textMuted },
  actionButtonText: { color: colors.surface, fontSize: 18, fontWeight: 'bold' },
  buttonReset: {
    paddingVertical: 16, paddingHorizontal: 16, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
});