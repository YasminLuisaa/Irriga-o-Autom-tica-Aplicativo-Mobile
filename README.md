# 🌿 Irrigação Automática

Aplicativo React Native com Expo para monitoramento e controle automático de sistemas de irrigação, **implementado com todas as 10 Heurísticas de Nielsen** para usabilidade otimizada.

## 📋 Características Principais

### Funcionalidades Core
- ✅ Tela inicial com status de umidade e controle da bomba
- ✅ Monitoramento de múltiplos sensores (S1, S2, S3)
- ✅ Gráfico de histórico de umidade com estatísticas
- ✅ Configurações avançadas do dispositivo
- ✅ Navegação por abas (Bottom Tabs)
- ✅ Design limpo e moderno com tema profissional
- ✅ Dados simulados (prontos para integração com ESP32)

### ✨ Melhorias de Usabilidade (IHC)
- ✅ **Indicador de Conexão** em todas as telas (real-time status)
- ✅ **Confirmações em Ações Críticas** (diálogos elegantes)
- ✅ **Sistema de Toasts** para feedback visual (sucesso/erro/info)
- ✅ **Validação em Tempo Real** com mensagens de erro
- ✅ **Help Modals Contextualizados** em cada tela
- ✅ **Help Tooltips Inline** (ícone "?" para rápida ajuda)
- ✅ **Componentes Acessíveis** com cores semanticamente significativas
- ✅ **Documentação Integrada** explicando cada funcionalidade

## 🎨 Sistema de Design

### Paleta de Cores Profissional
- **Azul (#1E88E5)**: Primário, ações e informações
- **Verde (#43A047)**: Sucesso, solo úmido, conectado
- **Vermelho (#E53935)**: Alerta, solo seco, desconectado
- **Âmbar (#FB8C00)**: Aviso, informações importantes
- **Cinza (#F5F7FA)**: Fundo principal

### Componentes Reutilizáveis
- `Header`: Cabeçalho com ícones em todas as telas
- `SensorCard`: Cartão padronizado para sensores
- `ConnectionStatus`: Indicador de status de conexão
- `ConfirmDialog`: Diálogo de confirmação elegante
- `Toast`: Notificações globais
- `HelpModal`: Modals com documentação contextualizada
- `HelpTooltip`: Tooltips inline para ajuda rápida

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Header.js              # Componente de cabeçalho
│   ├── SensorCard.js          # Componente de cartão de sensor
│   ├── ConfirmDialog.js       # ✨ Diálogo de confirmação
│   ├── ConnectionStatus.js    # ✨ Indicador de conexão
│   ├── Toast.js              # ✨ Sistema de toasts
│   └── Help.js               # ✨ Help modals e tooltips
├── screens/
│   ├── HomeScreen.js          # Tela principal (melhorada)
│   ├── SensoresScreen.js      # Tela de sensores (melhorada)
│   └── ConfigScreen.js        # Tela de configurações (melhorada)
└── styles/
    └── theme.js               # Design system
App.js                         # Navegação com Toast global
package.json                   # Dependências
app.json                       # Configuração Expo
MELHORIAS_IHC.md              # ✨ Documento detalhado de IHC
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v16+)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)

### Instalação

```bash
# 1. Navegue até o diretório do projeto
cd "path/to/Irrigacao"

# 2. Instale as dependências
npm install

# 3. Inicie o servidor Expo
npm start
```

### Teste no Simulador

- **iOS**: Pressione `i` no terminal
- **Android**: Pressione `a` no terminal
- **Web**: Pressione `w` no terminal

Ou use o aplicativo **Expo Go** no seu telefone e escaneie o código QR exibido.

## 📱 Telas Disponíveis

### 🏠 Home
- Exibe umidade média simulada
### 🏠 Home Screen
- Status de umidade com card destacado
- Indicador de conexão com status em tempo real
- Botão grande de controle de bomba com confirmação
- Sensores adicionais (temperatura, luminosidade)
- Último update timestamp
- **Novo**: Confirmação elegante antes de ligar/desligar
- **Novo**: Help tooltip explicando métricas

### 💧 Sensores Screen
- Cartões individuais para cada sensor (S1, S2, S3)
- Leituras em tempo real com cores semânticas
- Média geral dos sensores
- Barra de progresso visual
- **Novo**: Indicador de conexão
- **Novo**: Help modal com 3 seções contextualizadas
- **Novo**: Info box melhorada com legenda

### 📊 Histórico Screen
- Gráfico de umidade ao longo do tempo com gradiente
- Filtros por período (24h, semana, mês)
- Estatísticas completas (máxima, mínima, média, irrigações)
- **Novo**: Indicador de conexão
- **Novo**: Help tooltip nos filtros
- **Novo**: Help modal explicando interpretação de dados

### ⚙️ Configurações Screen
- Nome do dispositivo com validação
- Modo automático/manual (toggle com feedback)
- Intervalo de leitura (5s, 10s, 30s, 60s)
- Limites de umidade com validação cruzada
- Alertas sonoros (toggle)
- Informações do sistema (versão, plataforma, sincronismo)
- **Novo**: Validação em tempo real com feedback visual
- **Novo**: Banner de erro quando há problema de validação
- **Novo**: Help tooltips em cada seção
- **Novo**: Confirmação elegante antes de salvar
- **Novo**: Toast confirmando sucesso

## ✨ Implementação das 10 Heurísticas de Nielsen

Todas as 10 heurísticas de Nielsen foram implementadas diretamente no código:

| # | Heurística | Implementação |
|---|-----------|---|
| 1 | Visibilidade | Indicador de conexão em todas as telas + timestamps |
| 2 | Compatibilidade | Português completo, termos claros, convenções locais |
| 3 | Liberdade | Confirmações em ações críticas, navegação livre |
| 4 | Consistência | Design system unificado, componentes reutilizáveis |
| 5 | Prevenção | Validação em tempo real, confirmações antes de ações |
| 6 | Reconhecimento | Ícones significativos, rótulos explícitos, descrições |
| 7 | Flexibilidade | Modo automático/manual, configs customizáveis |
| 8 | Estética | Design minimalista, hierarquia visual clara |
| 9 | Recuperação | Toasts de sucesso/erro, mensagens de validação |
| 10 | Ajuda | Help modals contextualizados + tooltips inline |

📖 Veja [MELHORIAS_IHC.md](MELHORIAS_IHC.md) para detalhes completos.

## 🔧 Dependências

```json
{
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/bottom-tabs": "^6.5.11",
  "@react-navigation/stack": "^6.3.20",
  "@expo/vector-icons": "^14.0.0",
  "react-native-chart-kit": "^6.12.0",
  "react-native-svg": "15.0.0",
  "react-native-safe-area-context": "4.10.5",
  "react-native-screens": "~3.31.1"
}
```

## 🔌 Próximas Integrações

Quando o ESP32 estiver disponível:

1. **Conexão ESP32**: Configure a comunicação via REST API ou WebSocket
2. **Controle em Tempo Real**: Atualize o status e controle da bomba
3. **Autenticação**: Implemente login de usuários (opcional)

## 📝 Notas

- Os dados exibidos são **simulados** para desenvolvimento
- O aplicativo está pronto para substituição com dados reais
- Interface responsiva para diferentes tamanhos de tela
- Navegação intuitiva com ícones

## 📄 Licença

Este projeto é fornecido como está para fins educacionais.

## 👨‍💻 Desenvolvido com

- React Native
- Expo
- React Navigation
- Expo Vector Icons

---

**Status**: ✅ Pronto para desenvolvimento | ⏳ Aguardando integração com ESP32
