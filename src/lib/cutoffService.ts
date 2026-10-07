export interface BranchCutoff {
  branch: string;
  branchCode: string;
  cutoffRank2026: number; // Present academic year cutoff
  cutoffRank2025: number; // Previous academic year cutoff
  cutoffRank2024: number; // Benchmark cutoff
  trend: 'Rising' | 'Stable' | 'Dropping'; // Rank competition trend
  totalSeats: number;
}

export interface CollegeCutoffData {
  collegeName: string;
  code: string;
  location: string;
  type: 'University' | 'Private' | 'Government';
  rating: string;
  branches: BranchCutoff[];
}

export const COLLEGE_CUTOFFS_DATABASE: CollegeCutoffData[] = [
  {
    collegeName: "Andhra University College of Engineering",
    code: "AUCE",
    location: "Visakhapatnam",
    type: "University",
    rating: "A++",
    branches: [
      { branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank2026: 1450, cutoffRank2025: 1520, cutoffRank2024: 1600, trend: 'Rising', totalSeats: 120 },
      { branch: "Artificial Intelligence & Machine Learning", branchCode: "CSM", cutoffRank2026: 2750, cutoffRank2025: 2850, cutoffRank2024: 3100, trend: 'Rising', totalSeats: 60 },
      { branch: "Information Technology", branchCode: "INF", cutoffRank2026: 4100, cutoffRank2025: 4250, cutoffRank2024: 4400, trend: 'Rising', totalSeats: 60 },
      { branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank2026: 3400, cutoffRank2025: 3550, cutoffRank2024: 3700, trend: 'Rising', totalSeats: 120 },
      { branch: "Electrical & Electronics Engineering", branchCode: "EEE", cutoffRank2026: 7800, cutoffRank2025: 8050, cutoffRank2024: 8200, trend: 'Stable', totalSeats: 90 },
      { branch: "Mechanical Engineering", branchCode: "MEC", cutoffRank2026: 11800, cutoffRank2025: 12100, cutoffRank2024: 12500, trend: 'Stable', totalSeats: 90 },
      { branch: "Civil Engineering", branchCode: "CIV", cutoffRank2026: 14600, cutoffRank2025: 15100, cutoffRank2024: 15500, trend: 'Stable', totalSeats: 90 }
    ]
  },
  {
    collegeName: "JNTU College of Engineering, Kakinada",
    code: "JNTUK",
    location: "Kakinada",
    type: "University",
    rating: "A+",
    branches: [
      { branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank2026: 2400, cutoffRank2025: 2520, cutoffRank2024: 2650, trend: 'Rising', totalSeats: 120 },
      { branch: "Artificial Intelligence & Data Science", branchCode: "CSD", cutoffRank2026: 3700, cutoffRank2025: 3850, cutoffRank2024: 4000, trend: 'Rising', totalSeats: 60 },
      { branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank2026: 4650, cutoffRank2025: 4820, cutoffRank2024: 5000, trend: 'Rising', totalSeats: 120 },
      { branch: "Information Technology", branchCode: "INF", cutoffRank2026: 5400, cutoffRank2025: 5550, cutoffRank2024: 5750, trend: 'Rising', totalSeats: 60 },
      { branch: "Electrical & Electronics Engineering", branchCode: "EEE", cutoffRank2026: 9200, cutoffRank2025: 9550, cutoffRank2024: 9800, trend: 'Stable', totalSeats: 90 },
      { branch: "Mechanical Engineering", branchCode: "MEC", cutoffRank2026: 13700, cutoffRank2025: 14100, cutoffRank2024: 14500, trend: 'Stable', totalSeats: 90 }
    ]
  },
  {
    collegeName: "JNTU College of Engineering, Anantapur",
    code: "JNTUA",
    location: "Anantapur",
    type: "University",
    rating: "A",
    branches: [
      { branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank2026: 4350, cutoffRank2025: 4520, cutoffRank2024: 4700, trend: 'Rising', totalSeats: 120 },
      { branch: "Artificial Intelligence & Machine Learning", branchCode: "CSM", cutoffRank2026: 5850, cutoffRank2025: 6050, cutoffRank2024: 6300, trend: 'Rising', totalSeats: 60 },
      { branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank2026: 7300, cutoffRank2025: 7550, cutoffRank2024: 7800, trend: 'Rising', totalSeats: 120 },
      { branch: "Electrical & Electronics Engineering", branchCode: "EEE", cutoffRank2026: 13600, cutoffRank2025: 14100, cutoffRank2024: 14500, trend: 'Stable', totalSeats: 90 }
    ]
  },
  {
    collegeName: "Sri Venkateswara University College of Engineering",
    code: "SVUCE",
    location: "Tirupati",
    type: "University",
    rating: "A+",
    branches: [
      { branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank2026: 3400, cutoffRank2025: 3520, cutoffRank2024: 3700, trend: 'Rising', totalSeats: 120 },
      { branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank2026: 5850, cutoffRank2025: 6050, cutoffRank2024: 6300, trend: 'Rising', totalSeats: 120 },
      { branch: "Information Technology", branchCode: "INF", cutoffRank2026: 8300, cutoffRank2025: 8550, cutoffRank2024: 8800, trend: 'Rising', totalSeats: 60 },
      { branch: "Electrical & Electronics Engineering", branchCode: "EEE", cutoffRank2026: 11700, cutoffRank2025: 12100, cutoffRank2024: 12500, trend: 'Stable', totalSeats: 90 }
    ]
  },
  {
    collegeName: "Chaitanya Bharathi Institute of Technology",
    code: "CBIT",
    location: "Hyderabad",
    type: "Private",
    rating: "A++",
    branches: [
      { branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank2026: 1750, cutoffRank2025: 1820, cutoffRank2024: 1900, trend: 'Rising', totalSeats: 180 },
      { branch: "Artificial Intelligence & Machine Learning", branchCode: "CSM", cutoffRank2026: 2900, cutoffRank2025: 3020, cutoffRank2024: 3200, trend: 'Rising', totalSeats: 120 },
      { branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank2026: 4100, cutoffRank2025: 4250, cutoffRank2024: 4400, trend: 'Rising', totalSeats: 180 },
      { branch: "Information Technology", branchCode: "INF", cutoffRank2026: 4400, cutoffRank2025: 4550, cutoffRank2024: 4700, trend: 'Rising', totalSeats: 120 }
    ]
  },
  {
    collegeName: "Gayatri Vidya Parishad College of Engineering",
    code: "GVP",
    location: "Visakhapatnam",
    type: "Private",
    rating: "A",
    branches: [
      { branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank2026: 5350, cutoffRank2025: 5520, cutoffRank2024: 5700, trend: 'Rising', totalSeats: 180 },
      { branch: "Artificial Intelligence & Data Science", branchCode: "CSD", cutoffRank2026: 7600, cutoffRank2025: 7850, cutoffRank2024: 8100, trend: 'Rising', totalSeats: 120 },
      { branch: "Information Technology", branchCode: "INF", cutoffRank2026: 8300, cutoffRank2025: 8550, cutoffRank2024: 8800, trend: 'Rising', totalSeats: 120 },
      { branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank2026: 9000, cutoffRank2025: 9250, cutoffRank2024: 9500, trend: 'Rising', totalSeats: 180 },
      { branch: "Electrical & Electronics Engineering", branchCode: "EEE", cutoffRank2026: 15500, cutoffRank2025: 16100, cutoffRank2024: 16500, trend: 'Stable', totalSeats: 120 }
    ]
  },
  {
    collegeName: "Velagapudi Ramakrishna Siddhartha Engineering College",
    code: "VRSEC",
    location: "Vijayawada",
    type: "Private",
    rating: "A",
    branches: [
      { branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank2026: 6350, cutoffRank2025: 6520, cutoffRank2024: 6700, trend: 'Rising', totalSeats: 180 },
      { branch: "Artificial Intelligence & Machine Learning", branchCode: "CSM", cutoffRank2026: 8300, cutoffRank2025: 8550, cutoffRank2024: 8800, trend: 'Rising', totalSeats: 120 },
      { branch: "Information Technology", branchCode: "INF", cutoffRank2026: 9600, cutoffRank2025: 9850, cutoffRank2024: 10100, trend: 'Rising', totalSeats: 120 },
      { branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank2026: 10800, cutoffRank2025: 11100, cutoffRank2024: 11500, trend: 'Rising', totalSeats: 180 }
    ]
  },
  {
    collegeName: "Madanapalle Institute of Technology & Science",
    code: "MITS",
    location: "Madanapalle",
    type: "Private",
    rating: "A",
    branches: [
      { branch: "Computer Science & Engineering", branchCode: "CSE", cutoffRank2026: 17500, cutoffRank2025: 18100, cutoffRank2024: 18800, trend: 'Rising', totalSeats: 240 },
      { branch: "Artificial Intelligence & Data Science", branchCode: "CSD", cutoffRank2026: 25400, cutoffRank2025: 26100, cutoffRank2024: 26800, trend: 'Rising', totalSeats: 180 },
      { branch: "Electronics & Communication Engineering", branchCode: "ECE", cutoffRank2026: 31200, cutoffRank2025: 32100, cutoffRank2024: 32800, trend: 'Stable', totalSeats: 240 }
    ]
  }
];

