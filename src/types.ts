export interface Member {
  st_id: string; // 10-digit Student ID (Primary Key)
  name: string;  // First Name
  lname: string; // Last Name
  dob: string;   // Date of birth formatted as DDMMYYYY (e.g. 29102534)
  createdAt?: string;
}

export interface ST5Assessment {
  no: number;       // Auto-increment order starting from 1
  dat_time: string; // Current date and time (e.g. "19/08/2569 11:40:00")
  st_id: string;    // Student ID linked with Member
  q1: number;       // 0 - 3
  q2: number;       // 0 - 3
  q3: number;       // 0 - 3
  q4: number;       // 0 - 3
  q5: number;       // 0 - 3
  total: number;    // q1 + q2 + q3 + q4 + q5 (0 - 15)
  result: string;   // "ความเครียดระดับน้อย" | "ความเครียดระดับปานกลาง" | "ความเครียดระดับมาก" | "ความเครียดระดับรุนแรง"
  emoji: string;    // Emoji representing stress level
  levelKey: 'low' | 'moderate' | 'high' | 'severe';
  syncedToGoogleSheet?: boolean;
}

export interface ST5Question {
  id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
  title: string;
  subtitle?: string;
}

export interface ScoreOption {
  score: number;
  label: string;
  description: string;
}

export interface StressLevelDetail {
  key: 'low' | 'moderate' | 'high' | 'severe';
  minScore: number;
  maxScore: number;
  label: string;
  badgeColor: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  emoji: string;
  subTitle: string;
  description: string;
  adviceList: string[];
}
