import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ArrowRight, Calendar, ChevronRight, Dumbbell, Flame, RotateCcw, Scale, Target, User, Menu, LayoutDashboard } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateFitnessPlan } from './services/geminiService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AppData, DailyRecord } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { ChecklistView } from './components/ChecklistView';

type Step = 'form' | 'goal' | 'days' | 'loading' | 'plan';
type View = 'wizard' | 'dashboard' | 'calendar' | 'checklist';

const initialAppData: AppData = {
  profile: {
    age: '',
    weight: '',
    height: '',
    bmi: null,
    goal: null,
    trainingDays: null,
    plan: null,
  },
  records: {},
};

export default function App() {
  const [appData, setAppData] = useLocalStorage<AppData>('fitai-data', initialAppData);
  const [currentView, setCurrentView] = useState<View>('wizard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Wizard State
  const [step, setStep] = useState<Step>(appData.profile.plan ? 'plan' : 'form');
  const [age, setAge] = useState<number | ''>(appData.profile.age);
  const [weight, setWeight] = useState<number | ''>(appData.profile.weight);
  const [height, setHeight] = useState<number | ''>(appData.profile.height);
  const [bmi, setBmi] = useState<number | null>(appData.profile.bmi);
  const [goal, setGoal] = useState<'lose' | 'gain' | null>(appData.profile.goal);
  const [trainingDays, setTrainingDays] = useState<number | null>(appData.profile.trainingDays);
  const [plan, setPlan] = useState<string>(appData.profile.plan || '');
  const [error, setError] = useState<string>('');

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    if (age && weight && height) {
      const heightInMeters = height / 100;
      const calculatedBmi = weight / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi);
      setStep('goal');
    }
  };

  const handleGoalSelection = (selectedGoal: 'lose' | 'gain') => {
    setGoal(selectedGoal);
    setStep('days');
    setError('');
  };

  const handleDaysSelection = async (days: number) => {
    setTrainingDays(days);
    setStep('loading');
    setError('');

    try {
      if (age && weight && height && bmi && goal) {
        const generatedPlan = await generateFitnessPlan(
          Number(age),
          Number(weight),
          Number(height),
          bmi,
          goal,
          days
        );
        setPlan(generatedPlan);
        
        // Save to local storage
        setAppData(prev => ({
          ...prev,
          profile: {
            age, weight, height, bmi, goal, trainingDays: days, plan: generatedPlan
          }
        }));

        setStep('plan');
      } else {
        setError('Dados incompletos. Por favor, preencha novamente.');
        setStep('form');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro ao gerar seu plano. Por favor, tente novamente.');
      setStep('days');
    }
  };

  const resetApp = () => {
    setStep('form');
    setAge('');
    setWeight('');
    setHeight('');
    setBmi(null);
    setGoal(null);
    setTrainingDays(null);
    setPlan('');
    setError('');
    setAppData(prev => ({ ...prev, profile: initialAppData.profile }));
  };

  const handleSaveRecord = (date: string, record: DailyRecord) => {
    setAppData(prev => ({
      ...prev,
      records: {
        ...prev.records,
        [date]: record
      }
    }));
  };

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { text: 'Abaixo do peso', color: 'text-blue-500' };
    if (bmiValue < 24.9) return { text: 'Peso normal', color: 'text-emerald-500' };
    if (bmiValue < 29.9) return { text: 'Sobrepeso', color: 'text-yellow-500' };
    if (bmiValue < 34.9) return { text: 'Obesidade Grau I', color: 'text-orange-500' };
    if (bmiValue < 39.9) return { text: 'Obesidade Grau II', color: 'text-red-500' };
    return { text: 'Obesidade Grau III', color: 'text-red-700' };
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-emerald-200">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view as View)}
      />

      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">FitAI Planner</h1>
              <p className="text-xs text-zinc-500 font-medium">IMC & Plano Personalizado</p>
            </div>
          </div>
        </div>
      </header>

      <main>
        {currentView === 'dashboard' && <Dashboard data={appData} />}
        {currentView === 'calendar' && <CalendarView data={appData} />}
        {currentView === 'checklist' && <ChecklistView data={appData} onSave={handleSaveRecord} />}
        
        {currentView === 'wizard' && (
          <div className="max-w-3xl mx-auto px-6 py-12">
            <AnimatePresence mode="wait">
              {step === 'form' && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Vamos começar</h2>
                    <p className="text-zinc-500">Insira seus dados para calcularmos seu IMC inicial.</p>
                  </div>

                  <form onSubmit={calculateBMI} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                          <User size={16} className="text-emerald-500" />
                          Idade
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            min="14"
                            max="120"
                            value={age}
                            onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            placeholder="Ex: 28"
                          />
                          <span className="absolute right-4 top-3.5 text-zinc-400 text-sm">anos</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                          <Scale size={16} className="text-emerald-500" />
                          Peso
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            min="30"
                            max="300"
                            step="0.1"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            placeholder="Ex: 75.5"
                          />
                          <span className="absolute right-4 top-3.5 text-zinc-400 text-sm">kg</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                          <Activity size={16} className="text-emerald-500" />
                          Altura
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            min="100"
                            max="250"
                            value={height}
                            onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : '')}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            placeholder="Ex: 175"
                          />
                          <span className="absolute right-4 top-3.5 text-zinc-400 text-sm">cm</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl py-4 font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      Calcular IMC
                      <ArrowRight size={18} />
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 'goal' && bmi && (
                <motion.div
                  key="goal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 text-center">
                    <p className="text-zinc-500 font-medium mb-2">Seu IMC é</p>
                    <div className="text-6xl font-bold tracking-tight mb-4">
                      {bmi.toFixed(1)}
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-100 font-medium ${getBMICategory(bmi).color}`}>
                      <div className="w-2 h-2 rounded-full bg-current" />
                      {getBMICategory(bmi).text}
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
                    <div className="mb-6 text-center">
                      <h2 className="text-2xl font-semibold mb-2">Qual é o seu objetivo?</h2>
                      <p className="text-zinc-500">A inteligência artificial criará um plano baseado na sua escolha.</p>
                    </div>

                    {error && (
                      <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => handleGoalSelection('lose')}
                        className="group relative overflow-hidden rounded-2xl border-2 border-zinc-100 hover:border-emerald-500 p-6 text-left transition-all hover:shadow-md"
                      >
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Flame size={24} />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">Perder Peso</h3>
                        <p className="text-sm text-zinc-500">Foco em déficit calórico e queima de gordura.</p>
                      </button>

                      <button
                        onClick={() => handleGoalSelection('gain')}
                        className="group relative overflow-hidden rounded-2xl border-2 border-zinc-100 hover:border-blue-500 p-6 text-left transition-all hover:shadow-md"
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Dumbbell size={24} />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">Ganhar Massa</h3>
                        <p className="text-sm text-zinc-500">Foco em superávit calórico e hipertrofia.</p>
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => setStep('form')}
                      className="mt-8 w-full py-3 text-zinc-500 hover:text-zinc-800 font-medium transition-colors"
                    >
                      Voltar e editar dados
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'days' && (
                <motion.div
                  key="days"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100"
                >
                  <div className="mb-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                      <Calendar size={24} />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">Quantos dias por semana?</h2>
                    <p className="text-zinc-500">Selecione quantos dias você tem disponibilidade para treinar na academia.</p>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((day) => (
                      <button
                        key={day}
                        onClick={() => handleDaysSelection(day)}
                        className="py-6 rounded-2xl border-2 border-zinc-100 hover:border-indigo-500 hover:bg-indigo-50 text-center transition-all hover:shadow-sm group"
                      >
                        <span className="block text-3xl font-bold text-zinc-800 group-hover:text-indigo-600 mb-1">{day}</span>
                        <span className="text-sm text-zinc-500 group-hover:text-indigo-500 font-medium">
                          {day === 1 ? 'dia' : 'dias'}
                        </span>
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setStep('goal')}
                    className="mt-8 w-full py-3 text-zinc-500 hover:text-zinc-800 font-medium transition-colors"
                  >
                    Voltar
                  </button>
                </motion.div>
              )}

              {step === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-3xl p-12 shadow-sm border border-zinc-100 flex flex-col items-center justify-center text-center min-h-[400px]"
                >
                  <div className="relative w-20 h-20 mb-8">
                    <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
                      <Activity size={24} className="animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Analisando seu perfil...</h2>
                  <p className="text-zinc-500 max-w-sm">
                    Nossa IA está calculando suas necessidades calóricas e montando a rotina ideal de treinos para o seu objetivo.
                  </p>
                </motion.div>
              )}

              {step === 'plan' && (
                <motion.div
                  key="plan"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-zinc-900 text-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <Target size={120} />
                    </div>
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Plano Gerado e Salvo
                      </div>
                      <h2 className="text-3xl font-semibold mb-2">Seu Plano Personalizado</h2>
                      <p className="text-zinc-400">
                        Baseado no seu IMC de {bmi?.toFixed(1)}, objetivo de {goal === 'lose' ? 'perder peso' : 'ganhar massa'} e {trainingDays} {trainingDays === 1 ? 'dia' : 'dias'} de treino.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
                    <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-h3:text-lg prose-p:text-zinc-600 prose-li:text-zinc-600 prose-strong:text-zinc-900">
                      <ReactMarkdown>{plan}</ReactMarkdown>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-zinc-100">
                      <p className="text-sm text-zinc-400 text-center mb-6">
                        <strong>Aviso Legal:</strong> Este plano é gerado por inteligência artificial e serve apenas como uma sugestão inicial. Consulte um profissional de saúde, nutricionista ou educador físico antes de iniciar qualquer dieta ou rotina de exercícios.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={() => setCurrentView('dashboard')}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                          <LayoutDashboard size={18} />
                          Ir para o Dashboard
                        </button>
                        <button 
                          onClick={resetApp}
                          className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                          <RotateCcw size={18} />
                          Gerar Novo Plano
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
