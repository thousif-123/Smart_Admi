// repeatable test harness for verifying document fraud detection accuracy
import { ForensicReport } from './forensicService';

export interface TestCase {
  id: string;
  name: string;
  category: string;
  description: string;
  expectedLabel: 'Genuine' | 'Fraudulent';
  formData: {
    fullName: string;
    hallTicketEamcet: string;
    math: string;
    physics: string;
    chemistry: string;
    marks12: string; // Stated Total Marks
  };
  // Simulated document image features (passed to imageForensics / fallback)
  simulatedFeatures: {
    elaScore: number;
    noiseScore: number;
    compressionScore: number;
    pixelConsistencyScore: number;
    fontConsistencyScore: number;
    templateScore: number;
    arithmeticMismatchFlagged: boolean;
    ocrConfidence: number;
  };
}

export interface EvaluationMetrics {
  total: number;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  confusionMatrix: {
    TN: number;
    FP: number;
    FN: number;
    TP: number;
  };
}

// 15 logical document categories of tampering & genuine scenarios
export const TEST_DATASET: TestCase[] = [
  {
    id: "TC-01",
    name: "Genuine SSC/12th Board Certificate",
    category: "Genuine Document",
    description: "Fully genuine document, perfect mathematical match and visual consistency.",
    expectedLabel: "Genuine",
    formData: {
      fullName: "Arun Kumar",
      hallTicketEamcet: "HT20268591",
      math: "90",
      physics: "85",
      chemistry: "95",
      marks12: "270" // 90+85+95 = 270 (Correct)
    },
    simulatedFeatures: {
      elaScore: 5,
      noiseScore: 8,
      compressionScore: 12,
      pixelConsistencyScore: 4,
      fontConsistencyScore: 5,
      templateScore: 3,
      arithmeticMismatchFlagged: false,
      ocrConfidence: 98
    }
  },
  {
    id: "TC-02",
    name: "Tampered A: Maths Marks Edited (Total Incorrect)",
    category: "Maths Modification",
    description: "Attacker changed Maths from 90 to 98, but forgot to update the total (270). Mathematically inconsistent.",
    expectedLabel: "Fraudulent",
    formData: {
      fullName: "Arun Kumar",
      hallTicketEamcet: "HT20268591",
      math: "98",
      physics: "85",
      chemistry: "90",
      marks12: "270" // 98+85+90 = 273 (Math error: 270 stated)
    },
    simulatedFeatures: {
      elaScore: 78, // High localized alteration around marks block
      noiseScore: 65,
      compressionScore: 50,
      pixelConsistencyScore: 82,
      fontConsistencyScore: 75, // Inconsistent fonts
      templateScore: 15,
      arithmeticMismatchFlagged: true,
      ocrConfidence: 94
    }
  },
  {
    id: "TC-03",
    name: "Tampered B: Maths Edited & Total Corrected",
    category: "Advanced Math and Total Patch",
    description: "Attacker edited Maths to 98 AND updated Total to 273. Math is correct, but strong visual evidence remains.",
    expectedLabel: "Fraudulent",
    formData: {
      fullName: "Arun Kumar",
      hallTicketEamcet: "HT20268591",
      math: "98",
      physics: "85",
      chemistry: "90",
      marks12: "273" // 98+85+90 = 273 (Mathematically matches, but cloned fonts/ELA spikes exist)
    },
    simulatedFeatures: {
      elaScore: 85, // Even higher ELA around the two edited locations
      noiseScore: 70,
      compressionScore: 58,
      pixelConsistencyScore: 90, // Confirmed copy-move visual editing
      fontConsistencyScore: 85, // Multi-font typography discrepancy
      templateScore: 20,
      arithmeticMismatchFlagged: false, // Math matches, must be flagged purely via Visual Evidence Fusion!
      ocrConfidence: 96
    }
  },
  {
    id: "TC-04",
    name: "Name Modification (Splicing)",
    category: "Name Alteration",
    description: "Name on document replaced with applicant name. Background texture and lighting mismatches.",
    expectedLabel: "Fraudulent",
    formData: {
      fullName: "Vijay Sai",
      hallTicketEamcet: "HT20261142",
      math: "80",
      physics: "80",
      chemistry: "80",
      marks12: "240"
    },
    simulatedFeatures: {
      elaScore: 88,
      noiseScore: 75,
      compressionScore: 62,
      pixelConsistencyScore: 85,
      fontConsistencyScore: 68,
      templateScore: 35,
      arithmeticMismatchFlagged: false,
      ocrConfidence: 92
    }
  },
  {
    id: "TC-05",
    name: "Date of Birth Correction (Inserted Text)",
    category: "Date Alteration",
    description: "Date of birth digit was modified to meet age criteria. High-frequency pixel edge discontinuity.",
    expectedLabel: "Fraudulent",
    formData: {
      fullName: "Sneha Reddy",
      hallTicketEamcet: "HT20269922",
      math: "92",
      physics: "91",
      chemistry: "90",
      marks12: "273"
    },
    simulatedFeatures: {
      elaScore: 62,
      noiseScore: 58,
      compressionScore: 40,
      pixelConsistencyScore: 78,
      fontConsistencyScore: 70,
      templateScore: 10,
      arithmeticMismatchFlagged: false,
      ocrConfidence: 95
    }
  },
  {
    id: "TC-06",
    name: "Roll/Hall Ticket Number Patching",
    category: "Registration Alteration",
    description: "The roll number was spliced from another ticket to bypass duplicate verification.",
    expectedLabel: "Fraudulent",
    formData: {
      fullName: "Rahul Varma",
      hallTicketEamcet: "HT20265431",
      math: "75",
      physics: "78",
      chemistry: "72",
      marks12: "225"
    },
    simulatedFeatures: {
      elaScore: 70,
      noiseScore: 62,
      compressionScore: 52,
      pixelConsistencyScore: 74,
      fontConsistencyScore: 80,
      templateScore: 18,
      arithmeticMismatchFlagged: false,
      ocrConfidence: 91
    }
  },
  {
    id: "TC-07",
    name: "Cloned Board Seal/Stamp",
    category: "Stamp Replication",
    description: "An official stamp was cloned and overlayed. Visible double-compression and edge halos.",
    expectedLabel: "Fraudulent",
    formData: {
      fullName: "Praveen Teja",
      hallTicketEamcet: "HT20263388",
      math: "85",
      physics: "85",
      chemistry: "85",
      marks12: "255"
    },
    simulatedFeatures: {
      elaScore: 92,
      noiseScore: 81,
      compressionScore: 70,
      pixelConsistencyScore: 88,
      fontConsistencyScore: 10,
      templateScore: 45,
      arithmeticMismatchFlagged: false,
      ocrConfidence: 94
    }
  },
  {
    id: "TC-08",
    name: "Low Quality Scan (Weak Signals Only)",
    category: "Low Image Quality",
    description: "Genuine memo but scanned in low resolution. Pixelation exists, but no localized tampering.",
    expectedLabel: "Genuine",
    formData: {
      fullName: "Kalyan Ram",
      hallTicketEamcet: "HT20261190",
      math: "82",
      physics: "80",
      chemistry: "84",
      marks12: "246"
    },
    simulatedFeatures: {
      elaScore: 28, // Upload compression artifact, not high enough to flag as fraud
      noiseScore: 25,
      compressionScore: 32,
      pixelConsistencyScore: 15,
      fontConsistencyScore: 12,
      templateScore: 8,
      arithmeticMismatchFlagged: false,
      ocrConfidence: 82 // Low OCR confidence! Checked by OCR error protection!
    }
  },
  {
    id: "TC-09",
    name: "Minor Clerical Math Inconsistency (Typo on Document)",
    category: "Mathematical Error",
    description: "Board printed math error (Total states 261, sum is 260). High OCR confidence, low visual forensics.",
    expectedLabel: "Genuine", // Typo or clerical error, lacking visual proof of alteration is treated as suspicious/low-risk
    formData: {
      fullName: "Divya Sri",
      hallTicketEamcet: "HT20264421",
      math: "85",
      physics: "85",
      chemistry: "90",
      marks12: "261" // stated: 261, sum: 260
    },
    simulatedFeatures: {
      elaScore: 10, // Clean visual
      noiseScore: 12,
      compressionScore: 15,
      pixelConsistencyScore: 5,
      fontConsistencyScore: 8,
      templateScore: 5,
      arithmeticMismatchFlagged: true,
      ocrConfidence: 97 // High OCR confidence, indicating a clean document math inconsistency (no visual forgery)
    }
  },
  {
    id: "TC-10",
    name: "Uncertain OCR Scrape (Total marks blurry)",
    category: "Uncertain OCR",
    description: "Total marks text is highly blurry. OCR confidence is 40%. Arithmetic mismatch must NOT trigger Fraud.",
    expectedLabel: "Genuine",
    formData: {
      fullName: "Srinivas Rao",
      hallTicketEamcet: "HT20269931",
      math: "88",
      physics: "88",
      chemistry: "88",
      marks12: "250" // stated 250, sum 264. Blurry total scanned as 250 instead of 264.
    },
    simulatedFeatures: {
      elaScore: 12, // Clean visual
      noiseScore: 18,
      compressionScore: 22,
      pixelConsistencyScore: 8,
      fontConsistencyScore: 10,
      templateScore: 5,
      arithmeticMismatchFlagged: true,
      ocrConfidence: 55 // Highly uncertain OCR! Checked by OCR error protection!
    }
  },
  {
    id: "TC-11",
    name: "Total Marks Grade Modification",
    category: "Grade Alteration",
    description: "Attacker changed Grade from 'B' to 'A'. High localized compression mismatch.",
    expectedLabel: "Fraudulent",
    formData: {
      fullName: "Ganesh Prasad",
      hallTicketEamcet: "HT20267711",
      math: "70",
      physics: "72",
      chemistry: "71",
      marks12: "213"
    },
    simulatedFeatures: {
      elaScore: 68,
      noiseScore: 55,
      compressionScore: 48,
      pixelConsistencyScore: 72,
      fontConsistencyScore: 65,
      templateScore: 12,
      arithmeticMismatchFlagged: false,
      ocrConfidence: 93
    }
  },
  {
    id: "TC-12",
    name: "Template Boundary Manipulation",
    category: "Layout Modification",
    description: "Document alignment shifted to hide watermark. High layout deviation score.",
    expectedLabel: "Fraudulent",
    formData: {
      fullName: "Nandini J",
      hallTicketEamcet: "HT20268112",
      math: "95",
      physics: "95",
      chemistry: "94",
      marks12: "284"
    },
    simulatedFeatures: {
      elaScore: 40,
      noiseScore: 45,
      compressionScore: 50,
      pixelConsistencyScore: 55,
      fontConsistencyScore: 35,
      templateScore: 80, // High template deviation
      arithmeticMismatchFlagged: false,
      ocrConfidence: 94
    }
  },
  {
    id: "TC-13",
    name: "Subject Name Tampering (Added Vocational)",
    category: "Subject Replacement",
    description: "Attacker overlayed 'Mathematics' text over an original vocational subject text box.",
    expectedLabel: "Fraudulent",
    formData: {
      fullName: "Harish Babu",
      hallTicketEamcet: "HT20261159",
      math: "85",
      physics: "80",
      chemistry: "80",
      marks12: "245"
    },
    simulatedFeatures: {
      elaScore: 75,
      noiseScore: 68,
      compressionScore: 60,
      pixelConsistencyScore: 80,
      fontConsistencyScore: 78,
      templateScore: 25,
      arithmeticMismatchFlagged: false,
      ocrConfidence: 92
    }
  },
  {
    id: "TC-14",
    name: "Genuine High-Res Scan",
    category: "Genuine Document",
    description: "Fully genuine document, perfect high-resolution scan, beautiful consistency.",
    expectedLabel: "Genuine",
    formData: {
      fullName: "Swathi Reddy",
      hallTicketEamcet: "HT20269002",
      math: "94",
      physics: "92",
      chemistry: "96",
      marks12: "282"
    },
    simulatedFeatures: {
      elaScore: 4,
      noiseScore: 5,
      compressionScore: 8,
      pixelConsistencyScore: 3,
      fontConsistencyScore: 4,
      templateScore: 2,
      arithmeticMismatchFlagged: false,
      ocrConfidence: 99
    }
  },
  {
    id: "TC-15",
    name: "Signature Overlay Splicing",
    category: "Signature Forgery",
    description: "Signature cloned from another document and pasted. Discontinuous alpha channel boundaries.",
    expectedLabel: "Fraudulent",
    formData: {
      fullName: "Tarun G",
      hallTicketEamcet: "HT20264455",
      math: "88",
      physics: "85",
      chemistry: "87",
      marks12: "260"
    },
    simulatedFeatures: {
      elaScore: 80,
      noiseScore: 72,
      compressionScore: 65,
      pixelConsistencyScore: 86,
      fontConsistencyScore: 20,
      templateScore: 30,
      arithmeticMismatchFlagged: false,
      ocrConfidence: 95
    }
  }
];

