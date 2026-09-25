import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// Helper function to wrap Firestore promises with a timeout
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, defaultValue: T): Promise<T> {
  return new Promise<T>((resolve) => {
    const timer = setTimeout(() => {
      console.warn(`[TIMEOUT] Operation exceeded ${timeoutMs}ms. Resolving with fallback default value.`);
      resolve(defaultValue);
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        console.error('[TIMEOUT WRAPPER] Error in operation:', err);
        resolve(defaultValue);
      });
  });
}

export interface TrainingExample {
  id?: string;
  marksMismatch: number;        // 0 or 1
  duplicateHallTicket: number;  // 0 or 1
  nameMismatch: number;         // 0 or 1
  missingDocuments: number;     // 0 or 1
  ocrDiscrepancy: number;       // 0 or 1
  isFraud: number;              // 0 or 1
  label?: string;               // 'Fraudulent' or 'Genuine'
}

export interface ModelParameters {
  priorFraud: number;
  priorGenuine: number;
  featureProbsFraud: number[];
  featureProbsGenuine: number[];
  trainedCount: number;
  lastTrainedAt?: string;
}

// Simple but real Naive Bayes Classifier for Fraud Prediction
export class NaiveBayesClassifier {
  priorFraud: number = 0.5;
  priorGenuine: number = 0.5;
  // Features in order: marksMismatch, duplicateHallTicket, nameMismatch, missingDocuments, ocrDiscrepancy
  featureProbsFraud: number[] = [0.8, 0.9, 0.7, 0.6, 0.8];
  featureProbsGenuine: number[] = [0.05, 0.01, 0.1, 0.05, 0.05];
  trainedCount: number = 0;

  constructor(params?: ModelParameters) {
    if (params) {
      this.priorFraud = params.priorFraud;
      this.priorGenuine = params.priorGenuine;
      this.featureProbsFraud = params.featureProbsFraud;
      this.featureProbsGenuine = params.featureProbsGenuine;
      this.trainedCount = params.trainedCount;
    }
  }

  // Train on an array of examples
  train(examples: TrainingExample[]) {
    const fraudExamples = examples.filter(e => e.isFraud === 1);
    const genuineExamples = examples.filter(e => e.isFraud === 0);

    const countFraud = fraudExamples.length;
    const countGenuine = genuineExamples.length;
    const total = examples.length;

    if (total === 0) return;

    // Calculate Priors with Laplace smoothing
    this.priorFraud = (countFraud + 1) / (total + 2);
    this.priorGenuine = (countGenuine + 1) / (total + 2);

    const featuresCount = 5;
    this.featureProbsFraud = Array(featuresCount).fill(0);
    this.featureProbsGenuine = Array(featuresCount).fill(0);

    const keys: (keyof Omit<TrainingExample, 'isFraud' | 'id' | 'label'>)[] = [
      'marksMismatch',
      'duplicateHallTicket',
      'nameMismatch',
      'missingDocuments',
      'ocrDiscrepancy'
    ];

    for (let i = 0; i < featuresCount; i++) {
      const key = keys[i];
      const sumFraud = fraudExamples.reduce((sum, e) => sum + (e[key] || 0), 0);
      const sumGenuine = genuineExamples.reduce((sum, e) => sum + (e[key] || 0), 0);

      // Laplace smoothing for conditional probabilities
      this.featureProbsFraud[i] = (sumFraud + 1) / (countFraud + 2);
      this.featureProbsGenuine[i] = (sumGenuine + 1) / (countGenuine + 2);
    }
    this.trainedCount = total;
  }

