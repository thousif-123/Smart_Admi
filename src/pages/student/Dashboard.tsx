import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { GraduationCap, FileText, Upload, CheckCircle, Clock, LayoutDashboard, User, LogOut, ArrowRight, Loader2, Sparkles, Mail, XCircle, Bot, Send, MessageSquare, Tag } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firestoreErrorHandler';
import EapcetCollegeRecommendations from '@/components/EapcetCollegeRecommendations';
import { toast } from 'sonner';

export default function StudentDashboard() {
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isRecommending, setIsRecommending] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();

  // AI Copilot Dashboard Widget State
  const [dashboardCopilotInput, setDashboardCopilotInput] = useState('');
  const [dashboardCopilotAnswer, setDashboardCopilotAnswer] = useState<string | null>(null);
  const [dashboardCopilotLoading, setDashboardCopilotLoading] = useState(false);
  const [dashboardCopilotContext, setDashboardCopilotContext] = useState<string[]>([]);

  const handleAskDashboardCopilot = async (queryText?: string) => {
    const q = queryText || dashboardCopilotInput.trim();
    if (!q || dashboardCopilotLoading) return;

    if (!queryText) setDashboardCopilotInput('');
    setDashboardCopilotLoading(true);
    setDashboardCopilotAnswer(null);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const currentUser = auth.currentUser;
      if (currentUser) {
        if (typeof currentUser.getIdToken === 'function') {
          try {
            const idToken = await currentUser.getIdToken();
            headers['Authorization'] = `Bearer ${idToken}`;
          } catch (_) {
            headers['Authorization'] = `Bearer local:${currentUser.uid}`;
          }
        } else if (currentUser.uid) {
          headers['Authorization'] = `Bearer local:${currentUser.uid}`;
        }
        if (currentUser.uid) headers['x-user-uid'] = currentUser.uid;
      }

      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: q })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Copilot query failed');

      setDashboardCopilotAnswer(data.answer);
      setDashboardCopilotContext(data.contextUsed || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to query AI Copilot');
    } finally {
      setDashboardCopilotLoading(false);
    }
  };

  const handleDeleteAndReapply = async () => {
    if (!application) return;
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success("Rejected application data cleared. You can now register a new application.");
        setApplication(null);
        navigate('/student/apply');
      } else {
        toast.error("Failed to clear application. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!auth.currentUser) return;
      try {
        // Fetch application
        let appData: any = null;
        try {
          const res = await fetch(`/api/applications?studentUid=${auth.currentUser.uid}`);
          if (res.ok) {
            const apps = await res.json();
            if (apps && apps.length > 0) {
              appData = apps[0];
              setApplication(appData);
            }
          }
        } catch (error) {
          console.error('Error fetching application via API:', error);
        }

        // Fetch recommendations if marks are available
        if (appData && appData.marks12) {
          setIsRecommending(true);
          try {
            const res = await fetch('/api/recommend-courses', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                marks: {
                  marks12: appData.marks12,
                  marks10: appData.marks10,
                  rankEamcet: appData.rankEamcet
                },
                interests: appData.interests || ''
              })
            });
            if (res.ok) {
              const recs = await res.json();
              setRecommendations(recs || []);
            } else {
              console.warn('Backend recommendation route returned error');
            }
          } catch (recError) {
            console.error('Error fetching course recommendations:', recError);
          } finally {
            setIsRecommending(false);
          }
        }

        // Fetch automated notifications (emails sent)
        try {
          const res = await fetch(`/api/notifications?studentUid=${auth.currentUser.uid}`);
          if (res.ok) {
            const notifs = await res.json();
            // Sort notifications by sent time descending
            setNotifications((notifs || []).sort((a: any, b: any) => {
              const aTime = a.sentAt?.seconds || 0;
              const bTime = b.sentAt?.seconds || 0;
              return bTime - aTime;
            }));
          }
        } catch (error) {
          console.error('Error fetching notifications via API:', error);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const handleCollegeApply = (college: { collegeName: string; branch: string; code: string }) => {
    const selection = `${college.collegeName} (${college.code}) — ${college.branch}`;
    toast.info(`Continue your admission form to apply for ${college.collegeName}.`);
    navigate('/student/apply', { state: { selectedCollege: selection } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {auth.currentUser?.displayName?.split(' ')[0] || 'Student'}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your application.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {application && application.status === 'Rejected' && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in fade-in slide-in-from-top-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-destructive/20 text-destructive rounded-full mt-0.5">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-destructive">Your application was Rejected</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Reason / Feedback: <span className="italic font-medium text-foreground">"{application.feedback || 'None provided'}"</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  As per system rules, if your application is rejected, you have the chance to register again. Clearing this application will remove it from the database and allow a fresh registration.
                </p>
              </div>
            </div>
            {!showClearConfirm ? (
              <Button variant="destructive" size="sm" onClick={() => setShowClearConfirm(true)} className="w-full sm:w-auto font-semibold shrink-0">
                Clear & Register Again
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <span className="text-xs text-destructive font-black tracking-tight whitespace-nowrap">Are you sure? This deletes your old data.</span>
                <div className="flex items-center gap-2">
                  <Button variant="destructive" size="sm" onClick={handleDeleteAndReapply} className="font-semibold px-4">
                    Yes, Clear
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(false)} className="font-semibold bg-background hover:bg-accent px-4">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Application Status</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{application?.status || 'Not Started'}</div>
              <p className="text-xs text-muted-foreground">
                {application ? 'Updated recently' : 'Start your journey today'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Documents Uploaded</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{application?.documents ? 'Uploaded' : 'Pending'}</div>
              <p className="text-xs text-muted-foreground">
                {application?.documents ? 'All documents received' : 'Upload your certificates in the form'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Complete your application process</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {!application && (
                <Link to="/student/apply">
                  <Button className="w-full justify-between" variant="outline">
                    Fill Admission Form <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Link to="/student/status">
                <Button className="w-full justify-between" variant="outline">
                  Track Application <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/student/documents">
                <Button className="w-full justify-between" variant="outline">
                  Google Docs & SOP Workspace <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Recommendations
              </CardTitle>
              <CardDescription>Based on your profile and marks</CardDescription>
            </CardHeader>
            <CardContent>
              {isRecommending ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : recommendations.length > 0 ? (
                <ul className="space-y-4">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <GraduationCap className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{rec.title}</p>
                        <p className="text-xs text-muted-foreground">{rec.reason}</p>
                        <Badge variant="secondary" className="mt-1 text-[10px] h-4">
                          {rec.match} Match
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Submit your marks to get personalized course recommendations.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FEATURE 1 — AI Admission Copilot Dashboard Card */}
        <Card className="mt-6 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    SmartAdmi AI Copilot
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                      Context-Aware
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Ask questions about your application status, submitted marksheets, verification checks, or next steps.
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Suggested Question Chips */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Suggested Copilot Questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Why is my application pending?",
                  "Show my document status",
                  "Which documents are verified?",
                  "Is any document missing?",
                  "What should I do next?",
                  "Which engineering branches suit my academic profile?"
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskDashboardCopilot(q)}
                    disabled={dashboardCopilotLoading}
                    className="text-xs bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/40 border border-border px-3 py-1.5 rounded-full font-medium transition-all text-left truncate max-w-full"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskDashboardCopilot();
              }}
              className="flex items-center gap-2 pt-1"
            >
              <Input
                placeholder="Ask Copilot anything about your application..."
                value={dashboardCopilotInput}
                onChange={(e) => setDashboardCopilotInput(e.target.value)}
                disabled={dashboardCopilotLoading}
                className="bg-background text-sm"
              />
              <Button type="submit" disabled={dashboardCopilotLoading || !dashboardCopilotInput.trim()} className="gap-1.5 shrink-0">
                {dashboardCopilotLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Ask Copilot
              </Button>
            </form>

            {/* Answer Display */}
            {dashboardCopilotAnswer && (
              <div className="p-4 rounded-xl bg-card border border-primary/20 space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> SmartAdmi Copilot Answer
                  </span>
                  {dashboardCopilotContext.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Data Used:</span>
                      {dashboardCopilotContext.map((c, i) => (
                        <Badge key={i} variant="outline" className="text-[9px] py-0 px-1.5 bg-background">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-sm text-foreground whitespace-pre-line leading-relaxed font-sans">
                  {dashboardCopilotAnswer}
                </div>
              </div>
            )}
          </CardContent>
        </Card>


        {/* EAPCET College Recommendations & Rank Predictor */}
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <EapcetCollegeRecommendations 
            initialRank={application?.rankEamcet || ''} 
            studentInterests={application?.interests || ''} 
            onApply={handleCollegeApply}
          />
        </div>

        {/* Automated Email Notifications */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Automated Email History (System Notifications)
            </CardTitle>
            <CardDescription>
              Real-time logs of automated email notifications dispatched by the background service to your registered email address ({auth.currentUser?.email || 'N/A'}).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 border border-border rounded-lg bg-card hover:bg-muted/20 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                      <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        {notif.subject}
                      </div>
                      <Badge variant="outline" className="w-fit text-[10px]">
                        {notif.sentAt ? new Date(notif.sentAt.seconds * 1000).toLocaleString() : 'Just now'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-pre-line bg-muted/30 p-3 rounded-md border border-border/50 font-mono">
                      {notif.body}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm flex flex-col items-center gap-2">
                <Mail className="h-8 w-8 text-muted-foreground/50" />
                <p>No automated email notifications have been dispatched yet.</p>
                <p className="text-xs text-muted-foreground/70">
                  Email updates will trigger and display here instantly whenever an administrator changes your application status.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
