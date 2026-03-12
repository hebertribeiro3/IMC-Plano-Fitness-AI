import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2, Circle, Dumbbell, Utensils, Activity, Save } from 'lucide-react-native';
import { useAsyncStorage } from '../../hooks/useAsyncStorage';
import { AppData, DailyRecord } from '../../../src/types';

export default function ChecklistScreen() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [appData, setAppData, isReady] = useAsyncStorage<AppData>('fitai-data', { profile: {} as any, records: {} });
  const [currentRecord, setCurrentRecord] = useState<DailyRecord>({
    date: today, trainingCompleted: false, dietCompleted: false, cardioCompleted: false
  });

  useEffect(() => {
    if (isReady && appData.records && appData.records[today]) {
      setCurrentRecord(appData.records[today]);
    } else if (isReady) {
      setCurrentRecord(prev => ({ ...prev, weight: appData.profile.weight ? Number(appData.profile.weight) : undefined }));
    }
  }, [isReady, appData, today]);

  if (!isReady) return null;

  const handleToggle = (field: keyof DailyRecord) => {
    setCurrentRecord(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    setAppData(prev => ({
      ...prev,
      records: { ...prev.records, [today]: currentRecord }
    }));
    Alert.alert('Sucesso', 'Progresso salvo com sucesso!');
  };

  return (
    <ScrollView className="flex-1 bg-zinc-50 px-4 py-6">
      <Text className="text-zinc-500 capitalize mb-6">{format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}</Text>

      <TouchableOpacity onPress={() => handleToggle('trainingCompleted')} className={`flex-row items-center justify-between p-4 rounded-2xl border-2 mb-4 ${currentRecord.trainingCompleted ? 'border-emerald-500 bg-emerald-50' : 'border-zinc-100 bg-white'}`}>
        <View className="flex-row items-center">
          <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${currentRecord.trainingCompleted ? 'bg-emerald-100' : 'bg-zinc-100'}`}>
            <Dumbbell color={currentRecord.trainingCompleted ? '#10b981' : '#71717a'} size={24} />
          </View>
          <View>
            <Text className="font-semibold text-lg">Treino na Academia</Text>
            <Text className={currentRecord.trainingCompleted ? 'text-emerald-600' : 'text-zinc-500'}>{currentRecord.trainingCompleted ? 'Concluído!' : 'Pendente'}</Text>
          </View>
        </View>
        {currentRecord.trainingCompleted ? <CheckCircle2 color="#10b981" size={28} /> : <Circle color="#d4d4d8" size={28} />}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleToggle('dietCompleted')} className={`flex-row items-center justify-between p-4 rounded-2xl border-2 mb-4 ${currentRecord.dietCompleted ? 'border-blue-500 bg-blue-50' : 'border-zinc-100 bg-white'}`}>
        <View className="flex-row items-center">
          <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${currentRecord.dietCompleted ? 'bg-blue-100' : 'bg-zinc-100'}`}>
            <Utensils color={currentRecord.dietCompleted ? '#3b82f6' : '#71717a'} size={24} />
          </View>
          <View>
            <Text className="font-semibold text-lg">Dieta Seguida</Text>
            <Text className={currentRecord.dietCompleted ? 'text-blue-600' : 'text-zinc-500'}>{currentRecord.dietCompleted ? 'Concluído!' : 'Pendente'}</Text>
          </View>
        </View>
        {currentRecord.dietCompleted ? <CheckCircle2 color="#3b82f6" size={28} /> : <Circle color="#d4d4d8" size={28} />}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleToggle('cardioCompleted')} className={`flex-row items-center justify-between p-4 rounded-2xl border-2 mb-6 ${currentRecord.cardioCompleted ? 'border-orange-500 bg-orange-50' : 'border-zinc-100 bg-white'}`}>
        <View className="flex-row items-center">
          <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${currentRecord.cardioCompleted ? 'bg-orange-100' : 'bg-zinc-100'}`}>
            <Activity color={currentRecord.cardioCompleted ? '#f97316' : '#71717a'} size={24} />
          </View>
          <View>
            <Text className="font-semibold text-lg">Cardio Realizado</Text>
            <Text className={currentRecord.cardioCompleted ? 'text-orange-600' : 'text-zinc-500'}>{currentRecord.cardioCompleted ? 'Concluído!' : 'Pendente'}</Text>
          </View>
        </View>
        {currentRecord.cardioCompleted ? <CheckCircle2 color="#f97316" size={28} /> : <Circle color="#d4d4d8" size={28} />}
      </TouchableOpacity>

      <View className="bg-white p-4 rounded-2xl border border-zinc-100 mb-6">
        <Text className="font-semibold text-lg mb-4">Peso Atual (kg)</Text>
        <TextInput 
          keyboardType="numeric" 
          value={currentRecord.weight ? String(currentRecord.weight) : ''} 
          onChangeText={val => setCurrentRecord(prev => ({ ...prev, weight: Number(val) }))}
          className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3"
          placeholder="Ex: 75.5"
        />
      </View>

      <TouchableOpacity onPress={handleSave} className="bg-zinc-900 rounded-xl py-4 flex-row items-center justify-center mb-12">
        <Save color="#fff" size={20} />
        <Text className="text-white font-medium ml-2">Salvar Progresso</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
