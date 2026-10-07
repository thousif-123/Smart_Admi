import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  X, 
  ShieldCheck, 
  HelpCircle, 
  RefreshCw,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

export interface DocumentExplainerData {
  documentType?: string;
  fields?: {
    studentName?: string;
    math?: number | string;
    physics?: number | string;
    chemistry?: number | string;
    totalMarks?: number | string;
    rank?: number | string;
    hallTicketNumber?: string;
    [key: string]: any;
  };
  ocrText?: string;
  confidence?: number;
  forensicResults?: any;
  indicators?: {
    marksMismatch?: number;
    nameMismatch?: number;
    missingDocuments?: number;
    ocrDiscrepancy?: number;
    [key: string]: any;
  };
  reasons?: string[];
}

interface DocumentExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DocumentExplainerData | null;
}

export default function DocumentExplainerModal({ isOpen, onClose, data }: DocumentExplainerModalProps) {
  const [explanation, setExplanation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && data) {
      fetchExplanation();
    } else {
      setExplanation(null);
      setError(null);
    }
  }, [isOpen, data]);

  const fetchExplanation = async () => {
    if (!data) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/document-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentData: {
            documentType: data.documentType || 'Intermediate Marksheet / Rank Card',
            fields: data.fields || {},
            ocrText: data.ocrText || '',
            confidence: data.confidence || 95,
            indicators: data.indicators || {},
            reasons: data.reasons || []
          }
        })
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to generate document explanation.');
      }

      setExplanation(responseData.explanation);
    } catch (err: any) {
      console.error('Document explainer error:', err);
      setError(err.message || 'Unable to connect to AI Document Explainer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !data) return null;

  const fields = data.fields || {};
  const confidence = data.confidence !== undefined ? data.confidence : 95;
  const docType = data.documentType || 'Intermediate Marksheet';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl shadow-2xl border border-border"
        >
          <Card className="border-none shadow-none bg-transparent">
            {/* Modal Header */}
            <CardHeader className="flex flex-row items-start justify-between pb-4 border-b">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1 text-xs">
                    <Sparkles className="h-3.5 w-3.5" /> AI Document Explainer
                  </Badge>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1 text-xs font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Extraction Status: Completed
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold tracking-tight text-foreground pt-1">
                  Document Analysis & AI Breakdown
                </CardTitle>
                <CardDescription className="text-sm">
                  {docType} • SmartAdmi OCR Extraction
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Structured OCR Results Card */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-primary" />
                    Structured OCR Extracted Details
                  </h4>
                  <span className="text-xs text-muted-foreground font-mono">
                    Confidence: <strong className="text-foreground">{confidence}%</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  {fields.studentName && (
                    <div className="p-2.5 rounded-lg bg-background border border-border/50">
                      <span className="text-[11px] text-muted-foreground block font-medium">Candidate Name</span>
                      <span className="font-semibold text-foreground truncate block">{fields.studentName}</span>
                    </div>
                  )}

                  {fields.math !== undefined && (
                    <div className="p-2.5 rounded-lg bg-background border border-border/50">
                      <span className="text-[11px] text-muted-foreground block font-medium">Mathematics</span>
                      <span className="font-bold text-foreground">{fields.math}</span>
                    </div>
                  )}

                  {fields.physics !== undefined && (
                    <div className="p-2.5 rounded-lg bg-background border border-border/50">
                      <span className="text-[11px] text-muted-foreground block font-medium">Physics</span>
                      <span className="font-bold text-foreground">{fields.physics}</span>
                    </div>
                  )}

                  {fields.chemistry !== undefined && (
                    <div className="p-2.5 rounded-lg bg-background border border-border/50">
                      <span className="text-[11px] text-muted-foreground block font-medium">Chemistry</span>
                      <span className="font-bold text-foreground">{fields.chemistry}</span>
                    </div>
                  )}

                  {fields.rank !== undefined && (
                    <div className="p-2.5 rounded-lg bg-background border border-border/50">
                      <span className="text-[11px] text-muted-foreground block font-medium">EAMCET State Rank</span>
                      <span className="font-bold text-primary">{fields.rank}</span>
                    </div>
                  )}

                  {fields.hallTicketNumber && (
                    <div className="p-2.5 rounded-lg bg-background border border-border/50">
                      <span className="text-[11px] text-muted-foreground block font-medium">Hall Ticket No.</span>
                      <span className="font-mono text-foreground">{fields.hallTicketNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Distinction Box: OCR Extraction vs Authenticity Verification */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block text-amber-950 dark:text-amber-100">
                    Important Distinction
                  </strong>
                  <span>
                    <strong>OCR Extraction</strong> means reading text characters from your document image. 
                    It does not automatically verify document authenticity. SmartAdmi compares extracted values with your form entries to flag any potential discrepancies.
                  </span>
                </div>
              </div>

              {/* AI Explanation Result Box */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Human-Readable Explanation
                  </h4>
                  {explanation && (
                    <Button variant="ghost" size="sm" onClick={fetchExplanation} className="h-7 text-xs gap-1">
                      <RefreshCw className="h-3 w-3" /> Re-explain
                    </Button>
                  )}
                </div>

                {isLoading && (
                  <div className="p-6 rounded-xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground font-medium">
                      Gemini is generating a clear explanation of your document...
                    </p>
                  </div>
                )}

                {error && (
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 space-y-3">
                    <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      Explanation Service Error
                    </div>
                    <p className="text-xs text-muted-foreground">{error}</p>
                    <Button size="sm" variant="outline" onClick={fetchExplanation} className="gap-1.5 text-xs">
                      <RefreshCw className="h-3.5 w-3.5" /> Retry Explanation
                    </Button>
                  </div>
                )}

                {explanation && !isLoading && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 space-y-3 animate-in fade-in">
                    {explanation.extractedHighlights?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {explanation.extractedHighlights.map((hl: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-background border">
                            {hl}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="text-sm text-foreground space-y-2 whitespace-pre-line leading-relaxed font-sans">
                      {explanation.simpleExplanation}
                    </div>

                    {explanation.extractionVsVerificationNote && (
                      <div className="pt-2 border-t border-border/40 text-xs text-muted-foreground italic">
                        💡 {explanation.extractionVsVerificationNote}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-end pt-4 border-t">
              <Button onClick={onClose} variant="default" className="px-6">
                Close Explanation
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
