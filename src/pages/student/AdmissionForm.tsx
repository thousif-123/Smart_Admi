import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { GraduationCap, ArrowLeft, Loader2, Wand2, Upload, X, FileText, CheckCircle2, Save, ScanLine, AlertTriangle, ShieldCheck, Search } from 'lucide-react';
import { toast } from 'sonner';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { runMLFraudAnalysis } from '@/lib/mlFraudService';
import { getApplication, saveApplication } from '@/lib/applicationService';
import { EAPCET_COLLEGES_DATABASE } from '@/components/EapcetCollegeRecommendations';

const MAX_COLLEGE_PREFERENCES = 20;
// Curated AP EAPCET counselling choices. This is deliberately labelled as a
// preference shortlist, not a live government ranking; cut-offs and seats can
// change every counselling year.
const ANDHRA_PRADESH_TOP_COLLEGES = [
  { code: 'AUCE', collegeName: 'Andhra University College of Engineering', location: 'Visakhapatnam', type: 'University' as const },
  { code: 'JNTUK', collegeName: 'JNTU College of Engineering, Kakinada', location: 'Kakinada', type: 'University' as const },
  { code: 'JNTUA', collegeName: 'JNTU College of Engineering, Anantapur', location: 'Anantapur', type: 'University' as const },
  { code: 'SVUCE', collegeName: 'Sri Venkateswara University College of Engineering', location: 'Tirupati', type: 'University' as const },
  { code: 'GVP', collegeName: 'Gayatri Vidya Parishad College of Engineering', location: 'Visakhapatnam', type: 'Private' as const },
  { code: 'VRSEC', collegeName: 'Velagapudi Ramakrishna Siddhartha Engineering College', location: 'Vijayawada', type: 'Private' as const },
  { code: 'RVRJC', collegeName: 'RVR & JC College of Engineering', location: 'Guntur', type: 'Private' as const },
  { code: 'ANITS', collegeName: 'Anil Neerukonda Institute of Technology and Sciences', location: 'Visakhapatnam', type: 'Private' as const },
  { code: 'GMRIT', collegeName: 'GMR Institute of Technology', location: 'Rajam', type: 'Private' as const },
  { code: 'SRKR', collegeName: 'S.R.K.R. Engineering College', location: 'Bhimavaram', type: 'Private' as const },
  { code: 'PVPS', collegeName: 'Prasad V. Potluri Siddhartha Institute of Technology', location: 'Vijayawada', type: 'Private' as const },
  { code: 'VVIT', collegeName: 'Vasireddy Venkatadri Institute of Technology', location: 'Guntur', type: 'Private' as const },
  { code: 'SREC', collegeName: 'Shri Vishnu Engineering College for Women', location: 'Bhimavaram', type: 'Private' as const },
  { code: 'VIGNAN', collegeName: 'Vignan’s Institute of Information Technology', location: 'Visakhapatnam', type: 'Private' as const },
  { code: 'MITS', collegeName: 'Madanapalle Institute of Technology & Science', location: 'Madanapalle', type: 'Private' as const },
  { code: 'AITAM', collegeName: 'Aditya Institute of Technology and Management', location: 'Tekkali', type: 'Private' as const },
  { code: 'ADIT', collegeName: 'Aditya Engineering College', location: 'Surampalem', type: 'Private' as const },
  { code: 'LBRCE', collegeName: 'Lakireddy Bali Reddy College of Engineering', location: 'Mylavaram', type: 'Private' as const },
  { code: 'NRI', collegeName: 'NRI Institute of Technology', location: 'Agiripalli', type: 'Private' as const },
  { code: 'SVCET', collegeName: 'Sri Venkateswara College of Engineering', location: 'Tirupati', type: 'Private' as const }
];

const COLLEGE_OPTIONS = Array.from(
  new Map([...ANDHRA_PRADESH_TOP_COLLEGES, ...EAPCET_COLLEGES_DATABASE.map((college) => ({
    code: college.code,
    collegeName: college.collegeName,
    location: college.location,
    type: college.type
  }))].map((college) => [college.code, college])).values()
);

const parseCollegePreferences = (value: string) => value
  .split('\n')
  .map((item) => item.trim())
  .filter(Boolean);

// Helper function to compress base64 images in browser before upload
const compressImage = (base64Str: string, maxWidth = 1024, maxHeight = 1024, quality = 0.75): Promise<string> => {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith('data:image/')) {
      resolve(base64Str);
      return;
    }
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

// Helper function to reject a promise if it exceeds a timeout limit
const withTimeoutReject = <T extends unknown>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      console.warn(`[TIMEOUT] Operation exceeded ${timeoutMs}ms. Rejecting.`);
      reject(new Error(errorMessage));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

