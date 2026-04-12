import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from '@/context/AppContext';
import { AuthModal } from '@/components/hasab/AuthModal';
import { Toaster } from '@/components/ui/toaster';
import Landing from '@/pages/Landing'; // Ensure this matches your actual landing page filename
import Dashboard from '@/pages/Dashboard';
import Admin from '@/pages/Admin'; 

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // 🚨 FIX: Use absolute truth (localStorage) to prevent race conditions on hard refresh
  const token = localStorage.getItem('zabiya_token');
  if (!token) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AuthRedirect({ children }: { children: React.ReactNode }) {
  // 🚨 FIX: If they have a token, instantly push them to the dashboard
  const token = localStorage.getItem('zabiya_token');
  if (token) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
function AppRoutes() {
  // Grab the modal triggers from your global context
  const { showAuthModal, setShowAuthModal } = useApp();

  return (
    <>
      <Routes>
        <Route path="/" element={<AuthRedirect><Landing /></AuthRedirect>} />
        
        {/* Changed from /app to /dashboard to match our AuthModal redirects */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* ✅ FIX: Moved the Admin route INSIDE the Routes block */}
        <Route path="/admin" element={<Admin />} />

        {/* Catch-all route should generally be at the bottom */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Pass the props so the modal ONLY opens when 'Enter Zabiya' is pressed */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}