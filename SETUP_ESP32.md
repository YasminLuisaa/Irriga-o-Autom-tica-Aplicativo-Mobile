# Setup ESP32 - Irrigação Automática

## ✅ Versão SDK
Agora usando **SDK 52.0.0** - Suporta notificações push remotas normalmente.

## 🔧 Configuração ESP32

### IP Configurado
- **IP**: `192.168.0.5`
- **Porta**: `80`
- **URL Base**: `http://192.168.0.5:80`

### Como Conectar ao ESP32 Real

1. **Verificar se modo mock está desabilitado:**
   ```javascript
   // src/services/api.js - linha 13
   const USE_MOCK_DATA = false; // ✅ Deve estar false para ESP32 real
   ```

2. **Certificar que ESP32 está rodando:**
   - Conecte o ESP32 ao WiFi
   - Verifique o IP: `192.168.0.5`
   - Acesse no navegador: `http://192.168.0.5/dados`

3. **Endpoints esperados do ESP32:**
   - `GET /dados` - Retorna dados dos sensores
   - `POST /bomba` - Controlar bomba
   - `POST /config` - Configurar sistema

### Dados esperados de `/dados`:
```json
{
  "sensor1": 2000,
  "sensor1Percent": 50,
  "sensor2": 2500,
  "sensor2Percent": 60,
  "sensor3": 1800,
  "sensor3Percent": 45,
  "media": 2100,
  "mediaPercent": 52,
  "statusSolo": "UMIDO",
  "bombaLigada": false,
  "modoAutomatico": true,
  "limiteSeco": 2957,
  "luminosidade": 75,
  "ip": "192.168.0.5"
}
```

## 🎭 Modo Mock (Para Desenvolvimento)

Se ESP32 não estiver disponível, ative modo mock:

```javascript
// src/services/api.js - linha 13
const USE_MOCK_DATA = true; // Mude para true
```

Gera dados simulados automaticamente para testes.

## 📱 Para Rodar a App

```bash
# Terminal 1 - Iniciar servidor
npm start

# Terminal 2 - Rodar no Android (com dev build)
npm run android

# Ou no Expo Go (SDK 52)
npx expo start
```

## ⚠️ Troubleshooting

### Sensores não recebem dados
- Verificar se `USE_MOCK_DATA = false` 
- Verificar IP do ESP32: `192.168.0.5`
- Testar acesso em navegador: `http://192.168.0.5/dados`

### Notificações não funcionam
- Agora com SDK 52, as notificações locais devem funcionar
- Para notificações push remotas, use dev build

### Conexão recusada
- ESP32 pode estar offline
- Verificar WiFi do dispositivo
- Ativar `USE_MOCK_DATA = true` para testar interface