// Helper: compute reservation & gender adjusted cutoff rank
export function computeAdjustedCutoff(
  baseCutoff2026: number,
  category: string = 'OC',
  gender: string = 'Co-Ed',
  isEWS: boolean = false
): number {
  let multiplier = 1.0;

  const cat = category.toUpperCase();
  if (cat === 'BC') multiplier = 1.35;
  else if (cat === 'SC') multiplier = 2.15;
  else if (cat === 'ST') multiplier = 2.75;
  else if (cat === 'EWS' || isEWS) multiplier = 1.15;

  if (gender.toLowerCase() === 'girls' || gender.toLowerCase() === 'female') {
    multiplier *= 1.15;
  }

  return Math.round(baseCutoff2026 * multiplier);
}

// Evaluate student EAMCET rank against all colleges in database
export function evaluateStudentRank(
  studentRank: number,
  category: string = 'OC',
  gender: string = 'Co-Ed',
  isEWS: boolean = false,
  preferredBranch?: string
) {
  if (!studentRank || studentRank <= 0) return { matchedColleges: [], summary: 'No valid rank provided.' };

  const matches: any[] = [];

  COLLEGE_CUTOFFS_DATABASE.forEach(college => {
    college.branches.forEach(b => {
      if (preferredBranch && preferredBranch !== 'ALL' && b.branchCode.toLowerCase() !== preferredBranch.toLowerCase() && !b.branch.toLowerCase().includes(preferredBranch.toLowerCase())) {
        return;
      }

      const adjustedCutoff2026 = computeAdjustedCutoff(b.cutoffRank2026, category, gender, isEWS);
      const adjustedCutoff2025 = computeAdjustedCutoff(b.cutoffRank2025, category, gender, isEWS);

      let status: 'High Chance' | 'Moderate Chance' | 'Low Chance' | 'Reach';
      let chancePercent = 0;

      if (studentRank <= adjustedCutoff2026 * 0.82) {
        status = 'High Chance';
        chancePercent = Math.min(99, Math.round(92 + (adjustedCutoff2026 * 0.82 - studentRank) / 300));
      } else if (studentRank <= adjustedCutoff2026 * 1.08) {
        status = 'Moderate Chance';
        chancePercent = Math.round(68 + ((adjustedCutoff2026 * 1.08 - studentRank) / (adjustedCutoff2026 * 0.26)) * 23);
      } else if (studentRank <= adjustedCutoff2026 * 1.38) {
        status = 'Low Chance';
        chancePercent = Math.max(15, Math.round(25 + ((adjustedCutoff2026 * 1.38 - studentRank) / (adjustedCutoff2026 * 0.3)) * 38));
      } else {
        status = 'Reach';
        chancePercent = Math.max(2, Math.round(5 + (adjustedCutoff2026 * 1.8 - studentRank) / 2000));
      }

      matches.push({
        collegeName: college.collegeName,
        code: college.code,
        location: college.location,
        type: college.type,
        rating: college.rating,
        branch: b.branch,
        branchCode: b.branchCode,
        baseCutoff2026: b.cutoffRank2026,
        baseCutoff2025: b.cutoffRank2025,
        adjustedCutoff2026,
        adjustedCutoff2025,
        trend: b.trend,
        status,
        chancePercent,
        studentRank
      });
    });
  });

  // Sort matches by admission chance descending, then by adjusted cutoff
  matches.sort((a, b) => b.chancePercent - a.chancePercent || a.adjustedCutoff2026 - b.adjustedCutoff2026);

  const highCount = matches.filter(m => m.status === 'High Chance').length;
  const modCount = matches.filter(m => m.status === 'Moderate Chance').length;

  return {
    studentRank,
    category,
    gender,
    matchedColleges: matches,
    summary: `With EAMCET Rank ${studentRank.toLocaleString()} (${category} Category), you have ${highCount} high-probability college branch options and ${modCount} moderate options for 2026 admissions.`
  };
}
