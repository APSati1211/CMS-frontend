import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, MessageSquare, Loader, RefreshCw } from 'lucide-react';
import { chatFlowHandler } from '../api'; 
import useThemeSettings from '../hooks/useThemeSettings'; 

const Chatbot = () => {
    const { settings } = useThemeSettings(); 
    const welcomeMessage = settings?.chatbot_welcome_message || "Hello! I'm XpertAI. Let's get you started.";

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Tracks which field we are currently asking about (e.g., 'name', 'email')
    const [currentField, setCurrentField] = useState(null); 
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 1. Start Conversation
    const startFlow = async (isRestart = false) => {
        setIsLoading(true);
        try {
            // First call with no data triggers the first question
            const response = await chatFlowHandler({
                current_field: null, 
                answer: null
            });
            const data = response.data;

            const initialMessages = [
                { sender: 'bot', text: isRestart ? "Let's start over." : welcomeMessage },
                { sender: 'bot', text: data.next_question }
            ];

            setMessages(initialMessages);
            setCurrentField(data.next_field); // e.g., 'name'
        } catch (error) {
            console.error("Chatbot Error:", error);
            setMessages([{ sender: 'bot', text: 'Connection failed. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Handle User Response
    const handleSend = async () => {
        const answer = inputValue.trim();
        if (!answer || isLoading) return;

        // Display User Message
        setMessages(prev => [...prev, { sender: 'user', text: answer }]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Send answer to backend with the field identifier
            const response = await chatFlowHandler({
                current_field: currentField, // Important: What are we answering?
                answer: answer
            });
            const data = response.data;
            
            if (data.error) {
                // Validation Error
                setMessages(prev => [...prev, { sender: 'bot', text: data.error, isError: true }]);
            } else {
                // Success: Show next question
                setMessages(prev => [...prev, { sender: 'bot', text: data.next_question }]);
                
                // Update tracker to the next field (e.g., 'email')
                if (data.next_field) {
                    setCurrentField(data.next_field); 
                } else {
                    setCurrentField(null); // Flow Complete
                }
            }

        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: 'Error sending message.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            startFlow();
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <>
            <button
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition z-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <MessageSquare size={24} />
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 h-96 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden font-sans">
                    
                    {/* Header */}
                    <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <h3 className="font-semibold">XpertAI Assistant</h3>
                        </div>
                        <div className="flex gap-3">
                             <button onClick={() => startFlow(true)} title="Restart"><RefreshCw size={16}/></button>
                             <button onClick={() => setIsOpen(false)} title="Close">&times;</button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                    msg.sender === 'user' 
                                    ? 'bg-blue-600 text-white rounded-br-none' 
                                    : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-200 p-2 rounded-full animate-pulse">
                                    <Loader size={16} className="animate-spin text-gray-600" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            className="flex-1 p-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700"
                            placeholder={currentField ? "Type your answer..." : "Chat ended."}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={!currentField || isLoading}
                        />
                        <button
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            onClick={handleSend}
                            disabled={!inputValue.trim() || !currentField || isLoading}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;