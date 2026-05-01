import { useState, useRef, useEffect } from 'react';
import { Paperclip, Sparkles, Mic, Send, Zap, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
};

const AISupport = () => {
  const navigate = useNavigate();
  
  // Initial message for new chats
  const defaultMessage: Message = {
    id: '1',
    sender: 'ai',
    text: "Hello! I'm AsthmaGuard AI, your personal Asthma Support Doctor. I'm here 24/7 to help you manage your asthma. How are you feeling today? If you're in distress, tap \"EMERGENCY MODE\" above.",
    time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase()
  };

  // Load from localStorage or use default
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('asthma_guard_chat');
    return saved ? JSON.parse(saved) : [defaultMessage];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Speech Recognition setup
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Your browser doesn't support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript); // Automatically send transcribed text
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setError(`Voice error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Save to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('asthma_guard_chat', JSON.stringify(messages));
    scrollToBottom();
  }, [messages, isTyping]);

  const clearChat = () => {
    if (window.confirm('Are you sure you want to start a new session? This will clear your current chat history.')) {
      setMessages([defaultMessage]);
      localStorage.removeItem('asthma_guard_chat');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getBotResponse = async (userText: string) => {
    try {
      setError('');
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            sender: msg.sender,
            text: msg.text
          })).concat([
            {
              sender: 'user',
              text: userText
            }
          ])
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to get response from AI doctor';
        try {
          const errorData = await response.json();
          if (errorData.message) errorMessage = errorData.message;
        } catch (e) {
          // If the server isn't running, it might return a 504 HTML page instead of JSON
          errorMessage = `Server error (${response.status}). Please make sure the backend server is running.`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection error. Please try again.';
      setError(errorMessage);
      throw err;
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await getBotResponse(text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponse,
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I apologize, but I'm having trouble connecting. Please check your connection and try again.",
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEmergency = async () => {
    setIsTriggering(true);
    try {
      let location = "Unknown Location";
      try {
        if ("geolocation" in navigator) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          // Note: In production you might use a reverse geocoding API to get a real address
          location = `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`;
        }
      } catch (e) {
        console.log("Geolocation error:", e);
      }

      const res = await fetch('/api/v1/emergency/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure auth if required
        },
        body: JSON.stringify({ location })
      });
      
      if (!res.ok) throw new Error('Failed to trigger emergency');
      
      // Redirect to the Asthma Attack Guide immediately
      navigate('/asthma-attack');
    } catch (err) {
      setError('Failed to trigger emergency mode. Please call emergency services immediately.');
      setIsTriggering(false);
    }
  };

  const commonQuestions = [
    "I'm having trouble breathing",
    "How do I use my inhaler?",
    "What are common asthma triggers?",
    "When should I seek emergency help?"
  ];

  return (
    <div className="absolute inset-0 md:bottom-0 bottom-[75px] bg-[#F4F5F9] flex flex-col font-sans overflow-hidden z-40">
      {/* Top Bar: Online Status & Compact Emergency Button */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0 bg-[#F4F5F9] z-10">
         <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#DDF2E4] px-3 py-1.5 rounded-full shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></div>
              <span className="text-[11px] font-bold text-[#113C33] tracking-wide">AI Online</span>
            </div>
            <button 
              onClick={clearChat}
              className="text-[11px] font-bold text-slate-400 hover:text-[#0A5D64] transition-colors uppercase tracking-widest px-2 py-1"
            >
              New Session
            </button>
         </div>
         <button 
           onClick={handleEmergency}
           disabled={isTriggering}
           className="bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] transition-colors rounded-full px-4 py-1.5 flex items-center justify-center gap-1.5 shadow-sm border border-[#FCA5A5]/30 disabled:opacity-50"
         >
           {isTriggering ? (
             <div className="w-3.5 h-3.5 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin"></div>
           ) : (
             <Zap className="w-3.5 h-3.5 fill-current" />
           )}
           <span className="font-bold tracking-wider text-[11px]">{isTriggering ? 'TRIGGERING...' : 'EMERGENCY'}</span>
         </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 py-2 bg-[#FEE2E2] border-b border-[#FECACA] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
          <span className="text-sm text-[#DC2626]">{error}</span>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-40 pt-4 space-y-6 scrollbar-none">
         {messages.map((msg, index) => {
            const isFirstAiInSequence = msg.sender === 'ai' && (index === 0 || messages[index - 1].sender !== 'ai');
            
            return (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.sender === 'ai' && isFirstAiInSequence && (
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0A5D64] to-[#14A0B0] flex items-center justify-center relative overflow-hidden shrink-0 shadow-sm">
                       <div className="w-1 h-1 bg-white rounded-full absolute left-1.5 top-2.5"></div>
                       <div className="w-1 h-1 bg-white rounded-full absolute right-1.5 top-2.5"></div>
                     </div>
                     <span className="text-xs text-gray-400">{msg.time}</span>
                     <span className="text-xs font-semibold text-gray-700">AsthmaGuard AI</span>
                   </div>
                )}
                
                {msg.sender === 'user' ? (
                  <div className="bg-white text-gray-800 px-6 py-4 rounded-3xl rounded-tr-sm shadow-sm max-w-[85%] text-[15px] leading-relaxed">
                    {msg.text}
                  </div>
                ) : (
                  <div className="pl-8 max-w-[90%]">
                     <div className="text-gray-700 text-[15px] leading-relaxed mb-2">
                       {msg.text}
                     </div>
                  </div>
                )}
              </div>
            );
         })}
         
         {isTyping && (
            <div className="flex flex-col items-start">
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0A5D64] to-[#14A0B0] flex items-center justify-center relative overflow-hidden shrink-0 shadow-sm">
                   <div className="w-1 h-1 bg-white rounded-full absolute left-1.5 top-2.5"></div>
                   <div className="w-1 h-1 bg-white rounded-full absolute right-1.5 top-2.5"></div>
                 </div>
                 <span className="text-xs font-semibold text-gray-700">AsthmaGuard AI</span>
               </div>
               <div className="pl-8 text-gray-400 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
            </div>
         )}
         <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area with Quick Options */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-3">
         {/* Quick Options */}
         <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none w-full">
            {commonQuestions.map((q, i) => (
              <button 
                key={i}
                onClick={() => handleSend(q)}
                className="shrink-0 bg-white/80 backdrop-blur-md hover:bg-white transition-colors border border-gray-200 text-[#0A5D64] rounded-full px-4 py-2 text-[13px] font-medium shadow-sm"
              >
                {q}
              </button>
            ))}
         </div>

         {/* Input Box */}
         <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="bg-white rounded-full p-2 flex items-center shadow-lg border border-gray-100">
            <button type="button" className="p-3 text-gray-400 hover:text-gray-600 transition-colors shrink-0">
               <Paperclip className="w-5 h-5" />
            </button>
            
            <input 
               type="text" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Ask about asthma management..." 
               className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 placeholder:text-gray-400 px-2 text-[15px] min-w-0"
            />
            
            {!input.trim() && (
              <div className="flex items-center gap-1.5 px-3 text-[#6A5AE0] shrink-0">
                 <Sparkles className="w-4 h-4 fill-current" />
                 <span className="font-bold text-sm">24</span>
              </div>
            )}

            <button 
               type={input.trim() ? "submit" : "button"}
               onClick={!input.trim() ? startListening : undefined}
               className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-all shrink-0 ml-1 ${
                 input.trim() 
                   ? 'bg-[#0A5D64] hover:bg-[#084b51]' 
                   : isListening 
                     ? 'bg-red-500 animate-pulse scale-110' 
                     : 'bg-[#6A5AE0] hover:bg-[#5C4EE0]'
               }`}
            >
               {input.trim() ? <Send className="w-5 h-5 ml-0.5" /> : <Mic className="w-5 h-5" />}
            </button>
         </form>
      </div>
    </div>
  );
};

export default AISupport;
