import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Auth = ({ theme, toggleTheme }) => {
    const { login, register, loading, error } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        setSuccessMessage('');

        if (!username || !password || (!isLogin && !email)) {
            setLocalError('Please fill out all fields.');
            return;
        }

        const normalizedUsername = username.trim().toLowerCase();
        const normalizedEmail = email.trim().toLowerCase();

        if (isLogin) {
            const success = await login(normalizedUsername, password);
            if (!success) {
                // Error is handled in context, local state handles displaying
            }
        } else {
            const success = await register(normalizedUsername, normalizedEmail, password);
            if (success) {
                setSuccessMessage('Registration successful! Please log in.');
                setIsLogin(true);
                setPassword('');
            }
        }
    };

    return (
        <div style={styles.authWrapper}>
            {/* Visual background glowing orb */}
            <div style={styles.glowOrb}></div>
            
            <div className="glass-card animate-slide-up" style={styles.authCard}>
                {/* Floating corner theme toggle button */}
                <button 
                    onClick={toggleTheme} 
                    style={styles.cornerThemeToggle}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                >
                    {theme === 'light' ? (
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                        </svg>
                    ) : (
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.58 1.58m12.4 12.4l1.58 1.58M3 12h2.25m13.5 0H21M6.1 18.9l-1.58 1.58M18.9 6.1l-1.58 1.58M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
                        </svg>
                    )}
                </button>

                <div style={styles.header}>
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
                        <path d="M2 22C2 22 8 20 12 16C16 12 22 6 22 2C22 2 16 2 12 6C8 10 2 22 2 22Z" />
                        <path d="M12 16L14 19L20 21" />
                        <path d="M6 14L9 12L12 6" />
                    </svg>
                    <h2 style={styles.title}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p style={styles.subtitle}>
                        {isLogin 
                          ? 'Enter credentials to access the Fertilizer Engine' 
                          : 'Sign up to get custom soil recommendations'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Error Alerts */}
                    {(error || localError) && (
                        <div style={styles.alertDanger}>
                            {localError || error}
                        </div>
                    )}

                    {/* Success Alerts */}
                    {successMessage && (
                        <div style={styles.alertSuccess}>
                            {successMessage}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input 
                            type="text" 
                            className="form-control"
                            placeholder="e.g. farmer123"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoCapitalize="none"
                            autoCorrect="off"
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input 
                                type="email" 
                                className="form-control"
                                placeholder="e.g. farmer@agri.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoCapitalize="none"
                                autoCorrect="off"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                className="form-control"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ paddingRight: '2.5rem', width: '100%' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.eyeBtn}
                                title={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
                                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={loading}
                        style={styles.submitBtn}
                    >
                        {loading ? (
                            <>
                                <div className="spinner"></div>
                                Processing...
                            </>
                        ) : (
                            isLogin ? 'Log In' : 'Sign Up'
                        )}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={{ fontSize: '0.9rem' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span 
                            style={styles.toggleLink}
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setLocalError('');
                                setSuccessMessage('');
                            }}
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    authWrapper: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem 1rem'
    },
    glowOrb: {
        position: 'absolute',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, hsla(150, 84%, 39%, 0.15) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
        pointerEvents: 'none'
    },
    authCard: {
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1,
        borderRadius: '24px'
    },
    cornerThemeToggle: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        background: 'rgba(0,0,0,0.05)',
        border: '1px solid var(--border-color)',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--text-main)',
        transition: 'all 0.2s ease',
        zIndex: 10
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem'
    },
    title: {
        fontSize: '2rem',
        marginBottom: '0.5rem',
        fontWeight: 800
    },
    subtitle: {
        fontSize: '0.9rem'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    submitBtn: {
        width: '100%',
        justifyContent: 'center',
        padding: '0.9rem',
        marginTop: '0.5rem'
    },
    footer: {
        textAlign: 'center',
        marginTop: '1.5rem'
    },
    toggleLink: {
        color: 'var(--accent)',
        fontWeight: 600,
        cursor: 'pointer',
        textDecoration: 'underline',
        transition: 'var(--transition-smooth)'
    },
    eyeBtn: {
        position: 'absolute',
        right: '12px',
        background: 'transparent',
        border: 'none',
        color: '#8c9389',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        zIndex: 2,
        transition: 'color 0.2s ease',
        outline: 'none'
    },
    alertDanger: {
        background: 'rgba(239, 68, 68, 0.15)',
        color: '#EF4444',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        padding: '0.8rem 1rem',
        borderRadius: '10px',
        fontSize: '0.9rem',
        fontWeight: 500,
        marginBottom: '1.5rem',
        textAlign: 'center'
    },
    alertSuccess: {
        background: 'rgba(16, 185, 129, 0.15)',
        color: 'var(--accent)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        padding: '0.8rem 1rem',
        borderRadius: '10px',
        fontSize: '0.9rem',
        fontWeight: 500,
        marginBottom: '1.5rem',
        textAlign: 'center'
    }
};

export default Auth;
