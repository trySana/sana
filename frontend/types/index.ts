// Types de base pour l'application Sana
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  profileImage?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends AuthCredentials {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
}

export interface SymptomAnalysis {
  id: string;
  symptoms: string[];
  analysis: string;
  recommendations: string[];
  createdAt: Date;
}

export type OnboardingStep = {
  id: number;
  title: string;
  description: string;
  illustration: string;
};
