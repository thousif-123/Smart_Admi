import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { auth, db, googleProvider } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firestoreErrorHandler';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const AUTHORIZED_ADMIN_EMAILS = ['skthousif474@gmail.com', 'faculty@meritmatrix.ai'];

  const handleUserRedirect = async (uid: string, emailStr?: string | null) => {
    const isAdminEmail = AUTHORIZED_ADMIN_EMAILS.includes((emailStr || '').toLowerCase().trim());
    const finalRole = isAdminEmail ? 'admin' : 'student';

    let userDoc: any = null;
    let isOffline = false;

    try {
      userDoc = await getDoc(doc(db, 'users', uid));
    } catch (fsErr) {
      console.warn("Firestore offline or error during login role fetch, falling back to email check.", fsErr);
      isOffline = true;
    }

    if (!isOffline && userDoc && userDoc.exists()) {
      const userData = userDoc.data();
      // Enforce authorization constraints
      if (userData.role !== finalRole) {
        try {
          await setDoc(doc(db, 'users', uid), { role: finalRole }, { merge: true });
        } catch (fsErr) {
          console.warn("Firestore error updating role during login, proceeding anyway.", fsErr);
        }
        userData.role = finalRole;
      }
      toast.success('Logged in successfully');
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } else {
      // Create user profile in Firestore
      try {
        await setDoc(doc(db, 'users', uid), {
          uid: uid,
          email: emailStr || '',
          fullName: auth.currentUser?.displayName || 'Student',
          role: finalRole,
          provider: auth.currentUser?.providerData[0]?.providerId || 'password',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          profileCompleted: false
        });
      } catch (fsErr) {
        console.warn("Firestore error creating user profile during login, proceeding anyway.", fsErr);
      }
      toast.success('Logged in successfully' + (isOffline ? ' (Offline Mode)' : ''));
      if (finalRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await handleUserRedirect(user.uid, user.email);
    } catch (error: any) {
      console.warn('Firebase email/password sign-in failed. Attempting local login fallback...', error);
      
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json().catch(() => ({}));
        
        if (response.ok && data.success && data.user) {
          // Store user session in localStorage
          localStorage.setItem('smartadmi_user_session', JSON.stringify(data.user));
          toast.success('Signed in successfully using secure local fallback!');
          navigate(data.user.role === 'admin' ? '/admin' : '/student');
          return;
        }
        
        throw new Error(data.error || 'Local login fallback failed');
      } catch (fallbackError: any) {
        console.error('Local fallback login also failed:', fallbackError);
        
        if (error.code === 'auth/operation-not-allowed' || (error.message && error.message.includes('operation-not-allowed'))) {
          toast.error('Email/Password login is disabled in your Firebase console. Please enable it under Authentication -> Sign-in method, or use "Sign In with Google".', {
            duration: 10000
          });
        } else {
          console.error('Login error:', error);
          if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            toast.error('Invalid email or password. Please try again.');
          } else if (error.code === 'auth/too-many-requests') {
            toast.error('Too many failed login attempts. Please try again later.');
          } else if (error.code === 'auth/invalid-email') {
            toast.error('Please enter a valid email address.');
          } else {
            toast.error(fallbackError.message || error.message || 'Failed to sign in.');
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await handleUserRedirect(user.uid, user.email);
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Failed to login with Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address in the Email field first.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Please check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send password reset email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold tracking-tight">SmartAdmi</span>
          </Link>
        </div>
        <Card className="border-none shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full h-11 text-base font-semibold" type="submit" disabled={isLoading || isGoogleLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>

              <div className="relative w-full my-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-11" 
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                )}
                Sign In with Google
              </Button>

              <div className="text-center text-sm text-muted-foreground mt-2">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Sign Up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
