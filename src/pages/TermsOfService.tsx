import React from 'react';
import { motion } from 'motion/react';
import { Scale, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-4 mb-8">
            <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          </div>

          <div className="bg-background p-8 rounded-2xl border shadow-sm space-y-6 text-muted-foreground leading-relaxed">
            <div className="flex items-center gap-2 text-foreground"><Scale className="h-5 w-5 text-primary" /><span className="font-bold">Effective Date: 14-09-2026</span></div>
            <p>These Terms govern your use of SmartAdmi and its admission-support services. By creating an account or submitting an application, you agree to them.</p>
            <section className="space-y-2"><h2 className="text-xl font-bold text-foreground">1. Accurate information</h2><p>You must provide complete and accurate personal, academic, and document information. Submitting altered, misleading, or another person's records may result in rejection or account suspension.</p></section>
            <section className="space-y-2"><h2 className="text-xl font-bold text-foreground">2. OCR and recommendations</h2><p>Rank-card OCR and college recommendations are assistance features. Please review extracted values before submission. Eligibility, cutoffs, seat availability, and final admission decisions are determined by the relevant institution and counselling authority.</p></section>
            <section className="space-y-2"><h2 className="text-xl font-bold text-foreground">3. Applying to a college</h2><p>Selecting a college in SmartAdmi records it as a preference in your application. It does not guarantee admission or replace any required official counselling, payment, or college application process.</p></section>
            <section className="space-y-2"><h2 className="text-xl font-bold text-foreground">4. Account security</h2><p>Keep your account credentials private and notify us promptly if you suspect unauthorised access. You are responsible for activity completed through your account.</p></section>
            <section className="space-y-2"><h2 className="text-xl font-bold text-foreground">5. Changes and contact</h2><p>We may update these Terms as the service evolves. For questions, contact <a href="mailto:skthousif474@gmail.com" className="text-primary hover:underline font-medium">skthousif474@gmail.com</a>.</p></section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
