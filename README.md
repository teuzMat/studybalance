# ⚖️ StudyBalance

> **O equilíbrio perfeito entre produtividade acadêmica e saúde mental.**

O **StudyBalance** é um aplicativo mobile desenvolvido como projeto de extensão acadêmica por estudantes de **Análise e Desenvolvimento de Sistemas (IESB)**. Nascido a partir de uma profunda pesquisa de *Design Thinking*, o app visa combater a normalização do esgotamento (Burnout) no ambiente universitário, provando através de dados que o autocuidado é fundamental para o alto rendimento.

---

## ✨ Funcionalidades (MVP)

- **📊 Dashboard Interativo e Gráficos:** Acompanhamento visual do seu "Índice de Equilíbrio" semanal através de gráficos de linha, correlacionando descanso e produtividade.
- **📝 Check-in Diário de Saúde:** Registro ultrarrápido (menos de 1 minuto) sobre a qualidade do sono e nível de estresse.
- **🍅 Foco Direcionado (Pomodoro):** Cronômetro inteligente com ciclos de foco (25m) e pausas ativas (5m), reduzindo a sobrecarga cognitiva.
- **🏆 Gamificação:** Placar de ciclos concluídos para manter o estudante motivado.
- **🔔 Notificações Nativas:** Alertas locais que avisam o momento exato de pausar ou voltar aos estudos, mesmo com o app em segundo plano.
- **💾 Armazenamento Offline:** Dados salvos localmente e com segurança no dispositivo do usuário utilizando AsyncStorage.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias e bibliotecas:

- **[React Native](https://reactnative.dev/):** Framework principal para desenvolvimento mobile.
- **[Expo](https://expo.dev/):** Plataforma e toolchain para facilitar a construção e testes (Expo Go).
- **[React Navigation](https://reactnavigation.org/):** Gerenciamento de rotas e navegação inferior (Bottom Tabs).
- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/):** Banco de dados local para persistência do histórico do usuário.
- **[React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit):** Renderização do gráfico responsivo de evolução semanal.
- **[Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/):** Sistema de notificações push/locais.

---

## 🚀 Como executar o projeto

### Pré-requisitos
Antes de começar, você precisará ter o [Node.js](https://nodejs.org/) instalado em sua máquina e o aplicativo **Expo Go** instalado no seu smartphone (disponível para iOS e Android).

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/teuzmat/studybalance.git
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd studybalance
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Inicie o servidor do Expo:**
   ```bash
   npx expo start -c
   ```

5. **Teste no seu celular:**
   - Abra o aplicativo **Expo Go** no seu smartphone.
   - Escaneie o **QR Code** que aparecerá no terminal ou no seu navegador.
   - *Pronto! O aplicativo será carregado na sua tela.*

*(Nota: Para testar no navegador web, basta pressionar "w" no terminal com o servidor rodando).*

---

## 👥 Equipe Desenvolvedora

Este projeto foi idealizado e desenvolvido por:

- **Mateus Cruz**
- **Davi Neves**
- **Pedro Ferreira**
- **Gabriel Lima**

*Projeto Acadêmico - IESB | Análise e Desenvolvimento de Sistemas.*