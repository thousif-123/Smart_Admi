import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  School, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  SlidersHorizontal,
  Search, 
  BookOpen,
  Award,
  Sparkles,
  Loader2,
  BookmarkCheck,
  Building2,
  XCircle,
  HelpCircle as InfoIcon
} from 'lucide-react';

export interface CollegeCutoff {
  collegeName: string;
  code: string;
  location: string;
  type: 'University' | 'Private' | 'Government';
  branch: string;
  branchCode: string;
  cutoffRank: number;
}

// Rich mock database of EAPCET/EAMCET colleges and cutoffs (highly accurate relative ranges)
export const EAPCET_COLLEGES_DATABASE: CollegeCutoff[] = [
  // Andhra University (AUCE)
  { collegeName: "Andhra University College of Engineering", code: "AUCE", location: "Visakhapatnam", type: "University", branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank: 1500 },
  { collegeName: "Andhra University College of Engineering", code: "AUCE", location: "Visakhapatnam", type: "University", branch: "Artificial Intelligence & Machine Learning", branchCode: "CSM", cutoffRank: 2800 },
  { collegeName: "Andhra University College of Engineering", code: "AUCE", location: "Visakhapatnam", type: "University", branch: "Information Technology", branchCode: "INF", cutoffRank: 4200 },
  { collegeName: "Andhra University College of Engineering", code: "AUCE", location: "Visakhapatnam", type: "University", branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank: 3500 },
  { collegeName: "Andhra University College of Engineering", code: "AUCE", location: "Visakhapatnam", type: "University", branch: "Electrical & Electronics Engineering", branchCode: "EEE", cutoffRank: 8000 },
  { collegeName: "Andhra University College of Engineering", code: "AUCE", location: "Visakhapatnam", type: "University", branch: "Mechanical Engineering", branchCode: "MEC", cutoffRank: 12000 },
  { collegeName: "Andhra University College of Engineering", code: "AUCE", location: "Visakhapatnam", type: "University", branch: "Civil Engineering", branchCode: "CIV", cutoffRank: 15000 },

  // JNTU Kakinada (JNTUK)
  { collegeName: "JNTU College of Engineering, Kakinada", code: "JNTUK", location: "Kakinada", type: "University", branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank: 2500 },
  { collegeName: "JNTU College of Engineering, Kakinada", code: "JNTUK", location: "Kakinada", type: "University", branch: "Artificial Intelligence & Data Science", branchCode: "CSD", cutoffRank: 3800 },
  { collegeName: "JNTU College of Engineering, Kakinada", code: "JNTUK", location: "Kakinada", type: "University", branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank: 4800 },
  { collegeName: "JNTU College of Engineering, Kakinada", code: "JNTUK", location: "Kakinada", type: "University", branch: "Information Technology", branchCode: "INF", cutoffRank: 5500 },
  { collegeName: "JNTU College of Engineering, Kakinada", code: "JNTUK", location: "Kakinada", type: "University", branch: "Electrical & Electronics Engineering", branchCode: "EEE", cutoffRank: 9500 },
  { collegeName: "JNTU College of Engineering, Kakinada", code: "JNTUK", location: "Kakinada", type: "University", branch: "Mechanical Engineering", branchCode: "MEC", cutoffRank: 14000 },

  // JNTU Anantapur (JNTUA)
  { collegeName: "JNTU College of Engineering, Anantapur", code: "JNTUA", location: "Anantapur", type: "University", branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank: 4500 },
  { collegeName: "JNTU College of Engineering, Anantapur", code: "JNTUA", location: "Anantapur", type: "University", branch: "Artificial Intelligence & Machine Learning", branchCode: "CSM", cutoffRank: 6000 },
  { collegeName: "JNTU College of Engineering, Anantapur", code: "JNTUA", location: "Anantapur", type: "University", branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank: 7500 },
  { collegeName: "JNTU College of Engineering, Anantapur", code: "JNTUA", location: "Anantapur", type: "University", branch: "Electrical & Electronics Engineering", branchCode: "EEE", cutoffRank: 14000 },

  // SVUCE Tirupati
  { collegeName: "Sri Venkateswara University College of Engineering", code: "SVUCE", location: "Tirupati", type: "University", branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank: 3500 },
  { collegeName: "Sri Venkateswara University College of Engineering", code: "SVUCE", location: "Tirupati", type: "University", branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank: 6000 },
  { collegeName: "Sri Venkateswara University College of Engineering", code: "SVUCE", location: "Tirupati", type: "University", branch: "Information Technology", branchCode: "INF", cutoffRank: 8500 },
  { collegeName: "Sri Venkateswara University College of Engineering", code: "SVUCE", location: "Tirupati", type: "University", branch: "Electrical & Electronics Engineering", branchCode: "EEE", cutoffRank: 12000 },

  // CBIT Hyderabad (Very famous, used as top tier reference)
  { collegeName: "Chaitanya Bharathi Institute of Technology", code: "CBIT", location: "Gandipet, Hyderabad", type: "Private", branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank: 1800 },
  { collegeName: "Chaitanya Bharathi Institute of Technology", code: "CBIT", location: "Gandipet, Hyderabad", type: "Private", branch: "Artificial Intelligence & Machine Learning", branchCode: "CSM", cutoffRank: 3000 },
  { collegeName: "Chaitanya Bharathi Institute of Technology", code: "CBIT", location: "Gandipet, Hyderabad", type: "Private", branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank: 4200 },
  { collegeName: "Chaitanya Bharathi Institute of Technology", code: "CBIT", location: "Gandipet, Hyderabad", type: "Private", branch: "Information Technology", branchCode: "INF", cutoffRank: 4500 },

  // GVP Visakhapatnam
  { collegeName: "Gayatri Vidya Parishad College of Engineering", code: "GVP", location: "Visakhapatnam", type: "Private", branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank: 5500 },
  { collegeName: "Gayatri Vidya Parishad College of Engineering", code: "GVP", location: "Visakhapatnam", type: "Private", branch: "Artificial Intelligence & Data Science", branchCode: "CSD", cutoffRank: 7800 },
  { collegeName: "Gayatri Vidya Parishad College of Engineering", code: "GVP", location: "Visakhapatnam", type: "Private", branch: "Information Technology", branchCode: "INF", cutoffRank: 8500 },
  { collegeName: "Gayatri Vidya Parishad College of Engineering", code: "GVP", location: "Visakhapatnam", type: "Private", branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank: 9200 },
  { collegeName: "Gayatri Vidya Parishad College of Engineering", code: "GVP", location: "Visakhapatnam", type: "Private", branch: "Electrical & Electronics Engineering", branchCode: "EEE", cutoffRank: 16000 },
  { collegeName: "Gayatri Vidya Parishad College of Engineering", code: "GVP", location: "Visakhapatnam", type: "Private", branch: "Mechanical Engineering", branchCode: "MEC", cutoffRank: 22000 },

  // VRSEC Vijayawada
  { collegeName: "Velagapudi Ramakrishna Siddhartha Engineering College", code: "VRSEC", location: "Vijayawada", type: "Private", branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank: 6500 },
  { collegeName: "Velagapudi Ramakrishna Siddhartha Engineering College", code: "VRSEC", location: "Vijayawada", type: "Private", branch: "Artificial Intelligence & Machine Learning", branchCode: "CSM", cutoffRank: 8500 },
  { collegeName: "Velagapudi Ramakrishna Siddhartha Engineering College", code: "VRSEC", location: "Vijayawada", type: "Private", branch: "Information Technology", branchCode: "INF", cutoffRank: 9800 },
  { collegeName: "Velagapudi Ramakrishna Siddhartha Engineering College", code: "VRSEC", location: "Vijayawada", type: "Private", branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank: 11000 },
  { collegeName: "Velagapudi Ramakrishna Siddhartha Engineering College", code: "VRSEC", location: "Vijayawada", type: "Private", branch: "Electrical & Electronics Engineering", branchCode: "EEE", cutoffRank: 24000 },

  // Vasavi College of Engineering Hyderabad
  { collegeName: "Vasavi College of Engineering", code: "VCE", location: "Ibrahimbagh, Hyderabad", type: "Private", branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank: 2200 },
  { collegeName: "Vasavi College of Engineering", code: "VCE", location: "Ibrahimbagh, Hyderabad", type: "Private", branch: "Information Technology", branchCode: "INF", cutoffRank: 3800 },
  { collegeName: "Vasavi College of Engineering", code: "VCE", location: "Ibrahimbagh, Hyderabad", type: "Private", branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank: 5000 },

  // VNR VJIET Hyderabad
  { collegeName: "VNR Vignana Jyothi Institute of Engineering and Technology", code: "VNRVJIET", location: "Bachupally, Hyderabad", type: "Private", branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank: 2500 },
  { collegeName: "VNR Vignana Jyothi Institute of Engineering and Technology", code: "VNRVJIET", location: "Bachupally, Hyderabad", type: "Private", branch: "Artificial Intelligence & Machine Learning", branchCode: "CSM", cutoffRank: 4200 },
  { collegeName: "VNR Vignana Jyothi Institute of Engineering and Technology", code: "VNRVJIET", location: "Bachupally, Hyderabad", type: "Private", branch: "Information Technology", branchCode: "INF", cutoffRank: 5500 },
  { collegeName: "VNR Vignana Jyothi Institute of Engineering and Technology", code: "VNRVJIET", location: "Bachupally, Hyderabad", type: "Private", branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank: 6500 },

  // Sree Vidyanikethan (SVEC) Tirupati
  { collegeName: "Sree Vidyanikethan Engineering College", code: "SVEC", location: "Tirupati", type: "Private", branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank: 12000 },
  { collegeName: "Sree Vidyanikethan Engineering College", code: "SVEC", location: "Tirupati", type: "Private", branch: "Artificial Intelligence & Machine Learning", branchCode: "CSM", cutoffRank: 18000 },
  { collegeName: "Sree Vidyanikethan Engineering College", code: "SVEC", location: "Tirupati", type: "Private", branch: "Information Technology", branchCode: "INF", cutoffRank: 19500 },
  { collegeName: "Sree Vidyanikethan Engineering College", code: "SVEC", location: "Tirupati", type: "Private", branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank: 22000 },
  { collegeName: "Sree Vidyanikethan Engineering College", code: "SVEC", location: "Tirupati", type: "Private", branch: "Electrical & Electronics Engineering", branchCode: "EEE", cutoffRank: 35000 },

  // ANITS Visakhapatnam
  { collegeName: "Anil Neerukonda Institute of Technology and Sciences", code: "ANITS", location: "Visakhapatnam", type: "Private", branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank: 10000 },
  { collegeName: "Anil Neerukonda Institute of Technology and Sciences", code: "ANITS", location: "Visakhapatnam", type: "Private", branch: "Information Technology", branchCode: "INF", cutoffRank: 15000 },
  { collegeName: "Anil Neerukonda Institute of Technology and Sciences", code: "ANITS", location: "Visakhapatnam", type: "Private", branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank: 16500 },
  { collegeName: "Anil Neerukonda Institute of Technology and Sciences", code: "ANITS", location: "Visakhapatnam", type: "Private", branch: "Electrical & Electronics Engineering", branchCode: "EEE", cutoffRank: 30000 },

  // RVR & JC Guntur
  { collegeName: "RVR & JC College of Engineering", code: "RVRJC", location: "Guntur", type: "Private", branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank: 8500 },
  { collegeName: "RVR & JC College of Engineering", code: "RVRJC", location: "Guntur", type: "Private", branch: "Artificial Intelligence & Machine Learning", branchCode: "CSM", cutoffRank: 12000 },
  { collegeName: "RVR & JC College of Engineering", code: "RVRJC", location: "Guntur", type: "Private", branch: "Information Technology", branchCode: "INF", cutoffRank: 14000 },
  { collegeName: "RVR & JC College of Engineering", code: "RVRJC", location: "Guntur", type: "Private", branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank: 16000 },

  // Madanapalle Institute (MITS)
  { collegeName: "Madanapalle Institute of Technology & Science", code: "MITS", location: "Madanapalle", type: "Private", branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank: 18000 },
  { collegeName: "Madanapalle Institute of Technology & Science", code: "MITS", location: "Madanapalle", type: "Private", branch: "Artificial Intelligence & Data Science", branchCode: "CSD", cutoffRank: 26000 },
  { collegeName: "Madanapalle Institute of Technology & Science", code: "MITS", location: "Madanapalle", type: "Private", branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank: 32000 },
  { collegeName: "Madanapalle Institute of Technology & Science", code: "MITS", location: "Madanapalle", type: "Private", branch: "Electrical & Electronics Engineering", branchCode: "EEE", cutoffRank: 48000 }
];