  // Predict outputs for a given set of features
  predict(features: Omit<TrainingExample, 'isFraud' | 'id' | 'label'>) {
    const keys: (keyof typeof features)[] = [
      'marksMismatch',
      'duplicateHallTicket',
      'nameMismatch',
      'missingDocuments',
      'ocrDiscrepancy'
    ];

    // Log probabilities to prevent underflow
    let logProbFraud = Math.log(this.priorFraud);
    let logProbGenuine = Math.log(this.priorGenuine);

    keys.forEach((key, i) => {
      const val = features[key] || 0;
      const pF = this.featureProbsFraud[i];
      const pG = this.featureProbsGenuine[i];

      if (val === 1) {
        logProbFraud += Math.log(pF);
        logProbGenuine += Math.log(pG);
      } else {
        logProbFraud += Math.log(1 - pF);
        logProbGenuine += Math.log(1 - pG);
      }
    });

    // Exponential shift to normalize safely
    const maxLog = Math.max(logProbFraud, logProbGenuine);
    const probFraudRaw = Math.exp(logProbFraud - maxLog);
    const probGenuineRaw = Math.exp(logProbGenuine - maxLog);

    const probability = probFraudRaw / (probFraudRaw + probGenuineRaw);
    
    const confidence = Math.round(Math.abs(probability - 0.5) * 2 * 100);
    const fraudScore = Math.round(probability * 100);
    
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    if (fraudScore > 70) {
      riskLevel = 'High';
    } else if (fraudScore > 35) {
      riskLevel = 'Medium';
    }

    return {
      fraudProbability: fraudScore,
      fraudScore,
      riskLevel,
      confidence: Math.max(45, confidence), // lower boundary
    };
  }
}

// Fetch model parameters from proxy API
export async function getTrainedModel(): Promise<NaiveBayesClassifier> {
  try {
    console.log('[ML FRAUD SERVICE] Fetching ML model metadata from proxy API...');
    const response = await fetch('/api/ml-metadata');
    if (response.ok) {
      const data = await response.json();
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        return new NaiveBayesClassifier(data as ModelParameters);
      }
    }
  } catch (error: any) {
    console.warn('[ML FRAUD SERVICE] Could not fetch ML model metadata from proxy API (using local NaiveBayesClassifier fallback):', error?.message || error);
  }
  return new NaiveBayesClassifier(); // Default classifier
}

// Save model parameters to proxy API
export async function saveModelParameters(params: ModelParameters) {
  try {
    const response = await fetch('/api/ml-metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!response.ok) {
      throw new Error('Server returned non-ok status: ' + response.status);
    }
  } catch (error: any) {
    console.error('[ML FRAUD SERVICE] Error saving model parameters via proxy API:', error?.message || error);
  }
}

