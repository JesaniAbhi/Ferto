import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar = ({ theme, toggleTheme, activeTab, setActiveTab }) => {
    const { user, logout } = useAuth();
    const { language, setLanguage, languagesList, t } = useLanguage();
    const [showProfileCard, setShowProfileCard] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <header style={styles.header}>
            <div style={styles.navContainer} className="nav-container-res">
                <style dangerouslySetInnerHTML={{__html: `
                    @media (max-width: 768px) {
                        .nav-container-res {
                            display: grid !important;
                            grid-template-areas: 
                                "brand right"
                                "tabs tabs" !important;
                            grid-template-columns: auto 1fr !important;
                            row-gap: 0.8rem !important;
                            column-gap: 0.5rem !important;
                            padding: 0.8rem 1rem !important;
                            align-items: center !important;
                        }
                        .brand-res {
                            grid-area: brand !important;
                        }
                        .right-section-res {
                            grid-area: right !important;
                            justify-self: end !important;
                            justify-content: flex-end !important;
                            width: auto !important;
                        }
                        .tabs-container-res {
                            grid-area: tabs !important;
                            width: 100% !important;
                            display: flex !important;
                            overflow-x: auto !important;
                            white-space: nowrap !important;
                            scrollbar-width: none !important; /* Firefox */
                        }
                        .tabs-container-res::-webkit-scrollbar {
                            display: none !important; /* Chrome/Safari */
                        }
                        .tabs-container-res button {
                            flex: 1 0 auto !important;
                            text-align: center !important;
                            padding: 0.5rem 0.8rem !important;
                            font-size: 0.82rem !important;
                        }
                    }
                `}} />

                {/* Brand Logo */}
                <div style={styles.brand} className="brand-res" onClick={() => setActiveTab('dashboard')}>
                    <div style={styles.logoIcon}>
                        <svg viewBox="0 0 48 48" fill="currentColor" width="26" height="26">
                            <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" />
                        </svg>
                    </div>
                    <span style={styles.brandName}>GreenSteward</span>
                </div>

                {/* Navigation Tabs */}
                <div style={styles.tabsContainer} className="tabs-container-res">
                    <button 
                        onClick={() => setActiveTab('dashboard')} 
                        style={{
                            ...styles.tab,
                            ...(activeTab === 'dashboard' ? styles.activeTab : {})
                        }}
                    >
                        {t('nav.dashboard')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('form')} 
                        style={{
                            ...styles.tab,
                            ...(activeTab === 'form' || activeTab === 'result' ? styles.activeTab : {})
                        }}
                    >
                        {t('nav.recommendationEngine')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')} 
                        style={{
                            ...styles.tab,
                            ...(activeTab === 'history' ? styles.activeTab : {})
                        }}
                    >
                        {t('nav.calculationHistory')}
                    </button>
                </div>

                {/* Right Actions */}
                {user && (
                    <div style={styles.rightSection} className="right-section-res">
                        {/* Language Selector */}
                        <select 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value)} 
                            style={styles.langSelector}
                            title="Select Language"
                        >
                            {languagesList.map((lang) => (
                                <option key={lang.code} value={lang.code} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>

                        {/* Theme Toggle Button */}
                        <button 
                            onClick={toggleTheme} 
                            style={styles.themeToggleBtn}
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                        >
                            {theme === 'light' ? (
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.58 1.58m12.4 12.4l1.58 1.58M3 12h2.25m13.5 0H21M6.1 18.9l-1.58 1.58M18.9 6.1l-1.58 1.58M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
                                </svg>
                            )}
                        </button>

                        {/* Clickable User Info Container */}
                        <div style={{ position: 'relative' }}>
                            <div 
                                style={{
                                    ...styles.userInfo,
                                    background: isHovered ? 'var(--bg-secondary)' : 'transparent'
                                }} 
                                onClick={() => setShowProfileCard(!showProfileCard)}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                title="Click to view profile details"
                            >
                                <span style={styles.username}>{user.username}</span>
                                <span style={styles.roleTag}>{user.role === 'ROLE_ADMIN' ? t('nav.admin') : t('nav.farmer')}</span>
                            </div>

                            {showProfileCard && (
                                <div style={styles.profileCardDropdown} className="animate-slide-up">
                                    <div style={styles.profileCardHeader}>
                                        <div style={styles.profileAvatar}>
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div style={styles.profileHeaderInfo}>
                                            <h4 style={styles.profileTitle}>{user.username}</h4>
                                            <span style={styles.profileSubtitle}>{user.role === 'ROLE_ADMIN' ? t('nav.administrator') : t('nav.farmerMember')}</span>
                                        </div>
                                    </div>
                                    <div style={styles.profileDivider}></div>
                                    <div style={styles.profileDetailsList}>
                                        <div style={styles.profileDetailItem}>
                                            <span style={styles.profileLabel}>{t('nav.email')}</span>
                                            <span style={styles.profileVal}>{user.email || 'No email registered'}</span>
                                        </div>
                                        <div style={styles.profileDetailItem}>
                                            <span style={styles.profileLabel}>{t('nav.role')}</span>
                                            <span style={styles.profileVal}>{user.role === 'ROLE_ADMIN' ? t('nav.administrator') : t('nav.farmerMember')}</span>
                                        </div>
                                    </div>
                                    <div style={styles.profileDivider}></div>
                                    <button 
                                        onClick={() => {
                                            setShowProfileCard(false);
                                            logout();
                                        }} 
                                        style={styles.profileLogoutBtn}
                                    >
                                        {t('nav.logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

const styles = {
    header: {
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-primary)',
        boxShadow: '0px 4px 20px rgba(27,48,34,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%'
    },
    navContainer: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.8rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        cursor: 'pointer',
        color: 'var(--text-main)'
    },
    logoIcon: {
        color: 'var(--accent)',
        display: 'flex',
        alignItems: 'center'
    },
    brandName: {
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.35rem',
        fontWeight: 800,
        color: 'var(--text-main)'
    },
    tabsContainer: {
        display: 'flex',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '0.25rem'
    },
    tab: {
        border: 'none',
        background: 'transparent',
        color: 'var(--text-muted)',
        fontFamily: "'Hanken Grotesk', sans-serif",
        fontWeight: 600,
        fontSize: '0.9rem',
        padding: '0.5rem 1.2rem',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    activeTab: {
        background: 'var(--accent)',
        color: 'var(--text-inverse)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem'
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.1rem',
        cursor: 'pointer',
        padding: '0.35rem 0.7rem',
        borderRadius: '8px',
        transition: 'background 0.2s ease'
    },
    username: {
        fontWeight: 600,
        fontSize: '0.9rem',
        color: 'var(--text-main)',
        fontFamily: "'Hanken Grotesk', sans-serif"
    },
    roleTag: {
        fontSize: '0.75rem',
        background: 'var(--accent-glow)',
        color: 'var(--accent)',
        padding: '0.1rem 0.4rem',
        borderRadius: '4px',
        fontWeight: 500,
        fontFamily: "'Hanken Grotesk', sans-serif"
    },
    logoutBtn: {
        background: 'rgba(186, 26, 26, 0.1)',
        color: 'var(--danger)',
        border: '1px solid rgba(186, 26, 26, 0.2)',
        borderRadius: '8px',
        padding: '0.45rem 1rem',
        fontSize: '0.85rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: "'Hanken Grotesk', sans-serif"
    },
    themeToggleBtn: {
        background: 'var(--bg-secondary)',
        color: 'var(--text-main)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '0.45rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    profileCardDropdown: {
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        width: '280px',
        background: 'var(--bg-card)',
        backdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px 0 rgba(27, 48, 34, 0.15)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000
    },
    profileCardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        marginBottom: '0.5rem'
    },
    profileAvatar: {
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        background: 'var(--accent)',
        color: 'var(--text-inverse)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        fontFamily: "'Outfit', sans-serif"
    },
    profileHeaderInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.1rem'
    },
    profileTitle: {
        fontSize: '1rem',
        fontWeight: 700,
        color: 'var(--text-main)',
        margin: 0,
        fontFamily: "'Outfit', sans-serif"
    },
    profileSubtitle: {
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        fontWeight: 500
    },
    profileDivider: {
        height: '1px',
        background: 'var(--border-color)',
        margin: '0.8rem 0'
    },
    profileDetailsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },
    profileDetailItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.15rem',
        textAlign: 'left'
    },
    profileLabel: {
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    profileVal: {
        fontSize: '0.85rem',
        color: 'var(--text-main)',
        fontWeight: 600
    },
    profileLogoutBtn: {
        background: 'rgba(186, 26, 26, 0.08)',
        color: 'var(--danger)',
        border: 'none',
        borderRadius: '8px',
        padding: '0.55rem',
        fontSize: '0.82rem',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'center',
        fontFamily: "'Hanken Grotesk', sans-serif"
    },
    langSelector: {
        background: 'var(--bg-secondary)',
        color: 'var(--text-main)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '0.45rem 0.6rem',
        fontSize: '0.82rem',
        fontWeight: 600,
        cursor: 'pointer',
        outline: 'none',
        fontFamily: "'Hanken Grotesk', sans-serif",
        transition: 'all 0.2s ease'
    }
};

export default Navbar;
