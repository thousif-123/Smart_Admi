/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/student/Dashboard';
import AdmissionForm from './pages/student/AdmissionForm';
import ApplicationStatus from './pages/student/Status';
import DocumentHub from './pages/student/DocumentHub';
import AdminDashboard from './pages/admin/Dashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CollegeDirectoryPage from './pages/CollegeDirectoryPage';

// Components
import Chatbot from './components/Chatbot';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Background3D from './components/Background3D';
import { ThemeProvider } from './components/ThemeProvider';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: 'student' | 'admin' }) {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const AUTHORIZED_ADMIN_EMAILS = ['skthousif474@gmail.com', 'faculty@meritmatrix.ai'];

  useEffect(() => {
    // Check local storage session first
    const checkLocalSession = () => {
      const localUserSession = localStorage.getItem('smartadmi_user_session');
      if (localUserSession) {
        try {
          const parsed = JSON.parse(localUserSession);
          if (parsed && parsed.uid) {
            setUser(parsed);
            setUserRole(parsed.role || 'student');
            setLoading(false);
            return true;
          }
        } catch (err) {
          console.error('Error parsing custom user session:', err);
        }
      }
      return false;
    };

    const hasLocal = checkLocalSession();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            // Document does not exist, fallback to email check
            const isAdminEmail = AUTHORIZED_ADMIN_EMAILS.includes((currentUser.email || '').toLowerCase().trim());
            setUserRole(isAdminEmail ? 'admin' : 'student');
          }
        } catch (error: any) {
          const errorStr = (error?.message || String(error) || '').toLowerCase();
          const isOffline = errorStr.includes('offline') || 
                            error?.code === 'unavailable' || 
                            errorStr.includes('failed to get document') ||
                            errorStr.includes('network');
          if (isOffline) {
            console.warn("Firestore offline during user role check, falling back to local email verification.");
          } else {
            console.warn("Could not fetch user role due to network/Firestore issue, falling back to local email verification:", error?.message || error);
          }
          const isAdminEmail = AUTHORIZED_ADMIN_EMAILS.includes((currentUser.email || '').toLowerCase().trim());
          setUserRole(isAdminEmail ? 'admin' : 'student');
        }
        setLoading(false);
      } else {
        // If there's no active firebase user, check if we have a local session fallback
        const stillHasLocal = checkLocalSession();
        if (!stillHasLocal) {
          setUser(null);
          setUserRole(null);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/student'} />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased relative">
          <Background3D />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/colleges" element={<CollegeDirectoryPage />} />
            
            {/* Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/apply" element={
              <ProtectedRoute role="student">
                <AdmissionForm />
              </ProtectedRoute>
            } />
            <Route path="/student/status" element={
              <ProtectedRoute role="student">
                <ApplicationStatus />
              </ProtectedRoute>
            } />
            <Route path="/student/documents" element={
              <ProtectedRoute role="student">
                <DocumentHub />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
          <Chatbot />
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </ThemeProvider>
  );
}
