import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, ArrowLeft, CheckCircle2, Clock, ShieldAlert, FileSearch, UserCheck, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
// Imports removed as calling backend routes securely
import { toast } from 'sonner';
import ExplainableAIReport from '@/components/ExplainableAIReport';

export default function ApplicationStatus() {
  const navigate = useNavigate();
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleDeleteAndReapply = async () => {
    if (!application) return;
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        // Direct Firestore deletion fallback
        try {
          console.log(`[DEBUG] [handleDeleteAndReapply] Deleting application from Firestore directly...`);
          await deleteDoc(doc(db, 'applications', application.id));
          console.log(`[DEBUG] [handleDeleteAndReapply] Direct Firestore delete succeeded.`);
        } catch (fsErr) {
          console.warn('[DEBUG] [handleDeleteAndReapply] Direct Firestore delete failed:', fsErr);
        }

        toast.success("Rejected application data cleared. Redirecting you to register a new application...");
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
    const fetchApplication = async () => {
      if (!auth.currentUser) return;
      try {
        const res = await fetch(`/api/applications?studentUid=${auth.currentUser.uid}`);
        if (res.ok) {
          const apps = await res.json();
          if (apps && apps.length > 0) {
            setApplication(apps[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching application via API:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplication();
  }, []);

  const runEvaluation = async () => {
    if (!application) return;
    setIsProcessing(true);
    try {
      // The submission workflow already runs the complete document-forensics
      // pipeline. Do not replace that visual risk score here with the older
      // text-only check, which used the opposite score direction.
      const fraudRiskScore = Math.min(100, Math.max(0, Number(application.fraudScore) || 0));

      // 2. Get Final Decision
      const decisionRes = await fetch('/api/get-final-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            name: application.fullName,
            marks10: application.marks10,
            marks12: application.marks12,
            eamcetRank: application.rankEamcet,
            fraudScore: fraudRiskScore,
            careerGoals: application.careerGoals || ''
          }
        })
      });
      if (!decisionRes.ok) throw new Error('Decision evaluation API failed');
      const decisionResult = await decisionRes.json();

      // 3. Update application via API Proxy
      const newStatus = decisionResult.decision === 'Approved' ? 'Approved' : 'Rejected';
      const updatedPayload = {
        ...application,
        fraudScore: fraudRiskScore,
        aiRecommendation: decisionResult.decision,
        feedback: decisionResult.feedback,
        status: newStatus
      };

      const saveRes = await fetch(`/api/applications/${application.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload)
      });
      if (!saveRes.ok) throw new Error('Failed to update application on server');

      // Direct Firestore update fallback
      try {
        console.log(`[DEBUG] [runEvaluation] Mirroring updated application to Firestore client-side...`);
        await setDoc(doc(db, 'applications', application.id), updatedPayload, { merge: true });
        console.log(`[DEBUG] [runEvaluation] Direct Firestore update succeeded.`);
      } catch (fsErr) {
        console.warn('[DEBUG] [runEvaluation] Direct Firestore update failed:', fsErr);
      }

      // Trigger explicit email notification API
      fetch('/api/send-status-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: application.email || application.studentEmail || auth.currentUser?.email || '',
          studentName: application.fullName || application.studentName || 'Student',
          course: application.preferredCourse || application.course || 'Selected Course',
          status: newStatus,
          feedback: decisionResult.feedback || ''
        })
      }).catch(err => console.error('Error sending email notification:', err));

      // Refresh local state
      setApplication(updatedPayload);

      toast.success('AI Evaluation complete!');
    } catch (error) {
      console.error('Evaluation error:', error);
      toast.error('AI Evaluation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No Application Found</h2>
        <p className="text-muted-foreground mb-8">You haven't submitted an application yet.</p>
        <Link to="/student/apply">
          <Button>Start Application</Button>
        </Link>
      </div>
    );
  }

  const stages = [
    { id: 1, name: 'Form Submitted', status: 'completed', icon: <CheckCircle2 className="h-5 w-5" /> },
    { id: 2, name: 'Document Verification', status: application.documents ? 'completed' : 'processing', icon: <FileSearch className="h-5 w-5" /> },
    { id: 3, name: 'Fraud Detection Check', status: application.fraudScore !== undefined ? 'completed' : (application.documents ? 'processing' : 'pending'), icon: <ShieldAlert className="h-5 w-5" /> },
    { id: 4, name: 'Final Review', status: application.status === 'Approved' || application.status === 'Rejected' ? 'completed' : 'pending', icon: <UserCheck className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/student">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Application Pipeline</h1>
        </div>

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

        <div className="grid gap-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Current Status: {application.status}</CardTitle>
                  <CardDescription>Application ID: {application.id}</CardDescription>
                </div>
                <Badge variant={application.status === 'Approved' ? 'secondary' : application.status === 'Rejected' ? 'destructive' : 'outline'} className={application.status === 'Approved' ? 'bg-green-100 text-green-800' : ''}>
                  {application.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent">
                {stages.map((stage, i) => (
                  <div key={stage.id} className="relative flex items-center gap-6">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 z-10 bg-background ${
                      stage.status === 'completed' ? 'border-green-500 text-green-500' : 
                      stage.status === 'processing' ? 'border-primary text-primary animate-pulse' : 
                      'border-muted text-muted-foreground'
                    }`}>
                      {stage.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${stage.status === 'pending' ? 'text-muted-foreground' : ''}`}>
                          {stage.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {stage.status === 'completed' ? 'Completed' : stage.status === 'processing' ? 'In Progress' : 'Waiting'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {stage.id === 1 && "Basic details and career profile successfully recorded."}
                        {stage.id === 2 && (application.documents ? "Academic certificates uploaded and scanned." : "Waiting for document upload.")}
                        {stage.id === 3 && (application.fraudScore !== undefined ? "Advanced ML integrity verification completed." : "System verifying record consistency.")}
                        {stage.id === 4 && (application.status === 'Approved' || application.status === 'Rejected' ? `Final admission decision: ${application.status}` : "Your application is undergoing final board review.")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {application.fraudScore !== undefined && (
            <ExplainableAIReport application={application} showOcrRaw={false} />
          )}

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Application Summary</CardTitle>
              <CardDescription>Verifiable submitted academic profile details</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Student Details</div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{application.fullName}</span>
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span className="font-medium">{application.dob}</span>
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium uppercase">{application.category}</span>
                  <span className="text-muted-foreground">EAMCET Hall Ticket:</span>
                  <span className="font-mono">{application.hallTicketEamcet}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Academic Profile</div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                  <span className="text-muted-foreground">10th GPA/Marks:</span>
                  <span className="font-medium">{application.marks10}%</span>
                  <span className="text-muted-foreground">12th Stream:</span>
                  <span className="font-medium">{application.stream12}</span>
                  <span className="text-muted-foreground">12th Marks:</span>
                  <span className="font-medium">{application.marks12}%</span>
                  <span className="text-muted-foreground">EAMCET Rank:</span>
                  <span className="font-medium">{application.rankEamcet}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
