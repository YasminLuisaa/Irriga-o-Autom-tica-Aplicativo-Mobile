# Avaliação de Usabilidade Baseada nas Heurísticas de Nielsen: Aplicativo Irrigação Automática

---

## 1. INTRODUÇÃO

A Interação Humano-Computador (IHC) constitui um campo fundamental para o desenvolvimento de sistemas computacionais eficazes e satisfatórios. A usabilidade, como atributo central da IHC, determina a facilidade com que usuários interagem com interfaces digitais, impactando diretamente na adoção e efetividade das aplicações (Norman, 2013).

O aplicativo "Irrigação Automática" apresenta-se como uma solução móvel desenvolvida em React Native com Expo SDK 54, direcionada ao monitoramento e controle de sistemas de irrigação em ambientes agrícolas e horticulturas. A interface compreende quatro telas principais organizadas em abas inferiores: HomeScreen (painel principal), SensoresScreen (leituras individuais), HistoricoScreen (análise histórica) e ConfigScreen (configurações do sistema).

A presente avaliação objetiva examinar a conformidade da aplicação com os princípios consagrados de usabilidade, identificando potencialidades e lacunas na experiência do usuário. Utiliza-se como framework metodológico as 10 Heurísticas de Usabilidade de Jakob Nielsen, que constituem um conjunto de diretrizes amplamente reconhecidas na literatura de IHC para avaliação qualitativa de interfaces (Nielsen, 1994).

---

## 2. METODOLOGIA

### 2.1 Abordagem Avaliativa

Empregou-se a **Avaliação Heurística de Nielsen (1994)**, método inspeção de usabilidade não-automático que permite identificar problemas de usabilidade através da análise sistemática da interface por especialistas. Esta abordagem mostra-se particularmente adequada para aplicações em fase de prototipagem ou iterativa, possibilitando correções antes da disponibilização aos usuários finais.

### 2.2 Critérios de Avaliação

A análise baseou-se nas **10 Heurísticas de Usabilidade de Nielsen (Nielsen, 1994)**, diretrizes estabelecidas para avaliar a qualidade da interação em interfaces de usuário. As heurísticas são descritas a seguir conforme suas definições originais:

**1. Visibilidade do Status do Sistema** (_Visibility of System Status_)

O sistema deve manter os usuários sempre informados sobre o que está acontecendo, fornecendo feedback em tempo real, apropriado e oportuno. A comunicação entre sistema e usuário deve ser clara, utilizando linguagem do usuário e mantendo informações relevantes visíveis.

**2. Correspondência entre o Sistema e o Mundo Real** (_Match Between System and the Real World_)

O sistema deve falar a linguagem do usuário, com palavras, frases e conceitos familiares. Deve-se evitar terminologia orientada para o sistema em favor de convenções do mundo real. Informações devem estar organizadas de forma lógica e natural, seguindo a correspondência esperada pelo usuário.

**3. Controle e Liberdade do Usuário** (_User Control and Freedom_)

Usuários frequentemente executam funções por engano e necessitam de "saídas de emergência" claramente marcadas para sair de situações indesejadas. O sistema deve oferecer funcionalidades de desfazer (_undo_) e refazer (_redo_), permitindo ao usuário manter o controle e não se sentir aprisionado.

**4. Consistência e Padrões** (_Consistency and Standards_)

Os usuários não devem questionar-se se palavras, situações ou ações diferentes significam a mesma coisa. Convenções estabelecidas devem ser seguidas consistentemente ao longo da interface, garantindo previsibilidade e compreensão imediata dos elementos de interação.

**5. Prevenção de Erros** (_Error Prevention_)

Melhor do que possuir boas mensagens de erro é evitar o surgimento de problemas. O sistema deve eliminar condições propensas a erros ou apresentar confirmações antes de ações críticas. Devem-se implementar restrições que impeçam situações problemáticas.

**6. Reconhecimento em vez de Memorização** (_Recognition Rather Than Recall_)

Objetos, ações e opções devem estar visíveis e facilmente recuperáveis. O usuário não deve ser obrigado a memorizar informações de uma parte da interface para utilizar outra. Instruções de uso devem estar visíveis ou facilmente acessíveis quando necessário.

**7. Flexibilidade e Eficiência de Uso** (_Flexibility and Efficiency of Use_)

O sistema deve atender tanto usuários novatos quanto experientes. Devem-se fornecer atalhos, personalizações e aceleradores que permitam aos usuários frequentes realizar tarefas mais rapidamente. Sequências comuns devem poder ser customizadas.

**8. Design Estético e Minimalista** (_Aesthetic and Minimalist Design_)

As interfaces não devem conter informações irrelevantes ou raramente necessárias. O design deve focar-se nas funcionalidades essenciais, eliminando elementos desnecessários que compitam pela atenção do usuário e diminuam a clareza da comunicação.

**9. Ajuda aos Usuários para Reconhecer, Diagnosticar e Recuperar de Erros** (_Help Users Recognize, Diagnose, and Recover From Errors_)

Mensagens de erro devem ser expressas em linguagem clara (sem códigos), devem indicar o problema com precisão e sugerir construtivamente uma solução. O tom deve ser respeitoso e nunca acusatório.

**10. Ajuda e Documentação** (_Help and Documentation_)

Deve ser fácil procurar tarefas específicas, passos concretos a seguir e recuperar-se de dificuldades. A documentação deve ser prática, focada nas atividades do usuário, concisa e não extensa. Linguagem técnica deve ser evitada em favor de linguagem acessível.

### 2.3 Escala de Avaliação

Utilizou-se escala Likert de 5 pontos para mensuração da conformidade de cada heurística por tela:

- **1**: Não conformidade (grave problema de usabilidade)
- **2**: Conformidade inadequada (problemas significativos)
- **3**: Conformidade moderada (alguns pontos positivos e negativos)
- **4**: Boa conformidade (alinhamento com a heurística, com aspectos menores a melhorar)
- **5**: Conformidade excelente (implementação exemplar)

**Nota:** Todas as heurísticas são referenciadas tanto em português quanto em inglês, seguindo a nomenclatura padrão original de Nielsen (1994) para fins de conformidade acadêmica internacional.

---

## 3. ANÁLISE DETALHADA POR TELA

### 3.1 HomeScreen – Painel Principal

#### 3.1.1 Descrição da Interface

A HomeScreen funciona como ponto de entrada central da aplicação, apresentando informações agregadas do sistema de irrigação. Seus elementos constituintes incluem:

