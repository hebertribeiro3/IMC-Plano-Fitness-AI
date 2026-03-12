import { motion, AnimatePresence } from 'motion/react';
import { X, LayoutDashboard, Calendar as CalendarIcon, CheckSquare, Target, Dumbbell } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ isOpen, onClose, currentView, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'wizard', label: 'Meu Plano', icon: Target },
    { id: 'dashboard', label: 'Resumo (Dashboard)', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendário', icon: CalendarIcon },
    { id: 'checklist', label: 'Checklists Diários', icon: CheckSquare },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-xl flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-zinc-100">
              <div className="flex items-center gap-3 text-emerald-600">
                <Dumbbell size={24} />
                <span className="font-bold text-lg text-zinc-900">FitAI Planner</span>
              </div>
              <button onClick={onClose} className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-600 font-medium' 
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
