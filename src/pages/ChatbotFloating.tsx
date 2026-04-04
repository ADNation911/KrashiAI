import React, { useEffect, useRef, useState } from "react";
// Import Icons
import {
    MdSupportAgent,
    MdClose,
    MdSend
} from "react-icons/md";

// --- IMPORT CONTEXT ---
import { useLanguage } from "../context/LanguageContext";
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- THEME ---
const colors = {
    primary: '#2E7D32', // Farming Green
    primaryLight: '#4CAF50',
    primaryDark: '#1B5E20',
    background: '#F0F2F5', // Light gray web background
    surface: '#FFFFFF',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',
    white: '#FFFFFF',
    border: '#E5E7EB',
    success: '#10B981',
    botBubbleBg: '#FFFFFF',
    userBubbleBg: '#2E7D32', // Primary
};

// --- TRANSLATIONS ---
const translations = {
    en: {
        chatbotTitle: "Farm Assistant",
        chatbotSubtitle: "Ask me anything about farming",
        messagePlaceholder: "Type your farming question...",
        sendMessage: "Send",
        welcomeMessage: "Hi! I'm your farming assistant. How can I help you today?",
        sampleQuestions: [
            "What crops should I plant?",
            "How to prevent plant diseases?",
            "Best time for planting wheat?",
            "Soil testing methods?",
        ],
    },
    hi: {
        chatbotTitle: "कृषि सहायक",
        chatbotSubtitle: "खेती के बारे में कुछ भी पूछें",
        messagePlaceholder: "अपना कृषि प्रश्न लिखें...",
        sendMessage: "भेजें",
        welcomeMessage:
            "नमस्ते! मैं आपका कृषि सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
        sampleQuestions: [
            "मुझे कौन सी फसल लगानी चाहिए?",
            "पौधों की बीमारियों को कैसे रोकें?",
            "गेहूं बोने का सबसे अच्छा समय?",
            "मिट्टी परीक्षण के तरीके?",
        ],
    },
    te: {
        chatbotTitle: "వ్యవసాయ సహాయకుడు",
        chatbotSubtitle: "వ్యవసాయం గురించి ఏదైనా అడగండి",
        messagePlaceholder: "మీ వ్యవసాయ ప్రశ్నను టైప్ చేయండి...",
        sendMessage: "పంపు",
        welcomeMessage: "నమస్తే! నేను మీ వ్యవసాయ సహాయకుడిని. ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?",
        sampleQuestions: [
            "నేను ఏ పంటలు వేయాలి?",
            "మొక్కల వ్యాధులను ఎలా నివారించాలి?",
            "గోధుమలు నాటడానికి ఉత్తమ సమయం?",
            "నేల పరీక్ష పద్ధతులు?",
        ],
    },
};

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

