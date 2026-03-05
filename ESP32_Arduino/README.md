# 🔧 Código Arduino ESP32

Pasta com o código completo do ESP32 para o sistema de irrigação automática.

## 📝 Arquivos

- **Irrigacao_ESP32.ino** - Código principal do ESP32

## 🚀 Como usar

1. Abra **Arduino IDE**
2. **Arquivo → Abrir → Irrigacao_ESP32.ino**
3. Selecione a board: **ESP32 Dev Module**
4. Configure a porta COM e upload

## 📌 Dependências necessárias

Instale via Arduino IDE:
- ArduinoJson (>= 6.0)
- ESPmDNS

## ⚙️ Configuração

Edite estas linhas com seus dados:
```cpp
const char* ssid = "GuieYas";           // Seu SSID WiFi
const char* password = "guiyas2025";    // Sua senha WiFi
```

## 📡 Endpoints HTTP

- `GET /dados` - Retorna leitura dos sensores
- `POST /bomba` - Controla a bomba (body: `{ligada: bool}`)
- `POST /config` - Configura limites (body: `{limiteSeco, modoAutomatico}`)

## 🔗 Conectar ao App

O app se conecta automaticamente em:
- **IP Local:** 192.168.0.5:80
- **mDNS:** http://irrigacao.local
