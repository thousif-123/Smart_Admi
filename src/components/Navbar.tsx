import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, Home, LogIn, UserPlus, LayoutDashboard, FileText, Upload, CheckCircle, LogOut, Shield, User, Sun, Moon, Code, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const AUTHORIZED_ADMIN_EMAILS = ['skthousif474@gmail.com', 'faculty@meritmatrix.ai'];

  useEffect(() => {
    const checkLocalSession = () => {
      const localUserSession = localStorage.getItem('smartadmi_user_session');
      if (localUserSession) {
        try {
          const parsed = JSON.parse(localUserSession);
          if (parsed && parsed.uid) {
            setUser(parsed);
            setUserRole(parsed.role || 'student');
            return true;
          }
        } catch (err) {
          console.error('Error parsing custom user session inside Navbar:', err);
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
            const isAdminEmail = AUTHORIZED_ADMIN_EMAILS.includes((currentUser.email || '').toLowerCase().trim());
            setUserRole(isAdminEmail ? 'admin' : 'student');
          }
        } catch (error: any) {
          const isOffline = error?.message?.toLowerCase().includes('offline') || String(error).toLowerCase().includes('offline');
          if (isOffline) {
            console.warn("Firestore offline during Navbar user role check, falling back to local email verification.");
          } else {
            console.error("Error fetching user role inside Navbar, falling back to email check:", error);
          }
          const isAdminEmail = AUTHORIZED_ADMIN_EMAILS.includes((currentUser.email || '').toLowerCase().trim());
          setUserRole(isAdminEmail ? 'admin' : 'student');
        }
      } else {
        const stillHasLocal = checkLocalSession();
        if (!stillHasLocal) {
          setUser(null);
          setUserRole(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem('smartadmi_user_session');
    setIsOpen(false);
    navigate('/login');
  };

  const NavLink = ({ to, icon: Icon, children, onClick }: any) => (
    <Link 
      to={to} 
      onClick={() => {
        setIsOpen(false);
        if (onClick) onClick();
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        location.pathname === to 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{children}</span>
    </Link>
  );

  return (
    <nav className={`flex items-center justify-between sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? "px-6 py-3 border-b bg-background/70 backdrop-blur-md shadow-lg dark:shadow-black/25 border-amber-900/5 dark:border-white/5" 
        : "px-6 py-5 border-b bg-background/95 backdrop-blur-sm"
    }`}>
      <Link to="/" className="flex items-center gap-2">
        <GraduationCap className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold tracking-tight">SmartAdmi</span>
      </Link>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger 
            render={
              <Button variant="ghost" size="icon" className="md:flex">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            }
          />
          <SheetContent side="left" className="w-[300px] sm:w-[350px] flex flex-col p-0 h-screen">
            <SheetHeader className="border-b p-4 shrink-0">
              <SheetTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span>SmartAdmi</span>
              </SheetTitle>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-4 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <NavLink to="/" icon={Home}>Home</NavLink>
                  
                  {!user ? (
                    <>
                      <NavLink to="/login" icon={LogIn}>Login</NavLink>
                      <NavLink to="/signup" icon={UserPlus}>Sign Up</NavLink>
                    </>
                  ) : (
                    <>
                      {userRole === 'admin' ? (
                        <>
                          <NavLink to="/admin" icon={Shield}>Admin Dashboard</NavLink>
                        </>
                      ) : (
                        <>
                          <NavLink to="/student" icon={LayoutDashboard}>Student Dashboard</NavLink>
                          <NavLink to="/student/apply" icon={FileText}>Admission Form</NavLink>
                          <NavLink to="/student/status" icon={CheckCircle}>Application Status</NavLink>
                          <NavLink to="/student/documents" icon={FolderOpen}>Document Hub</NavLink>
                        </>
                      )}
                    </>
                  )}

                  <a 
                    href="/api/project-doc-pdf" 
                    download="SmartAdmi_Project_Documentation.pdf"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-primary/5 hover:bg-primary/10 text-primary border border-dashed border-primary/30 mt-2 shadow-sm"
                  >
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-bold text-sm">Download Project PDF</span>
                  </a>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 px-2 mb-3 text-primary">
                    <Code className="h-5 w-5" />
                    <span className="font-bold text-sm uppercase tracking-wider">Developers</span>
                  </div>
                  <div className="space-y-3 px-1 pb-6">
                    {[
                      { name: "Shaik Sabiha Sultana", roles: ["Team Leader"], isLeader: true },
                      { name: "Shaik Ayesha Farheen", roles: ["Team Member"] },
                      { name: "Seshamshetty Anusha", roles: ["Team Member"] },
                      { name: "Syed Fayaz", roles: ["Team Member"] },
                      { name: "Shaik Mohammad Thousif", roles: ["Main Developer", "Team Member"], isMain: true }
                    ].map((dev) => (
                      <div key={dev.name} className={`px-3 py-2 flex flex-col gap-2 rounded-lg border transition-all ${dev.isLeader ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-muted/30 border-transparent hover:border-primary/20'}`}>
                        <div className="flex items-center justify-between gap-2">
                          <div className={`text-sm transition-colors truncate ${dev.isLeader ? 'font-black text-primary tracking-tight' : dev.isMain ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {dev.name}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {dev.roles.map((role) => (
                            <Badge 
                              key={role}
                              variant={dev.isLeader ? "secondary" : role === "Main Developer" ? "default" : "outline"} 
                              className="text-[9px] h-4 px-1.5 shrink-0"
                            >
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t bg-muted/20 shrink-0">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 px-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold truncate">{user.displayName || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg w-full text-left transition-colors hover:bg-destructive/10 text-destructive"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-background border shadow-sm">
                  <p className="text-xs text-muted-foreground text-center">
                    Need help? Contact our support team at support@meritmatrix.ai
                  </p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