interface EapcetCollegeRecommendationsProps {
  initialRank?: string | number;
  studentInterests?: string;
  onApply?: (college: CollegeCutoff) => void;
}

export default function EapcetCollegeRecommendations({ initialRank, studentInterests, onApply }: EapcetCollegeRecommendationsProps) {
  const [rankInput, setRankInput] = useState<string>(initialRank ? String(initialRank) : '');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('OC'); // OC, BC, SC, ST
  const [selectedGender, setSelectedGender] = useState<string>('Co-Ed'); // Co-Ed, Girls
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAiCounseling, setIsAiCounseling] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiError, setAiError] = useState<string>('');

  // Update input if initialRank prop changes
  useEffect(() => {
    if (initialRank) {
      setRankInput(String(initialRank));
    }
  }, [initialRank]);

  const parsedRank = parseInt(rankInput) || 0;

  // Category & Gender Weight adjustments (General modeling for typical reservation differences)
  const getAdjustedCutoff = (baseCutoff: number) => {
    let multiplier = 1.0;
    
    // Category relaxation multipliers
    if (selectedCategory === 'BC') multiplier = 1.35; // ~35% relaxed ranking for OBC/BC
    else if (selectedCategory === 'SC') multiplier = 2.2; // ~120% relaxed ranking for SC
    else if (selectedCategory === 'ST') multiplier = 2.8; // ~180% relaxed ranking for ST

    // Girls quota adjustment
    if (selectedGender === 'Girls') {
      multiplier *= 1.15; // Extra 15% relaxation for females
    }

    return Math.round(baseCutoff * multiplier);
  };

  // Filtered colleges list
  const getRecommendations = () => {
    if (parsedRank <= 0) return [];

    return EAPCET_COLLEGES_DATABASE.map(item => {
      const adjustedCutoff = getAdjustedCutoff(item.cutoffRank);
      
      // Calculate match probability
      let probability: 'High' | 'Medium' | 'Low' | 'Reach' = 'Reach';
      let probabilityPercent = 0;
      let colorClass = '';

      if (parsedRank < adjustedCutoff * 0.8) {
        probability = 'High';
        probabilityPercent = Math.min(99, Math.round(95 + (adjustedCutoff * 0.8 - parsedRank) / 200));
        colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      } else if (parsedRank <= adjustedCutoff * 1.05) {
        probability = 'Medium';
        probabilityPercent = Math.round(70 + ((adjustedCutoff * 1.05 - parsedRank) / (adjustedCutoff * 0.25)) * 25);
        colorClass = 'bg-blue-50 text-blue-700 border-blue-200';
      } else if (parsedRank <= adjustedCutoff * 1.35) {
        probability = 'Low';
        probabilityPercent = Math.max(15, Math.round(30 + ((adjustedCutoff * 1.35 - parsedRank) / (adjustedCutoff * 0.3)) * 39));
        colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
      } else {
        probability = 'Reach';
        probabilityPercent = Math.max(2, Math.round(5 + (adjustedCutoff * 1.8 - parsedRank) / 1000));
        colorClass = 'bg-rose-50 text-rose-700 border-rose-200';
      }

      return {
        ...item,
        adjustedCutoff,
        probability,
        probabilityPercent,
        colorClass
      };
    })
    .filter(item => {
      // Filter by branch
      if (selectedBranch !== 'ALL') {
        if (selectedBranch === 'CSE_ALLIED') {
          if (!['CSM', 'CSD', 'INF'].includes(item.branchCode)) return false;
        } else if (item.branchCode !== selectedBranch) {
          return false;
        }
      }

      // Filter by type
      if (selectedType !== 'ALL' && item.type !== selectedType) {
        return false;
      }

      // Filter by text search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.collegeName.toLowerCase().includes(query);
        const matchesCode = item.code.toLowerCase().includes(query);
        const matchesLoc = item.location.toLowerCase().includes(query);
        const matchesBranch = item.branch.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesLoc && !matchesBranch) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by higher probability percent first, then by lower cutoff
      if (b.probabilityPercent !== a.probabilityPercent) {
        return b.probabilityPercent - a.probabilityPercent;
      }
      return a.adjustedCutoff - b.adjustedCutoff;
    });
  };

  const recommendedList = getRecommendations();

  // Call AI counselor to get dynamic custom plan
  const fetchAiCounseling = async () => {
    if (parsedRank <= 0) return;
    setIsAiCounseling(true);
    setAiResponse('');
    setAiError('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Provide an expert counseling analysis for an AP EAPCET / TG EAMCET rank of ${parsedRank}.
          Category: ${selectedCategory}, Gender Quota: ${selectedGender}, Preferred Branch: ${selectedBranch === 'ALL' ? 'Any Engineering Stream' : selectedBranch}.
          My technical and extracurricular interests: ${studentInterests || 'Software engineering, smart technologies, problem solving'}.
          
          Outline:
          1. 3 Top-tier colleges I stand a highly strong chance of entering.
          2. 2 "Ambition" choices where my rank is slightly on the edge but might get through in subsequent counseling rounds (Phase 2 or Slide rounds).
          3. Wise counseling strategy and choice filling guidelines (e.g., ordering of web options).
          
          Keep the advice highly encouraging, realistic, professional, and visually formatted. Use clear bullet points and bold headers. Do not include any standard meta disclaimer, talk like a native expert academic counselor of AP & TS admissions.`,
          history: []
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.text || 'Unable to generate counseling report. Please try again.');
      } else {
        throw new Error('Server returned non-ok counseling report status.');
      }
    } catch (err: any) {
      console.error('[AI COUNSELING REPORT] Error:', err);
      // Fallback response generator
      const defaultAdvice = `### 🤖 EAPCET AI Counselor Insights (Local Verification Fallback)

Based on your input rank **${parsedRank}** (${selectedCategory} - ${selectedGender}):

1. **Strategic Web Option Choices (Highly Recommended)**:
   - Place **Andhra University (AUCE)** and **JNTU Kakinada (JNTUK)** at the top of your choice list if your rank is below 5,000.
   - For ranks between 5,000 and 15,000, prioritize **Gayatri Vidya Parishad (GVP)** and **VR Siddhartha (VRSEC)** for Core branches like CSE & IT.
   - For ranks above 15,000, place **Sree Vidyanikethan (SVEC)** and **ANITS** as safe premium choices.

2. **Choice Filling Wisdom**:
   - Always list options in descending order of preference, irrespective of your rank. The algorithm processes options from #1 onwards.
   - Fill at least 25 to 30 options to prevent sliding down to vacant seats in less-preferred local colleges.
   - Don't hesitate to check specialized AI/ML (CSM) or Data Science (CSD) streams; cutoffs are slightly relaxed compared to core CSE, providing excellent placements.`;
      setAiResponse(defaultAdvice);
    } finally {
      setIsAiCounseling(false);
    }
  };

  return (
    <Card className="border border-border shadow-sm bg-card overflow-hidden">
      <CardHeader className="bg-muted/10 border-b border-border/50 py-5">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-primary hover:bg-transparent bg-primary/5 border-primary/20 text-xs px-2.5 py-0.5">
                EAPCET Rank Engine
              </Badge>
              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 text-[10px] px-2 py-0.5 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live AI
              </Badge>
              <span className="text-[10px] text-muted-foreground">• Real-time Predictor</span>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <School className="h-5 w-5 text-primary" />
              EAPCET College Recommendations & Rank Predictor
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Discover best-fit engineering colleges, cutoffs, and seat allocation probabilities across AP & Telangana based on your EAPCET rank.
            </CardDescription>
          </div>
          {parsedRank > 0 && (
            <Button 
              variant="outline" 
              onClick={fetchAiCounseling} 
              disabled={isAiCounseling}
              className="w-full md:w-auto h-9 text-xs font-medium gap-2 border-primary/30 text-primary hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
            >
              {isAiCounseling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Generating Counsel Plan...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  Request AI Counseling Advice
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Input Parameters Controls */}
        <div className="bg-muted/30 p-5 rounded-xl border border-border/60 mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-end">
          <div className="space-y-1.5">
            <Label htmlFor="predictor-rank" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              EAPCET State Rank
            </Label>
            <div className="relative">
              <Input
                id="predictor-rank"
                type="number"
                placeholder="Enter EAPCET Rank"
                value={rankInput}
                onChange={(e) => setRankInput(e.target.value)}
                className="pl-8 h-9 text-sm border-border bg-card font-medium"
                min="1"
                max="250000"
              />
              <Award className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/60" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="predictor-category" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Admission Category
            </Label>
            <select
              id="predictor-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-card px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            >
              <option value="OC">Open Category (OC / General)</option>
              <option value="BC">Backward Class (BC / OBC)</option>
              <option value="SC">Scheduled Caste (SC)</option>
              <option value="ST">Scheduled Tribe (ST)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="predictor-gender" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Seat Quota
            </Label>
            <select
              id="predictor-gender"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-card px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            >
              <option value="Co-Ed">Co-Educational Quota</option>
              <option value="Girls">Girls-Only Special Quota</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="predictor-branch" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Engineering Stream
            </Label>
            <select
              id="predictor-branch"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-card px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            >
              <option value="ALL">All Branches</option>
              <option value="CSE">CSE (Computer Science)</option>
              <option value="CSE_ALLIED">CSE Allied (AI, ML, IT, DS)</option>
              <option value="ECE">ECE (Electronics & Comm)</option>
              <option value="EEE">EEE (Electrical & Elect)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="predictor-type" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              College Type
            </Label>
            <select
              id="predictor-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-card px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            >
              <option value="ALL">All Colleges</option>
              <option value="University">University Campuses</option>
              <option value="Private">Top-Tier Private Colleges</option>
            </select>
          </div>
        </div>

        {/* AI response section */}
        {aiResponse && (
          <div className="mb-6 p-5 rounded-xl border border-primary/20 bg-primary/5/30 transition-all duration-300">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-pulse" />
                Expert Counselor AI Personalized Options report
              </h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setAiResponse('')}
                className="h-7 text-xs text-muted-foreground hover:bg-muted/50 rounded-full"
              >
                Clear Plan
              </Button>
            </div>
            <div className="text-sm text-foreground space-y-2 whitespace-pre-wrap leading-relaxed font-normal bg-card p-4 rounded-lg border border-border/80 shadow-inner max-h-[400px] overflow-y-auto">
              {aiResponse}
            </div>
          </div>
        )}

        {/* Search bar & statistics banner */}
        {parsedRank > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-2">
            <div className="relative w-full sm:max-w-xs">
              <Input
                placeholder="Search colleges or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs border-border bg-card"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="text-xs text-muted-foreground font-medium flex flex-wrap gap-x-4 gap-y-1">
              <span>Total Available matches: <strong className="text-foreground">{recommendedList.length}</strong> options</span>
              <span>Category Cutoffs Adjusted: <strong className="text-foreground">Enabled ({selectedCategory})</strong></span>
            </div>
          </div>
        )}

        {/* Output Cards list */}
        {parsedRank <= 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-xl bg-muted/10 flex flex-col items-center gap-2">
            <Award className="h-10 w-10 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-base">State Rank Needed</p>
            <p className="text-xs text-muted-foreground max-w-sm px-4">
              Please enter your EAPCET / EAMCET rank in the state rank input box above to fetch instant college recommendations and entry statistics.
            </p>
          </div>
        ) : recommendedList.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-xl bg-muted/10 flex flex-col items-center gap-2">
            <XCircle className="h-10 w-10 text-rose-500/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No colleges matched current filters</p>
            <p className="text-xs text-muted-foreground max-w-sm px-4">
              Try adjusting your stream preferences, choosing a relaxed Category (if applicable), or searching for a different keyword.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendedList.slice(0, 9).map((rec, i) => (
              <div 
                key={i} 
                className="flex flex-col border border-border rounded-xl bg-card hover:bg-muted/10 transition-all hover:shadow-md hover:-translate-y-0.5 duration-200"
              >
                <div className="p-4 flex-1">
                  {/* Card header */}
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider rounded h-5 bg-muted border border-border/50 text-muted-foreground">
                      {rec.code}
                    </Badge>
                    <Badge className={`text-[10px] font-bold h-5 px-2 py-0 border ${rec.colorClass}`}>
                      {rec.probabilityPercent}% {rec.probability} Chance
                    </Badge>
                  </div>

                  {/* College name & details */}
                  <h5 className="font-semibold text-sm text-foreground line-clamp-1 mb-1" title={rec.collegeName}>
                    {rec.collegeName}
                  </h5>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span>{rec.location}</span>
                    <span>•</span>
                    <span className="font-medium text-primary/80">{rec.type}</span>
                  </div>

                  {/* Branch & cutoff details */}
                  <div className="bg-muted/30 p-2.5 rounded-lg border border-border/40 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-muted-foreground font-normal flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-muted-foreground" />
                        Stream Option:
                      </span>
                      <strong className="text-foreground font-semibold">{rec.branchCode} ({rec.branch})</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-normal flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        Cutoff Rank:
                      </span>
                      <span className="text-foreground font-medium font-mono">
                        {rec.adjustedCutoff.toLocaleString()} 
                        <span className="text-[10px] text-muted-foreground ml-1">
                          (Base: {rec.cutoffRank.toLocaleString()})
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Match indicator footer */}
                <div className="border-t border-border/50 bg-muted/10 px-4 py-2 flex justify-between items-center gap-2 text-[10px]">
                  <span className="text-muted-foreground font-medium flex items-center gap-1">
                    {rec.probability === 'High' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : rec.probability === 'Medium' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                    ) : rec.probability === 'Low' ? (
                      <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                    )}
                    {rec.probability === 'High' 
                      ? 'Highly Secure Choice' 
                      : rec.probability === 'Medium' 
                      ? 'Likely to convert' 
                      : rec.probability === 'Low' 
                      ? 'Borderline / Ambition' 
                      : 'High cutoff reach'}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-muted-foreground font-mono">Rank: {parsedRank.toLocaleString()}</span>
                    <Button
                      type="button"
                      size="sm"
                      className="h-7 px-2.5 text-[10px]"
                      onClick={() => onApply?.(rec)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {recommendedList.length > 9 && (
              <div className="col-span-full text-center py-2 text-xs text-muted-foreground font-medium">
                Showing top 9 best matched recommendation options of {recommendedList.length} total options. Refine criteria to filter choices.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
