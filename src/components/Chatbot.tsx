import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { MessageSquare, X, Send, Bot, Loader2, Minimize2, Maximize2, Mic, MicOff, Sparkles, RefreshCw, ShieldCheck, Tag } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { auth } from '@/lib/firebase';

interface Message {
  role: 'user' | 'bot';
  content: string;
  contextUsed?: string[];
  isError?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "Why is my application pending?",
  "Show my document status",
  "Which documents are verified?",
  "Is any document missing?",
  "What should I do next?",
  "Which engineering branches suit my profile?"
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      content: "Hello! I am your **SmartAdmi AI Admission Copilot**.\n\nI have authorized access to your personal application data, document status, and verification checks. How can I assist your admission journey today?" 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev ? `${prev} ${transcript}` : transcript);
      };
      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      recognitionRef.current = rec;
    }
  }, []);

  const [aiStatus, setAiStatus] = useState<'checking' | 'available' | 'not_configured' | 'error'>('checking');
  const [aiStatusError, setAiStatusError] = useState<string | null>(null);

  useEffect(() => {
    const checkAiStatus = async () => {
      try {
        const res = await fetch('/api/ai-status');
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'available') {
            setAiStatus('available');
            setAiStatusError(null);
          } else if (data.status === 'not_configured') {
            setAiStatus('not_configured');
            setAiStatusError('GEMINI_API_KEY is not set. Offline fallback mode active.');
          } else {
            setAiStatus('error');
            setAiStatusError(data.error || 'Gemini AI service error.');
          }
        } else {
          setAiStatus('error');
          setAiStatusError(`AI check HTTP ${res.status}`);
        }
      } catch (err: any) {
        setAiStatus('error');
        setAiStatusError('Failed to reach AI status endpoint.');
      }
    };
    checkAiStatus();
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start speech recognition', err);
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const handleSend = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend || isLoading) return;

    if (!customMessage) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      const currentUser = auth.currentUser;
      if (currentUser) {
        if (typeof currentUser.getIdToken === 'function') {
          try {
            const idToken = await currentUser.getIdToken();
            headers['Authorization'] = `Bearer ${idToken}`;
          } catch (_) {
            headers['Authorization'] = `Bearer local:${currentUser.uid}`;
          }
        } else if (currentUser.uid) {
          headers['Authorization'] = `Bearer local:${currentUser.uid}`;
        }
        if (currentUser.uid) {
          headers['x-user-uid'] = currentUser.uid;
        }
      } else {
        // Check local storage session fallback
        const localSessionStr = localStorage.getItem('smartadmi_user_session');
        if (localSessionStr) {
          try {
            const parsed = JSON.parse(localSessionStr);
            if (parsed && parsed.uid) {
              headers['Authorization'] = `Bearer local:${parsed.uid}`;
              headers['x-user-uid'] = parsed.uid;
            }
          } catch (_) {}
        }
      }

      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: messageToSend })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || `Copilot Service Error (${response.status})`;
        setMessages(prev => [...prev, { 
          role: 'bot', 
          content: `⚠️ ${errorMsg}`, 
          isError: true 
        }]);
        return;
      }

      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: data.answer || "I'm sorry, I couldn't process your application query.",
        contextUsed: data.contextUsed || []
      }]);
    } catch (error: any) {
      console.error('Copilot query error:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: `⚠️ Network error: ${error?.message || 'Unable to communicate with SmartAdmi Copilot API.'}`,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLast = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.content);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Button
              size="icon"
              className="h-14 w-14 rounded-full shadow-2xl bg-primary text-primary-foreground hover:scale-105 transition-transform"
              onClick={() => setIsOpen(true)}
            >
              <Sparkles className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className={`w-[360px] sm:w-[420px] shadow-2xl ${isMinimized ? 'h-auto' : 'h-[550px]'}`}
          >
            <Card className="h-full flex flex-col border border-border overflow-hidden bg-card">
              {/* Header */}
              <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-primary-foreground/15 rounded-xl">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                      SmartAdmi AI Copilot
                    </CardTitle>
                    <div className="flex items-center gap-1 text-[10px] font-medium text-primary-foreground/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                      Context-Aware Admission Assistant
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              {!isMinimized && (
                <>
                  {/* Chat Content */}
                  <CardContent className="flex-1 p-4 overflow-hidden flex flex-col justify-between bg-muted/20">
                    <ScrollArea className="h-full pr-3" ref={scrollRef}>
                      <div className="space-y-4">
                        {messages.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                          >
                            <div
                              className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                                msg.role === 'user'
                                  ? 'bg-primary text-primary-foreground rounded-tr-none'
                                  : msg.isError
                                  ? 'bg-destructive/10 text-destructive border border-destructive/20 rounded-tl-none'
                                  : 'bg-card border border-border/80 text-foreground rounded-tl-none shadow-sm'
                              }`}
                            >
                              <div className="whitespace-pre-line font-sans">
                                {msg.content}
                              </div>

                              {/* Context Used Badges */}
                              {msg.contextUsed && msg.contextUsed.length > 0 && (
                                <div className="mt-2.5 pt-2 border-t border-border/40 flex flex-wrap gap-1 items-center">
                                  <span className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-0.5">
                                    <Tag className="h-2.5 w-2.5" /> Context:
                                  </span>
                                  {msg.contextUsed.map((ctx, idx) => (
                                    <Badge key={idx} variant="outline" className="text-[9px] py-0 px-1.5 h-4 bg-background/50">
                                      {ctx}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Error Retry Option */}
                            {msg.isError && i === messages.length - 1 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleRetryLast} 
                                className="mt-1 text-xs text-destructive hover:bg-destructive/10 gap-1 h-6"
                              >
                                <RefreshCw className="h-3 w-3" /> Retry query
                              </Button>
                            )}
                          </div>
                        ))}

                        {/* Loading Typing Indicator */}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-card border border-border p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              <span className="text-xs text-muted-foreground">Reading your application data...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    {/* Suggested Question Chips */}
                    {messages.length < 4 && !isLoading && (
                      <div className="pt-3 pb-1 border-t border-border/40">
                        <p className="text-[11px] font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-primary" /> Suggested Questions:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {SUGGESTED_QUESTIONS.slice(0, 4).map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(q)}
                              className="text-xs bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-border text-foreground px-2.5 py-1 rounded-full text-left transition-colors truncate max-w-full"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>

                  {/* Input Footer */}
                  <CardFooter className="p-3 border-t bg-background">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                      }}
                      className="flex w-full items-center gap-2"
                    >
                      <Input
                        placeholder={isListening ? "Listening..." : "Ask Copilot about your application..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 text-sm"
                        disabled={isLoading}
                      />
                      {isSpeechSupported && (
                        <Button
                          type="button"
                          size="icon"
                          variant={isListening ? "destructive" : "outline"}
                          onClick={toggleListening}
                          className={isListening ? "animate-pulse" : ""}
                        >
                          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                      )}
                      <Button size="icon" type="submit" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardFooter>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
