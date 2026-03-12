import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(key).then(item => {
      if (item) {
        try {
          setStoredValue(JSON.parse(item));
        } catch (e) {
          console.error('Erro ao fazer parse do AsyncStorage', e);
        }
      }
      setIsReady(true);
    });
  }, [key]);

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Erro ao salvar no AsyncStorage', error);
    }
  };

  return [storedValue, setValue, isReady] as const;
}