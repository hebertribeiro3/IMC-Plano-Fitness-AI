import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useAsyncStorage } from '../../hooks/useAsyncStorage';
import { AppData } from '../../src/types';
import { Target, Dumbbell, Activity } from 'lucide-react-native';

export default function DashboardScreen() {
  const [appData, , isReady] = useAsyncStorage<AppData>('fitai-data', { profile: {} as any, records: {} });

  if (!isReady) return <ActivityIndicator size="large" color="#10b981" />;

  const recordsArray = Object.values(appData.records || {}).sort((a, b) => a.date.localeCompare(b.date));
  const totalWorkouts = recordsArray.filter(r => r.trainingCompleted).length;
  const totalDietDays = recordsArray.filter(r => r.dietCompleted).length;
  const currentWeight = recordsArray.length > 0 ? recordsArray[recordsArray.length - 1].weight : appData.profile.weight;

  return (
    <ScrollView className="flex-1 bg-zinc-50 px-4 py-6">
      <View className="bg-white rounded-3xl p-6 mb-4 shadow-sm border border-zinc-100">
        <View className="flex-row items-center mb-2">
          <Target color="#71717a" size={20} />
          <Text className="text-zinc-500 font-medium ml-2">Peso Atual</Text>
        </View>
        <Text className="text-4xl font-bold">{currentWeight || '--'} <Text className="text-lg text-zinc-400">kg</Text></Text>
      </View>

      <View className="bg-white rounded-3xl p-6 mb-4 shadow-sm border border-zinc-100">
        <View className="flex-row items-center mb-2">
          <Dumbbell color="#71717a" size={20} />
          <Text className="text-zinc-500 font-medium ml-2">Treinos Concluídos</Text>
        </View>
        <Text className="text-4xl font-bold">{totalWorkouts} <Text className="text-lg text-zinc-400">dias</Text></Text>
      </View>

      <View className="bg-white rounded-3xl p-6 mb-4 shadow-sm border border-zinc-100">
        <View className="flex-row items-center mb-2">
          <Activity color="#71717a" size={20} />
          <Text className="text-zinc-500 font-medium ml-2">Consistência Dieta</Text>
        </View>
        <Text className="text-4xl font-bold">{totalDietDays} <Text className="text-lg text-zinc-400">dias</Text></Text>
      </View>

      {appData.profile.plan && (
        <View className="bg-white rounded-3xl p-6 mb-12 shadow-sm border border-zinc-100">
          <Text className="text-xl font-bold mb-4">Seu Plano</Text>
          <Text className="text-zinc-700 leading-6">{appData.profile.plan}</Text>
        </View>
      )}
    </ScrollView>
  );
}