- **Header**: Título "Irrigação 💧" com subtítulo "Sistema de Monitoramento" em gradiente azul
- **Umidade Card**: Exibe percentual central (65%) com ícone de gota, cores dinâmicas (verde se úmido, vermelho se seco)
- **Status Card**: Indicador de condição do solo com badge colorido (ÚMIDO/SECO)
- **Pump Control Button**: Botão com ícone de bomba para ativação/desativação, com feedback visual (cor alterada conforme estado)
- **Additional Sensors**: Seção que lista temperatura e luminosidade
- **Footer**: Timestamp "Última atualização: 14:35" que se atualiza automaticamente

#### 3.1.2 Avaliação Heurística

**Heurística 1 - Visibilidade do Status do Sistema** (_Visibility of System Status_) | **Pontuação: 5/5**

*Conformidade:* Excelente. O sistema proporciona feedback contínuo e imediato através de:
- Atualização automática do timestamp (a cada 60 segundos)
- Mudança dinâmica de cores conforme estado da umidade
- Indicador visual claro do status da bomba (botão ativo/inativo)
- Seção footer claramente comunicando último sincronismo

*Observação:* A implementação está alinhada com os padrões de feedback em tempo real esperados em aplicações de monitoramento.

---

**Heurística 2 - Correspondência entre Sistema e Mundo Real** (_Match Between System and the Real World_) | **Pontuação: 4/5**

*Conformidade:* Boa. A interface utiliza metáforas visuais intuitivas:
- Ícone de gota para umidade (metáfora natural)
- Ícone de bomba para controle de irrigação
- Cores associadas a estados naturais (verde = úmido, vermelho = seco)

*Negativos:* A seção de sensores adicionais (temperatura/luminosidade) menciona valores sem unidades na descrição, o que reduz a clareza semântica.

*Sugestão de Melhoria:* Adicionar unidades de medida ("°C" para temperatura, "lux" para luminosidade) em toda exibição de dados.

---

**Heurística 3 - Controle e Liberdade do Usuário** (_User Control and Freedom_) | **Pontuação: 3/5**

*Conformidade:* Moderada. O usuário possui controle direto sobre a ação crítica (bomba), porém:
- Não há confirmação antes de ativar/desativar a bomba em modo manual
- Não há opção para "desfazer" ações recentes
- Navegação entre telas é restrita a tabs inferiores, sem opção de retorno customizado

*Negativos:* Ativar a bomba sem confirmação pode resultar em desperdício de água ou danos ao sistema se o usuário agir por engano.

*Sugestão de Melhoria:* Implementar diálogo de confirmação para ações críticas ("Deseja ativar a bomba? Esta ação pode consumir água.").

---

**Heurística 4 - Consistência e Padrões** (_Consistency and Standards_) | **Pontuação: 5/5**

*Conformidade:* Excelente. A interface mantém consistência sistemática:
- Padrão de cor (verde/vermelho/azul) aplicado uniformemente
- Estrutura visual idêntica em cards (padding, border-radius, sombras)
- Headers em todas as telas seguem o mesmo padrão visual
- Uso consistente de MaterialCommunityIcons

*Observação:* Componentes reutilizáveis (Header, SensorCard) garantem coesão visual robusta.

---

**Heurística 5 - Prevenção de Erros** (_Error Prevention_) | **Pontuação: 3/5**

*Conformidade:* Moderada. Existem protocolos preventivos limitados:
- Validação de entrada não evidenciada na interface
- Ausência de confirmação em ações críticas (ativar bomba)
- Limites operacionais (ex: máximo de leituras por dia) não são comunicados

*Negativos:* Usuário pode inadvertidamente deixar bomba ativa por períodos prolongados em modo manual.

*Sugestão de Melhoria:* Adicionar timer visual que indique há quanto tempo a bomba está ligada, com aviso se exceder período crítico (ex: 2 horas).

---

**Heurística 6 - Reconhecimento em vez de Memorização** (_Recognition Rather Than Recall_) | **Pontuação: 4/5**

*Conformidade:* Boa. Todos os elementos possuem representação visual clara:
- Ícones indicam claramente funcionalidades (gota, bomba, relógio)
- Badges coloridas identificam estado sem necessidade de leitura textual
- Labels descritivos presentes para cada seção

*Negativos:* Significado de cores não é explicitado na tela; usuário deve memorizar convenção (verde = úmido, vermelho = seco).

*Sugestão de Melhoria:* Incluir legenda visual mínima ou tooltip ao primeiro acesso explicando código de cores.

---

**Heurística 7 - Flexibilidade e Eficiência de Uso** (_Flexibility and Efficiency of Use_) | **Pontuação: 3/5**

*Conformidade:* Moderada. Funcionalidades principais são acessíveis diretamente, porém:
- Não há atalhos ou gestos customizados para usuários avançados
- Botão de bomba leva um toque; sem opções de acesso rápido (ex: long-press para modo manual rápido)
- Todas as configurações requerem navegação até ConfigScreen

*Sugestão de Melhoria:* Implementar long-press no botão de bomba para exibir menu de ações rápidas (ativar por 15 min, 30 min, 1 hora).

---

**Heurística 8 - Design Estético e Minimalista** (_Aesthetic and Minimalist Design_) | **Pontuação: 5/5**

*Conformidade:* Excelente. Design minimalista bem executado:
- Uso seletivo de cores (paleta limitada a 4 cores principais)
- Espaçamento adequado entre elementos (visual breathing room)
- Ausência de elementos visuais desnecessários
- Tipografia clara com hierarquia bem definida
- Ícones como substitutos a texto excessivo

*Observação:* A escolha de degradês suaves (azul claro) reforça profissionalismo e acessibilidade.

---

**Heurística 9 - Ajuda aos Usuários para Reconhecer, Diagnosticar e Recuperar de Erros** (_Help Users Recognize, Diagnose, and Recover From Errors_) | **Pontuação: 2/5**

*Conformidade:* Inadequada. Praticamente não há tratamento de erros visível:
- Sem mensagens de erro observáveis na interface
- Sem validação de entrada comunicada ao usuário
- Sem recuperação de falhas (ex: perda de conexão não é indicada)

*Negativos:* Se sensor falhar ou perder conexão, usuário não é notificado, podendo tomar decisões baseado em dados obsoletos.

*Sugestão de Melhoria:* Adicionar indicador de status de conexão (ícone WiFi/nuvem com cor indicando conectado/desconectado) na header. Exibir toasts informativos em caso de falha de sincronismo.

---

**Heurística 10 - Ajuda e Documentação** (_Help and Documentation_) | **Pontuação: 1/5**

*Conformidade:* Não conformidade. Ausência total de suporte ao usuário:
- Sem tutoriais ou guias iniciais (onboarding)
- Sem botão de ajuda ou FAQ dentro da aplicação
- Sem documentação acessível sobre funcionamento do sistema

