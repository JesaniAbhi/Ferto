import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const History = ({ setActiveTab, setResultData }) => {
    const { fetchWithAuth } = useAuth();
    const { t, tCrop, tState, tSoilType, tFertilizer, tDosage, getExplanationTranslation } = useLanguage();
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const res = await fetchWithAuth('/api/recommendations/history');
            const data = await res.json();
            setHistoryList(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id) => {
        if (expandedId === id) {
            setExpandedId(null);
        } else {
            setExpandedId(id);
        }
    };

    const viewFullReport = (item) => {
        setResultData(item);
        setActiveTab('result');
    };

    if (loading) {
        return (
            <div style={styles.loadingWrapper}>
                <div className="spinner" style={{ width: '48px', height: '48px', borderTopColor: 'var(--accent)' }}></div>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>{t('history.loading')}</p>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in">
            {/* Header Title */}
            <div style={styles.header}>
                <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>{t('history.title')}</h1>
                <p>{t('history.subtitle')}</p>
            </div>

            {error && (
                <div style={styles.alertDanger}>
                    {error}
                </div>
            )}

            {historyList.length === 0 ? (
                <div className="glass-card" style={styles.emptyStateCard}>
                    <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: '1rem' }}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <h3>{t('history.emptyTitle')}</h3>
                    <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem', maxWidth: '360px', textAlign: 'center' }}>
                        {t('history.emptyDesc')}
                    </p>
                    <button className="btn-primary" onClick={() => setActiveTab('form')}>
                        {t('history.getFirst')}
                    </button>
                </div>
            ) : (
                <div style={styles.listContainer}>
                    {historyList.map((item) => {
                        const isExpanded = expandedId === item.id;
                        const dateString = new Date(item.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });

                        return (
                            <div key={item.id} className="glass-card" style={styles.historyCard}>
                                {/* Summary Header Line */}
                                <div style={styles.cardHeader} onClick={() => toggleExpand(item.id)}>
                                    <div style={styles.cardInfoCol}>
                                        <span style={styles.dateText}>{dateString}</span>
                                        <h3 style={styles.cropTitle}>
                                            {tCrop(item.cropName)} <span style={styles.locationText}>({tState(item.location)})</span>
                                        </h3>
                                    </div>
                                    <div style={styles.resultCol}>
                                        <span style={styles.fertText}>{tFertilizer(item.predictedFertilizer)}</span>
                                        <span style={styles.qtyText}>{tDosage(item.recommendedQuantity)}</span>
                                    </div>
                                    <div style={styles.expandIcon}>
                                        <svg 
                                            width="20" height="20" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" viewBox="0 0 24 24"
                                            style={{
                                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.3s ease'
                                            }}
                                        >
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>
                                </div>

                                {/* Expanded Detail Drawer */}
                                {isExpanded && (
                                    <div style={styles.drawerContent} className="animate-slide-up">
                                        <div style={styles.divider}></div>
                                        <div style={styles.detailGrid}>
                                            <div style={styles.detailItem}>
                                                <span style={styles.detailLabel}>{t('form.nitrogen')}</span>
                                                <span style={styles.detailVal}>{item.nitrogen} mg/kg</span>
                                            </div>
                                            <div style={styles.detailItem}>
                                                <span style={styles.detailLabel}>{t('form.phosphorus')}</span>
                                                <span style={styles.detailVal}>{item.phosphorus} mg/kg</span>
                                            </div>
                                            <div style={styles.detailItem}>
                                                <span style={styles.detailLabel}>{t('form.potassium')}</span>
                                                <span style={styles.detailVal}>{item.potassium} mg/kg</span>
                                            </div>
                                            <div style={styles.detailItem}>
                                                <span style={styles.detailLabel}>{t('form.ph')}</span>
                                                <span style={styles.detailVal}>{item.ph}</span>
                                            </div>
                                            <div style={styles.detailItem}>
                                                <span style={styles.detailLabel}>{t('form.moisture')}</span>
                                                <span style={styles.detailVal}>{item.moisture}%</span>
                                            </div>
                                            <div style={styles.detailItem}>
                                                <span style={styles.detailLabel}>{t('form.carbon')}</span>
                                                <span style={styles.detailVal}>{item.organicCarbon}%</span>
                                            </div>
                                            <div style={styles.detailItem}>
                                                <span style={styles.detailLabel}>{t('form.soilType')}</span>
                                                <span style={styles.detailVal}>{tSoilType(item.soilType)}</span>
                                            </div>
                                            <div style={styles.detailItem}>
                                                <span style={styles.detailLabel}>{t('history.confidence')}</span>
                                                <span style={styles.detailVal}>{Math.round(item.confidence * 100)}%</span>
                                            </div>
                                            <div style={styles.detailItem}>
                                                <span style={styles.detailLabel}>{t('result.expectedYield')}</span>
                                                <span style={styles.detailVal}>{item.expectedYield != null ? item.expectedYield : '2.00'} tons/acre</span>
                                            </div>
                                            <div style={styles.detailItem}>
                                                <span style={styles.detailLabel}>{t('result.temp')}</span>
                                                <span style={styles.detailVal}>{item.temperature}°C</span>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '1.25rem' }}>
                                            <span style={styles.detailLabel}>{t('history.recsDetail')}</span>
                                            <p style={styles.explanationText}>
                                                {getExplanationTranslation(item.explanation.split('\n\nField Application Tips: ')[0])}
                                            </p>
                                        </div>

                                        <div style={styles.actionRow}>
                                            <button className="btn-primary" onClick={() => viewFullReport(item)} style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>
                                                {t('history.viewFull')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const styles = {
    loadingWrapper: {
        height: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        marginBottom: '2.5rem'
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    historyCard: {
        padding: '1.25rem 1.75rem',
        cursor: 'pointer'
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
    },
    cardInfoCol: {
        display: 'flex',
        flexDirection: 'column',
        flex: 2,
        minWidth: '200px'
    },
    dateText: {
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        fontWeight: 600
    },
    cropTitle: {
        fontSize: '1.15rem',
        fontWeight: 700,
        marginTop: '0.1rem',
        fontFamily: "'Outfit', sans-serif"
    },
    locationText: {
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        fontWeight: 500
    },
    resultCol: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        flex: 1,
        minWidth: '120px'
    },
    fertText: {
        fontSize: '1.1rem',
        fontWeight: 700,
        color: 'var(--accent)'
    },
    qtyText: {
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
    },
    expandIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '1rem'
    },
    divider: {
        height: '1px',
        background: 'var(--border-color)',
        margin: '1rem 0'
    },
    drawerContent: {
        cursor: 'default'
    },
    detailGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: '1rem',
        background: 'rgba(0, 0, 0, 0.15)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '1rem'
    },
    detailItem: {
        display: 'flex',
        flexDirection: 'column'
    },
    detailLabel: {
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    detailVal: {
        fontSize: '0.9rem',
        fontWeight: 700,
        color: 'var(--text-main)',
        marginTop: '0.1rem'
    },
    explanationText: {
        fontSize: '0.9rem',
        lineHeight: 1.5,
        color: 'var(--text-main)',
        marginTop: '0.25rem'
    },
    actionRow: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '1.25rem'
    },
    emptyStateCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '4rem 2rem',
        borderRadius: '20px'
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
    }
};

export default History;
