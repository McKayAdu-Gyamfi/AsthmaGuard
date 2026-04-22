import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Paperclip, Sparkles, Mic, Send, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
};

const AISupport = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm AsthmaGuard AI. I'm here 24/7 to support you. How are you feeling today? If you're in distress, tap \"EMERGENCY MODE\" above.",
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getBotResponse = (userText: string) => {
    const text = userText.toLowerCase();
    if (text.includes('trouble breathing') || text.includes('attack')) {
      return "Please try to remain calm and sit upright. Take 1 puff of your reliever inhaler (like Albuterol) every 30 to 60 seconds, up to 10 puffs. If symptoms do not improve, tap EMERGENCY MODE immediately.";
    }
    if (text.includes('inhaler')) {
      return "To use your inhaler: 1. Shake it vigorously. 2. Breathe out fully away from the device. 3. Seal your lips around the mouthpiece. 4. Press the canister while breathing in slowly. 5. Hold your breath for 10 seconds.";
    }
    if (text.includes('aqi') || text.includes('air quality')) {
      return "Your local AQI is currently 42, which is Excellent. It is safe for you to carry out outdoor activities today!";
    }
    if (text.includes('hello') || text.includes('hi')) {
      return "Hi there! How can I assist you with your asthma management today?";
    }
    return "I am a basic support module. For specific medical advice, please consult your doctor. But don't forget to track your symptoms in the Dashboard periodically.";
  };

  const handleSend = (text: string) => {
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

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: getBotResponse(text),
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const commonQuestions = [
    "I'm having trouble breathing",
    "What should I do during an attack?",
    "How do I use my inhaler?",
    "Is my AQI level dangerous?"
  ];

  return (
    <div className="h-[100dvh] w-full bg-[#F4F5F9] flex flex-col font-sans relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4 shrink-0 bg-[#F4F5F9] z-10">
         <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-800 hover:bg-gray-50 transition-colors">
           <ArrowLeft className="w-5 h-5" />
         </button>
         <div className="flex flex-col items-center">
           <h1 className="text-xl font-medium tracking-wide text-gray-800">AI Support</h1>
           <span className="text-[10px] text-gray-400 font-medium">AsthmaGuard AI</span>
         </div>
         <div className="flex items-center gap-1.5 bg-[#DDF2E4] px-3 py-1.5 rounded-full shadow-sm">
           <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
           <span className="text-[11px] font-bold text-[#113C33] tracking-wide">Online</span>
         </div>
      </div>

      {/* Emergency Button - fixed under header */}
      <div className="px-6 pb-2 pt-2 bg-[#F4F5F9] shrink-0 z-10">
        <button className="w-full bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] transition-colors rounded-2xl py-3 flex items-center justify-center gap-2 shadow-sm border border-[#FCA5A5]/30">
           <Zap className="w-4 h-4 fill-current" />
           <span className="font-bold tracking-wider text-[13px]">EMERGENCY MODE</span>
           <Zap className="w-4 h-4 fill-current" />
        </button>
      </div>

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
      <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-3">
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
               className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-colors shrink-0 ml-1 ${input.trim() ? 'bg-[#0A5D64] hover:bg-[#084b51]' : 'bg-[#6A5AE0] hover:bg-[#5C4EE0]'}`}
            >
               {input.trim() ? <Send className="w-5 h-5 ml-0.5" /> : <Mic className="w-5 h-5" />}
            </button>
         </form>
      </div>
    </div>
  );
};

export default AISupport;