*Negativos:* Usuários novos podem não entender funcionamento do sistema ou significado de métricas.

*Sugestão de Melhoria:* Implementar:
  - Modal de boas-vindas na primeira abertura
  - Ícone "?" que exibe dica contextual ao tocar elementos principais
  - Seção "Ajuda" na ConfigScreen com FAQ e glossário

---

#### 3.1.3 Resumo HomeScreen

| Heurística | Nomenclatura EN | Pontuação | Status |
|-----------|---------|-----------|--------|
| Visibilidade do Status | Visibility of System Status | 5/5 | ✅ Excelente |
| Correspondência | Match Between System and the Real World | 4/5 | ✅ Boa |
| Controle e Liberdade | User Control and Freedom | 3/5 | ⚠️ Moderada |
| Consistência | Consistency and Standards | 5/5 | ✅ Excelente |
| Prevenção de Erros | Error Prevention | 3/5 | ⚠️ Moderada |
| Reconhecimento | Recognition Rather Than Recall | 4/5 | ✅ Boa |
| Flexibilidade | Flexibility and Efficiency of Use | 3/5 | ⚠️ Moderada |
| Design Estético | Aesthetic and Minimalist Design | 5/5 | ✅ Excelente |
| Ajuda em Erros | Help Users Recognize, Diagnose, Recover From Errors | 2/5 | ❌ Inadequada |
| Ajuda e Documentação | Help and Documentation | 1/5 | ❌ Crítica |

**Pontuação Média: 3.4/5**

---

### 3.2 SensoresScreen – Leituras Individuais

#### 3.2.1 Descrição da Interface

A SensoresScreen fornece visualização detalhada das leituras de três sensores de umidade do solo (YL-69). Componentes principais:

- **Header**: Título "Sensores 💧" com subtítulo descritivo
- **Sensor Cards Grid**: Três cards dispostos verticalmente, cada um contendo:
  - Ícone de sensor
  - Nome do sensor ("Sensor 1", "Sensor 2", "Sensor 3")
  - Percentual de umidade (valores entre 20-90%)
  - Progress bar visual representando percentual
  - Badge de status colorido (verde/vermelho)
- **Average Card**: Card destacado exibindo média calculada de todos sensores (média = 65%)
- **Info Box**: Caixa informativa explicando que verde = solo úmido, vermelho = solo seco
- **Auto-refresh**: Leituras atualizam automaticamente a cada 5 segundos

#### 3.2.2 Avaliação Heurística

**Heurística 1 - Visibilidade do Status do Sistema** (_Visibility of System Status_) | **Pontuação: 4/5**

*Conformidade:* Boa. Sistema comunica estado continuamente:
- Progress bars atualizadas em tempo real
- Badges coloridas indicam instantaneamente condição
- Média é recalculada automaticamente
- Ausência de indicador de tempo (quando foi última atualização)

*Negativos:* Não há timestamp explícito indicando quando os dados foram coletados.

*Sugestão de Melhoria:* Adicionar timestamp discreto na header: "Atualizado: 14:35:20".

---

**Heurística 2 - Correspondência entre Sistema e Mundo Real** (_Match Between System and the Real World_) | **Pontuação: 5/5**

*Conformidade:* Excelente. Interface utiliza metáforas naturais:
- Progress bars (representação visual familiar)
- Cores naturais (verde = molhado, vermelho = seco)
- Ícones de gota evocam água/umidade
- Número dos sensores reflete convenção (Sensor 1, 2, 3)

*Observação:* Linguagem clara e direta, sem jargão técnico desnecessário.

---

**Heurística 3 - Controle e Liberdade do Usuário** (_User Control and Freedom_) | **Pontuação: 4/5**

*Conformidade:* Boa. Usuário possui controle adequado:
- Tela é principalmente informativa (leitura-only)
- Capacidade de navegar para outras abas conforme necessário
- Não há ações irreversíveis nesta tela

*Negativos:* Sem opções de filtro ou seleção de sensores específicos a monitorar.

*Sugestão de Melhoria:* Adicionar opção de "recarregar agora" (botão com ícone refresh) para forçar sincronismo imediato se usuário deseja dado atualizado.

---

**Heurística 4 - Consistência e Padrões** (_Consistency and Standards_) | **Pontuação: 5/5**

*Conformidade:* Excelente. Padrões visuais consistentes com HomeScreen:
- Mesma paleta de cores
- Mesmo sistema de cards
- Ícones são consistentes
- Layout hierárquico familiar
- Progress bars utilizam estilo uniforme

---

**Heurística 5 - Prevenção de Erros** (_Error Prevention_) | **Pontuação: 4/5**

*Conformidade:* Boa. Tela é principalmente leitura, reduzindo risco de erros:
- Sem inputs do usuário que possam gerar erros
- Validação de dados automática (valores limitados a 0-100%)
- Feedback visual de dados inválidos seria óbvio (valor fora do intervalo esperado)

*Negativos:* Se sensor falhar, não há indicação de dado obsoleto ou inválido.

*Sugestão de Melhoria:* Adicionar ícone "⚠️" sutil ao sensor se dados tiverem mais de 10 minutos sem atualização.

---

**Heurística 6 - Reconhecimento em vez de Memorização** (_Recognition Rather Than Recall_) | **Pontuação: 5/5**

*Conformidade:* Excelente. Todos os dados estão visualmente presentes:
- Valores numéricos explícitos
- Representação visual (progress bar) reforça compreensão
- Cores e ícones deixam estado imediatamente claro
- Info box explica significado de cores

---

**Heurística 7 - Flexibilidade e Eficiência de Uso** (_Flexibility and Efficiency of Use_) | **Pontuação: 2/5**

*Conformidade:* Inadequada. Funcionalidades avançadas são inexistentes:
- Sem modo gráfico agregado (todos mostrados em cards individuais)
- Sem opções de exportação de dados
- Sem comparação entre sensores
- Sem alertas customizáveis por sensor

*Sugestão de Melhoria:* Implementar:
  - Ícone de "comparar" para mostrar gráfico comparativo dos 3 sensores lado a lado
  - Deslizar para esquerda em card de sensor para acessar histórico individual
  - Botão de "configurar limites" para definir alertas por sensor

---

**Heurística 8 - Design Estético e Minimalista** (_Aesthetic and Minimalist Design_) | **Pontuação: 5/5**

*Conformidade:* Excelente. Design altamente minimalista:
- Grid layout clean (3 cards com espaçamento uniforme)
- Average card se destaca sem poluição visual
- Info box é sutil mas presente
- Animações de atualização suaves (não distraem)

