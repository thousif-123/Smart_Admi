import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Copy, Check, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const contactEmail = "skthousif474@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setIsCopied(true);
    toast.success("Email address copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <footer className="border-t border-border/60 py-12 px-6 bg-card/60 relative z-10 backdrop-blur-md overflow-hidden">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-7 w-7 text-primary" />
          <span className="text-xl font-black text-foreground tracking-tight">SmartAdmi</span>
        </div>

        <p className="text-xs text-muted-foreground font-medium text-center md:text-left">
          © 2026 SmartAdmi Admission & Verification System. All rights reserved.
        </p>

        <div className="flex items-center gap-6 text-xs font-semibold text-muted-foreground flex-wrap justify-center">
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link to="/colleges" className="hover:text-foreground transition-colors">
            AP Colleges
          </Link>
          <button
            type="button"
            onClick={() => setIsContactOpen(true)}
            className="hover:text-primary transition-colors font-bold text-foreground flex items-center gap-1.5 cursor-pointer"
          >
            <Mail className="h-3.5 w-3.5 text-primary" />
            <span>Contact</span>
          </button>
        </div>
      </div>

      {/* Interactive Contact Modal / Dialog */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 relative">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Contact & Support</h3>
                  <p className="text-[11px] text-muted-foreground">SmartAdmi Helpdesk</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsContactOpen(false)}
                className="rounded-full h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg border border-border/60 text-center space-y-2">
              <p className="text-xs text-muted-foreground font-medium">
                For any queries, technical support, or admission feedback, please reach out to:
              </p>
              <div className="p-2.5 bg-card rounded-md border border-primary/20 flex items-center justify-between gap-2 shadow-xs">
                <span className="font-mono text-sm font-bold text-primary select-all">
                  {contactEmail}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyEmail}
                  className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{isCopied ? "Copied" : "Copy"}</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsContactOpen(false)}
                className="text-xs"
              >
                Close
              </Button>

              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
              >
                <Mail className="h-4 w-4" />
                <span>Send Email Now</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
