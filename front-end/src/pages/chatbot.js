import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, BookOpen, Star, CheckCircle, Award } from 'lucide-react';

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";
const API_KEY = "AIzaSyA6206mZepQktTDaSI_x6-Y1LNvy9cqKHs";

const generatePrompt = (userInput) => {
  return `You are an educational AI assistant. Please provide a clear, engaging, and structured response to the following question: ${userInput}

Please format your response using this structure:

🎯 TOPIC OVERVIEW
• Brief, engaging introduction
• Core definition/explanation

📚 KEY POINTS
• Break down main concepts
• Use bullet points
• Include relevant details

💡 EXAMPLES & APPLICATIONS
• Real-world examples
• Practical applications
• Relatable scenarios

✨ FUN FACTS
• Interesting tidbits
• Notable discoveries
• Surprising connections

🔍 REMEMBER
• Key takeaways
• Important tips
• Common misconceptions to avoid

Make sure to:
1. Use emojis for section headers
2. Keep explanations clear and engaging
3. Use bullet points for better readability
4. Include practical examples
5. Make it educational yet interesting

Response should be formatted in markdown for better readability.`;
};

const EducationalChatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const chatWithGemini = async (userInput) => {
    try {
      const payload = {
        contents: [{
          parts: [{ text: generatePrompt(userInput) }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || 'I apologize, but I could not generate a response. Please try again.';
    } catch (error) {
      console.error("Error:", error);
      return "I apologize, but I'm having trouble connecting. Please try again.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessage = { role: "user", content: userInput };
    setConversation(prev => [...prev, newMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await chatWithGemini(userInput);
      setConversation(prev => [...prev, { role: "bot", content: response }]);
    } catch (error) {
      console.error("Error:", error);
      setConversation(prev => [
        ...prev,
        { role: "bot", content: "I apologize, but I'm having trouble connecting. Please try again." }
      ]);
    }

    setIsLoading(false);
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
      return () => messagesContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Function to format message content with Markdown-style formatting
  const formatMessage = (content) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('🎯') || line.startsWith('📚') || line.startsWith('💡') || line.startsWith('✨') || line.startsWith('🔍')) {
        return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{line}</h3>;
      } else if (line.startsWith('•')) {
        return <li key={index} className="ml-4 my-1">{line.substring(1)}</li>;
      } else if (line.trim().length === 0) {
        return <br key={index} />;
      } else {
        return <p key={index} className="my-1">{line}</p>;
      }
    });
  };

  return (
    <div className="min-h-[600px] bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-center gap-3 mb-2">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-2xl font-bold">SmartEduBot</h1>
        </div>
        <p className="text-center text-blue-100">Your Interactive Learning Companion</p>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100%-8rem)]">
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 backdrop-blur-lg"
          style={{
            backgroundImage: 'linear-gradient(rgba(30, 41, 59, 0.7), rgba(30, 41, 59, 0.7))'
          }}
        >
          {/* Welcome Message */}
          {conversation.length === 0 && (
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md">
              <div className="flex justify-center mb-4">
                <Star className="w-12 h-12 text-yellow-400" />
              </div>
              <h2 className="text-xl font-bold text-center text-white mb-4">
                Welcome to Your Learning Journey! ✨
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-blue-600/20 backdrop-blur-sm">
                  <BookOpen className="w-6 h-6 text-blue-400 mb-2" />
                  <h3 className="font-semibold text-white">Subject Help</h3>
                  <p className="text-blue-100 text-sm">Get clear explanations</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-600/20 backdrop-blur-sm">
                  <CheckCircle className="w-6 h-6 text-purple-400 mb-2" />
                  <h3 className="font-semibold text-white">Exam Prep</h3>
                  <p className="text-purple-100 text-sm">Strategic guidance</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-600/20 backdrop-blur-sm">
                  <Award className="w-6 h-6 text-blue-400 mb-2" />
                  <h3 className="font-semibold text-white">Study Tips</h3>
                  <p className="text-blue-100 text-sm">Learn effectively</p>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div className={`
                flex items-start gap-3 max-w-[80%] rounded-xl p-4
                ${message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/10 backdrop-blur-sm text-white'}
              `}>
                <div className={`
                  p-2 rounded-full flex-shrink-0
                  ${message.role === 'user' ? 'bg-blue-700' : 'bg-purple-700'}
                `}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div className="whitespace-pre-wrap">
                  {message.role === 'bot' ? formatMessage(message.content) : message.content}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <form 
          onSubmit={handleSubmit} 
          className="p-4 bg-white/5 backdrop-blur-md border-t border-white/10"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask any question about your studies..."
              className="flex-1 bg-white/10 text-white placeholder-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>

      {/* Scroll Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          ↓
        </button>
      )}
    </div>
  );
};

export default EducationalChatbot;