import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const RecommendationResult = ({ resultData, setActiveTab }) => {
    const { t, tCrop, tState, tSoilType, tFertilizer, tDosage, getExplanationTranslation, getTipsTranslation } = useLanguage();
    const { fetchWithAuth } = useAuth();

    if (!resultData) return null;

    // Extract values
    const {
        nitrogen, phosphorus, potassium, ph, moisture, organicCarbon,
        soilType, cropName, location, temperature, humidity, rainfall,
        predictedFertilizer, recommendedQuantity, confidence, explanation,
        expectedYield = 2.0
    } = resultData;

    // Set up reactive states for optimizer sliders
    const [sliderN, setSliderN] = useState(nitrogen);
    const [sliderP, setSliderP] = useState(phosphorus);
    const [sliderK, setSliderK] = useState(potassium);
    const [sliderPh, setSliderPh] = useState(ph);
    const [sliderMoisture, setSliderMoisture] = useState(moisture);
    const [sliderOc, setSliderOc] = useState(organicCarbon);

    // Set up reactive recommendation states
    const [currentYield, setCurrentYield] = useState(expectedYield || 2.0);
    const [currentFertilizer, setCurrentFertilizer] = useState(predictedFertilizer);
    const [currentQuantity, setCurrentQuantity] = useState(recommendedQuantity);
    const [currentConfidence, setCurrentConfidence] = useState(confidence);
    const [currentExplanation, setCurrentExplanation] = useState(explanation);
    const [loadingYield, setLoadingYield] = useState(false);

    // Call dynamic backend recalculation when a slider value changes
    const triggerRecalculate = async (n, p, k, phVal, ocVal, moistVal) => {
        setLoadingYield(true);
        try {
            const payload = {
                nitrogen: parseFloat(n),
                phosphorus: parseFloat(p),
                potassium: parseFloat(k),
                ph: parseFloat(phVal),
                moisture: parseFloat(moistVal),
                organicCarbon: parseFloat(ocVal),
                soilType,
                cropName,
                location,
                language: 'en'
            };
            const res = await fetchWithAuth('/api/recommendations/predict', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                setCurrentYield(data.expected_yield !== undefined ? data.expected_yield : (data.expectedYield || 2.0));
                setCurrentFertilizer(data.fertilizer || data.predictedFertilizer);
                setCurrentQuantity(data.quantity || data.recommendedQuantity);
                setCurrentConfidence(data.confidence);
                setCurrentExplanation(data.explanation);
            }
        } catch (err) {
            console.error("Recalculate error:", err);
        } finally {
            setLoadingYield(false);
        }
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('report-card');
        const opt = {
            margin:       0.25,
            filename:     `Ferto_Soil_Report_${cropName}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true,
                ignoreElements: (el) => el.classList.contains('no-print')
            },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
            pagebreak:    { mode: 'avoid-all' }
        };
        if (window.html2pdf) {
            window.html2pdf().set(opt).from(element).save();
        } else {
            window.print();
        }
    };

    // Standard split for fallback vs ML formatting
    const explanationParts = currentExplanation.split('\n\nField Application Tips: ');
    const descText = explanationParts[0];
    const tipsText = explanationParts[1] || 'Apply under adequate soil moisture conditions.';

    // Confidence indicator formatting
    const confidencePct = Math.round(currentConfidence * 100);

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '800px' }}>
            {/* Action Bar (Go Back and PDF Download) */}
            <div className="no-print" style={styles.actionBar}>
                <button className="btn-secondary" onClick={() => setActiveTab('form')} style={styles.actionBtn}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    {t('result.backToForm')}
                </button>
                <button className="btn-primary" onClick={handleDownloadPDF} style={styles.actionBtn}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="6 9 6 2 18 2 18 9"></polyline>
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                        <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                    {t('result.downloadReport') || 'Download PDF Report'}
                </button>
            </div>

            {/* Printable Report Card */}
            <div id="report-card" className="glass-card" style={styles.reportCard}>
                {/* Header (Visible on print & web) */}
                <div style={{ ...styles.reportHeader, flexDirection: 'column', alignItems: 'stretch' }}>
                    {/* Brand Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.2rem' }}>
                        <div style={{ color: '#10b981', display: 'flex', alignItems: 'center' }}>
                            <svg viewBox="0 0 48 48" fill="currentColor" width="28" height="28">
                                <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" />
                            </svg>
                        </div>
                        <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>GreenSteward</span>
                    </div>
                    {/* Information Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                        <div>
                            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{t('result.title')}</h2>
                            <p style={{ fontSize: '0.85rem' }}>{t('result.subtitle')}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={styles.dateStamp}>{t('result.date')}: {new Date().toLocaleDateString()}</span>
                            <span style={{ ...styles.dateStamp, display: 'block', fontSize: '0.75rem', color: '#10b981' }}>{t('result.locationLabel')}: {tState(location)}</span>
                        </div>
                    </div>
                </div>

                {/* Split Column: Recommended Fertilizer, Expected Yield & Confidence */}
                <div style={styles.splitLayout}>
                    <div style={styles.metricCard}>
                        <span style={styles.cardLabel}>{t('result.recommendedProduct')}</span>
                        <h1 style={styles.fertName}>{tFertilizer(currentFertilizer)}</h1>
                        <div style={styles.dosageBadge}>
                            {t('result.dosage')}: {tDosage(currentQuantity)}
                        </div>
                    </div>

                    <div style={styles.metricCard}>
                        <span style={styles.cardLabel}>{t('result.expectedYield')}</span>
                        <h1 style={styles.yieldVal}>{currentYield} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-muted)' }}>tons/acre</span></h1>
                        <div style={styles.yieldBadge}>
                            🌾 Est. Harvest Potential
                        </div>
                    </div>

                    <div className="no-print" style={styles.metricCard}>
                        <span style={styles.cardLabel}>{t('result.aiConfidence')}</span>
                        <div style={styles.gaugeWrapper}>
                            <svg viewBox="0 0 36 36" style={styles.gaugeSvg}>
                                <path
                                    style={styles.gaugeTrack}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                    style={{
                                        ...styles.gaugeFill,
                                        strokeDasharray: `${confidencePct}, 100`
                                    }}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <text x="18" y="20.35" style={styles.gaugeText}>{confidencePct}%</text>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Input Parameters Summary Table */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>{t('result.inputMetrics')}</h3>
                    <div style={styles.tableGrid}>
                        <div style={styles.tableCell}>
                            <span style={styles.tableCellLabel}>{t('form.nitrogen')}</span>
                            <span style={styles.tableCellVal}>{sliderN} mg/kg</span>
                        </div>
                        <div style={styles.tableCell}>
                            <span style={styles.tableCellLabel}>{t('form.phosphorus')}</span>
                            <span style={styles.tableCellVal}>{sliderP} mg/kg</span>
                        </div>
                        <div style={styles.tableCell}>
                            <span style={styles.tableCellLabel}>{t('form.potassium')}</span>
                            <span style={styles.tableCellVal}>{sliderK} mg/kg</span>
                        </div>
                        <div style={styles.tableCell}>
                            <span style={styles.tableCellLabel}>{t('form.ph')}</span>
                            <span style={styles.tableCellVal}>{sliderPh}</span>
                        </div>
                        <div style={styles.tableCell}>
                            <span style={styles.tableCellLabel}>{t('form.carbon')}</span>
                            <span style={styles.tableCellVal}>{sliderOc}%</span>
                        </div>
                        <div style={styles.tableCell}>
                            <span style={styles.tableCellLabel}>{t('form.soilType')}</span>
                            <span style={styles.tableCellVal}>{tSoilType(soilType)}</span>
                        </div>
                        <div style={styles.tableCell}>
                            <span style={styles.tableCellLabel}>{t('result.targetCrop')}</span>
                            <span style={styles.tableCellVal}>{tCrop(cropName)}</span>
                        </div>
                        <div style={styles.tableCell}>
                            <span style={styles.tableCellLabel}>{t('result.temp')}</span>
                            <span style={styles.tableCellVal}>{temperature}°C</span>
                        </div>
                        <div style={styles.tableCell}>
                            <span style={styles.tableCellLabel}>{t('result.humidity')}</span>
                            <span style={styles.tableCellVal}>{humidity}%</span>
                        </div>
                    </div>
                </div>

                {/* Scientific Explanation */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>{t('result.diagnostic')}</h3>
                    <p style={styles.explanationText}>{getExplanationTranslation(descText)}</p>
                </div>

                {/* Guidelines */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>{t('result.guidelines')}</h3>
                    <div style={styles.tipsBox}>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent)" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '2px' }}>
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <p style={styles.tipsText}>{getTipsTranslation(tipsText)}</p>
                    </div>
                </div>

                {/* Sign-off footer (looks good on official reports) */}
                <div style={styles.reportFooter}>
                    <div style={styles.footerLine}></div>
                    <span>{t('result.signature')}</span>
                </div>
            </div> {/* END OF #report-card */}

            {/* Interactive Yield Optimizer Simulator Block (Visible on web, omitted from printable PDF) */}
            <div className="no-print" style={{ ...styles.section, marginTop: '2.5rem', padding: '1.8rem', background: 'rgba(0,0,0,0.18)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ ...styles.sectionTitle, borderBottom: 'none', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    💡 Yield Optimizer & Simulator
                    {loadingYield && <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: 'var(--accent)' }}></div>}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                    Simulate changing your field soil parameters dynamically. Drag the ranges to trigger live crop yield and fertilizer recommendations.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {/* N Slider */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{t('form.nitrogen')}</span>
                            <span style={{ color: 'var(--accent)' }}>{sliderN} mg/kg</span>
                        </label>
                        <input 
                            type="range" min="10" max="500" step="1" 
                            value={sliderN} 
                            onChange={(e) => setSliderN(e.target.value)}
                            onMouseUp={() => triggerRecalculate(sliderN, sliderP, sliderK, sliderPh, sliderOc, sliderMoisture)}
                            onTouchEnd={() => triggerRecalculate(sliderN, sliderP, sliderK, sliderPh, sliderOc, sliderMoisture)}
                            style={{ width: '100%' }}
                        />
                    </div>

                    {/* P Slider */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{t('form.phosphorus')}</span>
                            <span style={{ color: 'var(--accent)' }}>{sliderP} mg/kg</span>
                        </label>
                        <input 
                            type="range" min="5" max="150" step="1" 
                            value={sliderP} 
                            onChange={(e) => setSliderP(e.target.value)}
                            onMouseUp={() => triggerRecalculate(sliderN, sliderP, sliderK, sliderPh, sliderOc, sliderMoisture)}
                            onTouchEnd={() => triggerRecalculate(sliderN, sliderP, sliderK, sliderPh, sliderOc, sliderMoisture)}
                            style={{ width: '100%' }}
                        />
                    </div>

                    {/* K Slider */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{t('form.potassium')}</span>
                            <span style={{ color: 'var(--accent)' }}>{sliderK} mg/kg</span>
                        </label>
                        <input 
                            type="range" min="50" max="800" step="1" 
                            value={sliderK} 
                            onChange={(e) => setSliderK(e.target.value)}
                            onMouseUp={() => triggerRecalculate(sliderN, sliderP, sliderK, sliderPh, sliderOc, sliderMoisture)}
                            onTouchEnd={() => triggerRecalculate(sliderN, sliderP, sliderK, sliderPh, sliderOc, sliderMoisture)}
                            style={{ width: '100%' }}
                        />
                    </div>

                    {/* pH Slider */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{t('form.ph')}</span>
                            <span style={{ color: 'var(--accent)' }}>{sliderPh}</span>
                        </label>
                        <input 
                            type="range" min="3.5" max="9.0" step="0.1" 
                            value={sliderPh} 
                            onChange={(e) => setSliderPh(e.target.value)}
                            onMouseUp={() => triggerRecalculate(sliderN, sliderP, sliderK, sliderPh, sliderOc, sliderMoisture)}
                            onTouchEnd={() => triggerRecalculate(sliderN, sliderP, sliderK, sliderPh, sliderOc, sliderMoisture)}
                            style={{ width: '100%' }}
                        />
                    </div>

                    {/* OC Slider */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{t('form.carbon')}</span>
                            <span style={{ color: 'var(--accent)' }}>{sliderOc}%</span>
                        </label>
                        <input 
                            type="range" min="0.10" max="2.50" step="0.01" 
                            value={sliderOc} 
                            onChange={(e) => setSliderOc(e.target.value)}
                            onMouseUp={() => triggerRecalculate(sliderN, sliderP, sliderK, sliderPh, sliderOc, sliderMoisture)}
                            onTouchEnd={() => triggerRecalculate(sliderN, sliderP, sliderK, sliderPh, sliderOc, sliderMoisture)}
                            style={{ width: '100%' }}
                        />
                    </div>

                    {/* Moisture Slider */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{t('form.moisture')}</span>
                            <span style={{ color: 'var(--accent)' }}>{sliderMoisture}%</span>
                        </label>
                        <input 
                            type="range" min="10" max="90" step="1" 
                            value={sliderMoisture} 
                            onChange={(e) => setSliderMoisture(e.target.value)}
                            onMouseUp={() => triggerRecalculate(sliderN, sliderP, sliderK, sliderPh, sliderOc, sliderMoisture)}
                            onTouchEnd={() => triggerRecalculate(sliderN, sliderP, sliderK, sliderPh, sliderOc, sliderMoisture)}
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    actionBar: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        gap: '1rem'
    },
    actionBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.7rem 1.4rem'
    },
    reportCard: {
        borderRadius: '24px',
        padding: '1.8rem 2.2rem'
    },
    reportHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px dashed var(--border-color)',
        paddingBottom: '0.8rem',
        marginBottom: '1rem'
    },
    dateStamp: {
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--text-muted)'
    },
    splitLayout: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        alignItems: 'stretch',
        marginBottom: '2rem'
    },
    metricCard: {
        background: 'rgba(16, 185, 129, 0.04)',
        border: '1px solid rgba(16, 185, 129, 0.15)',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    cardLabel: {
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.5rem'
    },
    fertName: {
        fontSize: '2.4rem',
        fontWeight: 800,
        color: 'var(--accent)',
        lineHeight: 1.1,
        marginBottom: '0.5rem',
        fontFamily: "'Outfit', sans-serif"
    },
    dosageBadge: {
        fontSize: '1rem',
        fontWeight: 700,
        background: 'rgba(16, 185, 129, 0.1)',
        color: 'var(--accent)',
        padding: '0.4rem 1rem',
        borderRadius: '8px',
        border: '1px solid rgba(16, 185, 129, 0.2)'
    },
    yieldVal: {
        fontSize: '2.4rem',
        fontWeight: 800,
        color: 'var(--accent)',
        lineHeight: 1.1,
        marginBottom: '0.5rem',
        fontFamily: "'Outfit', sans-serif"
    },
    yieldBadge: {
        fontSize: '1rem',
        fontWeight: 700,
        background: 'rgba(245, 158, 11, 0.1)',
        color: '#F59E0B',
        padding: '0.4rem 1rem',
        borderRadius: '8px',
        border: '1px solid rgba(245, 158, 11, 0.2)'
    },
    gaugeWrapper: {
        width: '120px',
        height: '120px'
    },
    gaugeSvg: {
        width: '100%',
        height: '100%'
    },
    gaugeTrack: {
        fill: 'none',
        stroke: '#eceff1',
        strokeWidth: 3.5
    },
    gaugeFill: {
        fill: 'none',
        stroke: '#10b981',
        strokeWidth: 3.5,
        strokeLinecap: 'round',
        transition: 'stroke-dasharray 0.8s ease'
    },
    gaugeText: {
        fill: '#111827',
        fontFamily: "'Outfit', sans-serif",
        fontSize: '9px',
        fontWeight: 800,
        textAnchor: 'middle'
    },
    section: {
        marginBottom: '1rem'
    },
    sectionTitle: {
        fontSize: '1.1rem',
        fontWeight: 700,
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.4rem',
        marginBottom: '0.6rem'
    },
    tableGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.8rem',
        background: 'rgba(0,0,0,0.15)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '0.85rem'
    },
    tableCell: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2rem'
    },
    tableCellLabel: {
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        fontWeight: 500
    },
    tableCellVal: {
        fontSize: '0.95rem',
        fontWeight: 700,
        color: 'var(--text-main)'
    },
    explanationText: {
        fontSize: '0.95rem',
        lineHeight: 1.6,
        color: 'var(--text-main)'
    },
    tipsBox: {
        background: 'hsla(150, 84%, 39%, 0.06)',
        border: '1px solid rgba(16, 185, 129, 0.15)',
        borderRadius: '12px',
        padding: '1.2rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start'
    },
    tipsText: {
        fontSize: '0.9rem',
        color: 'var(--text-main)',
        margin: 0
    },
    reportFooter: {
        marginTop: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.75rem'
    },
    footerLine: {
        width: '180px',
        height: '1px',
        background: 'var(--border-color)',
        marginBottom: '0.4rem'
    }
};

export default RecommendationResult;