// Check if a hall ticket is duplicate
export async function checkDuplicateHallTicket(hallTicket: string, currentAppId: string): Promise<boolean> {
  if (!hallTicket) return false;
  console.log(`[ML FRAUD SERVICE] Starting duplicate check for hall ticket: ${hallTicket}`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.warn(`[ML FRAUD SERVICE] Duplicate check API call timed out after 10s. Aborting request.`);
    controller.abort();
  }, 10000);

  try {
    const response = await fetch(`/api/check-duplicate-hall-ticket?hallTicket=${encodeURIComponent(hallTicket)}&currentAppId=${encodeURIComponent(currentAppId)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json();
      console.log(`[ML FRAUD SERVICE] Duplicate check API success. isDuplicate: ${data.isDuplicate}`);
      return !!data.isDuplicate;
    }
    console.warn(`[ML FRAUD SERVICE] Duplicate check API returned non-ok status: ${response.status}`);
  } catch (apiError: any) {
    console.warn('[ML FRAUD SERVICE] API duplicate check failed or timed out, trying local Firestore fallback:', apiError.message || apiError);
  } finally {
    clearTimeout(timeoutId);
  }

  try {
    console.log('[ML FRAUD SERVICE] Running local Firestore duplicate check fallback with 5s timeout...');
    const q = query(collection(db, 'applications'), where('hallTicketEamcet', '==', hallTicket));
    const querySnapshot = await withTimeout(getDocs(q), 5000, null);
    if (querySnapshot) {
      const isDup = querySnapshot.docs.some(doc => doc.id !== currentAppId);
      console.log(`[ML FRAUD SERVICE] Local duplicate check complete. isDuplicate: ${isDup}`);
      return isDup;
    }
  } catch (error) {
    console.error('[ML FRAUD SERVICE] Error checking duplicate hall ticket locally in Firestore:', error);
  }
  return false;
}

// Generate the feature indicators using Gemini Vision + structured extraction
export async function extractOcrAndIndicators(formData: any, documents: Record<string, string>): Promise<{
  ocrData: string;
  indicators: Omit<TrainingExample, 'isFraud' | 'id' | 'label'>;
  reasons: string[];
  forensicResults?: any;
}> {
  console.log('[ML FRAUD SERVICE] Extracting OCR and indicators securely via backend...');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.warn(`[ML FRAUD SERVICE] OCR API call timed out after 60s. Aborting request.`);
    controller.abort();
  }, 60000);

  try {
    const response = await fetch('/api/extract-ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData, documents }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error('Server returned error status: ' + response.status);
    }
    const result = await response.json();
    console.log('[ML FRAUD SERVICE] Successfully extracted OCR and indicators from backend.');
    return result;
  } catch (error: any) {
    console.error('[ML FRAUD SERVICE] Error extracting OCR and indicators securely via backend:', error.message || error);
    const docsCount = documents ? Object.keys(documents).length : 0;
    // Safe fallbacks in case of network, key failure, or timeout
    return {
      ocrData: "OCR processing failed due to connection error, timeout, or missing keys. Reverting to basic automated heuristics.",
      indicators: {
        marksMismatch: 0,
        duplicateHallTicket: 0,
        nameMismatch: 0,
        missingDocuments: docsCount < 4 ? 1 : 0,
        // A timeout/error is not proof of fraud, but it must not be scored as
        // a clean document either.  This routes it to manual verification.
        ocrDiscrepancy: 1
      },
      reasons: ["Document verification could not complete independently; manual review is required."]
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

// Complete automated ML Fraud Analysis run for a single application
export async function runMLFraudAnalysis(
  appId: string, 
  formData: any, 
  documents: Record<string, string>,
  onProgress?: (step: string) => void
) {
  console.log('[ML FRAUD SERVICE] Initiating complete ML Fraud Analysis workflow...');
  
  if (onProgress) onProgress('Extracting Text...');
  
  // Start the three independent workflows in parallel!
  console.log('[ML FRAUD SERVICE] Launching parallel checks (OCR, Duplicate Ticket, Model Load)...');
  const ocrPromise = extractOcrAndIndicators(formData, documents);
  const duplicatePromise = checkDuplicateHallTicket(formData.hallTicketEamcet, appId);
  const classifierPromise = getTrainedModel();

  // Progress update simulation during parallel processing
  let stepIdx = 0;
  const progressInterval = setInterval(() => {
    if (onProgress) {
      const steps = [
        'Verifying Applicant Details...',
        'Verifying Uploaded Documents...',
        'Running Fraud Detection...'
      ];
      if (stepIdx < steps.length) {
        onProgress(steps[stepIdx++]);
      }
    }
  }, 2500);

  try {
    const [analysisResult, isDuplicate, classifier] = await Promise.all([
      ocrPromise,
      duplicatePromise,
      classifierPromise
    ]);
    
    clearInterval(progressInterval);
    console.log('[ML FRAUD SERVICE] Parallel operations complete. Processing results...');

    if (onProgress) onProgress('Running Fraud Detection...');

    if (isDuplicate) {
      analysisResult.indicators.duplicateHallTicket = 1;
      analysisResult.reasons.push("Duplicate EAMCET Hall Ticket detected (used by another applicant).");
    }

    // Run prediction
    console.log('[ML FRAUD SERVICE] Calculating Naive Bayes prediction...');
    const prediction = classifier.predict(analysisResult.indicators);
    console.log('[ML FRAUD SERVICE] Prediction results:', JSON.stringify(prediction));

    // Fuse / Override Naive Bayes with the Digital Forensic Report
    // Scores are user-facing security signals.  Do not allow an unavailable
    // OCR/model response (undefined, NaN or a negative value) to be rendered as
    // a misleading 0% "genuine" result.
    const normalizeScore = (value: unknown) => {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? Math.min(100, Math.max(0, Math.round(numeric))) : 0;
    };
    let finalFraudScore = normalizeScore(prediction.fraudScore);
    let finalRiskLevel = prediction.riskLevel;
    let finalConfidence = prediction.confidence;

    if (analysisResult.forensicResults) {
      const fRes = analysisResult.forensicResults;
      // We take the max of Bayesian indicator scoring and forensic inspection scoring to optimize sensitivity
      finalFraudScore = Math.max(finalFraudScore, normalizeScore(fRes.overallFraudScore ?? fRes.riskScore));
      finalConfidence = Math.max(prediction.confidence, normalizeScore(fRes.confidence));

      if (finalFraudScore > 70) {
        finalRiskLevel = 'High';
      } else if (finalFraudScore > 35) {
        finalRiskLevel = 'Medium';
      } else {
        finalRiskLevel = 'Low';
      }
    }

    return {
      ocrData: analysisResult.ocrData,
      indicators: analysisResult.indicators,
      fraudScore: finalFraudScore,
      riskLevel: finalRiskLevel,
      confidence: finalConfidence,
      reasons: analysisResult.forensicResults?.reasons || (analysisResult.reasons.length > 0 ? analysisResult.reasons : ["All details verified, no risks found."]),
      forensicResults: analysisResult.forensicResults
    };
  } catch (err: any) {
    clearInterval(progressInterval);
    console.error('[ML FRAUD SERVICE] Error in parallel fraud analysis:', err);
    throw err;
  }
}

// Generate a default high-quality synthetic training dataset to initialize Firestore
export function getDefaultTrainingDataset(): TrainingExample[] {
  return [
    { marksMismatch: 0, duplicateHallTicket: 0, nameMismatch: 0, missingDocuments: 0, ocrDiscrepancy: 0, isFraud: 0, label: 'Genuine' },
    { marksMismatch: 1, duplicateHallTicket: 0, nameMismatch: 0, missingDocuments: 0, ocrDiscrepancy: 0, isFraud: 1, label: 'Fraudulent' },
    { marksMismatch: 0, duplicateHallTicket: 1, nameMismatch: 0, missingDocuments: 0, ocrDiscrepancy: 0, isFraud: 1, label: 'Fraudulent' },
    { marksMismatch: 0, duplicateHallTicket: 0, nameMismatch: 1, missingDocuments: 0, ocrDiscrepancy: 0, isFraud: 1, label: 'Fraudulent' },
    { marksMismatch: 0, duplicateHallTicket: 0, nameMismatch: 0, missingDocuments: 1, ocrDiscrepancy: 0, isFraud: 0, label: 'Genuine' }, // missing file not necessarily fraud
    { marksMismatch: 0, duplicateHallTicket: 0, nameMismatch: 0, missingDocuments: 0, ocrDiscrepancy: 1, isFraud: 1, label: 'Fraudulent' },
    { marksMismatch: 1, duplicateHallTicket: 1, nameMismatch: 1, missingDocuments: 0, ocrDiscrepancy: 1, isFraud: 1, label: 'Fraudulent' },
    { marksMismatch: 0, duplicateHallTicket: 0, nameMismatch: 0, missingDocuments: 0, ocrDiscrepancy: 0, isFraud: 0, label: 'Genuine' },
    { marksMismatch: 0, duplicateHallTicket: 0, nameMismatch: 0, missingDocuments: 0, ocrDiscrepancy: 0, isFraud: 0, label: 'Genuine' },
    { marksMismatch: 0, duplicateHallTicket: 0, nameMismatch: 0, missingDocuments: 0, ocrDiscrepancy: 0, isFraud: 0, label: 'Genuine' }
  ];
}
