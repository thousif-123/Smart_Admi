import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { MessageSquare, X, Send, Bot, Loader2, Minimize2, Maximize2, Mic, MicOff } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { auth } from '@/lib/firebase';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hi! I'm your AI Admission Assistant. How can I help you today?" }
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

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => {
          const newText = prev ? `${prev} ${transcript}` : transcript;
          return newText;
        });
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
            setAiStatusError('GEMINI_API_KEY environment variable is missing on the server.');
          } else {
            setAiStatus('error');
            setAiStatusError(data.error || 'Gemini AI service error.');
          }
        } else {
          setAiStatus('error');
          setAiStatusError(`AI health check returned HTTP ${res.status}`);
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
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: userMessage,
          history: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.message || `AI Service Error (${response.status})`;
        setMessages(prev => [...prev, { role: 'bot', content: `⚠️ ${errorMsg}` }]);
        return;
      }

      const aiResponse = data.text;
      
      setMessages(prev => [...prev, { role: 'bot', content: aiResponse || "I'm sorry, I couldn't process that request." }]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'bot', content: `⚠️ Network connection error: ${error?.message || 'Unable to communicate with AI server.'}` }]);
    } finally {
      setIsLoading(false);
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
              className="h-14 w-14 rounded-full shadow-2xl"
              onClick={() => setIsOpen(true)}
            >
              <MessageSquare className="h-6 w-6" />
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
            className={`w-[350px] sm:w-[400px] shadow-2xl ${isMinimized ? 'h-auto' : 'h-[500px]'}`}
          >
            <Card className="h-full flex flex-col border-none overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  <div>
                    <CardTitle className="text-sm font-bold">Admission Assistant</CardTitle>
                    {aiStatus === 'available' && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-primary-foreground/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        Live AI
                      </span>
                    )}
                    {aiStatus === 'not_configured' && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-amber-200" title={aiStatusError || undefined}>
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        AI Config Required
                      </span>
                    )}
                    {aiStatus === 'error' && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-rose-200" title={aiStatusError || undefined}>
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                        AI Unavailable
                      </span>
                    )}
                    {aiStatus === 'checking' && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-primary-foreground/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/50 animate-pulse" />
                        Checking AI...
                      </span>
                    )}
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
                  <CardContent className="flex-1 p-4 overflow-hidden">
                    <ScrollArea className="h-full pr-4" ref={scrollRef}>
                      <div className="space-y-4">
                        {messages.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                msg.role === 'user'
                                  ? 'bg-primary text-primary-foreground rounded-tr-none'
                                  : 'bg-muted text-muted-foreground rounded-tl-none'
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-muted p-3 rounded-2xl rounded-tl-none">
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="p-4 border-t bg-background">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                      }}
                      className="flex w-full items-center gap-2"
                    >
                      <Input
                        placeholder={isListening ? "Listening..." : "Type your message..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1"
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