---

**Heurística 9 - Ajuda aos Usuários para Reconhecer, Diagnosticar e Recuperar de Erros** (_Help Users Recognize, Diagnose, and Recover From Errors_) | **Pontuação: 2/5**

*Conformidade:* Inadequada. Sem tratamento de erros observável:
- Se sensor falhar, nenhuma indicação é mostrada
- Sem mensagens sobre dados obsoletos
- Info box explica cores mas não cobre cenários de erro

*Sugestão de Melhoria:* 
  - Exibir "⚠️ Sem dados" em card de sensor se sincronismo falhar
  - Adicionar tooltip ao ícone que diz "Último sincronismo: há 2 minutos"

---

**Heurística 10 - Ajuda e Documentação** (_Help and Documentation_) | **Pontuação: 2/5**

*Conformidade:* Inadequada. Mínima documentação:
- Info box sobre cores é mínima
- Sem explicação sobre o que YL-69 é
- Sem guia sobre como calibrar sensores

*Sugestão de Melhoria:* 
  - Adicionar ícone "i" que exibe tooltip: "YL-69: Sensor capacitivo de umidade do solo. Valores 0-100%"
  - Link para documentação sobre manutenção de sensores

---

#### 3.2.3 Resumo SensoresScreen

| Heurística | Nomenclatura EN | Pontuação | Status |
|-----------|---------|-----------|--------|
| Visibilidade do Status | Visibility of System Status | 4/5 | ✅ Boa |
| Correspondência | Match Between System and the Real World | 5/5 | ✅ Excelente |
| Controle e Liberdade | User Control and Freedom | 4/5 | ✅ Boa |
| Consistência | Consistency and Standards | 5/5 | ✅ Excelente |
| Prevenção de Erros | Error Prevention | 4/5 | ✅ Boa |
| Reconhecimento | Recognition Rather Than Recall | 5/5 | ✅ Excelente |
| Flexibilidade | Flexibility and Efficiency of Use | 2/5 | ❌ Inadequada |
| Design Estético | Aesthetic and Minimalist Design | 5/5 | ✅ Excelente |
| Ajuda em Erros | Help Users Recognize, Diagnose, Recover From Errors | 2/5 | ❌ Inadequada |
| Ajuda e Documentação | Help and Documentation | 2/5 | ❌ Inadequada |

**Pontuação Média: 3.8/5**

---

### 3.3 HistoricoScreen – Análise Histórica

#### 3.3.1 Descrição da Interface

A HistoricoScreen apresenta análise temporal de dados de umidade através de visualização gráfica e estatística. Componentes:

- **Header**: Título "Histórico 📊" com subtítulo
- **Filter Buttons**: Três botões interativos para seleção de período:
  - "Últimas 24h" (ícone relógio)
  - "Última Semana" (ícone calendário semana)
  - "Último Mês" (ícone calendário mês)
  - Botão ativo é destacado em azul
- **LineChart**: Gráfico de linhas com bezier curves mostrando evolução de umidade
  - Eixo Y: percentual (0-100%)
  - Eixo X: período temporal conforme filtro selecionado
  - Gradiente de preenchimento (azul suave)
  - Legenda colorida
- **Statistics Grid**: 4 cards em layout 2x2 exibindo:
  - Máxima umidade atingida
  - Mínima umidade atingida
  - Média de umidade
  - Número de ciclos de irrigação

#### 3.3.2 Avaliação Heurística

**Heurística 1 - Visibilidade do Status do Sistema** (_Visibility of System Status_) | **Pontuação: 5/5**

*Conformidade:* Excelente. Sistema comunica historicamente estado:
- Gráfico proporciona visibilidade clara de tendências
- Cards estatísticos sintetizam informações
- Mudança de filtro atualiza instantaneamente a visualização
- Cores no gráfico facilitam rastreamento de valores

*Observação:* Implementação exemplar de visualização de estado histórico.

---

**Heurística 2 - Correspondência entre Sistema e Mundo Real** (_Match Between System and the Real World_) | **Pontuação: 4/5**

*Conformidade:* Boa. Convenções de visualização são familiares:
- Gráfico de linhas é padrão industrial para séries temporais
- Terminologia simples ("últimas 24h", "última semana")
- Ícones de calendário/relógio são reconhecíveis

*Negativos:* Estatística de "irrigações" é abstrata; usuário pode não compreender plenamente sua definição (quantas mudanças de 40% a 75%?).

*Sugestão de Melhoria:* Adicionar tooltip ao card "Irrigações" explicando: "Número de ciclos completos (solo seco → molhado)".

---

**Heurística 3 - Controle e Liberdade do Usuário** (_User Control and Freedom_) | **Pontuação: 5/5**

*Conformidade:* Excelente. Usuário possui controle flexível:
- Três opções de filtro claramente apresentadas
- Mudança de período é imediata e reversível
- Navegação entre abas é fluida
- Nenhuma ação é irreversível

---

**Heurística 4 - Consistência e Padrões** (_Consistency and Standards_) | **Pontuação: 5/5**

*Conformidade:* Excelente. Coerência visual mantida:
- Paleta de cores consistente
- Estilo de botões alinhado com resto da aplicação
- Cards de estatística seguem padrão estabelecido
- Ícones são do mesmo conjunto

---

**Heurística 5 - Prevenção de Erros** (_Error Prevention_) | **Pontuação: 4/5**

*Conformidade:* Boa. Interface reduz risco de erro:
- Seleção de período é clara (botões mutuamente exclusivos)
- Dados são apenas leitura (sem possibilidade de edição errônea)
- Validação de dados ocorre automaticamente

*Negativos:* Se gráfico não carregar (falha de sincronismo), não há mensagem de erro.

*Sugestão de Melhoria:* Exibir mensagem "Carregando dados..." durante busca e "Falha ao carregar dados do período" se erro ocorrer.

---

**Heurística 6 - Reconhecimento em vez de Memorização** (_Recognition Rather Than Recall_) | **Pontuação: 5/5**

*Conformidade:* Excelente. Todos os dados estão imediatamente acessíveis:
- Botões de filtro são claramente identificados
- Gráfico proporciona representação visual intuitiva
- Cards estatísticos nomeados explicitamente
- Cores e ícones reforçam compreensão

---

**Heurística 7 - Flexibilidade e Eficiência de Uso** (_Flexibility and Efficiency of Use_) | **Pontuação: 3/5**

*Conformidade:* Moderada. Funcionalidades básicas estão presentes, porém:
- Sem opção de exportar dados ou gráfico
- Sem modo de comparação entre períodos
- Sem capacidade de definir intervalo customizado (apenas 24h/semana/mês)
- Sem zoom ou detalhamento do gráfico