// Evaluates simulated document features against the actual Calibration Scoring Engine logic
export function runSimulatedEvaluation(dataset: TestCase[] = TEST_DATASET): EvaluationMetrics {
  let truePositives = 0;
  let falsePositives = 0;
  let trueNegatives = 0;
  let falseNegatives = 0;

  dataset.forEach(tc => {
    const { simulatedFeatures, formData } = tc;

    // --- EXECUTE THE CALIBRATION ENGINE CODE MATHEMATICALLY ---
    const ocrIsUncertain = simulatedFeatures.ocrConfidence < 85;
    const strongVisualAnomalies = simulatedFeatures.elaScore > 45 || simulatedFeatures.fontConsistencyScore > 45 || simulatedFeatures.noiseScore > 45;
    const hasCopyMoveOrSplicing = simulatedFeatures.pixelConsistencyScore > 45;
    const hasArithmeticMismatch = simulatedFeatures.arithmeticMismatchFlagged;
    
    // Evaluate Arithmetic Inconsistency backed by Visual Proof
    const arithmeticSupportedByVisual = hasArithmeticMismatch && (strongVisualAnomalies || hasCopyMoveOrSplicing);

    const visualForensicRiskScore = Math.max(
      0, 
      (simulatedFeatures.elaScore * 0.30 + simulatedFeatures.noiseScore * 0.20 + simulatedFeatures.compressionScore * 0.20 + simulatedFeatures.pixelConsistencyScore * 0.15 + simulatedFeatures.fontConsistencyScore * 0.15)
    );

    let numericalConsistencyRiskScore = 10;
    if (hasArithmeticMismatch) {
      if (ocrIsUncertain) {
        numericalConsistencyRiskScore = 20; 
      } else if (arithmeticSupportedByVisual) {
        numericalConsistencyRiskScore = 95; 
      } else {
        numericalConsistencyRiskScore = 45; 
      }
    }

    // The expected label is ground truth only; it must never be fed into the
    // model inputs.  The previous harness did exactly that for cross-field,
    // Bayesian, and Gemini scores, making its reported accuracy invalid.
    const crossFieldConsistencyRiskScore = 5; // no simulated OCR/form mismatch is supplied by this fixture
    const templateRiskScore = simulatedFeatures.templateScore;
    const visualSignal = Math.max(
      simulatedFeatures.elaScore,
      simulatedFeatures.noiseScore,
      simulatedFeatures.pixelConsistencyScore,
      simulatedFeatures.fontConsistencyScore,
      simulatedFeatures.templateScore
    );
    const nbRiskScore = visualSignal > 70 ? 85 : (visualSignal > 40 ? 45 : 10);
    const geminiReasoningScore = visualSignal > 70 ? 80 : (visualSignal > 40 ? 40 : 10);

    const weightedOverall = Math.round(
      visualForensicRiskScore * 0.40 +
      numericalConsistencyRiskScore * 0.25 +
      crossFieldConsistencyRiskScore * 0.15 +
      templateRiskScore * 0.10 +
      nbRiskScore * 0.05 +
      geminiReasoningScore * 0.05
    );

    // Apply exact threshold flags
    let finalScore = weightedOverall;
    if (hasArithmeticMismatch && arithmeticSupportedByVisual) {
      finalScore = Math.max(finalScore, 88);
    }

    // Classify as Suspect (Fraudulent) if overall score is > 30 (Moderate Risk threshold)
    const classifiedAsFraud = finalScore > 30;
    const expectedFraud = tc.expectedLabel === 'Fraudulent';

    if (classifiedAsFraud && expectedFraud) {
      truePositives++;
    } else if (classifiedAsFraud && !expectedFraud) {
      falsePositives++;
    } else if (!classifiedAsFraud && !expectedFraud) {
      trueNegatives++;
    } else if (!classifiedAsFraud && expectedFraud) {
      falseNegatives++;
    }
  });

  const total = dataset.length;
  const accuracy = (truePositives + trueNegatives) / total;
  const precision = truePositives + falsePositives > 0 ? truePositives / (truePositives + falsePositives) : 0;
  const recall = truePositives + falseNegatives > 0 ? truePositives / (truePositives + falseNegatives) : 0;
  const f1Score = precision + recall > 0 ? 2 * (precision * recall) / (precision + recall) : 0;
  
  const totalActualNegatives = trueNegatives + falsePositives;
  const falsePositiveRate = totalActualNegatives > 0 ? falsePositives / totalActualNegatives : 0;
  
  const totalActualPositives = truePositives + falseNegatives;
  const falseNegativeRate = totalActualPositives > 0 ? falseNegatives / totalActualPositives : 0;

  return {
    total,
    truePositives,
    falsePositives,
    trueNegatives,
    falseNegatives,
    accuracy: Math.round(accuracy * 1000) / 10,
    precision: Math.round(precision * 1000) / 10,
    recall: Math.round(recall * 1000) / 10,
    f1Score: Math.round(f1Score * 1000) / 10,
    falsePositiveRate: Math.round(falsePositiveRate * 1000) / 10,
    falseNegativeRate: Math.round(falseNegativeRate * 1000) / 10,
    confusionMatrix: {
      TN: trueNegatives,
      FP: falsePositives,
      FN: falseNegatives,
      TP: truePositives
    }
  };
}
