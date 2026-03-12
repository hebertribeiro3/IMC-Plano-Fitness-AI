# Versão Expo (React Native)

Como o ambiente de visualização atual roda exclusivamente React para Web (Vite), eu não posso substituir o aplicativo web atual diretamente por um projeto Expo sem quebrar a visualização aqui.

No entanto, eu criei esta pasta `expo-src` com o código refatorado para **React Native / Expo** (usando Expo Router, NativeWind para Tailwind, e AsyncStorage).

## Como usar este código no seu projeto Expo:

1. Crie um novo projeto Expo:
   ```bash
   npx create-expo-app@latest meu-app
   cd meu-app
   ```

2. Instale as dependências necessárias:
   ```bash
   npx expo install @react-native-async-storage/async-storage lucide-react-native nativewind date-fns @google/genai
   ```

3. Configure o **NativeWind** (Tailwind para React Native) seguindo a documentação oficial do NativeWind v4.

4. Copie os arquivos desta pasta (`expo-src`) e substitua a pasta `app` do seu novo projeto Expo.

5. Rode o projeto:
   ```bash
   npx expo start
   ```

### O que foi adaptado:
- `div`, `span`, `button` foram substituídos por `View`, `Text`, `TouchableOpacity`.
- O roteamento foi adaptado para o **Expo Router** (com abas nativas na parte inferior).
- O `localStorage` web foi substituído pelo `@react-native-async-storage/async-storage`.
- Os ícones foram adaptados para `lucide-react-native`.
