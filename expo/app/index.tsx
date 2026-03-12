import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ArrowRight, Flame, Dumbbell } from 'lucide-react-native';
import { useAsyncStorage } from '../hooks/useAsyncStorage';
import { AppData } from '../src/types';
import { generateFitnessPlan } from '../src/services/geminiService';

const initialAppData: AppData = {
  profile: { age: '', weight: '', height: '', bmi: null, goal: null, trainingDays: null, plan: null },
  records: {},
};

export default function WizardScreen() {
  const [appData, setAppData, isReady] = useAsyncStorage<AppData>('fitai-data', initialAppData);
  const [step, setStep] = useState('form');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [goal, setGoal] = useState<'lose' | 'gain' | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isReady && appData.profile.plan) {
      router.replace('/(tabs)/dashboard');
    }
  }, [isReady, appData.profile.plan]);

  if (!isReady) return <View className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#10b981" /></View>;

  const calculateBMI = () => {
    if (age && weight && height) {
      const h = Number(height) / 100;
      setBmi(Number(weight) / (h * h));
      setStep('goal');
    }
  };

  const handleDaysSelection = async (days: number) => {
    setStep('loading');
    try {
      const generatedPlan = await generateFitnessPlan(Number(age), Number(weight), Number(height), bmi!, goal!, days);
      setAppData(prev => ({
        ...prev,
        profile: { age: Number(age), weight: Number(weight), height: Number(height), bmi, goal, trainingDays: days, plan: generatedPlan }
      }));
      router.replace('/(tabs)/dashboard');
    } catch (err: any) {
      setError(err.message);
      setStep('days');
    }
  };

  return (
    <ScrollView className="flex-1 bg-zinc-50 px-6 py-12">
      {step === 'form' && (
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
          <Text className="text-2xl font-semibold mb-2">Vamos começar</Text>
          <Text className="text-zinc-500 mb-6">Insira seus dados para calcularmos seu IMC inicial.</Text>

          <Text className="text-sm font-medium text-zinc-700 mb-1">Idade</Text>
          <TextInput keyboardType="numeric" value={age} onChangeText={setAge} className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 mb-4" placeholder="Ex: 28" />

          <Text className="text-sm font-medium text-zinc-700 mb-1">Peso (kg)</Text>
          <TextInput keyboardType="numeric" value={weight} onChangeText={setWeight} className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 mb-4" placeholder="Ex: 75.5" />

          <Text className="text-sm font-medium text-zinc-700 mb-1">Altura (cm)</Text>
          <TextInput keyboardType="numeric" value={height} onChangeText={setHeight} className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 mb-6" placeholder="Ex: 175" />

          <TouchableOpacity onPress={calculateBMI} className="bg-zinc-900 rounded-xl py-4 flex-row items-center justify-center">
            <Text className="text-white font-medium mr-2">Calcular IMC</Text>
            <ArrowRight color="#fff" size={18} />
          </TouchableOpacity>
        </View>
      )}

      {step === 'goal' && (
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
          <Text className="text-2xl font-semibold mb-6 text-center">Qual é o seu objetivo?</Text>
          <TouchableOpacity onPress={() => { setGoal('lose'); setStep('days'); }} className="border-2 border-zinc-100 rounded-2xl p-6 mb-4 items-center">
            <Flame color="#10b981" size={32} />
            <Text className="text-lg font-semibold mt-2">Perder Peso</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setGoal('gain'); setStep('days'); }} className="border-2 border-zinc-100 rounded-2xl p-6 items-center">
            <Dumbbell color="#3b82f6" size={32} />
            <Text className="text-lg font-semibold mt-2">Ganhar Massa</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'days' && (
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
          <Text className="text-2xl font-semibold mb-6 text-center">Quantos dias por semana?</Text>
          <View className="flex-row flex-wrap justify-between">
            {[1, 2, 3, 4, 5, 6].map(day => (
              <TouchableOpacity key={day} onPress={() => handleDaysSelection(day)} className="w-[48%] border-2 border-zinc-100 rounded-2xl p-4 mb-4 items-center">
                <Text className="text-2xl font-bold">{day}</Text>
                <Text className="text-zinc-500">dias</Text>
              </TouchableOpacity>
            ))}
          </View>
          {error ? <Text className="text-red-500 text-center mt-4">{error}</Text> : null}
        </View>
      )}

      {step === 'loading' && (
        <View className="bg-white rounded-3xl p-12 items-center justify-center mt-12">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-xl font-semibold mt-4 text-center">Analisando seu perfil...</Text>
        </View>
      )}
    </ScrollView>
  );
}