// --- MAIN COMPONENT ---
const ChatbotScreen = () => {
    const { language } = useLanguage();
    const t = (translations as any)[language] || translations.en;

    // Web: We use a div ref to scroll to bottom
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: t.welcomeMessage,
            sender: "bot",
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (textToSend?: string) => {
        const messageText = textToSend ?? inputText;
        if (!messageText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            sender: "user",
            timestamp: new Date(),
        };

        // If no message history exists except welcome, we don't necessarily need to pass the welcome msg
        const historyToPass = messages
            .filter(msg => msg.id !== "1") // Skip the hardcoded welcome message from history
            .map(msg => ({
                role: msg.sender === "user" ? "user" : "model",
                parts: [{ text: msg.text }],
            }));

        setMessages((prev) => [...prev, userMessage]);
        setInputText("");
        setIsTyping(true);

        try {
            const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;

            if (!apiKey || apiKey === "your_gemini_api_key_here") {
                throw new Error("API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.");
            }

            const genAI = new GoogleGenerativeAI(apiKey);

            // For a chat bot, gemini-2.0-flash is faster and recommended
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
                systemInstruction: "You are Krishimitra, a helpful, knowledgeable AI farming assistant for Indian farmers. Provide practical, accurate, and concise advice related to agriculture, farming techniques, crops, fertilizers, pest control, weather impact, and soil management. If a question is completely unrelated to farming or agriculture, politely decline to answer. You can reply in English, Hindi, or Telugu based on how the user asks."
            });

            const chat = model.startChat({
                history: historyToPass,
            });

            const result = await chat.sendMessage(messageText);
            const response = await result.response;
            const textResult = response.text();

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: textResult,
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error: any) {
            console.error("Gemini API Error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: `Error: ${error?.message || "I am currently facing technical difficulties connecting to the AI service. Please check your API key configuration."}`,
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSampleQuestion = (question: string) => {
        handleSendMessage(question);
    };

    const handleClose = () => {
        // Web navigation logic (e.g., using React Router) or just alert
        console.log("Navigate Back");
    };

    // Handle "Enter" key in text area
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // --- SUB-COMPONENTS ---

    const MessageBubble = ({ message }: { message: Message }) => {
        const isUser = message.sender === "user";
        return (
            <div style={{
                ...styles.messageContainer,
                justifyContent: isUser ? 'flex-end' : 'flex-start'
            }}>
                {!isUser && (
                    <div style={styles.botAvatar}>
                        <MdSupportAgent size={20} color={colors.white} />
                    </div>
                )}
                <div style={{
                    ...styles.messageBubble,
                    ...(isUser ? styles.userBubble : styles.botBubble),
                }}>
                    <p style={{
                        ...styles.messageText,
                        color: isUser ? colors.white : colors.textPrimary
                    }}>
                        {message.text}
                    </p>
                    <span style={{
                        ...styles.messageTime,
                        color: isUser ? 'rgba(255,255,255,0.7)' : colors.textSecondary
                    }}>
                        {message.timestamp.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
            </div>
        );
    };

    const TypingIndicator = () => (
        <div style={{ ...styles.messageContainer, justifyContent: 'flex-start' }}>
            <div style={styles.botAvatar}>
                <MdSupportAgent size={20} color={colors.white} />
            </div>
            <div style={{ ...styles.messageBubble, ...styles.botBubble }}>
                <div style={styles.typingContainer}>
                    <div style={styles.typingDot} className="typing-dot"></div>
                    <div style={{ ...styles.typingDot, animationDelay: '0.2s' }} className="typing-dot"></div>
                    <div style={{ ...styles.typingDot, animationDelay: '0.4s' }} className="typing-dot"></div>
                </div>
            </div>
            {/* CSS Animation for dots */}
            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .typing-dot {
                    animation: bounce 1s infinite;
                }
            `}</style>
        </div>
    );

    return (
        <div style={styles.fullScreenContainer}>
            {/* --- Main Chat Layout (Centered on wide screens) --- */}
            <div style={styles.chatWindow}>

                {/* --- Header --- */}
                <div style={styles.header}>
                    <div style={styles.headerContent}>
                        <div style={styles.headerLeft}>
                            <div style={styles.botAvatarLarge}>
                                <MdSupportAgent size={32} color={colors.white} />
                            </div>
                            <div>
                                <h1 style={styles.headerTitle}>{t.chatbotTitle}</h1>
                                <span style={styles.headerSubtitle}>{t.chatbotSubtitle}</span>
                            </div>
                        </div>
                        <button onClick={handleClose} style={styles.closeButton}>
                            <MdClose size={24} color={colors.white} />
                        </button>
                    </div>
                </div>

                {/* --- Messages Area --- */}
                <div style={styles.messagesArea}>
                    {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))}
                    {isTyping && <TypingIndicator />}

                    {/* Dummy div to scroll to */}
                    <div ref={messagesEndRef} />

                    {/* Sample Questions (Only show if it's the start of convo) */}
                    {messages.length === 1 && !isTyping && (
                        <div style={styles.sampleQuestionsContainer}>
                            <p style={styles.sampleQuestionsTitle}>Suggested questions:</p>
                            <div style={styles.sampleQuestionsGrid}>
                                {t.sampleQuestions.map((question: string, index: number) => (
                                    <button
                                        key={index}
                                        style={styles.sampleQuestionButton}
                                        onClick={() => handleSampleQuestion(question)}
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- Input Area --- */}
                <div style={styles.inputContainer}>
                    <div style={styles.inputWrapper}>
                        <textarea
                            style={styles.textInput}
                            placeholder={t.messagePlaceholder}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                        />
                        <button
                            style={{
                                ...styles.sendButton,
                                opacity: inputText.trim() ? 1 : 0.6,
                                cursor: inputText.trim() ? 'pointer' : 'default'
                            }}
                            onClick={() => handleSendMessage()}
                            disabled={!inputText.trim()}
                        >
                            <MdSend size={20} color={colors.white} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ChatbotScreen;

// --- STYLES (CSS-in-JS) ---
const styles: { [key: string]: React.CSSProperties } = {
    fullScreenContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        height: '100vh',
        width: '100vw',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },
    // The main card acting as the chat window
    chatWindow: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        maxWidth: '1200px', // Constrain width for 16:9 desktop feel
        backgroundColor: colors.background, // Or white if you prefer a card look
        position: 'relative',
        boxShadow: '0 0 20px rgba(0,0,0,0.05)', // Subtle shadow
    },
    header: {
        padding: '16px 24px',
        background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryLight})`,
        color: colors.white,
        flexShrink: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 10,
    },
    headerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    botAvatarLarge: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        margin: 0,
    },
    headerSubtitle: {
        fontSize: '14px',
        opacity: 0.9,
        display: 'block',
    },
    closeButton: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s',
    },
    // Scrollable Message Area
    messagesArea: {
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        // Styling scrollbar for cleaner web look
        scrollbarWidth: 'thin',
        scrollbarColor: `${colors.border} transparent`,
    },
    messageContainer: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
        width: '100%',
    },
    botAvatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: colors.primary,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    messageBubble: {
        maxWidth: '60%', // Don't let bubbles stretch too wide on desktop
        padding: '12px 16px',
        borderRadius: '18px',
        position: 'relative',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        lineHeight: '1.5',
    },
    userBubble: {
        backgroundColor: colors.userBubbleBg,
        borderBottomRightRadius: '4px',
    },
    botBubble: {
        backgroundColor: colors.botBubbleBg,
        borderBottomLeftRadius: '4px',
    },
    messageText: {
        margin: 0,
        fontSize: '16px',
        wordWrap: 'break-word',
    },
    messageTime: {
        fontSize: '11px',
        marginTop: '4px',
        display: 'block',
        textAlign: 'right',
    },
    typingContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 0',
    },
    typingDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: colors.textSecondary,
    },

    // Sample Questions
    sampleQuestionsContainer: {
        marginTop: 'auto', // Pushes to bottom if space available
        marginBottom: '10px',
        textAlign: 'center',
    },
    sampleQuestionsTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: '16px',
    },
    sampleQuestionsGrid: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '10px',
    },
    sampleQuestionButton: {
        backgroundColor: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: '20px',
        padding: '10px 20px',
        fontSize: '14px',
        color: colors.primary,
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },

    // Input Area
    inputContainer: {
        backgroundColor: colors.white,
        borderTop: `1px solid ${colors.border}`,
        padding: '20px 24px',
        flexShrink: 0,
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: '24px',
        padding: '8px 16px',
        border: `1px solid ${colors.border}`,
        maxWidth: '1000px',
        margin: '0 auto', // Center input on wide screens
    },
    textInput: {
        flex: 1,
        border: 'none',
        background: 'transparent',
        fontSize: '16px',
        color: colors.textPrimary,
        outline: 'none',
        resize: 'none',
        padding: '10px',
        fontFamily: 'inherit',
    },
    sendButton: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.success})`,
        border: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '12px',
        transition: 'opacity 0.2s',
        flexShrink: 0,
    },
};