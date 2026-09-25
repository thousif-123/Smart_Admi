import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  ExternalLink, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft, 
  FileCheck, 
  FolderOpen, 
  ArrowRight, 
  LogOut, 
  FileEdit,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { 
  signInWithWorkspace, 
  getWorkspaceAccessToken, 
  logoutWorkspace, 
  setWorkspaceAccessToken 
} from '@/lib/googleAuth';
import { 
  listGoogleDocs, 
  createDocWithContent, 
  GoogleDocFile 
} from '@/lib/googleDocs';

export default function DocumentHub() {
  const [application, setApplication] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  // Google Docs Auth & Files
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [docsList, setDocsList] = useState<GoogleDocFile[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);

  // SOP Generator State
  const [sopInterests, setSopInterests] = useState('');
  const [sopSkills, setSopSkills] = useState('');
  const [sopCareerGoals, setSopCareerGoals] = useState('');
  const [generatedSop, setGeneratedSop] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExportingSop, setIsExportingSop] = useState(false);
  const [exportedSopLink, setExportedSopLink] = useState('');

  // Offer Letter State
  const [isExportingOffer, setIsExportingOffer] = useState(false);
  const [exportedOfferLink, setExportedOfferLink] = useState('');
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  // 1. Load application profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      try {
        const res = await fetch(`/api/applications?studentUid=${auth.currentUser.uid}`);
        if (res.ok) {
          const apps = await res.json();
          if (apps && apps.length > 0) {
            const appData = apps[0];
            setApplication(appData);
            setSopInterests(appData.interests || '');
            setSopSkills(appData.skills || '');
            setSopCareerGoals(appData.careerGoals || '');
          }
        }
      } catch (error) {
        console.error('Error fetching application profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
    
    // Check if we already have an active Workspace session token cached
    const activeToken = getWorkspaceAccessToken();
    if (activeToken) {
      setIsConnected(true);
      fetchDocsList();
    }
  }, []);

  // 2. Fetch documents from Google Drive
  const fetchDocsList = async () => {
    setDocsLoading(true);
    try {
      const files = await listGoogleDocs(10);
      setDocsList(files);
    } catch (err: any) {
      console.error('Failed to list files:', err);
      // If token expired or failed, request reconnect
      if (err.message?.includes('401') || err.message?.includes('token')) {
        setIsConnected(false);
        logoutWorkspace();
      }
    } finally {
      setDocsLoading(false);
    }
  };

  // 3. Google Workspace Sign In
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const result = await signInWithWorkspace();
      if (result?.accessToken) {
        setIsConnected(true);
        toast.success('Successfully connected to Google Workspace!');
        // Fetch files immediately after connection
        setDocsLoading(true);
        const files = await listGoogleDocs(10);
        setDocsList(files);
      }
    } catch (err: any) {
      toast.error(err.message || 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  // 4. Disconnect Google Workspace
  const handleDisconnect = async () => {
    await logoutWorkspace();
    setIsConnected(false);
    setDocsList([]);
    setExportedSopLink('');
    setExportedOfferLink('');
    toast.success('Disconnected from Google Workspace');
    setShowDisconnectConfirm(false);
  };

  // 5. Generate Statement of Purpose (SOP) via API
  const handleGenerateSOP = async () => {
    if (!application) {
      toast.error('Please submit your Admission Form first to feed candidate credentials to the AI writer!');
      return;
    }
    
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-sop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentData: {
            name: application.fullName,
            course: application.preferredCourse,
            math: application.marks12 || '85',
            physics: application.marks12 || '85',
            chemistry: application.marks12 || '85',
            interests: sopInterests,
            skills: sopSkills,
            careerGoals: sopCareerGoals
          }
        })
      });

      if (!res.ok) throw new Error('Failed to generate SOP');
      const data = await res.json();
      setGeneratedSop(data.sop);
      toast.success('SOP generated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate SOP');
    } finally {
      setIsGenerating(false);
    }
  };

  // 6. Export SOP to Google Docs
  const handleExportSop = async () => {
    if (!generatedSop) {
      toast.error('Please generate or write an SOP first!');
      return;
    }

    setIsExportingSop(true);
    try {
      const title = `Statement of Purpose - ${application?.fullName || auth.currentUser?.displayName || 'Student'}`;
      const file = await createDocWithContent(title, generatedSop);
      if (file.webViewLink) {
        setExportedSopLink(file.webViewLink);
        toast.success('SOP exported successfully to Google Docs!');
        // Refresh document list
        fetchDocsList();
      }
    } catch (err: any) {
      toast.error(err.message || 'SOP export failed');
    } finally {
      setIsExportingSop(false);
    }
  };

  // 7. Export Admission Offer Letter to Google Docs
  const handleExportOffer = async () => {
    if (!application || application.status !== 'Approved') {
      toast.error('Only approved applications are eligible for an official Admission Offer Letter!');
      return;
    }

    setIsExportingOffer(true);
    try {
      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const offerLetterContent = `SMARTADMI UNIVERSITY ADMISSIONS OFFICE
OFFICIAL ADMISSION OFFER LETTER

Date: ${today}
Application ID: ${application.id || 'N/A'}
Candidate Name: ${application.fullName}
Aadhaar ID: ${application.aadhaar || 'N/A'}

---------------------------------------------------------

Dear ${application.fullName},

We are absolutely thrilled to extend you a formal offer of admission to SmartAdmi University for our upcoming academic intake!

Following a rigorous review of your academic profile, 12th marks (${application.marks12}%), and EAMCET Rank (${application.rankEamcet}), our Board and AI Integrity Evaluator have verified your credentials as outstanding.

Course Approved: ${application.preferredCourse}
Decision: Approved / Active Offer

To secure your seat, please complete your online enrollment verification and confirm your acceptance on the SmartAdmi portal.

Once again, congratulations on your admission. We look forward to seeing your contributions to our innovative student community!

Sincerely,

Admissions Committee
SmartAdmi University Office of the Registrar
admin@meritmatrix.ai`;

      const title = `Admission Offer Letter - ${application.fullName}`;
      const file = await createDocWithContent(title, offerLetterContent);
      if (file.webViewLink) {
        setExportedOfferLink(file.webViewLink);
        toast.success('Offer Letter exported successfully to Google Docs!');
        // Refresh document list
        fetchDocsList();
      }
    } catch (err: any) {
      toast.error(err.message || 'Offer Letter export failed');
    } finally {
      setIsExportingOffer(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/student">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Google Workspace Hub</h1>
              <p className="text-muted-foreground">Manage and export your official academic documents to Google Docs.</p>
            </div>
          </div>
          
          {isConnected && (
            <div className="flex items-center gap-2">
              {!showDisconnectConfirm ? (
                <Button variant="outline" onClick={() => setShowDisconnectConfirm(true)} className="gap-2">
                  <LogOut className="h-4 w-4" /> Disconnect Workspace
                </Button>
              ) : (
                <div className="flex items-center gap-2 bg-destructive/10 p-1 rounded-lg border border-destructive/20 animate-in fade-in slide-in-from-top-2">
                  <span className="text-xs text-destructive font-bold px-2 whitespace-nowrap">Are you sure?</span>
                  <Button variant="destructive" size="sm" onClick={handleDisconnect} className="h-8 font-semibold px-3 text-xs">
                    Yes, Disconnect
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowDisconnectConfirm(false)} className="h-8 font-semibold bg-background hover:bg-accent px-3 text-xs">
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT PANEL: Connection & Drive Browser */}
          <div className="lg:col-span-1 space-y-6">
            {!isConnected ? (
              <Card className="border-none shadow-xl bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <GraduationCap className="w-40 h-40" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Connect Workspace
                  </CardTitle>
                  <CardDescription>
                    Authorize SmartAdmi to securely access your Google Docs and Drive so you can read, write, and manage your student documents.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-background p-4 border text-xs text-muted-foreground space-y-2">
                    <p className="font-semibold text-foreground">Requested Authorizations:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Create Statement of Purpose (SOP) documents</li>
                      <li>Export official university offer letters</li>
                      <li>Browse your existing Google Docs</li>
                    </ul>
                  </div>
                  
                  <button 
                    onClick={handleConnect} 
                    disabled={isConnecting}
                    className="w-full relative flex items-center justify-center gap-3 px-4 py-3 bg-foreground text-background font-medium rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer text-sm shadow-md"
                  >
                    {isConnecting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5.04c1.78 0 3.37.61 4.63 1.81l3.47-3.47C18.01 1.48 15.22 1 12 1 7.35 1 3.39 3.65 1.51 7.5l4.03 3.12C6.48 7.37 8.99 5.04 12 5.04z" />
                        <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.61-.21-2.38H12v4.51h6.45c-.28 1.47-1.11 2.72-2.35 3.56l3.65 2.83c2.14-1.97 3.38-4.87 3.38-8.52z" />
                        <path fill="#FBBC05" d="M5.54 14.51a6.83 6.83 0 0 1 0-4.02L1.51 7.37a11.96 11.96 0 0 0 0 9.27l4.03-3.13z" />
                        <path fill="#34A853" d="M12 23c3.24 0 5.96-1.07 7.95-2.91l-3.65-2.83c-1.01.68-2.31 1.08-4.3 1.08-3.01 0-5.52-2.33-6.46-5.58L1.51 16.29C3.39 20.35 7.35 23 12 23z" />
                      </svg>
                    )}
                    <span>Sign in with Google</span>
                  </button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-none shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-indigo-500" />
                    My Google Documents
                  </CardTitle>
                  <CardDescription>
                    Browse your last 10 Google Docs directly from your active Drive connection.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-semibold">RECENT FILES</span>
                    <Button variant="ghost" size="xs" onClick={fetchDocsList} className="text-primary hover:underline h-6 text-xs px-2">
                      Refresh
                    </Button>
                  </div>
                  
                  {docsLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">Listing documents...</span>
                    </div>
                  ) : docsList.length > 0 ? (
                    <ScrollArea className="h-[320px] pr-2">
                      <div className="space-y-2">
                        {docsList.map((docFile) => (
                          <div 
                            key={docFile.id} 
                            className="p-3 border rounded-lg bg-card hover:bg-muted/30 transition-colors flex items-start gap-3 group"
                          >
                            <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-foreground truncate">{docFile.name}</p>
                              <p className="text-[10px] text-muted-foreground">
                                Modified: {docFile.modifiedTime ? new Date(docFile.modifiedTime).toLocaleDateString() : 'Recent'}
                              </p>
                            </div>
                            {docFile.webViewLink && (
                              <a 
                                href={docFile.webViewLink} 
                                target="_blank" 
                                rel="noreferrer" 
                                referrerPolicy="no-referrer"
                                className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-12 border border-dashed rounded-lg">
                      <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">No Google Docs found in your account.</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">Exported documents will show up here instantly.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Admission Status Checker */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Application Track</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Current Status:</span>
                  <Badge variant={application?.status === 'Approved' ? 'secondary' : application?.status === 'Rejected' ? 'destructive' : 'outline'} className={application?.status === 'Approved' ? 'bg-green-100 text-green-800' : ''}>
                    {application?.status || 'Not Started'}
                  </Badge>
                </div>
                {application && (
                  <div className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border">
                    <p className="font-semibold text-foreground mb-1">{application.fullName}</p>
                    <p>Course: {application.preferredCourse}</p>
                    <p>Marks (12th): {application.marks12}%</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT PANEL: Docs Creators */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-xl">
              <CardHeader className="border-b">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                  AI Document Generator Workspace
                </CardTitle>
                <CardDescription>
                  Draft and publish professional Statement of Purposes and official letters directly to your Google Workspace.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="sop" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="sop" className="text-sm py-2">
                      Statement of Purpose (SOP)
                    </TabsTrigger>
                    <TabsTrigger value="offer" className="text-sm py-2" disabled={!application || application.status !== 'Approved'}>
                      Admission Offer Letter {!application || application.status !== 'Approved' ? '🔒' : '🌟'}
                    </TabsTrigger>
                  </TabsList>

                  {/* TAB 1: Statement of Purpose */}
                  <TabsContent value="sop" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="sop-interests" className="text-xs font-semibold text-muted-foreground uppercase">Academic & Personal Interests</Label>
                        <Textarea 
                          id="sop-interests" 
                          placeholder="What subjects, fields of research, or activities inspire you?" 
                          value={sopInterests}
                          onChange={(e) => setSopInterests(e.target.value)}
                          className="h-24 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sop-skills" className="text-xs font-semibold text-muted-foreground uppercase">Key Skills & Practical Training</Label>
                        <Textarea 
                          id="sop-skills" 
                          placeholder="List your projects, coding, leadership, or specialized technical skills." 
                          value={sopSkills}
                          onChange={(e) => setSopSkills(e.target.value)}
                          className="h-24 text-sm"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="sop-career" className="text-xs font-semibold text-muted-foreground uppercase">Short & Long-term Career Goals</Label>
                        <Textarea 
                          id="sop-career" 
                          placeholder="Where do you see yourself in 3-5 years? Why this specific course?" 
                          value={sopCareerGoals}
                          onChange={(e) => setSopCareerGoals(e.target.value)}
                          className="h-20 text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button 
                        onClick={handleGenerateSOP} 
                        disabled={isGenerating || !application}
                        className="flex-1 gap-2"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Drafting SOP...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 text-amber-400" /> Draft Statement of Purpose
                          </>
                        )}
                      </Button>

                      {isConnected && generatedSop && (
                        <Button 
                          onClick={handleExportSop} 
                          disabled={isExportingSop}
                          variant="secondary"
                          className="flex-1 gap-2 border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 dark:bg-indigo-950/20 dark:border-indigo-950"
                        >
                          {isExportingSop ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> Exporting...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 text-indigo-500" /> Save as Google Doc
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    <AnimatePresence>
                      {generatedSop && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="space-y-3"
                        >
                          <div className="flex justify-between items-center pt-4 border-t">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                              <FileEdit className="h-4 w-4 text-primary" /> Generated SOP Document Preview
                            </span>
                          </div>
                          
                          <ScrollArea className="h-[280px] p-4 border rounded-lg bg-muted/25 text-sm font-sans whitespace-pre-line leading-relaxed">
                            {generatedSop}
                          </ScrollArea>
                          
                          {exportedSopLink && (
                            <motion.div 
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-full text-green-600 dark:text-green-400">
                                  <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-green-800 dark:text-green-300">Successfully Created!</p>
                                  <p className="text-[10px] text-green-700/80 dark:text-green-400/80">"Statement of Purpose" is now live on your Google Drive.</p>
                                </div>
                              </div>
                              <a 
                                href={exportedSopLink} 
                                target="_blank" 
                                rel="noreferrer"
                                referrerPolicy="no-referrer"
                              >
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1 text-xs">
                                  Open Google Doc <ExternalLink className="h-3 w-3" />
                                </Button>
                              </a>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </TabsContent>

                  {/* TAB 2: Admission Offer Letter */}
                  <TabsContent value="offer" className="space-y-6">
                    <div className="p-5 border border-dashed rounded-lg bg-primary/5 text-center max-w-lg mx-auto">
                      <GraduationCap className="h-10 w-10 text-primary mx-auto mb-3 animate-bounce" />
                      <h3 className="font-bold text-base text-foreground">Congratulations! Your application is approved.</h3>
                      <p className="text-xs text-muted-foreground mt-2 mb-4">
                        As an approved applicant, you can export your verified, official Offer of Admission letter directly to your connected Google Docs space. It serves as your official enrolment collateral.
                      </p>

                      <div className="flex justify-center gap-3">
                        {isConnected ? (
                          <Button 
                            onClick={handleExportOffer} 
                            disabled={isExportingOffer}
                            className="gap-2"
                          >
                            {isExportingOffer ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" /> Publishing...
                              </>
                            ) : (
                              <>
                                <FileCheck className="h-4 w-4" /> Export Offer Letter to Google Docs
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button onClick={handleConnect} disabled={isConnecting} className="gap-2">
                            Connect Google Drive to Export Offer
                          </Button>
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {exportedOfferLink && (
                        <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-between max-w-lg mx-auto"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/20 rounded-full text-green-600 dark:text-green-400">
                              <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-green-800 dark:text-green-300">Offer Letter Exported!</p>
                              <p className="text-[10px] text-green-700/80 dark:text-green-400/80">Document created and synced to your Google Docs repository.</p>
                            </div>
                          </div>
                          <a 
                            href={exportedOfferLink} 
                            target="_blank" 
                            rel="noreferrer"
                            referrerPolicy="no-referrer"
                          >
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1 text-xs">
                              Open Doc <ExternalLink className="h-3 w-3" />
                            </Button>
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
