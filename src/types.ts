export interface DailyRecord {
  date: string; // YYYY-MM-DD
  weight?: number;
  bmi?: number;
  trainingCompleted: boolean;
  dietCompleted: boolean;
  cardioCompleted: boolean;
  notes?: string;
}

export interface UserProfile {
  age: number | '';
  weight: number | '';
  height: number | '';
  bmi: number | null;
  goal: 'lose' | 'gain' | null;
  trainingDays: number | null;
  plan: string | null;
}

export interface AppData {
  profile: UserProfile;
  records: Record<string, DailyRecord>;
}
