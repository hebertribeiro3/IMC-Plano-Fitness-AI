import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2, Circle, Dumbbell, Utensils, Activity, Save } from 'lucide-react';
import { AppData, DailyRecord } from '../types';

interface ChecklistViewProps {
  data: AppData;
  onSave: (date: string, record: DailyRecord) => void;
}

export function ChecklistView({ data, onSave }: ChecklistViewProps) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState(today);
  
  const [currentRecord, setCurrentRecord] = useState<DailyRecord>({
    date: selectedDate,
    trainingCompleted: false,
    dietCompleted: false,
    cardioCompleted: false,
    weight: data.profile.weight ? Number(data.profile.weight) : undefined,
  });

  useEffect(() => {
    const record = data.records[selectedDate];
    if (record) {
      setCurrentRecord(record);
    } else {
      setCurrentRecord({
        date: selectedDate,
        trainingCompleted: false,
        dietCompleted: false,
        cardioCompleted: false,
        weight: data.profile.weight ? Number(data.profile.weight) : undefined,
      });
    }
  }, [selectedDate, data.records, data.profile.weight]);

  const handleToggle = (field: keyof DailyRecord) => {
    setCurrentRecord(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    onSave(selectedDate, currentRecord);
    alert('Progresso salvo com sucesso!');
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Checklist Diário</h2>
        <p className="text-zinc-500 capitalize">{format(new Date(selectedDate + 'T12:00:00'), "EEEE, d 'de' MMMM", { locale: ptBR })}</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100 space-y-6">
        <div className="space-y-4">
          <button 
            onClick={() => handleToggle('trainingCompleted')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${currentRecord.trainingCompleted ? 'border-emerald-500 bg-emerald-50' : 'border-zinc-100 hover:border-zinc-200'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentRecord.trainingCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
                <Dumbbell size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Treino na Academia</h3>
                <p className={`text-sm ${currentRecord.trainingCompleted ? 'text-emerald-600' : 'text-zinc-500'}`}>
                  {currentRecord.trainingCompleted ? 'Concluído!' : 'Pendente'}
                </p>
              </div>
            </div>
            {currentRecord.trainingCompleted ? <CheckCircle2 size={28} className="text-emerald-500" /> : <Circle size={28} className="text-zinc-300" />}
          </button>

          <button 
            onClick={() => handleToggle('dietCompleted')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${currentRecord.dietCompleted ? 'border-blue-500 bg-blue-50' : 'border-zinc-100 hover:border-zinc-200'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentRecord.dietCompleted ? 'bg-blue-100 text-blue-600' : 'bg-zinc-100 text-zinc-500'}`}>
                <Utensils size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Dieta Seguida</h3>
                <p className={`text-sm ${currentRecord.dietCompleted ? 'text-blue-600' : 'text-zinc-500'}`}>
                  {currentRecord.dietCompleted ? 'Concluído!' : 'Pendente'}
                </p>
              </div>
            </div>
            {currentRecord.dietCompleted ? <CheckCircle2 size={28} className="text-blue-500" /> : <Circle size={28} className="text-zinc-300" />}
          </button>

          <button 
            onClick={() => handleToggle('cardioCompleted')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${currentRecord.cardioCompleted ? 'border-orange-500 bg-orange-50' : 'border-zinc-100 hover:border-zinc-200'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentRecord.cardioCompleted ? 'bg-orange-100 text-orange-600' : 'bg-zinc-100 text-zinc-500'}`}>
                <Activity size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Cardio Realizado</h3>
                <p className={`text-sm ${currentRecord.cardioCompleted ? 'text-orange-600' : 'text-zinc-500'}`}>
                  {currentRecord.cardioCompleted ? 'Concluído!' : 'Pendente'}
                </p>
              </div>
            </div>
            {currentRecord.cardioCompleted ? <CheckCircle2 size={28} className="text-orange-500" /> : <Circle size={28} className="text-zinc-300" />}
          </button>
        </div>

        <div className="pt-6 border-t border-zinc-100 space-y-4">
          <h3 className="font-semibold text-lg">Registros Adicionais</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Peso Atual (kg)</label>
              <input 
                type="number" 
                value={currentRecord.weight || ''} 
                onChange={e => setCurrentRecord(prev => ({ ...prev, weight: Number(e.target.value) }))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="Ex: 75.5"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl py-4 font-medium flex items-center justify-center gap-2 transition-colors mt-6"
        >
          <Save size={20} />
          Salvar Progresso do Dia
        </button>
      </div>
    </div>
  );
}