*Sugestão de Melhoria:*
  - Adicionar ícone de compartilhamento/exportação
  - Permitir seleção customizada de datas (data picker)
  - Implementar gesture de pinch-to-zoom no gráfico

---

**Heurística 8 - Design Estético e Minimalista** (_Aesthetic and Minimalist Design_) | **Pontuação: 4/5**

*Conformidade:* Boa. Design limpo com informações essenciais:
- Gráfico ocupa espaço apropriado sem poluição
- Cards estatísticos bem organizados
- Legenda é discreta

*Negativos:* Gráfico poderia beneficiar-se de linhas de grade suaves para auxiliar leitura de valores.

*Sugestão de Melhoria:* Adicionar grid horizontal sutil (opacidade 0.1) ao fundo do gráfico para facilitar leitura de valores precisos.

---

**Heurística 9 - Ajuda aos Usuários para Reconhecer, Diagnosticar e Recuperar de Erros** (_Help Users Recognize, Diagnose, and Recover From Errors_) | **Pontuação: 2/5**

*Conformidade:* Inadequada. Tratamento de erros não implementado:
- Sem mensagens sobre falha de carregamento
- Sem indicação de dados obsoletos
- Sem sugestões de ação em caso de período vazio

*Sugestão de Melhoria:*
  - Toast "Falha ao carregar dados. Verifique sua conexão."
  - Placeholder: "Nenhum dado disponível para este período"

---

**Heurística 10 - Ajuda e Documentação** (_Help and Documentation_) | **Pontuação: 1/5**

*Conformidade:* Não conformidade. Ausência de suporte educativo:
- Sem explicação sobre o que cada estatística representa
- Sem documentação sobre interpretação do gráfico
- Sem guia sobre como usar a análise histórica para melhorar irrigação

*Sugestão de Melhoria:*
  - Adicionar ícone "i" com tooltip: "Máx: valor mais alto de umidade neste período"
  - Seção "Insights" sugerindo ações baseadas em padrões (ex: "Padrão irregular detectado - considere verificar sensores")

---

#### 3.3.3 Resumo HistoricoScreen

| Heurística | Nomenclatura EN | Pontuação | Status |
|-----------|---------|-----------|--------|
| Visibilidade do Status | Visibility of System Status | 5/5 | ✅ Excelente |
| Correspondência | Match Between System and the Real World | 4/5 | ✅ Boa |
| Controle e Liberdade | User Control and Freedom | 5/5 | ✅ Excelente |
| Consistência | Consistency and Standards | 5/5 | ✅ Excelente |
| Prevenção de Erros | Error Prevention | 4/5 | ✅ Boa |
| Reconhecimento | Recognition Rather Than Recall | 5/5 | ✅ Excelente |
| Flexibilidade | Flexibility and Efficiency of Use | 3/5 | ⚠️ Moderada |
| Design Estético | Aesthetic and Minimalist Design | 4/5 | ✅ Boa |
| Ajuda em Erros | Help Users Recognize, Diagnose, Recover From Errors | 2/5 | ❌ Inadequada |
| Ajuda e Documentação | Help and Documentation | 1/5 | ❌ Crítica |

**Pontuação Média: 3.8/5**

---

### 3.4 ConfigScreen – Configurações do Sistema

#### 3.4.1 Descrição da Interface

A ConfigScreen permite personalização e ajuste dos parâmetros operacionais do sistema. Componentes principais:

- **Header**: Título "Configurações ⚙️" com subtítulo
- **Dispositivo Section**:
  - Campo de texto para nome do dispositivo
  - Texto descritivo explicando propósito
- **Modo de Operação Section**:
  - Toggle switch (Automático/Manual)
  - Status badge colorido (🔵 Automático, 🔴 Manual)
  - Descrição de cada modo
  - Aviso condicional em modo manual
- **Notificações Section**:
  - Toggle switch para alertas sonoros
  - Ícone dinâmico (alto-falante/mudo)
- **Intervalo de Leitura Section**:
  - Quatro botões: 5s, 10s, 30s, 60s
  - Botão ativo destacado em azul
  - Descrição explicando função
- **Limites de Umidade Section**:
  - Input para limite mínimo (40%)
  - Input para limite máximo (75%)
  - Descrição de quando bomba ativa/desativa
- **Save Button**: Botão destacado para salvar configurações
- **System Info Section**: Cards mostrando versão, plataforma, último sincronismo

#### 3.4.2 Avaliação Heurística

**Heurística 1 - Visibilidade do Status do Sistema** (_Visibility of System Status_) | **Pontuação: 5/5**

*Conformidade:* Excelente. Configurações atuais são claramente visíveis:
- Toggles mostram estado atual (ativado/desativado)
- Botão de intervalo ativo é destacado
- Campos de entrada exibem valores atuais
- Status badge indica modo operacional
- Info section fornece visibilidade de versão e sincronismo

---

**Heurística 2 - Correspondência entre Sistema e Mundo Real** (_Match Between System and the Real World_) | **Pontuação: 4/5**

*Conformidade:* Boa. Terminologia é familiar:
- "Modo Automático" e "Manual" são conceitos compreensíveis
- "Alertas Sonoros" é intuitivo
- Unidades de tempo (segundos) são diretas
- Percentuais para umidade são convenção industrial

*Negativos:* Campo "Limite Mínimo" e "Limite Máximo" poderia ser mais específico ("Umidade Mínima para Ativar Bomba").

*Sugestão de Melhoria:* Expandir labels: "Limite Mínimo (Bomba Liga)" e "Limite Máximo (Bomba Desliga)".

---

**Heurística 3 - Controle e Liberdade do Usuário** (_User Control and Freedom_) | **Pontuação: 4/5**

*Conformidade:* Boa. Usuário possui controle completo sobre configurações:
- Alterações podem ser desfeitas alterando toggle/campo novamente
- Botão salvar permite confirmar mudanças
- Alterações não são aplicadas automaticamente (sem "salvar", mudança pode ser revertida)

*Negativos:* Sem opção "descartar mudanças" explícita; se usuário navega para outro tab, mudanças não salvas são perdidas sem confirmação.

*Sugestão de Melhoria:* Exibir aviso se usuário tentar navegar com mudanças não salvas: "Mudanças não foram salvas. Deseja descartar?".

---

**Heurística 4 - Consistência e Padrões** (_Consistency and Standards_) | **Pontuação: 5/5**

