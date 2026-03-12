import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useAsyncStorage } from '../../hooks/useAsyncStorage';
import { AppData } from '../../../src/types';

export default function CalendarScreen() {
  const [appData, , isReady] = useAsyncStorage<AppData>('fitai-data', { profile: {} as any, records: {} });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  if (!isReady) return null;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <ScrollView className="flex-1 bg-zinc-50 px-4 py-6">
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 bg-white rounded-full border border-zinc-100">
          <ChevronLeft color="#18181b" size={20} />
        </TouchableOpacity>
        <Text className="font-semibold text-lg capitalize">{format(currentDate, 'MMMM yyyy', { locale: ptBR })}</Text>
        <TouchableOpacity onPress={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 bg-white rounded-full border border-zinc-100">
          <ChevronRight color="#18181b" size={20} />
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-3xl p-4 shadow-sm border border-zinc-100">
        <View className="flex-row mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <Text key={day} className="flex-1 text-center text-xs font-medium text-zinc-400 py-2">{day}</Text>
          ))}
        </View>
        
        <View className="flex-row flex-wrap">
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <View key={`empty-${i}`} className="w-[14.28%] aspect-square p-1" />
          ))}
          
          {daysInMonth.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const record = appData.records[dateStr];
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            let completedCount = 0;
            if (record?.trainingCompleted) completedCount++;
            if (record?.dietCompleted) completedCount++;
            if (record?.cardioCompleted) completedCount++;
            
            let bgClass = 'bg-zinc-50';
            if (completedCount === 1) bgClass = 'bg-emerald-100';
            if (completedCount === 2) bgClass = 'bg-emerald-300';
            if (completedCount === 3) bgClass = 'bg-emerald-500';

            return (
              <TouchableOpacity 
                key={day.toString()} 
                onPress={() => setSelectedDate(day)}
                className={`w-[14.28%] aspect-square p-1`}
              >
                <View className={`flex-1 rounded-xl items-center justify-center ${bgClass} ${isToday ? 'border-2 border-zinc-900' : ''} ${isSelected ? 'border-2 border-emerald-500' : ''}`}>
                  <Text className={`font-medium ${completedCount === 3 ? 'text-white' : 'text-zinc-900'}`}>{format(day, 'd')}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {selectedDate && appData.records[format(selectedDate, 'yyyy-MM-dd')] && (
        <View className="mt-6 bg-white rounded-3xl p-6 border border-zinc-100 mb-12">
          <Text className="text-lg font-semibold mb-4 capitalize">{format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}</Text>
          <Text className="mb-2 text-base">Treino: {appData.records[format(selectedDate, 'yyyy-MM-dd')].trainingCompleted ? '✅ Concluído' : '❌ Pendente'}</Text>
          <Text className="mb-2 text-base">Dieta: {appData.records[format(selectedDate, 'yyyy-MM-dd')].dietCompleted ? '✅ Concluída' : '❌ Pendente'}</Text>
          <Text className="mb-2 text-base">Cardio: {appData.records[format(selectedDate, 'yyyy-MM-dd')].cardioCompleted ? '✅ Concluído' : '❌ Pendente'}</Text>
        </View>
      )}
    </ScrollView>
  );
}
