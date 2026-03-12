# Projeto Expo (React Native)

Esta pasta `/expo` contém um projeto Expo completo e independente, pronto para ser executado. O erro anterior ocorria porque o projeto não tinha um `package.json` próprio. Agora ele tem tudo o que precisa!

## Como rodar o projeto localmente

1. Faça o download da pasta `/expo` para o seu computador (ou extraia do ZIP).
2. Abra o terminal **dentro da pasta `/expo`** (ex: `cd /Users/hebertribeiro/EloDocente/IMC-Plano-Fitness-AI/expo`).
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor do Expo:
   ```bash
   npx expo start
   ```
5. Use o aplicativo **Expo Go** no seu celular (iOS ou Android) para escanear o QR Code que aparecerá no terminal, ou pressione `i` para rodar no simulador iOS / `a` para rodar no emulador Android.

## Configuração da API do Gemini
Para que o gerador de treinos funcione, você precisará configurar a chave da API do Gemini.
1. Crie um arquivo `.env` na raiz da pasta `/expo`.
2. Adicione sua chave:
   ```env
   EXPO_PUBLIC_GEMINI_API_KEY=sua_chave_aqui
   ```