*Conformidade:* Excelente. Padrões mantidos rigorosamente:
- Toggles visuais idênticos em toda a tela
- Botões de intervalo seguem mesmo estilo dos filtros em HistoricoScreen
- Cards utilizam mesmo padrão visual
- Ícones são consistentes
- Paleta de cores uniforme

---

**Heurística 5 - Prevenção de Erros** (_Error Prevention_) | **Pontuação: 3/5**

*Conformidade:* Moderada. Algumas salvaguardas implementadas:
- Campos numéricos (intervalo, limites) aceitam apenas números
- Máximo de caracteres pode estar limitado (não evidenciado)

*Negativos:*
  - Sem validação de limites (ex: limite máximo < limite mínimo)
  - Sem confirmação ao salvar (pode ser acionado por engano)
  - Sem aviso se valores estão fora de intervalo recomendado (ex: intervalo de 1 segundo é impraticável)

*Sugestão de Melhoria:*
  - Validação: "Limite Máximo deve ser maior que Limite Mínimo"
  - Diálogo de confirmação: "Salvar estas configurações? Esta ação não pode ser desfeita."
  - Aviso para valores extremos: "⚠️ Intervalo de 1s pode causar consumo excessivo de energia"

---

**Heurística 6 - Reconhecimento em vez de Memorização** (_Recognition Rather Than Recall_) | **Pontuação: 4/5**

*Conformidade:* Boa. Configurações atuais são imediatamente visíveis:
- Labels descritivos para cada opção
- Valores atuais mostrados em campos/toggles
- Ícones reforçam significado

*Negativos:* Unidades não são sempre explícitas (ex: percentual em limites está implícito).

*Sugestão de Melhoria:* Adicionar unidades explicitamente: input mostraria "40 %" em vez de apenas "40".

---

**Heurística 7 - Flexibilidade e Eficiência de Uso** (_Flexibility and Efficiency of Use_) | **Pontuação: 3/5**

*Conformidade:* Moderada. Configurações básicas são acessíveis, porém:
- Sem perfis de configuração pré-definidos (ex: "Tomate", "Alface", "Flores")
- Sem reset para configurações padrão
- Sem backup/exportação de configurações
- Sem histórico de mudanças

*Sugestão de Melhoria:*
  - Botão "Restaurar Padrões" para resetar a valores iniciais
  - Predefinições: "Rápida (10s)" vs "Conservadora (60s)"

---

**Heurística 8 - Design Estético e Minimalista** (_Aesthetic and Minimalist Design_) | **Pontuação: 4/5**

*Conformidade:* Boa. Design organizado e limpo:
- Seções bem delimitadas com headers visuais
- Ícones coloridos em background sutil
- Espaçamento apropriado
- ScrollView permite conteúdo sem abarrotar

*Negativos:* Muitas seções podem criar sensação de tamanho excessivo para usuário que apenas quer ajustar intervalo.

*Sugestão de Melhoria:* Considerar collapsible sections (expandir/colapsar) para reduzir visual overhead.

---

**Heurística 9 - Ajuda aos Usuários para Reconhecer, Diagnosticar e Recuperar de Erros** (_Help Users Recognize, Diagnose, and Recover From Errors_) | **Pontuação: 2/5**

*Conformidade:* Inadequada. Feedback de erro é minimal:
- Alert "✓ Configurações salvas com sucesso!" é genérico
- Sem validação de erros mostrada
- Sem feedback sobre status de sincronismo com hardware

*Sugestão de Melhoria:*
  - Feedback específico: "Intervalo alterado para 30s. Aguarde próxima leitura..."
  - Indicador: "⚠️ Aplicação pendente" durante sincronismo
  - Erro: "❌ Falha ao aplicar limites. Verifique conexão com dispositivo."

---

**Heurística 10 - Ajuda e Documentação** (_Help and Documentation_) | **Pontuação: 1/5**

*Conformidade:* Não conformidade. Documentação inexistente:
- Sem explicação de cada configuração
- Sem recomendações de valores
- Sem informação sobre impacto de cada mudança

*Sugestão de Melhoria:*
  - Ícone "?" ao lado de cada seção com tooltip:
    - Intervalo: "Frequência de leitura dos sensores. Valores menores = mais preciso mas consome mais energia"
    - Limites: "Faixa automática de irrigação. Ex: 40% ativa bomba, 75% desativa"
  - Seção "Recomendações" sugerindo valores conforme tipo de planta

---

#### 3.4.3 Resumo ConfigScreen

| Heurística | Nomenclatura EN | Pontuação | Status |
|-----------|---------|-----------|--------|
| Visibilidade do Status | Visibility of System Status | 5/5 | ✅ Excelente |
| Correspondência | Match Between System and the Real World | 4/5 | ✅ Boa |
| Controle e Liberdade | User Control and Freedom | 4/5 | ✅ Boa |
| Consistência | Consistency and Standards | 5/5 | ✅ Excelente |
| Prevenção de Erros | Error Prevention | 3/5 | ⚠️ Moderada |
| Reconhecimento | Recognition Rather Than Recall | 4/5 | ✅ Boa |
| Flexibilidade | Flexibility and Efficiency of Use | 3/5 | ⚠️ Moderada |
| Design Estético | Aesthetic and Minimalist Design | 4/5 | ✅ Boa |
| Ajuda em Erros | Help Users Recognize, Diagnose, Recover From Errors | 2/5 | ❌ Inadequada |
| Ajuda e Documentação | Help and Documentation | 1/5 | ❌ Crítica |

**Pontuação Média: 3.5/5**

---

## 4. TABELA RESUMO COMPARATIVA

