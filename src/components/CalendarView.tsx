import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CheckCircle2, Dumbbell, Utensils, Activity } from 'lucide-react';
import { AppData } from '../types';

interface CalendarViewProps {
  data: AppData;
}

export function CalendarView({ data }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Calendário</h2>
          <p className="text-zinc-500">Acompanhe sua consistência</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 bg-white rounded-full shadow-sm border border-zinc-100 hover:bg-zinc-50">
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold text-lg capitalize w-32 text-center">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <button onClick={nextMonth} className="p-2 bg-white rounded-full shadow-sm border border-zinc-100 hover:bg-zinc-50">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-zinc-400 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for offset */}
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-xl bg-transparent" />
          ))}
          
          {daysInMonth.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const record = data.records[dateStr];
            const isToday = isSameDay(day, new Date());
            
            // Calculate completion level
            let completedCount = 0;
            if (record?.trainingCompleted) completedCount++;
            if (record?.dietCompleted) completedCount++;
            if (record?.cardioCompleted) completedCount++;
            
            let bgClass = 'bg-zinc-50 hover:bg-zinc-100';
            if (completedCount === 1) bgClass = 'bg-emerald-100 text-emerald-700';
            if (completedCount === 2) bgClass = 'bg-emerald-300 text-emerald-800';
            if (completedCount === 3) bgClass = 'bg-emerald-500 text-white';

            return (
              <button 
                key={day.toString()} 
                onClick={() => setSelectedDate(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-colors ${bgClass} ${isToday ? 'ring-2 ring-zinc-900 ring-offset-2' : ''} ${selectedDate && isSameDay(day, selectedDate) ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}
              >
                <span className="font-medium">{format(day, 'd')}</span>
                {completedCount === 3 && (
                  <CheckCircle2 size={12} className="absolute bottom-1 right-1 opacity-80" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-100 border border-zinc-200" /> Nenhum
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-100" /> Parcial
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" /> Completo
          </div>
        </div>

        {selectedDate && (
          <div className="mt-8 pt-8 border-t border-zinc-100">
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </h3>
            {data.records[format(selectedDate, 'yyyy-MM-dd')] ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${data.records[format(selectedDate, 'yyyy-MM-dd')].trainingCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}>
                    <Dumbbell size={20} />
                  </div>
                  <span className={data.records[format(selectedDate, 'yyyy-MM-dd')].trainingCompleted ? 'text-zinc-900 font-medium' : 'text-zinc-500'}>Treino na Academia</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${data.records[format(selectedDate, 'yyyy-MM-dd')].dietCompleted ? 'bg-blue-100 text-blue-600' : 'bg-zinc-100 text-zinc-400'}`}>
                    <Utensils size={20} />
                  </div>
                  <span className={data.records[format(selectedDate, 'yyyy-MM-dd')].dietCompleted ? 'text-zinc-900 font-medium' : 'text-zinc-500'}>Dieta Seguida</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${data.records[format(selectedDate, 'yyyy-MM-dd')].cardioCompleted ? 'bg-orange-100 text-orange-600' : 'bg-zinc-100 text-zinc-400'}`}>
                    <Activity size={20} />
                  </div>
                  <span className={data.records[format(selectedDate, 'yyyy-MM-dd')].cardioCompleted ? 'text-zinc-900 font-medium' : 'text-zinc-500'}>Cardio Realizado</span>
                </div>
                {data.records[format(selectedDate, 'yyyy-MM-dd')].weight && (
                  <div className="mt-4 p-4 bg-zinc-50 rounded-xl inline-block">
                    <span className="text-sm text-zinc-500 block mb-1">Peso Registrado</span>
                    <span className="text-xl font-bold">{data.records[format(selectedDate, 'yyyy-MM-dd')].weight} kg</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-zinc-500">Nenhum registro encontrado para este dia.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
