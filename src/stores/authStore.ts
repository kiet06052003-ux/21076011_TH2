import { create } from 'zustand';
import { STUDENT, examStamp } from '../constants/student';

interface AuthState {
  token: string | null;
  authInput: string;
  login: (input: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  authInput: '',
  login: (input: string) => {
    const generatedToken = `ktxgo-${STUDENT.mssv}-${examStamp()}`;
    set({ token: generatedToken, authInput: input });
  },
  logout: () => {
    set({ token: null, authInput: '' });
  },
}));