| Tela | Heurística | Pontuação | Observação |
|------|-----------|-----------|-----------|
| HomeScreen | Visibilidade do Status | 5/5 | Feedback contínuo e imediato com auto-atualização |
| HomeScreen | Correspondência | 4/5 | Metáforas intuitivas; faltam unidades em sensores adicionais |
| HomeScreen | Controle e Liberdade | 3/5 | Sem confirmação em ações críticas; sem desfazer |
| HomeScreen | Consistência | 5/5 | Padrões visuais uniforme aplicados consistentemente |
| HomeScreen | Prevenção de Erros | 3/5 | Timer de bomba ativa faria melhorar prevenção |
| HomeScreen | Reconhecimento | 4/5 | Sem legenda de cores; convenção deve ser memorizada |
| HomeScreen | Flexibilidade | 3/5 | Sem atalhos ou gestos avançados para usuários experientes |
| HomeScreen | Design Estético | 5/5 | Minimalismo exemplar com paleta reduzida e espaçamento apropriado |
| HomeScreen | Ajuda em Erros | 2/5 | Sem tratamento de falhas visível; desconexão não é indicada |
| HomeScreen | Ajuda e Documentação | 1/5 | Ausência total de tutoriais ou suporte integrado |
| SensoresScreen | Visibilidade do Status | 4/5 | Atualização em tempo real; falta timestamp de sincronismo |
| SensoresScreen | Correspondência | 5/5 | Progress bars e cores naturais; representação excelente |
| SensoresScreen | Controle e Liberdade | 4/5 | Tela informativa adequadamente; falta botão recarregar |
| SensoresScreen | Consistência | 5/5 | Coerência com outras telas mantida perfeitamente |
| SensoresScreen | Prevenção de Erros | 4/5 | Poucos inputs; sensor inativo não é sinalizado |
| SensoresScreen | Reconhecimento | 5/5 | Dados e representações visuais totalmente claros |
| SensoresScreen | Flexibilidade | 2/5 | Sem comparação gráfica ou exportação; estrutura rígida |
| SensoresScreen | Design Estético | 5/5 | Layout clean; progress bars bem integrados |
| SensoresScreen | Ajuda em Erros | 2/5 | Sem indicação de sensores inoperantes |
| SensoresScreen | Ajuda e Documentação | 2/5 | Info box mínima; sem explicação técnica dos sensores |
| HistoricoScreen | Visibilidade do Status | 5/5 | Gráfico proporciona compreensão clara de tendências |
| HistoricoScreen | Correspondência | 4/5 | Convenções familiares; conceito "irrigações" é abstrato |
| HistoricoScreen | Controle e Liberdade | 5/5 | Filtros claros e reversíveis; controle completo |
| HistoricoScreen | Consistência | 5/5 | Padrões mantidos rigorosamente com resto da app |
| HistoricoScreen | Prevenção de Erros | 4/5 | Sem feedback sobre falha de carregamento |
| HistoricoScreen | Reconhecimento | 5/5 | Visualização intuitiva; sem memorização necessária |
| HistoricoScreen | Flexibilidade | 3/5 | Sem exportação ou períodos customizados; básico |
| HistoricoScreen | Design Estético | 4/5 | Limpo; grade no gráfico melhoraria leitura |
| HistoricoScreen | Ajuda em Erros | 2/5 | Sem tratamento visível de erros ou períodos vazios |
| HistoricoScreen | Ajuda e Documentação | 1/5 | Sem explicação de métricas ou insights sugeridos |
| ConfigScreen | Visibilidade do Status | 5/5 | Configurações atuais claramente visíveis |
| ConfigScreen | Correspondência | 4/5 | Linguagem familiar; labels poderiam ser mais específicos |
| ConfigScreen | Controle e Liberdade | 4/5 | Alterações reversíveis; falta aviso ao sair |
| ConfigScreen | Consistência | 5/5 | Padrões de toggle e botões alinhados com resto |
| ConfigScreen | Prevenção de Erros | 3/5 | Validação mínima; falta confirmação ao salvar |
| ConfigScreen | Reconhecimento | 4/5 | Labels descritivos; unidades nem sempre explícitas |
| ConfigScreen | Flexibilidade | 3/5 | Sem predefinições ou perfis; reset não evidenciado |
| ConfigScreen | Design Estético | 4/5 | Bem organizado; muitas seções podem ser colapsáveis |
| ConfigScreen | Ajuda em Erros | 2/5 | Feedback genérico; sem validação de erros |
| ConfigScreen | Ajuda e Documentação | 1/5 | Sem explicação de impacto de configurações |

### 4.1 Estatísticas Gerais

**Pontuação Média Global: 3.65/5**

**Por Heurística (Média de todas as telas):**

| Heurística | Nomenclatura EN | Pontuação Média | Status |
|-----------|---------|-----------------|--------|
| Visibilidade do Status | Visibility of System Status | 4.75/5 | ✅ Excelente |
| Correspondência | Match Between System and the Real World | 4.25/5 | ✅ Boa |
| Controle e Liberdade | User Control and Freedom | 4.25/5 | ✅ Boa |
| Consistência | Consistency and Standards | 5.00/5 | ✅ Excelente |
| Prevenção de Erros | Error Prevention | 3.50/5 | ⚠️ Moderada |
| Reconhecimento | Recognition Rather Than Recall | 4.50/5 | ✅ Boa |
| Flexibilidade | Flexibility and Efficiency of Use | 2.75/5 | ❌ Inadequada |
| Design Estético | Aesthetic and Minimalist Design | 4.50/5 | ✅ Boa |
| Ajuda em Erros | Help Users Recognize, Diagnose, Recover From Errors | 2.00/5 | ❌ Crítica |
| Ajuda e Documentação | Help and Documentation | 1.25/5 | ❌ Crítica |

**Por Tela (Média de todas as heurísticas):**

| Tela | Pontuação Média |
|------|-----------------|
| HomeScreen | 3.40/5 |
| SensoresScreen | 3.80/5 |
| HistoricoScreen | 3.80/5 |
| ConfigScreen | 3.50/5 |

---

## 5. CONCLUSÃO

### 5.1 Síntese Geral

O aplicativo "Irrigação Automática" demonstra conformidade substancial com os princípios fundamentais de usabilidade estabelecidos por Nielsen (1994), alcançando pontuação média de **3.65/5** na avaliação heurística abrangente. A análise revela que a aplicação possui **pontos fortes bem definidos** em aspectos visuais e estruturais, simultaneamente apresentando **oportunidades significativas de melhoria** em dimensões de suporte ao usuário e tratamento de erros.

### 5.2 Forças Identificadas

1. **Excelência em Design Estético e Consistência (5.0/5)**
   - A interface adota paradigma minimalista robusto, com paleta de cores limitada mas efetiva
   - Padrões visuais são mantidos consistentemente entre telas, reforçando coesão do design
   - Hierarquia visual clara facilita navegação e compreensão

2. **Visibilidade de Status Adequada (4.75/5)**
   - Feedback em tempo real proporciona confiança ao usuário
   - Auto-atualização de dados comunica sincronismo contínuo
   - Indicadores visuais (cores, ícones) são imediatos e compreensíveis

3. **Correspondência com Mundo Real (4.25/5)**
   - Metáforas visuais (gota para água, cores naturais) são intuitivas
   - Linguagem utilizada é acessível e não técnica
   - Convenções de UI (botões, toggles) são familiares ao usuário médio

4. **Controle e Liberdade Adequados (4.25/5)**
   - Navegação é fluida e reversível
   - Ações são principalmente não-destrutivas
   - Usuário mantém autonomia nas principais funções

### 5.3 Deficiências Críticas

