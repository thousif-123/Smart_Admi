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
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firestoreErrorHandler';

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!fullName.trim()) {
      toast.error('Full Name cannot be empty.');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email format must be valid.');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error('Password must contain at least one uppercase letter.');
      setIsLoading(false);
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error('Password must contain at least one lowercase letter.');
      setIsLoading(false);
      return;
    }

    if (!/[0-9]/.test(password)) {
      toast.error('Password must contain at least one number.');
      setIsLoading(false);
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      toast.error('Password must contain at least one special character.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Confirm Password must match Password.');
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: fullName });

      // Create user profile in Firestore
      // Every newly registered account must automatically receive the role "student"
      const finalRole = 'student';
      
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          fullName: fullName,
          email: user.email || email,
          phoneNumber: phoneNumber || '',
          role: finalRole,
          provider: 'password',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          profileCompleted: false
        });
      } catch (fsErr) {
        console.error('Error writing user profile to firestore:', fsErr);
        handleFirestoreError(fsErr, OperationType.WRITE, `users/${user.uid}`);
      }
      
      toast.success('Account created successfully');
      navigate('/student');
    } catch (error: any) {
      console.warn('Firebase email/password signup failed. Attempting local registration fallback...', error);
      
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, fullName, phoneNumber })
        });
        
        const data = await response.json().catch(() => ({}));
        
        if (response.ok && data.success && data.user) {
          // Store user session in localStorage
          localStorage.setItem('smartadmi_user_session', JSON.stringify(data.user));
          toast.success('Registered successfully using secure local fallback!');
          navigate(data.user.role === 'admin' ? '/admin' : '/student');
          return;
        }
        
        throw new Error(data.error || 'Local signup fallback failed');
      } catch (fallbackError: any) {
        console.error('Local fallback registration also failed:', fallbackError);
        
        if (error.code === 'auth/operation-not-allowed' || (error.message && error.message.includes('operation-not-allowed'))) {
          toast.error('Email/Password registration is disabled in your Firebase console. Please enable it under Authentication -> Sign-in method, or use "Sign Up with Google".', {
            duration: 10000
          });
        } else {
          console.error('Signup error:', error);
          if (error.code === 'auth/email-already-in-use') {
            toast.error('Email already in use. Please use a different email or sign in.');
          } else if (error.code === 'auth/weak-password') {
            toast.error('Weak password. Please enter a stronger password.');
          } else if (error.code === 'auth/invalid-email') {
            toast.error('Invalid email format.');
          } else if (error.code === 'auth/network-request-failed') {
            toast.error('Network error. Please check your internet connection.');
          } else {
            toast.error(fallbackError.message || error.message || 'Failed to create account');
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore, if not create
      let userDoc: any = null;
      let isOffline = false;
      try {
        userDoc = await getDoc(doc(db, 'users', user.uid));
      } catch (fsErr) {
        console.warn("Firestore offline or error during signup, falling back to email check.", fsErr);
        isOffline = true;
      }

      if (isOffline) {
        toast.success('Signed in successfully (Offline Mode)');
        navigate('/student');
      } else if (!userDoc || !userDoc.exists()) {
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            fullName: user.displayName || 'Student',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            role: 'student',
            provider: 'google',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            profileCompleted: false
          });
        } catch (fsErr) {
          console.warn("Firestore error creating user during signup, proceeding anyway.", fsErr);
        }
        toast.success('Signed up with Google successfully');
        navigate('/student');
      } else {
        // Enforce role consistency for existing accounts too
        const userData = userDoc.data();
        const finalRole = userData.role || 'student';
        toast.success('Signed in with Google successfully');
        if (finalRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/student');
        }
      }
    } catch (error: any) {
      console.error('Google signup error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setIsGoogleLoading(false);
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
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Register or sign up for your SmartAdmi account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  placeholder="John Doe" 
                  required 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
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
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input 
                  id="phoneNumber" 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Min. 8 characters with A-Z, a-z, 0-9, and symbol"
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Re-enter your password"
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full h-11 text-base font-semibold" type="submit" disabled={isLoading || isGoogleLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
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
                onClick={handleGoogleSignup}
                disabled={isLoading || isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                )}
                Sign Up with Google
              </Button>

              <div className="text-center text-sm text-muted-foreground mt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
