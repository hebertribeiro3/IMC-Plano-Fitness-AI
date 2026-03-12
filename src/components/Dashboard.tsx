import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AppData } from '../types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingDown, TrendingUp, Activity, Dumbbell, Target } from 'lucide-react';

interface DashboardProps {
  data: AppData;
}

export function Dashboard({ data }: DashboardProps) {
  // Process data for charts
  const recordsArray = Object.values(data.records).sort((a, b) => a.date.localeCompare(b.date));
  
  const chartData = recordsArray.map(r => ({
    date: format(parseISO(r.date), 'dd/MM', { locale: ptBR }),
    peso: r.weight || null,
  })).filter(r => r.peso !== null);

  const totalWorkouts = recordsArray.filter(r => r.trainingCompleted).length;
  const totalDietDays = recordsArray.filter(r => r.dietCompleted).length;
  const totalCardio = recordsArray.filter(r => r.cardioCompleted).length;

  const currentWeight = recordsArray.length > 0 ? recordsArray[recordsArray.length - 1].weight : data.profile.weight;
  const initialWeight = data.profile.weight;
  
  const weightDiff = (currentWeight && initialWeight) ? Number(currentWeight) - Number(initialWeight) : 0;
  const isLosing = weightDiff < 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Resumo da Evolução</h2>
        <p className="text-zinc-500">Acompanhe seu progresso ao longo do tempo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
          <div className="flex items-center gap-3 mb-2 text-zinc-500">
            <Target size={20} />
            <h3 className="font-medium">Peso Atual</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold">{currentWeight || '--'} <span className="text-lg text-zinc-400 font-normal">kg</span></span>
            {weightDiff !== 0 && (
              <span className={`flex items-center text-sm font-medium mb-1 ${isLosing ? 'text-emerald-500' : 'text-blue-500'}`}>
                {isLosing ? <TrendingDown size={16} className="mr-1" /> : <TrendingUp size={16} className="mr-1" />}
                {Math.abs(weightDiff).toFixed(1)} kg
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
          <div className="flex items-center gap-3 mb-2 text-zinc-500">
            <Dumbbell size={20} />
            <h3 className="font-medium">Treinos Concluídos</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold">{totalWorkouts}</span>
            <span className="text-sm text-zinc-400 font-medium mb-1">dias</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
          <div className="flex items-center gap-3 mb-2 text-zinc-500">
            <Activity size={20} />
            <h3 className="font-medium">Consistência Dieta</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold">{totalDietDays}</span>
            <span className="text-sm text-zinc-400 font-medium mb-1">dias</span>
          </div>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100 mb-8">
          <h3 className="font-semibold text-lg mb-6">Evolução de Peso</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} dy={10} />
                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#18181b', fontWeight: 500 }}
                />
                <Line type="monotone" dataKey="peso" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="Peso (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-zinc-100 text-center">
          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
            <Activity size={32} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Sem dados suficientes</h3>
          <p className="text-zinc-500">Preencha seus checklists diários para visualizar os gráficos de evolução.</p>
        </div>
      )}
    </div>
  );
}
