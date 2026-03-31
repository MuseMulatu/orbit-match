import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface CrushEntry {
  id: string;
  phone: string;
  maskedPhone: string;
  status: 'pending' | 'matched';
  addedAt: Date;
}

interface AppState {
  isAuthenticated: boolean;
  userPhone: string;
  crushList: CrushEntry[];
  maxSlots: number;
  matchState: boolean;
  showAuthModal: boolean;
}

interface AppContextType extends AppState {
  setShowAuthModal: (show: boolean) => void;
  login: (phone: string) => void;
  logout: () => void;
  addCrush: (phone: string) => { success: boolean; error?: string };
  removeCrush: (id: string) => void;
  simulateMatch: (id: string) => void;
  dismissMatch: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.length < 4) return '***';
  const last4 = cleaned.slice(-4);
  const prefix = cleaned.slice(0, cleaned.startsWith('+') ? 4 : 3);
  return `${prefix} ${'*'.repeat(Math.max(0, cleaned.length - prefix.length - 4))} ${last4}`;
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, '');
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    userPhone: '',
    crushList: [],
    maxSlots: 2,
    matchState: false,
    showAuthModal: false,
  });

  const setShowAuthModal = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showAuthModal: show }));
  }, []);

  const login = useCallback((phone: string) => {
    setState(prev => ({ ...prev, isAuthenticated: true, userPhone: phone, showAuthModal: false }));
  }, []);

  const logout = useCallback(() => {
    setState({
      isAuthenticated: false,
      userPhone: '',
      crushList: [],
      maxSlots: 2,
      matchState: false,
      showAuthModal: false,
    });
  }, []);

  const addCrush = useCallback((phone: string): { success: boolean; error?: string } => {
    const normalized = normalizePhone(phone);

    if (!normalized || normalized.length < 7) {
      return { success: false, error: 'Please enter a valid phone number.' };
    }

    const userNormalized = normalizePhone(state.userPhone);
    if (normalized === userNormalized) {
      return { success: false, error: "You can't add your own number." };
    }

    if (state.crushList.some(c => normalizePhone(c.phone) === normalized)) {
      return { success: false, error: 'This number is already in your list.' };
    }

    if (state.crushList.length >= state.maxSlots) {
      return { success: false, error: `You've reached the maximum of ${state.maxSlots} slots.` };
    }

    const entry: CrushEntry = {
      id: crypto.randomUUID(),
      phone: normalized,
      maskedPhone: maskPhone(normalized),
      status: 'pending',
      addedAt: new Date(),
    };

    setState(prev => ({ ...prev, crushList: [...prev.crushList, entry] }));
    return { success: true };
  }, [state.userPhone, state.crushList, state.maxSlots]);

  const removeCrush = useCallback((id: string) => {
    setState(prev => ({ ...prev, crushList: prev.crushList.filter(c => c.id !== id) }));
  }, []);

  const simulateMatch = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      matchState: true,
      crushList: prev.crushList.map(c => c.id === id ? { ...c, status: 'matched' as const } : c),
    }));
  }, []);

  const dismissMatch = useCallback(() => {
    setState(prev => ({ ...prev, matchState: false }));
  }, []);

  return (
    <AppContext.Provider value={{
      ...state,
      setShowAuthModal,
      login,
      logout,
      addCrush,
      removeCrush,
      simulateMatch,
      dismissMatch,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
