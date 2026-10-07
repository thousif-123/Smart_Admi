import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, Home, LogIn, UserPlus, LayoutDashboard, FileText, Upload, CheckCircle, LogOut, Shield, User, Sun, Moon, Code, FolderOpen, Linkedin, Github } from 'lucide-react';
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
    <nav
      className={`flex items-center justify-between sticky top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "px-6 py-3 border-b bg-background/70 backdrop-blur-md shadow-lg dark:shadow-black/25 border-amber-900/5 dark:border-white/5"
          : "px-6 py-5 border-b bg-background/95 backdrop-blur-sm"
      }`}
    >
      <Link to="/" className="flex items-center gap-2">
        <GraduationCap className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold tracking-tight">SmartAdmi</span>
      </Link>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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
          <SheetContent
            side="left"
            className="w-[300px] sm:w-[350px] flex flex-col p-0 h-screen"
          >
            <SheetHeader className="border-b p-4 shrink-0">
              <SheetTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span>SmartAdmi</span>
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-4 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <NavLink to="/" icon={Home}>
                    Home
                  </NavLink>

                  {!user ? (
                    <>
                      <NavLink to="/login" icon={LogIn}>
                        Login
                      </NavLink>
                      <NavLink to="/signup" icon={UserPlus}>
                        Sign Up
                      </NavLink>
                    </>
                  ) : (
                    <>
                      {userRole === "admin" ? (
                        <>
                          <NavLink to="/admin" icon={Shield}>
                            Admin Dashboard
                          </NavLink>
                        </>
                      ) : (
                        <>
                          <NavLink to="/student" icon={LayoutDashboard}>
                            Student Dashboard
                          </NavLink>
                          <NavLink to="/student/apply" icon={FileText}>
                            Admission Form
                          </NavLink>
                          <NavLink to="/student/status" icon={CheckCircle}>
                            Application Status
                          </NavLink>
                          <NavLink to="/student/documents" icon={FolderOpen}>
                            Document Hub
                          </NavLink>
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
                    <span className="font-bold text-sm">
                      Download Project PDF
                    </span>
                  </a>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 px-2 mb-3 text-primary">
                    <Code className="h-5 w-5" />
                    <span className="font-bold text-sm uppercase tracking-wider">
                      Developers
                    </span>
                  </div>
                  <div className="space-y-3 px-1 pb-6">
                    {[
                      {
                        name: "Shaik Sabiha Sultana",
                        linkedin: "https://www.linkedin.com/in/sabiha-shaik-",
                        github: "https://github.com/codebysabiha",
                      },
                      {
                        name: "Shaik Mohammad Thousif",
                        linkedin:
                          "https://www.linkedin.com/in/shaik-mohammad-thousif",
                        github: "https://github.com/thousif-123",
                      },
                      {
                        name: "Shaik Ayesha Farheen",
                        linkedin:
                          "https://www.linkedin.com/in/ayesha-farheen-shaik-60b586381",
                        github: "https://github.com/Ayesha-9555",
                      },
                      {
                        name: "Seshamshetty Anusha",
                        linkedin:
                          "https://www.linkedin.com/in/sri-naidu-0841a0375",
                        github: "https://github.com/srinaidu0114",
                      },
                      {
                        name: "Syed Fayaz",
                        linkedin: "https://linkedin.com/in/syed-fayaz",
                        github: "https://github.com/syed-fayaz",
                      },
                    ].map((dev) => (
                      <div
                        key={dev.name}
                        className="px-3 py-2.5 flex flex-col gap-2 rounded-lg border bg-muted/30 border-transparent hover:border-primary/20 transition-all"
                      >
                        <div className="text-sm font-semibold text-foreground truncate">
                          {dev.name}
                        </div>
                        <div className="flex items-center gap-2">
                          {dev.linkedin && (
                            <a
                              href={dev.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 hover:bg-blue-600/20 dark:hover:bg-blue-500/30 transition-colors"
                            >
                              <Linkedin className="h-3.5 w-3.5" />
                              <span>LinkedIn</span>
                            </a>
                          )}
                          {dev.github && (
                            <a
                              href={dev.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-foreground/10 text-foreground hover:bg-foreground/20 transition-colors"
                            >
                              <Github className="h-3.5 w-3.5" />
                              <span>GitHub</span>
                            </a>
                          )}
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
                      <p className="text-sm font-bold truncate">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
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
                    Need help? Contact our support team at
                    support@meritmatrix.ai
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
