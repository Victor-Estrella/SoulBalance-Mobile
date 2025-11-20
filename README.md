# SoulBalance

O SoulBalance é um aplicativo mobile que utiliza IA Generativa para promover autoconsciência, equilíbrio entre performance e bem-estar, e desenvolvimento humano personalizado. A plataforma atua como uma mentora digital, interpretando dados diários do usuário e gerando recomendações, análises e experiências de autocuidado.

## Funcionalidades-Chave

**1. Coleta de Dados Pessoais**
- Check-in diário de humor, energia e foco (entrada manual)
- Coleta opcional de dados simulados (sono, batimento, atividade física)
- Interpretação empática via IA Generativa (GPT, Gemini, Llama)

**2. Inteligência de Ajuste de Carga**
- Recomendações personalizadas de autocuidado e produtividade
- Coach digital adaptativo
- Sugestões automáticas: pausas ativas, micro-missões, meditação, planos de produtividade
- Geração de planos em JSON estruturado

**3. Dashboard Pessoal**
- Gráficos de equilíbrio (horas trabalhadas x descansadas)
- Evolução de foco, energia e humor
- Tendências semanais e histórico de recomendações da IA

**4. Registro de Horas e Performance**
- Registro manual/automático de trabalho, descanso e lazer
- Relatórios narrativos automáticos sobre a semana
- Indicadores de hábitos sustentáveis para RH/mentoria

**5. Perfil Evolutivo**
- Perfil comportamental dinâmico
- Métricas de autogestão, resiliência, inteligência emocional
- Geração de "currículo comportamental" via IA

**Visão Futurista**
- Plataforma de autoconsciência profissional
- Experiências personalizadas de autocuidado e desenvolvimento
- Performance como equilíbrio entre resultados e saúde mental

Exemplo de output da IA:
```
{
    "status_curto": "em recuperação",
    "competencias": ["resiliência", "autoconsciência"],
    "mensagem": "Seu foco está voltando gradualmente. Continue equilibrando pausas e aprendizado."
}
```

---


## Integrantes
- Julia Monteiro — RM: 557023 — Turma: 2TDSPV - https://github.com/jliamonteiro
- Sofia Andrade Petruk — RM: 556585 — Turma: 2TDSPV - https://github.com/sofiapetruk
- Victor Henrique Estrella Carracci — RM: 556206 — Turma: 2TDSPH - https://github.com/Victor-Estrella 




## Estrutura de Pastas
```
assets/
contexto/           # Contextos globais 
control/            # Hooks de controle 
fetcher/            # Acesso HTTP (axios) à API
model/              # Tipos e Schemas
service/            # Orquestração e validação antes do fetcher
styles/             # Temas, estilos globais e ThemeContext
utils/              # Utilitários (ex.: validação de dados)
view/               # Telas (UI)
App.tsx             # Navegação raiz e ThemeProvider
```


## Tecnologias Utilizadas
- React Native (Expo)
- React Navigation (Stack/Tab)
- TypeScript
- AsyncStorage
- Axios
- Firebase App Distribution (publicação)


## Como Rodar

Pré‑requisitos
- Node.js LTS
- Expo (não precisa instalar globalmente no Expo SDK 54+)
- Emulador Android/iOS ou app Expo Go no dispositivo

Clonar e instalar
```powershell
git clone https://github.com/AntonioCarvalhoFIAP/global-solution-2-Victor-Estrella.git
cd global-solution-2-Victor-Estrella
npm install
```

Executar (Metro bundler)
```powershell
npm run start
```

Executar no navegador (web)
```powershell
npm run web
```

Back-end
- Endpoint padrão: `https://soulbalance-api.onrender.com` (ou seu servidor Java/.NET).
- É possível sobrescrever via variável de ambiente (PowerShell):
```powershell
$env:API_URL = "http://seu-servidor:8080"; npm run start
```


## Publicação (Firebase App Distribution)

1. Gere um build interno com EAS ou Gradle (Android):
    - EAS: `eas build --platform android --profile development` (ou `preview`/`production`)
2. Faça upload do APK/AAB para o Firebase App Distribution.


## Tela "Sobre o App" e Hash do Commit

- A tela Sobre exibe nome do app, versão e hash do commit de referência.
- Para builds no expo.dev, defina a variável de ambiente `EXPO_PUBLIC_GIT_COMMIT`.




## Apresentação (Vídeo)

**Link do vídeo (demonstração completa):** [Adicione aqui o link do YouTube]
