import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const SupportWidget = () => {
    const { user, token } = useAuth();
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'contact'
    
    // Chat state
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Contact form state
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [contactType, setContactType] = useState('EXECUTIVE_CALLBACK');
    const [formLoading, setFormLoading] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formError, setFormError] = useState(null);

    // Support requests status state
    const [supportRequests, setSupportRequests] = useState([]);
    const [requestsLoading, setRequestsLoading] = useState(false);
    const [requestsError, setRequestsError] = useState(null);

    const chatEndRef = useRef(null);

    // Initialize or translate welcome message dynamically on language toggle
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: 1,
                    text: t('support.welcome'),
                    isBot: true,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } else {
            setMessages(prev => prev.map((msg, idx) => 
                idx === 0 && msg.isBot ? { ...msg, text: t('support.welcome') } : msg
            ));
        }
    }, [language]);

    const fetchSupportRequests = async () => {
        if (!token) return;
        setRequestsLoading(true);
        setRequestsError(null);
        try {
            const response = await fetch('/api/support/requests', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            let data = [];
            const text = await response.text();
            if (text) {
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    // Ignore parsing error
                }
            }

            if (!response.ok) {
                throw new Error((data && data.message) || 'Failed to fetch support requests.');
            }
            
            setSupportRequests(Array.isArray(data) ? data : []);
        } catch (err) {
            setRequestsError(err.message || 'Something went wrong.');
        } finally {
            setRequestsLoading(false);
        }
    };

    // Pre-fill user data when user changes
    useEffect(() => {
        if (user) {
            setContactName(user.username || '');
            setContactEmail(user.email || '');
            fetchSupportRequests();
        } else {
            setContactName('');
            setContactEmail('');
            setSupportRequests([]);
        }
    }, [user, token]);

    // Fetch requests when widget opens
    useEffect(() => {
        if (isOpen && token) {
            fetchSupportRequests();
        }
    }, [isOpen, token]);

    // Scroll to bottom of chat
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, isOpen]);

    const handleSendMessage = async (textToSend, apiTextToSend) => {
        const text = textToSend || inputText;
        const apiText = apiTextToSend || text;
        if (!text.trim()) return;

        const userMsg = {
            id: Date.now(),
            text: text,
            isBot: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        if (!textToSend) setInputText('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/support/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ message: apiText, language: language })
            });

            const data = await response.json();
            
            setTimeout(() => {
                const botMsg = {
                    id: Date.now() + 1,
                    text: data.reply || "Sorry, I encountered an error. How can I help you?",
                    isBot: true,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, botMsg]);
                setIsTyping(false);
            }, 600); // Small delay to feel natural
            
        } catch (err) {
            console.error('Error fetching chatbot reply:', err);
            setTimeout(() => {
                const errorMsg = {
                    id: Date.now() + 1,
                    text: "I am having trouble connecting to the server. Please check your network connection or switch to the Contact tab to reach out directly.",
                    isBot: true,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, errorMsg]);
                setIsTyping(false);
            }, 600);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!contactName.trim() || !contactEmail.trim()) {
            setFormError(t('support.errorRequired') || 'Name and Email are required.');
            return;
        }

        setFormLoading(true);
        setFormError(null);

        try {
            const response = await fetch('/api/support/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    name: contactName,
                    email: contactEmail,
                    phone: contactPhone,
                    message: contactMessage,
                    type: contactType
                })
            });

            let data = {};
            const text = await response.text();
            if (text) {
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    // Ignore parsing error
                }
            }

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit request.');
            }

            setFormSubmitted(true);
            setContactMessage('');
            setContactPhone('');
            fetchSupportRequests();
        } catch (err) {
            setFormError(err.message || t('support.errorGeneric') || 'Something went wrong. Please try again.');
        } finally {
            setFormLoading(false);
        }
    };

    const quickQueries = [
        { label: t('support.q1'), val: "What is NPK?" },
        { label: t('support.q2'), val: "How do I adjust soil pH?" },
        { label: t('support.q3'), val: "How does recommendation work?" },
        { label: t('support.q4'), val: "Talk to an Executive" }
    ];

    const handleQuickQueryClick = (item) => {
        if (item.val === "Talk to an Executive") {
            setActiveTab('contact');
            setContactType('EXECUTIVE_CALLBACK');
        } else {
            handleSendMessage(item.label, item.val);
        }
    };

    return (
        <div style={styles.widgetContainer}>
            {/* Custom animations style injection */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes float-pulse {
                    0% { transform: scale(1); box-shadow: 0 8px 24px rgba(1, 152, 99, 0.3); }
                    50% { transform: scale(1.05); box-shadow: 0 12px 30px rgba(1, 152, 99, 0.5); }
                    100% { transform: scale(1); box-shadow: 0 8px 24px rgba(1, 152, 99, 0.3); }
                }
                @keyframes slide-up {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .pulse-btn {
                    animation: float-pulse 3s infinite ease-in-out;
                }
                .slide-in {
                    animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .custom-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                    background: rgba(195, 200, 193, 0.6);
                    border-radius: 4px;
                }
                .custom-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(195, 200, 193, 0.9);
                }
            `}} />

            {/* Support Dialog Card */}
            {isOpen && (
                <div className="slide-in" style={styles.card}>
                    {/* Header */}
                    <div style={styles.header}>
                        <div style={styles.headerTitleArea}>
                            <div style={styles.botAvatar}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '20px', height: '20px' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742h.008v.008h-.008v-.008zm3.702 0h.008v.008h-.008v-.008zM12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V6zM9.75 14.25h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 010-1.5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 style={styles.headerTitle}>{t('support.title')}</h3>
                                <p style={styles.headerSubtitle}>{t('support.subtitle')}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={styles.closeBtn} title="Close Help Desk">
                            &times;
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <div style={styles.tabsRow}>
                        <button 
                            onClick={() => { setActiveTab('chat'); setFormSubmitted(false); }} 
                            style={{
                                ...styles.tabBtn,
                                ...(activeTab === 'chat' ? styles.activeTabBtn : {})
                            }}
                        >
                            {t('support.aiAssistant')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('contact')} 
                            style={{
                                ...styles.tabBtn,
                                ...(activeTab === 'contact' ? styles.activeTabBtn : {})
                            }}
                        >
                            {t('support.contactChannels')}
                        </button>
                        <button 
                            onClick={() => { setActiveTab('status'); fetchSupportRequests(); }} 
                            style={{
                                ...styles.tabBtn,
                                ...(activeTab === 'status' ? styles.activeTabBtn : {})
                            }}
                        >
                            {t('support.requestStatus')}
                        </button>
                    </div>

                    {/* Content Body */}
                    <div style={styles.contentBody}>
                        {activeTab === 'chat' && (
                            /* CHAT INTERFACE */
                            <div style={styles.chatSection}>
                                <div className="custom-scroll" style={styles.chatMessagesContainer}>
                                    {messages.map(msg => (
                                        <div key={msg.id} style={{
                                            ...styles.messageRow,
                                            justifyContent: msg.isBot ? 'flex-start' : 'flex-end'
                                        }}>
                                            <div style={{
                                                ...styles.messageBubble,
                                                backgroundColor: msg.isBot ? 'var(--bg-secondary)' : 'var(--accent-glow)',
                                                color: 'var(--text-main)',
                                                borderBottomLeftRadius: msg.isBot ? '4px' : '16px',
                                                borderBottomRightRadius: msg.isBot ? '16px' : '4px',
                                            }}>
                                                <p style={styles.messageText}>{msg.text}</p>
                                                <span style={styles.messageTime}>{msg.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div style={styles.messageRow}>
                                            <div style={{
                                                ...styles.messageBubble,
                                                backgroundColor: 'var(--bg-secondary)',
                                                borderBottomLeftRadius: '4px',
                                                borderBottomRightRadius: '16px',
                                                display: 'flex',
                                                gap: '4px',
                                                padding: '12px 16px'
                                            }}>
                                                <span className="dot" style={styles.typingDot}>•</span>
                                                <span className="dot" style={{...styles.typingDot, animationDelay: '0.2s'}}>•</span>
                                                <span className="dot" style={{...styles.typingDot, animationDelay: '0.4s'}}>•</span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Quick suggestion chips */}
                                <div style={styles.suggestionsContainer}>
                                    {quickQueries.map((item, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={() => handleQuickQueryClick(item)} 
                                            style={styles.suggestionChip}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Chat Input Area */}
                                <div style={styles.chatInputContainer}>
                                    <input 
                                        type="text" 
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSendMessage();
                                            }
                                        }}
                                        placeholder={t('support.typeQuestion')} 
                                        style={styles.chatInput}
                                    />
                                    <button 
                                        onClick={() => handleSendMessage()} 
                                        style={styles.sendBtn}
                                        disabled={!inputText.trim()}
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
                                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'contact' && (
                            /* CONTACT INTERFACE */
                            <div className="custom-scroll" style={styles.contactSection}>
                                {/* Direct Links Info */}
                                <div style={styles.directContactCards}>
                                    <a href="mailto:support@greensteward.com" style={styles.contactLinkCard}>
                                        <div style={styles.contactIconCircle}>✉</div>
                                        <div>
                                            <h4 style={styles.contactCardTitle}>{t('support.emailSupport')}</h4>
                                            <p style={styles.contactCardVal}>support@greensteward.com</p>
                                        </div>
                                    </a>
                                    <a href="tel:+18005557645" style={styles.contactLinkCard}>
                                        <div style={styles.contactIconCircle}>📞</div>
                                        <div>
                                            <h4 style={styles.contactCardTitle}>{t('support.phoneHotline')}</h4>
                                            <p style={styles.contactCardVal}>+1 (800) 555-SOIL</p>
                                        </div>
                                    </a>
                                </div>

                                {/* Form Area */}
                                <div style={styles.formContainer}>
                                    {formSubmitted ? (
                                        <div style={styles.formSuccessArea}>
                                            <div style={styles.successIcon}>✓</div>
                                            <h4 style={styles.successHeader}>{t('support.callbackRegistered')}</h4>
                                            <p style={styles.successText}>
                                                {t('support.thankYouCallback').replace('{name}', contactName)}
                                            </p>
                                            <button 
                                                onClick={() => setFormSubmitted(false)} 
                                                style={styles.backBtn}
                                            >
                                                {t('support.submitAnother')}
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleFormSubmit} style={styles.contactForm}>
                                            <h4 style={styles.formTitle}>{t('support.talkExecutive')}</h4>
                                            <p style={styles.formSubtitle}>{t('support.formSubtitle')}</p>
                                            
                                            {formError && <div style={styles.errorBanner}>{formError}</div>}

                                            <div style={styles.formGroup}>
                                                <label style={styles.inputLabel}>{t('support.nameLabel')}</label>
                                                <input 
                                                    type="text" 
                                                    value={contactName}
                                                    onChange={(e) => setContactName(e.target.value)}
                                                    required 
                                                    style={styles.formInput}
                                                    placeholder="John Doe"
                                                />
                                            </div>

                                            <div style={styles.formGroup}>
                                                <label style={styles.inputLabel}>{t('support.emailLabel')}</label>
                                                <input 
                                                    type="email" 
                                                    value={contactEmail}
                                                    onChange={(e) => setContactEmail(e.target.value)}
                                                    required 
                                                    style={styles.formInput}
                                                    placeholder="john@example.com"
                                                />
                                            </div>

                                            <div style={styles.formGroup}>
                                                <label style={styles.inputLabel}>{t('support.phoneLabel')}</label>
                                                <input 
                                                    type="tel" 
                                                    value={contactPhone}
                                                    onChange={(e) => setContactPhone(e.target.value)}
                                                    style={styles.formInput}
                                                    placeholder="+1 (123) 456-7890"
                                                />
                                            </div>

                                            <div style={styles.formGroup}>
                                                <label style={styles.inputLabel}>{t('support.queryCategory')}</label>
                                                <select 
                                                    value={contactType}
                                                    onChange={(e) => setContactType(e.target.value)}
                                                    style={styles.formSelect}
                                                >
                                                    <option value="EXECUTIVE_CALLBACK">{t('support.executiveCallback')}</option>
                                                    <option value="GENERAL_QUERY">{t('support.generalQuery')}</option>
                                                    <option value="TECHNICAL_ISSUE">{t('support.technicalSupport')}</option>
                                                </select>
                                            </div>

                                            <div style={styles.formGroup}>
                                                <label style={styles.inputLabel}>{t('support.messageLabel')}</label>
                                                <textarea 
                                                    value={contactMessage}
                                                    onChange={(e) => setContactMessage(e.target.value)}
                                                    rows={3}
                                                    style={styles.formTextarea}
                                                    placeholder={t('support.messagePlaceholder')}
                                                />
                                            </div>

                                            <button 
                                                type="submit" 
                                                disabled={formLoading}
                                                style={{
                                                    ...styles.submitBtn,
                                                    opacity: formLoading ? 0.7 : 1
                                                }}
                                            >
                                                {formLoading ? t('support.submitting') : t('support.requestCallbackBtn')}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'status' && (
                            /* STATUS INTERFACE */
                            <div className="custom-scroll" style={styles.statusSection}>
                                <div style={styles.statusHeaderRow}>
                                    <h4 style={styles.formTitle}>{t('support.requestHistory')}</h4>
                                    <button 
                                        onClick={fetchSupportRequests} 
                                        style={styles.refreshBtn}
                                        disabled={requestsLoading}
                                        title="Refresh requests"
                                    >
                                        {requestsLoading ? '⏳' : '🔄'}
                                    </button>
                                </div>
                                
                                {requestsError && <div style={styles.errorBanner}>{requestsError}</div>}
                                
                                {requestsLoading && supportRequests.length === 0 ? (
                                    <div style={styles.statusLoadingArea}>
                                        <span className="dot" style={styles.typingDot}>•</span>
                                        <span className="dot" style={{...styles.typingDot, animationDelay: '0.2s'}}>•</span>
                                        <span className="dot" style={{...styles.typingDot, animationDelay: '0.4s'}}>•</span>
                                        <p style={styles.loadingText}>{t('support.fetchingRequests')}</p>
                                    </div>
                                ) : supportRequests.length === 0 ? (
                                    <div style={styles.statusEmptyArea}>
                                        <div style={styles.emptyIcon}>🎫</div>
                                        <p style={styles.emptyText}>{t('support.noTickets')}</p>
                                        <button 
                                            onClick={() => setActiveTab('contact')} 
                                            style={styles.backBtn}
                                        >
                                            {t('support.submitRequest')}
                                        </button>
                                    </div>
                                ) : (
                                    <div style={styles.statusList}>
                                        {supportRequests.map(req => (
                                            <div key={req.id} style={styles.statusCard}>
                                                <div style={styles.statusCardHeader}>
                                                    <span style={styles.statusId}>#{req.id}</span>
                                                    <span style={{
                                                        ...styles.statusBadge,
                                                        ...(req.status === 'RESOLVED' ? styles.statusBadgeResolved : styles.statusBadgePending)
                                                    }}>
                                                        {req.status === 'RESOLVED' ? t('support.resolved') : t('support.pending')}
                                                    </span>
                                                </div>
                                                <div style={styles.statusCardBody}>
                                                    <div style={styles.statusType}>
                                                        <strong>{t('support.ticketType')}:</strong> {
                                                            req.type === 'EXECUTIVE_CALLBACK' ? t('support.executiveCallback') :
                                                            req.type === 'GENERAL_QUERY' ? t('support.generalQuery') :
                                                            req.type === 'TECHNICAL_ISSUE' ? t('support.technicalSupport') : req.type
                                                        }
                                                    </div>
                                                    {req.message && (
                                                        <p style={styles.statusMessageText}>
                                                            "{req.message}"
                                                        </p>
                                                    )}
                                                </div>
                                                <div style={styles.statusCardFooter}>
                                                    <span style={styles.statusDate}>
                                                        {new Date(req.createdAt).toLocaleString([], {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="pulse-btn"
                style={{
                    ...styles.floatButton,
                    transform: isOpen ? 'rotate(90deg)' : 'none',
                    backgroundColor: isOpen ? 'var(--danger)' : 'var(--accent)'
                }}
                title={isOpen ? 'Close support panel' : 'Get support and contact options'}
            >
                {isOpen ? (
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>&times;</span>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '26px', height: '26px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

const styles = {
    widgetContainer: {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif"
    },
    floatButton: {
        width: '60px',
        height: '60px',
        borderRadius: '30px',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        boxShadow: '0 8px 24px rgba(27, 48, 34, 0.25)'
    },
    card: {
        width: '380px',
        height: '570px',
        backgroundColor: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        boxShadow: '0 12px 40px rgba(27, 48, 34, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
    },
    header: {
        background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
        color: '#ffffff',
        padding: '1.25rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px'
    },
    headerTitleArea: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    },
    botAvatar: {
        width: '36px',
        height: '36px',
        borderRadius: '18px',
        backgroundColor: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff'
    },
    headerTitle: {
        fontSize: '1rem',
        fontWeight: '700',
        margin: 0,
        color: '#ffffff',
        fontFamily: "'Outfit', sans-serif"
    },
    headerSubtitle: {
        fontSize: '0.75rem',
        margin: 0,
        color: 'rgba(255,255,255,0.85)',
        fontWeight: '500'
    },
    closeBtn: {
        background: 'transparent',
        border: 'none',
        color: '#ffffff',
        fontSize: '1.75rem',
        cursor: 'pointer',
        lineHeight: 1,
        padding: '0 0.5rem'
    },
    tabsRow: {
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-primary)'
    },
    tabBtn: {
        flex: 1,
        padding: '0.85rem',
        border: 'none',
        background: 'transparent',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        borderBottom: '2px solid transparent',
        transition: 'all 0.2s ease',
        textAlign: 'center'
    },
    activeTabBtn: {
        color: 'var(--accent)',
        borderBottom: '2px solid var(--accent)',
        backgroundColor: 'var(--accent-glow)'
    },
    contentBody: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-primary)',
        overflow: 'hidden'
    },
    chatSection: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    chatMessagesContainer: {
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },
    messageRow: {
        display: 'flex',
        width: '100%'
    },
    messageBubble: {
        maxWidth: '80%',
        padding: '0.75rem 1rem',
        borderRadius: '16px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
    },
    messageText: {
        margin: 0,
        fontSize: '0.85rem',
        lineHeight: '1.45',
        whiteSpace: 'pre-line',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
    },
    messageTime: {
        fontSize: '0.68rem',
        color: 'rgba(27, 28, 28, 0.5)',
        alignSelf: 'flex-end'
    },
    typingDot: {
        fontSize: '1rem',
        color: 'var(--accent)',
        lineHeight: '0.5'
    },
    suggestionsContainer: {
        padding: '0.5rem 1rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.4rem',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-primary)'
    },
    suggestionChip: {
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        padding: '0.4rem 0.75rem',
        fontSize: '0.78rem',
        fontWeight: '500',
        color: 'var(--text-main)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
    },
    chatInputContainer: {
        padding: '0.75rem 1rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        backgroundColor: 'var(--bg-primary)'
    },
    chatInput: {
        flex: 1,
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        padding: '0.6rem 1rem',
        fontSize: '0.85rem',
        outline: 'none',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-main)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        transition: 'border-color 0.2s ease'
    },
    sendBtn: {
        background: 'var(--accent)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.15s ease'
    },
    contactSection: {
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    directContactCards: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem'
    },
    contactLinkCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '0.8rem 1rem',
        textDecoration: 'none',
        color: 'var(--text-main)',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 8px rgba(27,48,34,0.02)'
    },
    contactIconCircle: {
        width: '34px',
        height: '34px',
        borderRadius: '17px',
        backgroundColor: 'var(--accent-glow)',
        color: 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.1rem'
    },
    contactCardTitle: {
        fontSize: '0.78rem',
        fontWeight: '600',
        color: 'var(--text-muted)',
        margin: 0
    },
    contactCardVal: {
        fontSize: '0.85rem',
        fontWeight: '700',
        color: 'var(--text-main)',
        margin: 0
    },
    formContainer: {
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '1.2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
    },
    contactForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
    },
    formTitle: {
        fontSize: '0.92rem',
        fontWeight: '700',
        color: 'var(--text-main)',
        margin: 0
    },
    formSubtitle: {
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        margin: 0,
        lineHeight: '1.3'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
    },
    inputLabel: {
        fontSize: '0.72rem',
        fontWeight: '600',
        color: 'var(--text-muted)'
    },
    formInput: {
        padding: '0.5rem 0.75rem',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-main)',
        borderRadius: '8px',
        fontSize: '0.82rem',
        outline: 'none',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
    },
    formSelect: {
        padding: '0.5rem 0.75rem',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-main)',
        borderRadius: '8px',
        fontSize: '0.82rem',
        outline: 'none',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        cursor: 'pointer'
    },
    formTextarea: {
        padding: '0.5rem 0.75rem',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-main)',
        borderRadius: '8px',
        fontSize: '0.82rem',
        outline: 'none',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        resize: 'none'
    },
    submitBtn: {
        background: 'var(--accent)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        padding: '0.65rem',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '0.25rem',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
    },
    errorBanner: {
        backgroundColor: 'rgba(186, 26, 26, 0.1)',
        color: 'var(--danger)',
        padding: '0.5rem 0.75rem',
        borderRadius: '8px',
        fontSize: '0.78rem',
        fontWeight: '500'
    },
    formSuccessArea: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '1.5rem 0.5rem'
    },
    successIcon: {
        width: '48px',
        height: '48px',
        borderRadius: '24px',
        backgroundColor: 'var(--accent-glow)',
        color: 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.6rem',
        fontWeight: 'bold',
        marginBottom: '0.85rem',
        boxShadow: '0 4px 10px rgba(16, 185, 129, 0.15)'
    },
    successHeader: {
        fontSize: '1rem',
        fontWeight: '700',
        color: 'var(--text-main)',
        marginBottom: '0.35rem'
    },
    successText: {
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        lineHeight: '1.5',
        marginBottom: '1rem'
    },
    backBtn: {
        background: 'transparent',
        border: '1px solid var(--accent)',
        color: 'var(--accent)',
        borderRadius: '8px',
        padding: '0.5rem 1rem',
        fontSize: '0.78rem',
        fontWeight: '600',
        cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        transition: 'all 0.2s ease'
    },
    statusSection: {
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    statusHeaderRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    refreshBtn: {
        background: 'transparent',
        border: 'none',
        fontSize: '1rem',
        cursor: 'pointer',
        padding: '0.2rem 0.5rem',
        transition: 'transform 0.2s ease'
    },
    statusLoadingArea: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        gap: '0.5rem'
    },
    loadingText: {
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        margin: 0
    },
    statusEmptyArea: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '3rem 1rem',
        gap: '0.8rem'
    },
    emptyIcon: {
        fontSize: '2.5rem'
    },
    emptyText: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        margin: 0
    },
    statusList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
    },
    statusCard: {
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '0.85rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        boxShadow: '0 2px 8px rgba(27,48,34,0.02)'
    },
    statusCardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    statusId: {
        fontSize: '0.78rem',
        fontWeight: '700',
        color: 'var(--text-muted)'
    },
    statusBadge: {
        fontSize: '0.68rem',
        fontWeight: '700',
        padding: '0.2rem 0.6rem',
        borderRadius: '12px',
        textTransform: 'uppercase'
    },
    statusBadgePending: {
        backgroundColor: 'rgba(217, 119, 6, 0.1)',
        color: '#d97706'
    },
    statusBadgeResolved: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        color: '#10b981'
    },
    statusCardBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        textAlign: 'left'
    },
    statusType: {
        fontSize: '0.82rem',
        color: 'var(--text-main)'
    },
    statusMessageText: {
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        margin: '0.25rem 0 0 0',
        fontStyle: 'italic',
        lineHeight: '1.4'
    },
    statusCardFooter: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    statusDate: {
        fontSize: '0.68rem',
        color: 'rgba(27, 28, 28, 0.5)'
    }
};

export default SupportWidget;
