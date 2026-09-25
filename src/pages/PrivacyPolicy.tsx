import React from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          </div>

          <div className="bg-background p-8 rounded-2xl border shadow-sm space-y-6 text-muted-foreground leading-relaxed">
            <div className="flex items-center gap-2 text-foreground">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-bold">Effective Date: 08-04-2026</span>
            </div>

            <p>
              Welcome to <span className="font-semibold text-foreground italic">SmartAdmi</span>. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.
            </p>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">1. Information We Collect</h2>
              <p>We may collect the following data:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Personal details (Name, Email, Phone Number, Address)</li>
                <li>Academic information (Marks, qualifications)</li>
                <li>Uploaded documents (Certificates, ID proofs)</li>
                <li>Login credentials</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">2. How We Use Your Information</h2>
              <p>We use your data to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Process admission applications</li>
                <li>Verify documents using OCR technology</li>
                <li>Detect fraudulent or incorrect information</li>
                <li>Provide AI-based recommendations and decisions</li>
                <li>Improve our system and user experience</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">3. Data Security</h2>
              <p>
                We take appropriate measures to protect your data from unauthorized access, misuse, or loss.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">4. Sharing of Information</h2>
              <p>We do not sell or share your personal data with third parties, except:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>When required by law</li>
                <li>For academic or institutional verification purposes</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">5. User Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access your data</li>
                <li>Request correction of incorrect information</li>
                <li>Request deletion of your data</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">6. Cookies</h2>
              <p>
                Our system may use cookies to improve user experience and session management.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">7. Changes to Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Updates will be reflected on this page.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">8. Contact Us</h2>
              <p>
                If you have any questions, contact us at:<br />
                <a href="mailto:skthousif474@gmail.com" className="text-primary hover:underline font-medium">
                  skthousif474@gmail.com
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