export default function AdmissionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitStep, setSubmitStep] = useState('');
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});
  const [existingApplication, setExistingApplication] = useState<any>(null);
  const [isCheckingExisting, setIsCheckingExisting] = useState(true);
  const [readOnly, setReadOnly] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isExtractingRank, setIsExtractingRank] = useState(false);
  const [rankCardCheck, setRankCardCheck] = useState<{
    rank: number;
    hallTicketNumber: string;
    examYear: string;
    confidence: number;
    imageQuality: 'CLEAR' | 'UNCLEAR';
    qualityWarning: string;
  } | null>(null);
  const [collegeSearch, setCollegeSearch] = useState('');
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    dob: '',
    gender: '',
    fatherName: '',
    motherName: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhaar: '',

    // Academic Details - 10th
    schoolName10: '',
    board10: '',
    year10: '',
    marks10: '',

    // Academic Details - 12th
    collegeName12: '',
    board12: '',
    year12: '',
    marks12: '',
    stream12: '',

    // Entrance Exam
    hallTicketEamcet: '',
    rankEamcet: '',
    scoreEamcet: '',
    yearEamcet: '',

    // Course Preferences
    preferredCourse: '',
    preferredColleges: '',
    category: '',

    // AI Assistance
    interests: '',
    skills: '',
    careerGoals: '',

    // Declaration
    confirmed: false
  });

  const navigate = useNavigate();
  const location = useLocation();

  const selectedColleges = parseCollegePreferences(formData.preferredColleges);
  const updateCollegePreferences = (colleges: string[]) => {
    setFormData(prev => ({ ...prev, preferredColleges: colleges.join('\n') }));
  };

  const toggleCollegePreference = (college: typeof COLLEGE_OPTIONS[number]) => {
    const label = `${college.collegeName} (${college.code})`;
    const isSelected = selectedColleges.includes(label);
    if (isSelected) {
      updateCollegePreferences(selectedColleges.filter((item) => item !== label));
      return;
    }
    if (selectedColleges.length >= MAX_COLLEGE_PREFERENCES) {
      toast.error(`You can select up to ${MAX_COLLEGE_PREFERENCES} colleges.`);
      return;
    }
    updateCollegePreferences([...selectedColleges, label]);
  };

  useEffect(() => {
    const selectedCollege = (location.state as { selectedCollege?: string } | null)?.selectedCollege;
    if (!selectedCollege) return;

    setFormData(prev => {
      const current = parseCollegePreferences(prev.preferredColleges);
      if (current.includes(selectedCollege)) return prev;
      if (current.length >= MAX_COLLEGE_PREFERENCES) {
        toast.error(`You can select up to ${MAX_COLLEGE_PREFERENCES} colleges.`);
        return prev;
      }
      return { ...prev, preferredColleges: [...current, selectedCollege].join('\n') };
    });
    toast.success('College choice added to your application preferences.');
    window.history.replaceState({}, document.title, location.pathname);
  }, [location.pathname, location.state]);

  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!auth.currentUser) {
        setIsCheckingExisting(false);
        return;
      }
      try {
        console.log(`[DEBUG] [AdmissionForm] Loading application for UID: ${auth.currentUser.uid} from Firestore...`);
        const app = await getApplication(auth.currentUser.uid);
        if (app) {
          console.log('[DEBUG] [AdmissionForm] Loaded from Firestore:', app);
          setExistingApplication(app);
          
          // Pre-fill form data
          setFormData({
            fullName: app.fullName || '',
            dob: app.dob || '',
            gender: app.gender || '',
            fatherName: app.fatherName || '',
            motherName: app.motherName || '',
            mobile: app.mobile || '',
            email: app.email || '',
            address: app.address || '',
            city: app.city || '',
            state: app.state || '',
            pincode: app.pincode || '',
            aadhaar: app.aadhaar || '',
            schoolName10: app.schoolName10 || '',
            board10: app.board10 || '',
            year10: app.year10 || '',
            marks10: app.marks10 || '',
            collegeName12: app.collegeName12 || '',
            board12: app.board12 || '',
            year12: app.year12 || '',
            marks12: app.marks12 || '',
            stream12: app.stream12 || '',
            hallTicketEamcet: app.hallTicketEamcet || '',
            rankEamcet: app.rankEamcet || '',
            scoreEamcet: app.scoreEamcet || '',
            yearEamcet: app.yearEamcet || '',
            preferredCourse: app.preferredCourse || '',
            preferredColleges: app.preferredColleges || '',
            category: app.category || '',
            interests: app.interests || '',
            skills: app.skills || '',
            careerGoals: app.careerGoals || '',
            confirmed: app.status !== 'Rejected' // Auto-confirm on read-only, force check on reject
          });

          // Set previews for files
          if (app.documents) {
            setPreviews(app.documents);
          }

          // Set readOnly based on status
          if (app.status === 'Approved' || app.status === 'Pending' || app.status === 'Under Review' || app.status === 'Under Manual Verification') {
            setReadOnly(true);
          } else {
            setReadOnly(false);
          }
        } else {
          // Fallback to API call if not found in Firestore
          console.log('[DEBUG] [AdmissionForm] No application found in Firestore, trying API fallback...');
          const res = await fetch(`/api/applications?studentUid=${auth.currentUser.uid}`);
          if (res.ok) {
            const apps = await res.json();
            if (apps && apps.length > 0) {
              const appApi = apps[0];
              setExistingApplication(appApi);
              
              setFormData({
                fullName: appApi.fullName || '',
                dob: appApi.dob || '',
                gender: appApi.gender || '',
                fatherName: appApi.fatherName || '',
                motherName: appApi.motherName || '',
                mobile: appApi.mobile || '',
                email: appApi.email || '',
                address: appApi.address || '',
                city: appApi.city || '',
                state: appApi.state || '',
                pincode: appApi.pincode || '',
                aadhaar: appApi.aadhaar || '',
                schoolName10: appApi.schoolName10 || '',
                board10: appApi.board10 || '',
                year10: appApi.year10 || '',
                marks10: appApi.marks10 || '',
                collegeName12: appApi.collegeName12 || '',
                board12: appApi.board12 || '',
                year12: appApi.year12 || '',
                marks12: appApi.marks12 || '',
                stream12: appApi.stream12 || '',
                hallTicketEamcet: appApi.hallTicketEamcet || '',
                rankEamcet: appApi.rankEamcet || '',
                scoreEamcet: appApi.scoreEamcet || '',
                yearEamcet: appApi.yearEamcet || '',
                preferredCourse: appApi.preferredCourse || '',
                preferredColleges: appApi.preferredColleges || '',
                category: appApi.category || '',
                interests: appApi.interests || '',
                skills: appApi.skills || '',
                careerGoals: appApi.careerGoals || '',
                confirmed: appApi.status !== 'Rejected'
              });

              if (appApi.documents) {
                setPreviews(appApi.documents);
              }

              if (appApi.status === 'Approved' || appApi.status === 'Pending' || appApi.status === 'Under Review' || appApi.status === 'Under Manual Verification') {
                setReadOnly(true);
              } else {
                setReadOnly(false);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error loading existing application:', err);
      } finally {
        setIsCheckingExisting(false);
      }
    };

    // Make sure auth is initialized
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkExistingApplication();
      } else {
        setIsCheckingExisting(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const documentData = reader.result as string;
        setPreviews(prev => ({ ...prev, [field]: documentData }));

        if (field === 'rankCard') {
          void extractRankFromCard(documentData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const extractRankFromCard = async (rankCard: string) => {
    if (!rankCard.startsWith('data:image/')) {
      toast.info('Please enter your rank manually when uploading a PDF rank card.');
      return;
    }

    setIsExtractingRank(true);
    try {
      const response = await fetch('/api/extract-eamcet-rank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rankCard })
      });
      const result = await response.json();
      if (!response.ok || !result.rank) {
        throw new Error(result.error || 'Rank could not be read.');
      }
      setFormData(prev => ({ ...prev, rankEamcet: String(result.rank) }));
      setRankCardCheck({
        rank: Number(result.rank),
        hallTicketNumber: String(result.hallTicketNumber || ''),
        examYear: String(result.examYear || ''),
        confidence: Number(result.confidence) || 0,
        imageQuality: result.imageQuality === 'CLEAR' ? 'CLEAR' : 'UNCLEAR',
        qualityWarning: String(result.qualityWarning || '')
      });
      toast.success(`EAMCET rank ${Number(result.rank).toLocaleString()} extracted from your rank card.`);
      if (result.imageQuality === 'UNCLEAR' || Number(result.confidence) < 85) {
        toast.warning(result.qualityWarning || 'The rank was read, but the image is unclear. Please upload a sharper, complete rank card for verification.');
      }
    } catch (error: any) {
      console.error('EAMCET rank extraction failed:', error);
      toast.info(error.message || 'Could not read the rank card. Please enter your rank manually.');
    } finally {
      setIsExtractingRank(false);
    }
  };

  const removeFile = (field: string) => {
    setPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[field];
      return newPreviews;
    });
    if (field === 'rankCard') setRankCardCheck(null);
  };

  const handleSaveDraft = async () => {
    if (!auth.currentUser) {
      toast.error('You must be logged in to save progress');
      return;
    }
    setIsSavingDraft(true);
    try {
      toast.info('Saving your form progress...');
      const uid = auth.currentUser.uid;
      
      const payload = {
        id: uid,
        studentUid: uid,
        ...formData,
        selectedCollegePreferences: selectedColleges,
        documents: previews,
        status: existingApplication?.status || 'Draft',
        timestamp: new Date().toISOString()
      };

      await saveApplication(uid, payload);
      toast.success('Form progress saved successfully!');
      
      setExistingApplication(payload);
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress. Please try again.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[DEBUG] [handleSubmit] Form submitted. Checking auth state...');
    if (!auth.currentUser) {
      console.log('[DEBUG] [handleSubmit] User not logged in, aborting.');
      toast.error('You must be logged in to apply');
      return;
    }

    if (readOnly) {
      toast.error('Cannot submit. This application is already approved or pending review.');
      return;
    }

    // Double-check existing application status client-side to prevent duplicates
    if (existingApplication && ['Pending', 'Approved', 'Under Review', 'Under Manual Verification'].includes(existingApplication.status)) {
      toast.error('You already have an active admission application.');
      return;
    }

    console.log('[DEBUG] [handleSubmit] Checking declaration confirmation...');
    if (!formData.confirmed) {
      console.log('[DEBUG] [handleSubmit] Declaration not confirmed, aborting.');
      toast.error('Please confirm the declaration');
      return;
    }

    console.log('[DEBUG] [handleSubmit] Validation passed. Setting loading states...');
    setIsLoading(true);
    setSubmitStep('Uploading Documents...');
    
    try {
      const applicationId = auth.currentUser.uid;
      console.log(`[DEBUG] [handleSubmit] Using applicationId (User UID): ${applicationId}`);

      // Compress all documents in parallel before sending to ML Fraud analysis or Firestore
      console.log(`[DEBUG] [handleSubmit] Starting browser-side document compression for keys:`, Object.keys(previews));
      const compressedPreviews: { [key: string]: string } = {};
      const compressionPromises = Object.entries(previews).map(async ([key, val]) => {
        console.log(`[DEBUG] [compress] Starting compression for document key: ${key}`);
        const result = await compressImage(val as string);
        console.log(`[DEBUG] [compress] Compression finished for key: ${key}. Size: ${result.length} characters.`);
        compressedPreviews[key] = result;
      });
      
      console.log(`[DEBUG] [handleSubmit] Awaiting Promise.all for all document compressions...`);
      await Promise.all(compressionPromises);
      console.log(`[DEBUG] [handleSubmit] Promise.all completed successfully. All document compressions done.`);

      toast.info('Analyzing uploaded documents with OCR and ML models...');
      console.log(`[DEBUG] [handleSubmit] Starting ML and OCR Fraud Analysis for appId: ${applicationId}...`);
      // Pass the high-quality original images (previews) for forensic analysis, saving compressed copies for Firestore storage
      const analysis = await runMLFraudAnalysis(applicationId, formData, previews, setSubmitStep);
      console.log(`[DEBUG] [handleSubmit] ML and OCR Fraud Analysis resolved successfully. Results:`, {
        ocrLength: analysis.ocrData?.length,
        fraudScore: analysis.fraudScore,
        riskLevel: analysis.riskLevel,
        reasonsCount: analysis.reasons?.length
      });

      setSubmitStep('Saving Application...');
      console.log(`[DEBUG] [handleSubmit] Saving application details to Firestore at /applications/${applicationId}...`);
      
      const payload = {
        id: applicationId,
        studentUid: auth.currentUser.uid,
        ...formData,
        selectedCollegePreferences: selectedColleges,
        documents: compressedPreviews,
        status: 'Pending',
        // ML Model Outputs
        ocrData: analysis.ocrData,
        indicators: analysis.indicators,
        fraudScore: analysis.fraudScore,
        riskLevel: analysis.riskLevel,
        confidence: analysis.confidence,
        fraudReasons: analysis.reasons,
        aiRecommendation: analysis.riskLevel === 'High' ? 'Reject' : (analysis.riskLevel === 'Medium' ? 'Needs Manual Verification' : 'Approved'),
        forensicResults: (analysis as any).forensicResults,
        
        // Explicit Flat Firestore Database Fields (Requested Multi-Stage Indicators)
        elaScore: (analysis as any).forensicResults?.multiStageScores?.elaScore ?? 0,
        noiseScore: (analysis as any).forensicResults?.multiStageScores?.pixelConsistency ?? 0,
        compressionScore: (analysis as any).forensicResults?.multiStageScores?.compressionIntegrity ?? 0,
        pixelScore: (analysis as any).forensicResults?.multiStageScores?.pixelConsistency ?? 0,
        templateScore: (analysis as any).forensicResults?.multiStageScores?.documentLayout ?? 0,
        arithmeticScore: (analysis as any).forensicResults?.ruleValidation?.arithmeticMismatchFlagged ? 100 : 0,
        ocrConfidence: analysis.confidence ?? 0,
        naiveBayesResult: analysis.riskLevel,
        geminiExplanation: analysis.reasons?.join(". ") || "",
        timestamp: new Date().toISOString()
      };
      
      console.log(`[DEBUG] [handleSubmit] Payload payload total length of base64 document values:`, 
        Object.values(compressedPreviews).reduce((acc, str) => acc + str.length, 0)
      );

      console.log(`[DEBUG] [handleSubmit] Initiating save via API for appId: ${applicationId} (with 15s timeout)...`);
      const response = await withTimeoutReject(
        fetch(`/api/applications/${applicationId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }),
        15000,
        'Database connection timed out. Please check your internet connection or try again.'
      );
      if (!response.ok) {
        throw new Error('Failed to save application to server');
      }
      console.log(`[DEBUG] [handleSubmit] Save finished successfully.`);

      // Mirror application payload to Firestore client-side for permanent storage
      try {
        console.log(`[DEBUG] [handleSubmit] Saving application to Firestore client-side via applicationService...`);
        await saveApplication(auth.currentUser.uid, payload);
        console.log(`[DEBUG] [handleSubmit] Direct Firestore save succeeded.`);
      } catch (clientFsErr) {
        console.error('[DEBUG] [handleSubmit] Direct Firestore save failed:', clientFsErr);
      }

      setSubmitStep('Submission Complete');
      console.log(`[DEBUG] [handleSubmit] Submission complete. Showing toast and navigating to status page.`);
      toast.success('Admission form submitted successfully!');
      navigate('/student/status');
    } catch (error: any) {
      console.error('[DEBUG] [handleSubmit] CRITICAL ERROR CAUGHT in handleSubmit try-catch block:', error);
      toast.error(error.message || 'Failed to submit form');
    } finally {
      console.log('[DEBUG] [handleSubmit] Entering finally block. Cleaning up loading states...');
      setIsLoading(false);
      setSubmitStep('');
      console.log('[DEBUG] [handleSubmit] Cleared loading states.');
    }
  };

  if (isCheckingExisting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/student">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admission Form</h1>
            <p className="text-muted-foreground">Complete your application for SmartAdmi Admission System</p>
          </div>
        </div>

        {existingApplication && (
          <div className="mb-6">
            {existingApplication.status === 'Approved' && (
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-4 shadow-sm dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-300">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full mt-0.5 dark:bg-emerald-900/60 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-lg dark:text-emerald-100">Application Already Approved</h4>
                  <p className="text-emerald-800 mt-1 dark:text-emerald-300">Your admission application (ID: <span className="font-mono font-bold">{existingApplication.id}</span>) was successfully approved by the board. Below is a read-only view of your verified admission details.</p>
                </div>
              </div>
            )}
            {['Pending', 'Under Review', 'Under Manual Verification'].includes(existingApplication.status) && (
              <div className="p-5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 flex items-start gap-4 shadow-sm dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-300">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full mt-0.5 dark:bg-blue-900/60 dark:text-blue-400">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-950 text-lg dark:text-blue-100">Application Under Review</h4>
                  <p className="text-blue-800 mt-1 dark:text-blue-300">Your admission application (ID: <span className="font-mono font-bold">{existingApplication.id}</span>) is currently being processed by our integrity verification board. Duplicate submissions are disabled during active review. Below is a summary of your submitted details.</p>
                </div>
              </div>
            )}
            {existingApplication.status === 'Rejected' && (
              <div className="p-5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-4 shadow-sm">
                <div className="p-2 bg-destructive/20 text-destructive rounded-full mt-0.5">
                  <X className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-destructive-foreground text-lg">Application Resubmission Mode</h4>
                  <p className="text-muted-foreground mt-1">Your previous application (ID: <span className="font-mono font-bold">{existingApplication.id}</span>) was rejected by the board. Board Feedback: <span className="font-semibold text-foreground italic">{existingApplication.feedback || 'Please update incorrect academic records or re-upload clear certificates.'}</span>. All your previously entered details have been pre-filled below. Please correct any incorrect fields, re-upload documents as necessary, and resubmit for review.</p>
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Personal Details */}
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">1</span>
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3 p-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="fullName" 
                  required 
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth <span className="text-destructive">*</span></Label>
                <Input 
                  id="dob" 
                  type="date" 
                  required 
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender <span className="text-destructive">*</span></Label>
                <Select required value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})} disabled={readOnly}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="fatherName" 
                  required 
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherName">Mother's Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="motherName" 
                  required 
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number <span className="text-destructive">*</span></Label>
                <Input 
                  id="mobile" 
                  type="tel"
                  required 
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                <Input 
                  id="email" 
                  type="email"
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number (Optional)</Label>
                <Input 
                  id="aadhaar" 
                  value={formData.aadhaar}
                  onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
                <Textarea 
                  id="address" 
                  required 
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                <Input 
                  id="city" 
                  required 
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
                <Input 
                  id="state" 
                  required 
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode <span className="text-destructive">*</span></Label>
                <Input 
                  id="pincode" 
                  required 
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  disabled={readOnly}
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. Academic Details */}
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">2</span>
                Academic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* 10th Class */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg border-l-4 border-primary pl-3">10th Class</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName10">School Name <span className="text-destructive">*</span></Label>
                    <Input 
                      id="schoolName10" 
                      required 
                      value={formData.schoolName10}
                      onChange={(e) => setFormData({ ...formData, schoolName10: e.target.value })}
                      disabled={readOnly}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="board10">Board <span className="text-destructive">*</span></Label>
                    <Input 
                      id="board10" 
                      required 
                      value={formData.board10}
                      onChange={(e) => setFormData({ ...formData, board10: e.target.value })}
                      disabled={readOnly}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year10">Year of Passing <span className="text-destructive">*</span></Label>
                    <Input 
                      id="year10" 
                      type="number"
                      required 
                      value={formData.year10}
                      onChange={(e) => setFormData({ ...formData, year10: e.target.value })}
                      disabled={readOnly}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marks10">Marks / GPA <span className="text-destructive">*</span></Label>
                    <Input 
                      id="marks10" 
                      required 
                      value={formData.marks10}
                      onChange={(e) => setFormData({ ...formData, marks10: e.target.value })}
                      disabled={readOnly}
                    />
                  </div>
                </div>
              </div>

              {/* 12th Class */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-bold text-lg border-l-4 border-primary pl-3">12th Class</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="collegeName12">College Name <span className="text-destructive">*</span></Label>
                    <Input 
                      id="collegeName12" 
                      required 
                      value={formData.collegeName12}
                      onChange={(e) => setFormData({ ...formData, collegeName12: e.target.value })}
                      disabled={readOnly}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="board12">Board <span className="text-destructive">*</span></Label>
                    <Input 
                      id="board12" 
                      required 
                      value={formData.board12}
                      onChange={(e) => setFormData({ ...formData, board12: e.target.value })}
                      disabled={readOnly}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year12">Year of Passing <span className="text-destructive">*</span></Label>
                    <Input 
                      id="year12" 
                      type="number"
                      required 
                      value={formData.year12}
                      onChange={(e) => setFormData({ ...formData, year12: e.target.value })}
                      disabled={readOnly}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marks12">Marks / Percentage <span className="text-destructive">*</span></Label>
                    <Input 
                      id="marks12" 
                      required 
                      value={formData.marks12}
                      onChange={(e) => setFormData({ ...formData, marks12: e.target.value })}
                      disabled={readOnly}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stream12">Stream <span className="text-destructive">*</span></Label>
                    <Select required value={formData.stream12} onValueChange={(v) => setFormData({...formData, stream12: v})} disabled={readOnly}>
                      <SelectTrigger id="stream12">
                        <SelectValue placeholder="Select Stream" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mpc">MPC (Maths, Physics, Chemistry)</SelectItem>
                        <SelectItem value="bipc">BiPC (Biology, Physics, Chemistry)</SelectItem>
                        <SelectItem value="cec">CEC</SelectItem>
                        <SelectItem value="mec">MEC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Entrance Exam Section */}
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">3</span>
                Entrance Exam (EAMCET)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 p-6">
              <div className="space-y-2">
                <Label htmlFor="hallTicketEamcet">Hall Ticket Number <span className="text-destructive">*</span></Label>
                <Input 
                  id="hallTicketEamcet" 
                  required 
                  value={formData.hallTicketEamcet}
                  onChange={(e) => setFormData({ ...formData, hallTicketEamcet: e.target.value })}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rankEamcet" className="flex items-center gap-2">Rank <span className="text-destructive">*</span>{isExtractingRank && <><Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /><span className="text-xs font-normal text-muted-foreground">Reading rank card…</span></>}</Label>
                <Input 
                  id="rankEamcet" 
                  type="number"
                  required 
                  value={formData.rankEamcet}
                  onChange={(e) => setFormData({ ...formData, rankEamcet: e.target.value })}
                  disabled={readOnly || isExtractingRank}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scoreEamcet">Score <span className="text-destructive">*</span></Label>
                <Input 
                  id="scoreEamcet" 
                  type="number"
                  required 
                  value={formData.scoreEamcet}
                  onChange={(e) => setFormData({ ...formData, scoreEamcet: e.target.value })}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearEamcet">Exam Year <span className="text-destructive">*</span></Label>
                <Input 
                  id="yearEamcet" 
                  type="number"
                  required 
                  value={formData.yearEamcet}
                  onChange={(e) => setFormData({ ...formData, yearEamcet: e.target.value })}
                  disabled={readOnly}
                />
              </div>
            </CardContent>
          </Card>

          {/* 4. Course Preferences */}
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">4</span>
                Course Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 p-6">
              <div className="space-y-2">
                <Label htmlFor="preferredCourse">Preferred Course <span className="text-destructive">*</span></Label>
                <Select required value={formData.preferredCourse} onValueChange={(v) => setFormData({...formData, preferredCourse: v})} disabled={readOnly}>
                  <SelectTrigger id="preferredCourse">
                    <SelectValue placeholder="Choose a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cse">Computer Science Engineering</SelectItem>
                    <SelectItem value="ece">Electronics & Communication</SelectItem>
                    <SelectItem value="it">Information Technology</SelectItem>
                    <SelectItem value="ai-ml">AI & Machine Learning</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                    <SelectItem value="civil">Civil Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
                <Select required value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})} disabled={readOnly}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oc">OC</SelectItem>
                    <SelectItem value="bc">BC</SelectItem>
                    <SelectItem value="sc">SC</SelectItem>
                    <SelectItem value="st">ST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <Label>College Preferences (Optional)</Label>
                  <span className={`text-xs font-semibold ${selectedColleges.length >= MAX_COLLEGE_PREFERENCES ? 'text-amber-600' : 'text-muted-foreground'}`}>
                    {selectedColleges.length} / {MAX_COLLEGE_PREFERENCES} selected
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Start with the curated Top 20 Andhra Pradesh EAPCET choices below, then search for other colleges if needed. Choose up to 20 in order of preference.</p>

                {selectedColleges.length > 0 && (
                  <div className="flex flex-wrap gap-2 rounded-lg border bg-muted/20 p-3">
                    {selectedColleges.map((college, index) => (
                      <span key={college} className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs font-medium text-foreground">
                        <span className="text-primary font-bold">{index + 1}.</span>{college}
                        {!readOnly && <button type="button" onClick={() => updateCollegePreferences(selectedColleges.filter((item) => item !== college))} className="text-muted-foreground hover:text-destructive" aria-label={`Remove ${college}`}><X className="h-3.5 w-3.5" /></button>}
                      </span>
                    ))}
                  </div>
                )}

                {!readOnly && (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input value={collegeSearch} onChange={(e) => setCollegeSearch(e.target.value)} placeholder="Search by college name, code, or location..." className="pl-9" />
                    </div>
                    {!collegeSearch && <p className="text-xs font-semibold text-primary">Top 20 Andhra Pradesh EAPCET college choices</p>}
                    <div className="max-h-64 overflow-y-auto rounded-lg border divide-y bg-background">
                      {COLLEGE_OPTIONS.filter((college) => {
                        const query = collegeSearch.trim().toLowerCase();
                        return !query || `${college.collegeName} ${college.code} ${college.location}`.toLowerCase().includes(query);
                      }).map((college) => {
                        const label = `${college.collegeName} (${college.code})`;
                        const isSelected = selectedColleges.includes(label);
                        return (
                          <button key={college.code} type="button" onClick={() => toggleCollegePreference(college)} className={`w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-muted/50 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}>
                            <span><span className="block text-sm font-semibold text-foreground">{college.collegeName} <span className="text-primary text-xs">({college.code})</span></span><span className="block text-xs text-muted-foreground mt-0.5">{college.location} · {college.type}</span></span>
                            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${isSelected ? 'bg-primary text-primary-foreground' : 'border text-muted-foreground'}`}>{isSelected ? 'Selected' : 'Add'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 5. Document Upload Section */}
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">5</span>
                Document Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid gap-8 md:grid-cols-2">
              {[
                { id: 'cert10', label: '10th Certificate' },
                { id: 'memo12', label: '12th Marks Memo' },
                { id: 'rankCard', label: 'EAMCET Rank Card' },
                { id: 'idProof', label: 'ID Proof (Aadhaar/Voter ID)' }
              ].map((doc) => (
                <div key={doc.id} className="space-y-3">
                  <Label className="text-sm font-semibold">{doc.label} <span className="text-destructive">*</span></Label>
                  <div className="relative group">
                    {previews[doc.id] ? (
                      <div className="relative h-40 w-full rounded-xl border-2 border-dashed border-primary/30 overflow-hidden bg-muted/50 flex items-center justify-center">
                        <img src={previews[doc.id]} alt="Preview" className="h-full w-full object-contain" />
                        {!readOnly && (
                          <Button 
                            type="button"
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFile(doc.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ) : (
                      <label className={`flex flex-col items-center justify-center h-40 w-full rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all ${readOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">{readOnly ? 'No document uploaded' : `Click to upload ${doc.label}`}</span>
                        <Input 
                          type="file" 
                          className="hidden" 
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e, doc.id)}
                          required={!readOnly}
                          disabled={readOnly}
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {rankCardCheck && (
            <Card className={`border shadow-sm overflow-hidden ${rankCardCheck.imageQuality === 'CLEAR' && rankCardCheck.confidence >= 85 ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/10' : 'border-amber-200 bg-amber-50/40 dark:border-amber-900/50 dark:bg-amber-950/10'}`}>
              <CardContent className="p-5 flex items-start gap-3">
                <div className={`p-2 rounded-full ${rankCardCheck.imageQuality === 'CLEAR' && rankCardCheck.confidence >= 85 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {rankCardCheck.imageQuality === 'CLEAR' && rankCardCheck.confidence >= 85 ? <ShieldCheck className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-foreground flex items-center gap-2"><ScanLine className="h-4 w-4" /> Rank Card OCR Result</h3><span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800"><span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />Live AI</span><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${rankCardCheck.imageQuality === 'CLEAR' && rankCardCheck.confidence >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{rankCardCheck.imageQuality === 'CLEAR' && rankCardCheck.confidence >= 85 ? 'Ready for verification' : 'Needs clearer upload'}</span></div>
                  <p className="text-sm text-muted-foreground mt-1">Review the extracted values before submitting. Final verification cross-checks them with your application.</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm"><div className="rounded-lg border bg-background/70 p-3"><p className="text-xs text-muted-foreground">State Rank</p><p className="font-bold text-foreground mt-0.5">{rankCardCheck.rank.toLocaleString()}</p></div><div className="rounded-lg border bg-background/70 p-3"><p className="text-xs text-muted-foreground">Hall Ticket</p><p className="font-bold text-foreground mt-0.5">{rankCardCheck.hallTicketNumber || 'Not clearly read'}</p></div><div className="rounded-lg border bg-background/70 p-3"><p className="text-xs text-muted-foreground">OCR Confidence</p><p className="font-bold text-foreground mt-0.5">{rankCardCheck.confidence}%</p></div></div>
                  {(rankCardCheck.imageQuality === 'UNCLEAR' || rankCardCheck.confidence < 85) && <p className="text-xs text-amber-800 mt-3">{rankCardCheck.qualityWarning || 'Upload a full, sharp image with all text visible. An unclear card is sent for manual review, not automatically marked fake.'}</p>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 6. AI Assistance Section */}
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">6</span>
                AI Assistance & Career Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="interests">Interests <span className="text-destructive">*</span></Label>
                <Input 
                  id="interests" 
                  placeholder="e.g. Coding, Robotics, Space Science"
                  required 
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills <span className="text-destructive">*</span></Label>
                <Input 
                  id="skills" 
                  placeholder="e.g. Python, Public Speaking, Mathematics"
                  required 
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="careerGoals">Career Goals <span className="text-destructive">*</span></Label>
                <Textarea 
                  id="careerGoals" 
                  placeholder="Where do you see yourself in 5 years?"
                  required 
                  value={formData.careerGoals}
                  onChange={(e) => setFormData({ ...formData, careerGoals: e.target.value })}
                  disabled={readOnly}
                />
              </div>
            </CardContent>
          </Card>

          {/* 7. Declaration */}
          <Card className="border-none shadow-sm bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="confirmed" 
                  checked={formData.confirmed}
                  onCheckedChange={(checked) => setFormData({ ...formData, confirmed: checked as boolean })}
                  className="mt-1"
                  disabled={readOnly}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="confirmed"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I confirm that all details provided are correct
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    By checking this, you agree to our <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and verify that the information provided is true to the best of your knowledge.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pb-10">
            <Link to="/student">
              <Button variant="ghost" type="button">Cancel</Button>
            </Link>
            {!readOnly && (
              <Button
                variant="outline"
                type="button"
                size="lg"
                onClick={handleSaveDraft}
                disabled={isLoading || isSavingDraft}
              >
                {isSavingDraft ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Draft...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft / Progress
                  </>
                )}
              </Button>
            )}
            <Button type="submit" size="lg" className="px-8" disabled={isLoading || readOnly}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {submitStep || 'Submitting Application...'}
                </>
              ) : readOnly ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Application Submitted
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Submit Admission Form
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