1. **Suporte a Erros Inadequado (2.0/5)** — PRIORIDADE CRÍTICA
   - Ausência de mensagens de erro visíveis em nenhuma tela
   - Falhas de conexão não são comunicadas
   - Dados obsoletos não são sinalizados
   - **Impacto:** Usuário pode tomar decisões críticas baseado em informações obsoletas
   - **Exemplo:** Se sensor desconectar, app continua exibindo último valor sem indicação de problema

2. **Documentação e Ajuda Inexistentes (1.25/5)** — PRIORIDADE CRÍTICA
   - Sem tutoriais, onboarding ou documentação integrada
   - Sem explicação de métricas ou funcionalidades
   - Usuários novos enfrentarão curva de aprendizagem abrupta
   - **Impacto:** Redução na adoção da aplicação; utilização incorreta de funcionalidades

3. **Flexibilidade de Uso Limitada (2.75/5)** — PRIORIDADE ALTA
   - Sem recursos avançados para usuários experientes
   - Sem opções de customização profunda
   - Sem possibilidade de exportação ou comparação de dados
   - **Impacto:** Usuários power-users terão experiência limitada

### 5.4 Recomendações de Melhoria por Prioridade

#### 🔴 CRÍTICA (Implementar imediatamente)

**1. Implementar Sistema de Tratamento de Erros**
   - Adicionar indicadores de status de conexão na header
   - Exibir toasts informativos para falhas de sincronismo
   - Sinalizar dados obsoletos com timestamp e ícone ⚠️
   - Implementação estimada: 4-6 horas de desenvolvimento

**2. Criar Sistema de Ajuda Integrado**
   - Implementar onboarding (modal na primeira abertura)
   - Adicionar ícones "?" em elementos chave com tooltips
   - Criar seção "Ajuda" na ConfigScreen com FAQ
   - Implementação estimada: 6-8 horas de desenvolvimento

**3. Adicionar Confirmação em Ações Críticas**
   - Diálogo de confirmação ao ativar/desativar bomba
   - Aviso ao fazer mudanças não salvas em ConfigScreen
   - Implementação estimada: 2-3 horas de desenvolvimento

#### 🟡 ALTA (Implementar na próxima sprint)

**4. Melhorar Prevenção de Erros em ConfigScreen**
   - Validar que limite máximo > limite mínimo
   - Avisar sobre valores fora do intervalo recomendado
   - Adicionar unidades explícitas (%,°C, lux) em todos campos
   - Implementação estimada: 3-4 horas

**5. Adicionar Funcionalidades de Eficiência**
   - Botão "Recarregar" em SensoresScreen
   - Opção de comparação gráfica entre sensores
   - Predefinições de configuração ("Rápida", "Conservadora")
   - Implementação estimada: 5-6 horas

**6. Expandir Visualizações e Dados**
   - Grid suave no gráfico histórico para leitura facilitada
   - Legenda visual de códigos de cor
   - Export de dados em CSV/PDF
   - Implementação estimada: 4-5 horas

#### 🟢 MÉDIA (Implementar quando recursos forem disponíveis)

**7. Melhorias de Acessibilidade**
   - Aumentar contraste em elementos críticos
   - Suportar tamanhos de fonte customizáveis
   - Implementar suporte a screen readers
   - Implementação estimada: 6-8 horas

**8. Gestos Avançados**
   - Long-press no botão de bomba para ações rápidas
   - Swipe em cards de sensor para histórico individual
   - Pinch-to-zoom no gráfico
   - Implementação estimada: 4-5 horas

### 5.5 Conformidade com Princípios de IHC

O aplicativo **atende parcialmente** aos princípios fundamentais de IHC. Enquanto demonstra compreensão adequada de design visual e navegação, apresenta deficiências críticas em dois pilares essenciais:

1. **Robustez**: Sistema não é robusto a falhas visíveis; usuário carece de informação em cenários de erro
2. **Learnability**: Curva de aprendizagem é abrupta; ausência de suporte educativo prejudica usabilidade de novos usuários

A pontuação de **3.65/5** situa a aplicação na faixa "Moderadamente Usável", indicando que enquanto funcionalidades principais são acessíveis, a experiência geral é prejudicada pela falta de polimento em tratamento de erros e suporte ao usuário.

### 5.6 Indicação de Viabilidade

**Recomendação: VIÁVEL COM RESERVAS**

A aplicação é viável para uso em ambiente controlado (usuários especializados em pesquisa/desenvolvimento), porém **não recomenda-se disponibilização pública sem implementação das melhorias críticas** (tratamento de erros, ajuda integrada, confirmação de ações).

Com implementação das recomendações críticas (estimado 12-16 horas de desenvolvimento), espera-se aumento da pontuação média para **4.2-4.5/5**, alcançando "Boa Usabilidade".

---

## 6. REFERÊNCIAS BIBLIOGRÁFICAS

Nielsen, J. (1994). Heuristic evaluation of user interfaces. *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*, 249-256.

Norman, D. A. (2013). *The Design of Everyday Things: Revised and Expanded Edition*. MIT Press.

Sommerville, I. (2015). *Software Engineering* (10th ed.). Pearson.

ISO/IEC 25010:2023. *Systems and software engineering – System and software quality models*. International Organization for Standardization.

Nielsen, J. & Molich, R. (1990). Heuristic evaluation of user interfaces. *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*, 249-256.

W3C. (2023). *Web Content Accessibility Guidelines (WCAG) 2.1*. Retrieved from https://www.w3.org/WAI/WCAG21/quickref/

---

## APÊNDICE A – RESUMO EXECUTIVO PARA STAKEHOLDERS

**Aplicativo:** Irrigação Automática v1.0  
**Plataforma:** React Native + Expo SDK 54  
**Data de Avaliação:** Janeiro 2026  
**Método:** Avaliação Heurística de Nielsen

**Resultado em Uma Sentença:** A aplicação demonstra design visual excelente mas requer melhorias críticas em tratamento de erros e suporte ao usuário antes de disponibilização pública.

**Métricas-Chave:**
- Pontuação Média: 3.65/5 (Moderadamente Usável)
- Telas Mais Fortes: SensoresScreen e HistoricoScreen (3.8/5)
- Tela com Mais Oportunidades: HomeScreen (3.4/5)
- Heurísticas Críticas: Ajuda em Erros (2.0/5) e Documentação (1.25/5)
- Heurísticas Fortes: Consistência (5.0/5) e Visibilidade (4.75/5)

**Tempo para Compliance:** 12-16 horas de desenvolvimento (críticas) + 15-20 horas (alta prioridade)

---

**Documento preparado para fins académicos e de desenvolvimento.**  
**Avaliação realizada conforme normas de IHC estabelecidas na literatura.**

