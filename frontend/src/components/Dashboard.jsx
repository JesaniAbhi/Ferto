import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const Dashboard = ({ setActiveTab, setResultData }) => {
    const { fetchWithAuth } = useAuth();
    const { t, tCrop, tState, tFertilizer, tStage, tDosage, language } = useLanguage();
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRecalibrating, setIsRecalibrating] = useState(false);
    const [calibrationMessage, setCalibrationMessage] = useState(null);
    const [calibrationOffset, setCalibrationOffset] = useState({ n: 0, p: 0, k: 0 });
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Weather and visual chart states
    const [weatherLocation, setWeatherLocation] = useState('Punjab');
    const [weatherData, setWeatherData] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState(null);
    const [hoverForecastIndex, setHoverForecastIndex] = useState(null);
    const [hoverMoistureIndex, setHoverMoistureIndex] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStartX, setTouchStartX] = useState(null);
    
    // Auto-play slides every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleSwipeStart = (e) => {
        setTouchStartX(e.touches ? e.touches[0].clientX : e.clientX);
    };

    const handleSwipeEnd = (e) => {
        if (!touchStartX) return;
        const currentX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const diff = touchStartX - currentX;
        if (diff > 40) {
            // Swiped left
            setCurrentSlide((prev) => (prev + 1) % 3);
        } else if (diff < -40) {
            // Swiped right
            setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1));
        }
        setTouchStartX(null);
    };

    const handleRecalibrate = () => {
        if (isRecalibrating) return;
        setIsRecalibrating(true);
        setCalibrationMessage("Recalibrating soil sensors...");
        
        setTimeout(() => {
            setCalibrationMessage("Adjusting NPK baseline filters...");
        }, 800);

        setTimeout(() => {
            const randomOffsetN = Math.floor(Math.random() * 5) - 2;
            const randomOffsetP = Math.floor(Math.random() * 5) - 2;
            const randomOffsetK = Math.floor(Math.random() * 5) - 2;
            
            setCalibrationOffset({
                n: randomOffsetN,
                p: randomOffsetP,
                k: randomOffsetK
            });
            
            setIsRecalibrating(false);
            setCalibrationMessage(null);
            setShowSuccessToast(true);
            setTimeout(() => {
                setShowSuccessToast(false);
            }, 3000);
        }, 1800);
    };

    const loadWeatherData = async (locName) => {
        setWeatherLoading(true);
        setWeatherError(null);
        try {
            const res = await fetchWithAuth(`/api/weather?location=${encodeURIComponent(locName)}`);
            if (res.ok) {
                const data = await res.json();
                setWeatherData(data);
            } else {
                throw new Error("Failed to fetch weather data.");
            }
        } catch (err) {
            setWeatherError(err.message);
        } finally {
            setWeatherLoading(false);
        }
    };

    const handleWeatherLocationChange = (newLoc) => {
        setWeatherLocation(newLoc);
        loadWeatherData(newLoc);
    };

    const loadDashboardData = async () => {
        try {
            // Fetch stats
            const statsRes = await fetchWithAuth('/api/dashboard/stats');
            const statsData = await statsRes.json();
            setStats(statsData);

            // Fetch history
            const historyRes = await fetchWithAuth('/api/recommendations/history');
            const historyData = await historyRes.json();
            setHistory(historyData);

            // Select default weather location from latest recommendation, or 'Punjab'
            let defaultLoc = 'Punjab';
            if (historyData && historyData.length > 0) {
                defaultLoc = historyData[0].location || 'Punjab';
            }
            setWeatherLocation(defaultLoc);
            loadWeatherData(defaultLoc);
        } catch (err) {
            setError("Error loading control room data: " + err.message);
            setWeatherLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            const res = await fetchWithAuth(`/api/recommendations/history/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                // Reload dashboard data
                loadDashboardData();
            } else {
                throw new Error("Failed to delete record.");
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const handleViewDetails = (record) => {
        setResultData(record);
        setActiveTab('result');
    };

    if (loading) {
        return (
            <div style={styles.centerContainer}>
                <div className="spinner"></div>
                <p style={{ marginTop: '1rem', fontFamily: '"Hanken Grotesk", sans-serif' }}>{t('dashboard.connecting')}</p>
            </div>
        );
    }

    // Default averages if no history exists yet
    const nVal = (stats?.avgNitrogen || 65) + calibrationOffset.n;
    const pVal = (stats?.avgPhosphorus || 50) + calibrationOffset.p;
    const kVal = (stats?.avgPotassium || 60) + calibrationOffset.k;
    
    const latestRec = history.length > 0 ? history[0] : null;

    const phVal = latestRec ? latestRec.ph : (stats?.avgPh || 6.5);
    const ocVal = latestRec ? latestRec.organicCarbon : (stats?.avgOrganicCarbon || 0.60);

    // Soil Vitality Score calculation
    let healthScore = 100;
    healthScore -= Math.min(30, Math.abs(phVal - 6.5) * 15);
    if (ocVal < 0.8) {
        healthScore -= Math.min(25, (0.8 - ocVal) * 50);
    }
    const nTargetDiff = Math.max(0, 50 - nVal) + Math.max(0, nVal - 90);
    const pTargetDiff = Math.max(0, 40 - pVal) + Math.max(0, pVal - 70);
    const kTargetDiff = Math.max(0, 45 - kVal) + Math.max(0, kVal - 85);
    healthScore -= Math.min(20, nTargetDiff * 0.5);
    healthScore -= Math.min(15, pTargetDiff * 0.5);
    healthScore -= Math.min(10, kTargetDiff * 0.5);
    healthScore = Math.max(40, Math.round(healthScore));

    let healthStatus = "Excellent";
    let healthColor = "#10b981";
    let healthBg = "rgba(16, 185, 129, 0.1)";
    if (healthScore < 60) {
        healthStatus = language === 'hi' ? "ध्यान दें" : "Needs Attention";
        healthColor = "#ef4444";
        healthBg = "rgba(239, 68, 68, 0.1)";
    } else if (healthScore < 85) {
        healthStatus = language === 'hi' ? "अच्छा संतुलन" : "Good Balance";
        healthColor = "#f59e0b";
        healthBg = "rgba(245, 158, 11, 0.1)";
    } else {
        healthStatus = language === 'hi' ? "उत्कृष्ट" : "Excellent";
    }

    const moistureHistoryData = [60, 65, 70, 62, 58, 75, 80, 78, 85, 90, 88, 92, 85, latestRec ? latestRec.moisture : (stats?.avgMoisture || 45)];
    const chartJSLabels = moistureHistoryData.map((_, idx) => idx === 13 ? (language === 'hi' ? 'आज' : 'Today') : `${13 - idx}d`);

    const chartJSData = {
        labels: chartJSLabels,
        datasets: [
            {
                label: 'Moisture (%)',
                data: moistureHistoryData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                tension: 0.35,
                fill: true,
                borderWidth: 2,
                pointRadius: 2,
                pointHoverRadius: 5,
                pointBackgroundColor: '#10b981'
            }
        ]
    };

    const chartJSOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(27, 48, 34, 0.95)',
                titleColor: '#fff',
                bodyColor: '#e0e0e0',
                borderColor: 'rgba(16, 185, 129, 0.2)',
                borderWidth: 1
            }
        },
        scales: {
            y: {
                min: 0,
                max: 100,
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)'
                },
                ticks: {
                    color: '#8b9a8f',
                    font: {
                        size: 9
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#8b9a8f',
                    font: {
                        size: 8
                    }
                }
            }
        }
    };

    return (
        <div style={styles.dashboardContainer} className="dashboard-container-res animate-fade-in">
            <style dangerouslySetInnerHTML={{__html: `
                .dashboard-container-res {
                    width: 100% !important;
                    padding: 1.5rem 1.5rem !important;
                    gap: 2rem !important;
                }
                .grid-row-res {
                    display: grid !important;
                    grid-template-columns: 1.2fr 0.8fr !important;
                    gap: 2.2rem !important;
                }
                .insights-row-res {
                    display: grid !important;
                    grid-template-columns: 1fr 1fr !important;
                    gap: 2.2rem !important;
                }
                .weather-split-res {
                    display: grid !important;
                    grid-template-columns: 0.9fr 1.1fr !important;
                    gap: 1.5rem !important;
                    align-items: stretch;
                }
                .moisture-content-res {
                    display: grid !important;
                    grid-template-columns: 0.8fr 1.2fr !important;
                    gap: 2rem !important;
                    align-items: center;
                    flex: 1;
                }
                .hero-banner-res {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: flex-end !important;
                    padding: 2.5rem !important;
                    height: 300px !important;
                }
                .gauges-container-res {
                    display: flex !important;
                    justify-content: space-around !important;
                    align-items: center !important;
                    padding: 1rem 0 !important;
                }
                .table-wrapper-res {
                    overflow-x: auto !important;
                    width: 100% !important;
                }
                .table-wrapper-res table {
                    min-width: 650px !important;
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); text-shadow: 0 0 10px rgba(16, 185, 129, 0); }
                    50% { transform: scale(1.08); text-shadow: 0 0 20px rgba(16, 185, 129, 0.2); }
                    100% { transform: scale(1); text-shadow: 0 0 10px rgba(16, 185, 129, 0); }
                }
                .weather-pulse {
                    display: inline-block;
                    animation: pulse 4s ease-in-out infinite;
                }

                @keyframes growBar {
                    from { transform: scaleY(0); }
                    to { transform: scaleY(1); }
                }
                .chart-bar-grow {
                    transform-origin: bottom;
                    animation: growBar 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                
                @media (max-width: 768px) {
                    .dashboard-container-res {
                        padding: 1rem 0.75rem !important;
                        gap: 1.2rem !important;
                    }
                    .grid-row-res, .insights-row-res {
                        grid-template-columns: 1fr !important;
                        gap: 1.2rem !important;
                    }
                    .weather-split-res, .moisture-content-res {
                        grid-template-columns: 1fr !important;
                        gap: 1.2rem !important;
                    }
                    .hero-banner-res {
                        flex-direction: column !important;
                        align-items: stretch !important;
                        justify-content: flex-end !important;
                        height: auto !important;
                        gap: 1.2rem !important;
                        padding: 1.5rem !important;
                    }
                    .hero-banner-res button {
                        width: 100% !important;
                        padding: 0.9rem !important;
                    }
                    .gauges-container-res {
                        flex-direction: column !important;
                        gap: 1.5rem !important;
                        padding: 0.5rem 0 !important;
                    }
                    .gauge-item-res {
                        width: 100% !important;
                        border-bottom: 1px dashed rgba(195, 200, 193, 0.4);
                        padding-bottom: 1rem;
                    }
                    .gauge-item-res:last-child {
                        border-bottom: none !important;
                        padding-bottom: 0 !important;
                    }
                }
            `}} />

            {/* Hero Banner Section */}
            <section style={styles.heroBanner} className="hero-banner-res">
                <div style={styles.heroImageOverlay} />
                <div style={styles.heroContent}>
                    <span style={styles.heroBadge}>{t('dashboard.activeMonitoring')}</span>
                    <h2 style={styles.heroTitle}>
                        {latestRec ? `${tState(latestRec.location)} ${t('dashboard.fieldOps')}: ${tCrop(latestRec.cropName)}` : t('dashboard.centralWheat')}
                    </h2>
                    <p style={styles.heroSubtitle}>
                        {latestRec 
                            ? `${t('dashboard.latestRec')}: ${tFertilizer(latestRec.predictedFertilizer)} (${tDosage(latestRec.recommendedQuantity)}). ${t('form.growthStage')}: ${tStage(latestRec.growthStage || 'Vegetative')}.`
                            : t('dashboard.stableStage')}
                    </p>
                </div>
                <button 
                    style={styles.heroBtn} 
                    onClick={() => setActiveTab('form')}
                >
                    {t('dashboard.runScan')}
                </button>
            </section>

            {/* Middle Grid */}
            <div style={styles.gridRow} className="grid-row-res">
                {/* NPK Dashboard Section */}
                <div style={styles.npkCard} className="glass-card">
                    {isRecalibrating && (
                        <div style={styles.calibrationOverlay}>
                            <div className="spinner" style={styles.overlaySpinner}></div>
                            <p style={styles.overlayText}>{t('dashboard.recalibrating')}</p>
                        </div>
                    )}
                    
                    {showSuccessToast && (
                        <div style={styles.toastNotification}>
                            ✓ {t('dashboard.calibrationSuccess')}
                        </div>
                    )}
                    
                    <div style={styles.npkHeader}>
                        <h3 style={styles.sectionTitle}>{t('dashboard.nutrientBalance')}</h3>
                        <button 
                            style={{
                                ...styles.recalibrateBtn,
                                border: 'none',
                                background: 'transparent',
                                cursor: isRecalibrating ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                            onClick={handleRecalibrate}
                            disabled={isRecalibrating}
                            title="Calibrate NPK sensors"
                        >
                            🔄 {isRecalibrating ? t('dashboard.recalibrating') : t('dashboard.recalibrateSensors')}
                        </button>
                    </div>
                    
                    <div style={styles.gaugesContainer} className="gauges-container-res">
                        {/* Nitrogen Gauge */}
                        <div style={styles.gaugeItem} className="gauge-item-res">
                            <div style={styles.gaugeWrapper}>
                                <svg style={styles.svgCircle} viewBox="0 0 100 100">
                                    <circle style={styles.circleBg} cx="50" cy="50" r="40" />
                                    <circle 
                                        style={{
                                            ...styles.circleFill,
                                            stroke: '#0b2013',
                                            strokeDashoffset: 251.2 - (251.2 * Math.min(100, nVal)) / 140
                                        }} 
                                        cx="50" 
                                        cy="50" 
                                        r="40" 
                                    />
                                    <text style={styles.gaugeText} x="50" y="55">{Math.round(nVal)}</text>
                                </svg>
                            </div>
                            <span style={styles.gaugeLabel}>{t('form.nitrogen')}</span>
                            <span style={styles.gaugeSub}>{t('dashboard.optimalRange')}</span>
                        </div>

                        {/* Phosphorus Gauge */}
                        <div style={styles.gaugeItem} className="gauge-item-res">
                            <div style={styles.gaugeWrapper}>
                                <svg style={styles.svgCircle} viewBox="0 0 100 100">
                                    <circle style={styles.circleBg} cx="50" cy="50" r="40" />
                                    <circle 
                                        style={{
                                            ...styles.circleFill,
                                            stroke: '#516447',
                                            strokeDashoffset: 251.2 - (251.2 * Math.min(100, pVal)) / 140
                                        }} 
                                        cx="50" 
                                        cy="50" 
                                        r="40" 
                                    />
                                    <text style={styles.gaugeText} x="50" y="55">{Math.round(pVal)}</text>
                                </svg>
                            </div>
                            <span style={styles.gaugeLabel}>{t('form.phosphorus')}</span>
                            <span style={styles.gaugeSub}>{t('dashboard.target')}</span>
                        </div>

                        {/* Potassium Gauge */}
                        <div style={styles.gaugeItem} className="gauge-item-res">
                            <div style={styles.gaugeWrapper}>
                                <svg style={styles.svgCircle} viewBox="0 0 100 100">
                                    <circle style={styles.circleBg} cx="50" cy="50" r="40" />
                                    <circle 
                                        style={{
                                            ...styles.circleFill,
                                            stroke: '#4d6453',
                                            strokeDashoffset: 251.2 - (251.2 * Math.min(100, kVal)) / 140
                                        }} 
                                        cx="50" 
                                        cy="50" 
                                        r="40" 
                                    />
                                    <text style={styles.gaugeText} x="50" y="55">{Math.round(kVal)}</text>
                                </svg>
                            </div>
                            <span style={styles.gaugeLabel}>{t('form.potassium')}</span>
                            <span style={styles.gaugeSub}>{t('form.saturated')}</span>
                        </div>
                    </div>

                    {/* New Soil Diagnostics & Vitality Score panel */}
                    <div style={styles.diagnosticsPanel}>
                        <div style={styles.diagnosticsDivider} />
                        <h4 style={styles.diagnosticsTitle}>🧪 {t('dashboard.soilDiagnostics')}</h4>
                        
                        <div style={styles.diagnosticsGrid}>
                            {/* Score Card */}
                            <div style={styles.diagCard}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ ...styles.scoreBadge, backgroundColor: healthBg, color: healthColor }}>
                                        {healthScore}
                                    </div>
                                    <div>
                                        <span style={styles.diagLabel}>{t('dashboard.vitalityScore')}</span>
                                        <span style={{ ...styles.diagValue, color: healthColor, fontSize: '0.74rem' }}>{healthStatus}</span>
                                    </div>
                                </div>
                            </div>

                            {/* pH Card */}
                            <div style={styles.diagCard}>
                                <div>
                                    <span style={styles.diagLabel}>{t('form.ph')}</span>
                                    <span style={styles.diagValue}>{phVal.toFixed(1)} <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>({phVal < 6.0 ? t('form.acidic') : phVal > 7.2 ? t('form.alkaline') : t('form.neutral')})</span></span>
                                </div>
                            </div>

                            {/* Carbon Card */}
                            <div style={styles.diagCard}>
                                <div>
                                    <span style={styles.diagLabel}>{t('form.carbon')}</span>
                                    <span style={styles.diagValue}>{ocVal.toFixed(2)}% <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>({ocVal < 0.45 ? t('form.criticallyLow') : ocVal < 0.7 ? t('form.good') : t('form.rich')})</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Agronomic Advice text */}
                        <div style={{ ...styles.adviceBox, borderLeft: `4px solid ${healthColor}` }}>
                            <span style={{ ...styles.adviceHeader, color: healthColor }}>📢 {t('dashboard.agronomicAdvice')}</span>
                            <p style={styles.adviceText}>
                                {(() => {
                                    const isHindi = language === 'hi';
                                    if (healthScore >= 85) {
                                        return isHindi 
                                            ? "संतुलित पीएच और जैविक कार्बन के साथ उत्कृष्ट पोषक तत्व। मिट्टी उच्च सजीवता और जैव-गतिविधि दिखाती है। वर्तमान कृषि प्रथाओं को बनाए रखें।"
                                            : "Excellent nutrient profile with balanced pH & Organic Carbon. The soil shows high vitality and bio-activity. Maintain current agricultural practices.";
                                    } else if (healthScore >= 60) {
                                        return isHindi
                                            ? "अच्छी बुनियादी संरचना। हल्का एनपीके (NPK) असंतुलन पाया गया। उपज को अनुकूलित करने के लिए मामूली नाइट्रोजन पूरकता या जैविक पदार्थ डालने पर विचार करें।"
                                            : "Good baseline composition. Slight NPK imbalance detected. Consider minor nitrogen replenishment or organic matter top-up to optimize yield.";
                                    } else {
                                        return isHindi
                                            ? "गंभीर पोषक तत्वों की कमी या मिट्टी का पीएच असंतुलन पाया गया। तत्काल मिट्टी सुधार की सलाह दी जाती है। अनुशंसित उर्वरक खुराक का बारीकी से पालन करें।"
                                            : "Critical nutrient depletion or soil pH imbalance detected. Immediate soil remediation is advised. Follow the recommended fertilizer dosing guide closely.";
                                    }
                                })()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Local Weather Forecast Showcase */}
                <div style={styles.weatherCard} className="glass-card">
                    <div style={styles.weatherCardHeader}>
                        <h3 style={styles.sectionTitle}>{t('dashboard.localForecast')}</h3>
                        <select 
                            value={weatherLocation} 
                            onChange={(e) => handleWeatherLocationChange(e.target.value)}
                            style={styles.weatherSelect}
                        >
                            {["Punjab", "Andhra Pradesh", "Maharashtra", "Assam", "Karnataka", "Gujarat", "Rajasthan", "Tamil Nadu", "Uttar Pradesh", "West Bengal"].map(loc => (
                                <option key={loc} value={loc}>{tState(loc)}</option>
                            ))}
                        </select>
                    </div>

                    {weatherLoading ? (
                        <div style={styles.weatherLoadingContainer}>
                            <div className="spinner"></div>
                        </div>
                    ) : weatherError ? (
                        <div style={styles.weatherErrorContainer}>
                            <p style={{ color: 'var(--danger)', fontWeight: 600 }}>⚠️ {weatherError}</p>
                            <button onClick={() => loadWeatherData(weatherLocation)} style={styles.weatherRetryBtn}>
                                🔄 Retry
                            </button>
                        </div>
                    ) : weatherData ? (
                        <div style={styles.weatherContent}>
                            <div style={styles.weatherSplit} className="weather-split-res">
                                {/* Current Conditions Column */}
                                <div style={styles.currentWeatherColumn}>
                                    <span style={styles.largeWeatherIcon} className="weather-pulse">{weatherData.current.icon}</span>
                                    <div style={styles.largeTemp}>{weatherData.current.temperature}°C</div>
                                    <span style={styles.currentWeatherDesc}>{weatherData.current.description}</span>
                                    
                                    <div style={styles.miniStatsGrid}>
                                        <div style={styles.miniStatItem}>
                                            <span style={styles.miniStatLabel}>💧 Humidity</span>
                                            <span style={styles.miniStatValue}>{weatherData.current.humidity}%</span>
                                        </div>
                                        <div style={styles.miniStatItem}>
                                            <span style={styles.miniStatLabel}>💨 Wind</span>
                                            <span style={styles.miniStatValue}>{weatherData.current.windSpeed} km/h</span>
                                        </div>
                                        <div style={styles.miniStatItem}>
                                            <span style={styles.miniStatLabel}>☀️ UV Index</span>
                                            <span style={styles.miniStatValue}>{weatherData.current.uvIndex}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 5-Day Forecast Column */}
                                <div style={styles.forecastColumn}>
                                    <div style={styles.weatherList}>
                                        {weatherData.forecast.map((w, i) => (
                                            <div 
                                                key={i} 
                                                style={{
                                                    ...styles.weatherItem,
                                                    ...(hoverForecastIndex === i ? styles.weatherItemActive : {})
                                                }}
                                                onMouseEnter={() => setHoverForecastIndex(i)}
                                                onMouseLeave={() => setHoverForecastIndex(null)}
                                            >
                                                <span style={styles.weatherDay}>{w.day}</span>
                                                <span style={styles.weatherIcon}>{w.icon}</span>
                                                <div style={styles.weatherTemps}>
                                                    <span style={styles.tempMax}>{w.tempMax}</span>
                                                    <span style={styles.tempMin}>{w.tempMin}</span>
                                                </div>
                                                <span style={styles.weatherDesc}>{w.desc}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Forecast Hover Detail Area */}
                                    <div style={styles.forecastDetailArea}>
                                        {hoverForecastIndex !== null ? (
                                            <p style={styles.forecastDetailText}>
                                                📊 <strong>{weatherData.forecast[hoverForecastIndex].day} Details:</strong> Humidity: {weatherData.forecast[hoverForecastIndex].humidity}% | Rain: {weatherData.forecast[hoverForecastIndex].rainfall}mm
                                            </p>
                                        ) : (
                                            <p style={{ ...styles.forecastDetailText, color: 'var(--text-muted)' }}>
                                                💡 Hover over a day to view rainfall & humidity trends
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Smart Agricultural Advisory */}
                            <div style={{
                                ...styles.weatherAdvisoryBox,
                                ...(() => {
                                    const hum = weatherData.current.humidity;
                                    const temp = weatherData.current.temperature;
                                    const willRain = weatherData.forecast.some(f => f.desc.toLowerCase().includes("shower") || f.desc.toLowerCase().includes("rain") || parseFloat(f.rainfall) > 5);
                                    
                                    if (hum > 80 || weatherData.current.description.toLowerCase().includes("rain")) {
                                        return { background: 'rgba(186, 26, 26, 0.08)', border: '1px solid rgba(186, 26, 26, 0.25)', color: 'var(--danger)' };
                                    } else if (willRain) {
                                        return { background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', color: '#1e3a8a' };
                                    } else if (temp > 32) {
                                        return { background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', color: '#78350f' };
                                    } else {
                                        return { background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', color: 'var(--success)' };
                                    }
                                })()
                            }}>
                                <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>🌾 Agricultural Advisory</span>
                                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.4, fontWeight: 500 }}>
                                    {(() => {
                                        const current = weatherData.current;
                                        const willRain = weatherData.forecast.some(f => f.desc.toLowerCase().includes("shower") || f.desc.toLowerCase().includes("rain") || parseFloat(f.rainfall) > 5);
                                        
                                        if (current.humidity > 80 || current.description.toLowerCase().includes("rain")) {
                                            return "Heavy rainfall detected. Delay urea/fertilizer top-dressing to prevent runoff. Inspect fields for waterlogging and potential fungal infections.";
                                        } else if (willRain) {
                                            return "Rain forecasted within 48 hours. Postpone foliar nutrient sprays. Excellent opportunity for basal dosing if soil moisture is dry.";
                                        } else if (current.temperature > 32) {
                                            return "High heat index. Ensure adequate crop watering and soil moisture to prevent thermal stress during peak growth stages.";
                                        } else if (current.humidity < 40) {
                                            return "Dry winds and low humidity. Water evaporation rate is high. Monitor soil moisture closely to avoid crop wilt.";
                                        } else {
                                            return "Balanced climate indexes. Nutrient absorption rates are optimal. Proceed with standard fertilizer dosing according to crop plan.";
                                        }
                                    })()}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Soil Vitality & Field Insights */}
            <div style={styles.insightsRow} className="insights-row-res">
                {/* Soil Moisture Command Center */}
                <div style={styles.chartBlock} className="glass-card">
                    <div style={styles.chartHeader}>
                        <div>
                            <h3 style={styles.sectionTitle}>{t('dashboard.soilMoistureTrends')}</h3>
                            <p style={styles.chartSub}>{t('dashboard.biometricHistory')}</p>
                        </div>
                        <div style={styles.chartLegend}>
                            <span style={{ ...styles.legendColor, background: '#10b981' }} />
                            <span style={styles.legendText}>{t('dashboard.moistPct')}</span>
                        </div>
                    </div>

                    <div style={styles.moistureContent} className="moisture-content-res">
                        {/* Left Gauge Column */}
                        <div style={styles.moistureGaugeColumn}>
                            <div style={styles.moistureGaugeWrapper}>
                                <svg style={styles.svgCircle} viewBox="0 0 100 100">
                                    <circle style={styles.circleBg} cx="50" cy="50" r="40" />
                                    <circle 
                                        style={{
                                            ...styles.circleFill,
                                            stroke: (() => {
                                                const val = latestRec ? latestRec.moisture : (stats?.avgMoisture || 45);
                                                if (val < 35) return '#f59e0b';
                                                if (val > 70) return '#3b82f6';
                                                return '#10b981';
                                            })(),
                                            strokeDashoffset: 251.2 - (251.2 * Math.min(100, latestRec ? latestRec.moisture : (stats?.avgMoisture || 45))) / 100
                                        }} 
                                        cx="50" 
                                        cy="50" 
                                        r="40" 
                                    />
                                    <text style={styles.gaugeText} x="50" y="56">
                                        {latestRec ? latestRec.moisture : Math.round(stats?.avgMoisture || 45)}%
                                    </text>
                                </svg>
                            </div>
                            
                            {/* Dynamic Status Alert */}
                            {(() => {
                                const val = latestRec ? latestRec.moisture : (stats?.avgMoisture || 45);
                                let tagStyle = {};
                                let text = "";
                                let adv = "";
                                let nextIrr = "";
                                
                                if (val < 35) {
                                    tagStyle = { background: 'rgba(245, 158, 11, 0.12)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.25)' };
                                    text = "⚠️ CRITICAL DRY";
                                    adv = "Irrigate immediately to avoid thermal stress.";
                                    nextIrr = "🚨 Urgent Watering Required";
                                } else if (val > 70) {
                                    tagStyle = { background: 'rgba(59, 130, 246, 0.12)', color: '#1d4ed8', border: '1px solid rgba(59, 130, 246, 0.25)' };
                                    text = "🌊 SATURATED WET";
                                    adv = "Soil is saturated. Suspend irrigation.";
                                    nextIrr = "📅 Suspend Watering for 3-4 days";
                                } else {
                                    tagStyle = { background: 'rgba(16, 185, 129, 0.12)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.25)' };
                                    text = "✓ OPTIMAL MOISTURE";
                                    adv = "Soil moisture is in the healthy zone.";
                                    nextIrr = "📅 Next Irrigation: ~ 2-3 Days";
                                }
                                
                                return (
                                    <div style={styles.moistureStatusWrapper}>
                                        <span style={{ ...styles.moistureStatusTag, ...tagStyle }}>{text}</span>
                                        <p style={styles.moistureAdvText}>{adv}</p>
                                        <div style={styles.nextIrrigationBox}>
                                            <span style={styles.nextIrrigationLabel}>Water Schedule</span>
                                            <span style={styles.nextIrrigationVal}>{nextIrr}</span>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Right Interactive Chart Column */}
                        <div style={styles.moistureChartColumn}>
                            <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                                <Line data={chartJSData} options={chartJSOptions} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Natural Language Insights */}
                <div style={styles.insightsCard}>
                    <div style={styles.insightsHeader}>
                        <span style={styles.insightsIcon}>🧠</span>
                        <h3 style={styles.insightsHeading}>KNOWLEDGE</h3>
                    </div>
                    
                    <div 
                        style={{ ...styles.insightsList, flex: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', cursor: 'grab', position: 'relative' }}
                        onTouchStart={handleSwipeStart}
                        onTouchEnd={handleSwipeEnd}
                        onMouseDown={handleSwipeStart}
                        onMouseUp={handleSwipeEnd}
                        onMouseLeave={handleSwipeEnd}
                    >
                        {/* Left/Right Arrows for easy clicking */}
                        <div style={{ position: 'absolute', width: '100%', display: 'flex', justifyContent: 'space-between', top: '50%', transform: 'translateY(-50%)', zIndex: 10, pointerEvents: 'none' }}>
                            <div 
                                style={{ padding: '10px', marginLeft: '-15px', color: '#10b981', cursor: 'pointer', pointerEvents: 'auto', fontSize: '1.2rem', opacity: 0.6 }}
                                onClick={() => setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1))}
                            >
                                ◀
                            </div>
                            <div 
                                style={{ padding: '10px', marginRight: '-15px', color: '#10b981', cursor: 'pointer', pointerEvents: 'auto', fontSize: '1.2rem', opacity: 0.6 }}
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
                            >
                                ▶
                            </div>
                        </div>

                        <div style={{ ...styles.insightItem, padding: '0 1.5rem', animation: 'fadeIn 0.5s ease-in-out' }}>
                            {currentSlide === 0 && (
                                <>
                                    <h4 style={{ color: '#10b981', margin: '0 0 12px 0', fontSize: '1.1rem' }}>🌱 Organic Farming</h4>
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', fontWeight: 500, lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <li>Relies on natural organic matter like compost, green manure, and bone meal which slowly release nutrients, enhancing soil structure and preventing nutrient leaching into nearby water sources.</li>
                                        <li>Promotes a highly active soil microbiome by encouraging earthworms and beneficial bacteria, leading to natural disease suppression and improved water retention in the root zone.</li>
                                        <li>Completely avoids synthetic pesticides and fertilizers, ensuring that the harvested crops are free from chemical residues and the local ecosystem maintains a healthy biodiversity.</li>
                                    </ul>
                                </>
                            )}
                            {currentSlide === 1 && (
                                <>
                                    <h4 style={{ color: '#3b82f6', margin: '0 0 12px 0', fontSize: '1.1rem' }}>🧪 Inorganic Farming</h4>
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', fontWeight: 500, lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <li>Utilizes manufactured synthetic fertilizers that provide an immediate and concentrated dose of essential macronutrients like Nitrogen, Phosphorus, and Potassium for rapid crop development.</li>
                                        <li>Maximizes short-term yields efficiently but requires extremely precise management and soil testing; over-application can lead to severe soil acidification, toxic nutrient runoff into waterways, and long-term degradation of the natural soil microbiome.</li>
                                    </ul>
                                </>
                            )}
                            {currentSlide === 2 && (
                                <>
                                    <h4 style={{ color: '#f59e0b', margin: '0 0 12px 0', fontSize: '1.1rem' }}>🍃 Natural Farming</h4>
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', fontWeight: 500, lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <li>A zero-chemical, ecological farming approach that strictly avoids tilling, weeding, and external fertilizers, relying entirely on the existing natural ecosystem to maintain long-term soil health.</li>
                                        <li>Cultivates a diverse polyculture environment where different plant species support each other through natural pest control, nitrogen fixation, and highly complex shared root networks.</li>
                                        <li>Offers high sustainability with minimal human intervention and zero input costs, though it may require a longer transition period for the soil to recover and reach optimal natural productivity.</li>
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: 'auto' }}>
                        {[0, 1, 2].map((idx) => (
                            <div 
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                style={{
                                    width: currentSlide === idx ? '16px' : '8px', 
                                    height: '8px', 
                                    borderRadius: '4px', 
                                    backgroundColor: currentSlide === idx ? '#10b981' : 'rgba(139, 154, 143, 0.3)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease-in-out'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>


            {/* Calculation History Table */}
            <section style={styles.historySection}>
                <h3 style={styles.sectionTitle}>{t('dashboard.scanHistory')}</h3>
                <div style={styles.tableWrapper} className="table-wrapper-res glass-card">
                    {history.length === 0 ? (
                        <div style={styles.noHistory}>
                            <p>{t('dashboard.noActivity')}</p>
                        </div>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.thRow}>
                                    <th style={styles.th}>{t('dashboard.crop')}</th>
                                    <th style={styles.th}>{t('dashboard.region')}</th>
                                    <th style={styles.th}>N-P-K</th>
                                    <th style={styles.th}>pH / Moist</th>
                                    <th style={styles.th}>{t('dashboard.recommendation')}</th>
                                    <th style={styles.th}>{t('dashboard.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((record) => (
                                    <tr key={record.id} style={styles.tr}>
                                        <td style={styles.td}>
                                            <div style={styles.cropCell}>
                                                <span style={styles.cropIcon}>🌱</span>
                                                <div>
                                                    <span style={styles.cropName}>{tCrop(record.cropName)}</span>
                                                    <span style={styles.stageTag}>{tStage(record.growthStage)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={styles.td}>{tState(record.location)}</td>
                                        <td style={styles.td}>
                                            {record.nitrogen}-{record.phosphorus}-{record.potassium}
                                        </td>
                                        <td style={styles.td}>
                                            {record.ph} pH / {record.moisture}%
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.fertilizerBadge}>{tFertilizer(record.predictedFertilizer)}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.actionRow}>
                                                <button 
                                                    style={styles.viewBtn} 
                                                    onClick={() => handleViewDetails(record)}
                                                >
                                                    {t('dashboard.view')}
                                                </button>
                                                <button 
                                                    style={styles.deleteBtn} 
                                                    onClick={() => handleDelete(record.id)}
                                                >
                                                    {t('dashboard.delete')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </div>
    );
};

const styles = {
    dashboardContainer: {
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
        fontFamily: '"Hanken Grotesk", sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
    },
    centerContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        color: '#4d6453'
    },
    heroBanner: {
        height: '300px',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'end',
        padding: '2.5rem',
        backgroundImage: `linear-gradient(rgba(6, 27, 14, 0.4) 0%, rgba(6, 27, 14, 0.8) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAHhTiE3VZ2InShP3_94iIeGSSZCJbKh6wRH2n8Wn7kRe00umagrYTutoEKcZxNNC7dLrCASL5Od-WNmsiVbFO1VgkDsVMUi4e-6eiwRbFb8kugWRoqaMuXySOUYVOnyoyyXbXhTGf3G3JaGUFmq9D6s9E54CzPAf7RvcqWYaZLb1pJgt7FEhGlTMStymWkG2Mh3drhaZvivz00ISny9QjAtSx74JWKAmsvtGlSRFJTwpG0vTEq0DmW5JN6dZ2hlk5hPZWgTps_VUhO')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '0px 8px 24px rgba(27, 48, 34, 0.08)',
        border: '1px solid #c3c8c1'
    },
    heroImageOverlay: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(6, 27, 14, 0.7) 0%, transparent 100%)',
        zIndex: 1
    },
    heroContent: {
        position: 'relative',
        zIndex: 2,
        color: '#ffffff',
        textAlign: 'left',
        maxWidth: '650px'
    },
    heroBadge: {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        background: '#d4e9c4',
        color: '#101f09',
        borderRadius: '20px',
        fontSize: '0.78rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.8rem'
    },
    heroTitle: {
        fontFamily: "'Playfair Display', serif",
        fontSize: '2.1rem',
        fontWeight: 700,
        color: '#ffffff',
        margin: '0 0 0.5rem 0'
    },
    heroSubtitle: {
        fontSize: '1.15rem',
        fontWeight: 600,
        color: '#ffffff',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
        margin: '0.4rem 0 0 0',
        lineHeight: 1.45
    },
    heroBtn: {
        position: 'relative',
        zIndex: 2,
        background: '#fcf9f8',
        color: '#061b0e',
        border: 'none',
        borderRadius: '10px',
        padding: '0.75rem 1.5rem',
        fontSize: '0.88rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'all 0.2s ease',
        ':hover': {
            background: '#d0e9d4'
        }
    },
    gridRow: {
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '2.2rem'
    },
    npkCard: {
        borderRadius: '20px',
        padding: '1.8rem',
        border: '1px solid #c3c8c1',
        background: '#fcf9f8',
        position: 'relative'
    },
    calibrationOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20px',
        zIndex: 10,
        transition: 'all 0.3s ease'
    },
    overlaySpinner: {
        width: '32px',
        height: '32px',
        borderWidth: '3px'
    },
    overlayText: {
        marginTop: '0.8rem',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#061b0e',
        fontFamily: '"Hanken Grotesk", sans-serif'
    },
    toastNotification: {
        position: 'absolute',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#10b981',
        color: '#ffffff',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: '0.78rem',
        fontWeight: 700,
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
        zIndex: 11,
        animation: 'slide-up 0.2s ease-out'
    },
    npkHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(195, 200, 193, 0.3)',
        paddingBottom: '0.8rem',
        marginBottom: '1.5rem'
    },
    sectionTitle: {
        fontSize: '1.3rem',
        fontWeight: 700,
        color: '#061b0e',
        margin: 0,
        fontFamily: "'Playfair Display', serif",
        textAlign: 'left'
    },
    recalibrateBtn: {
        fontSize: '0.8rem',
        fontWeight: 700,
        color: '#434843',
        textTransform: 'uppercase',
        cursor: 'pointer'
    },
    gaugesContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '1rem 0'
    },
    gaugeItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    gaugeWrapper: {
        position: 'relative',
        width: '100px',
        height: '100px',
        marginBottom: '0.8rem'
    },
    svgCircle: {
        width: '100%',
        height: '100%'
    },
    circleBg: {
        fill: 'none',
        stroke: '#eae7e7',
        strokeWidth: 6
    },
    circleFill: {
        fill: 'none',
        strokeWidth: 6,
        strokeLinecap: 'round',
        transform: 'rotate(-90deg)',
        transformOrigin: '50% 50%',
        transition: 'stroke-dashoffset 1.5s ease-out',
        strokeDasharray: '251.2'
    },
    gaugeText: {
        fontFamily: '"Hanken Grotesk", sans-serif',
        fontSize: '1.25rem',
        fontWeight: 800,
        fill: '#061b0e',
        textAnchor: 'middle'
    },
    gaugeLabel: {
        fontSize: '0.8rem',
        fontWeight: 700,
        color: '#434843',
        textTransform: 'uppercase',
        letterSpacing: '0.04em'
    },
    gaugeSub: {
        fontSize: '0.72rem',
        color: '#516447',
        fontWeight: 500,
        marginTop: '0.2rem'
    },
    weatherCard: {
        borderRadius: '20px',
        padding: '1.8rem',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        backdropFilter: 'var(--glass-blur)',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'all 0.3s ease'
    },
    weatherCardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    weatherSelect: {
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-main)',
        padding: '0.4rem 0.8rem',
        borderRadius: '10px',
        fontSize: '0.82rem',
        fontWeight: 600,
        cursor: 'pointer',
        outline: 'none',
        transition: 'var(--transition-smooth)'
    },
    weatherLoadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '220px',
        flex: 1
    },
    weatherErrorContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '220px',
        gap: '1rem',
        textAlign: 'center',
        flex: 1
    },
    weatherRetryBtn: {
        background: 'var(--accent-glow)',
        color: 'var(--accent)',
        border: '1px solid var(--accent)',
        borderRadius: '8px',
        padding: '0.4rem 1rem',
        fontSize: '0.82rem',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    weatherContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        flex: 1
    },
    weatherSplit: {
        gap: '1.5rem',
        alignItems: 'stretch'
    },
    currentWeatherColumn: {
        background: 'rgba(27, 48, 34, 0.02)',
        border: '1px solid rgba(195, 200, 193, 0.2)',
        borderRadius: '16px',
        padding: '1.2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    largeWeatherIcon: {
        fontSize: '3rem',
        lineHeight: 1
    },
    largeTemp: {
        fontSize: '2.2rem',
        fontWeight: 800,
        color: 'var(--text-main)',
        margin: '0.4rem 0 0.1rem 0'
    },
    currentWeatherDesc: {
        fontSize: '0.85rem',
        fontWeight: 700,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em'
    },
    miniStatsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.8rem',
        width: '100%',
        marginTop: '1.2rem',
        borderTop: '1px solid rgba(195, 200, 193, 0.2)',
        paddingTop: '1rem'
    },
    miniStatItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    miniStatLabel: {
        fontSize: '0.68rem',
        color: 'var(--text-muted)',
        fontWeight: 600,
        marginBottom: '0.2rem'
    },
    miniStatValue: {
        fontSize: '0.82rem',
        fontWeight: 750,
        color: 'var(--text-main)'
    },
    forecastColumn: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.8rem'
    },
    weatherList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.45rem'
    },
    weatherItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0.8rem',
        borderRadius: '10px',
        border: '1px solid transparent',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
    },
    weatherItemActive: {
        background: 'var(--accent-glow)',
        borderColor: 'rgba(16, 185, 129, 0.2)'
    },
    weatherDay: {
        fontSize: '0.85rem',
        fontWeight: 700,
        color: 'var(--text-main)',
        width: '35px'
    },
    weatherIcon: {
        fontSize: '1.1rem'
    },
    weatherTemps: {
        display: 'flex',
        gap: '0.4rem',
        fontSize: '0.85rem',
        fontWeight: 700
    },
    tempMax: {
        color: 'var(--text-main)'
    },
    tempMin: {
        color: 'var(--text-muted)',
        fontWeight: 500
    },
    weatherDesc: {
        fontSize: '0.72rem',
        textTransform: 'uppercase',
        fontWeight: 700,
        color: 'var(--accent)',
        width: '100px',
        textAlign: 'right'
    },
    forecastDetailArea: {
        background: 'rgba(27, 48, 34, 0.02)',
        borderRadius: '8px',
        padding: '0.5rem 0.8rem',
        textAlign: 'center',
        border: '1px solid rgba(195, 200, 193, 0.1)'
    },
    forecastDetailText: {
        margin: 0,
        fontSize: '0.78rem',
        fontWeight: 600,
        color: 'var(--text-main)'
    },
    weatherAdvisoryBox: {
        borderRadius: '12px',
        padding: '0.8rem 1rem',
        transition: 'all 0.3s ease'
    },
    chartBlock: {
        borderRadius: '20px',
        padding: '1.8rem',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        backdropFilter: 'var(--glass-blur)',
        display: 'flex',
        flexDirection: 'column',
        height: 'auto',
        minHeight: '380px',
        transition: 'all 0.3s ease'
    },
    chartHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1.2rem',
        textAlign: 'left'
    },
    chartSub: {
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
        margin: '0.2rem 0 0 0'
    },
    chartLegend: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.78rem'
    },
    legendColor: {
        width: '10px',
        height: '10px',
        borderRadius: '50%'
    },
    legendText: {
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase'
    },
    moistureContent: {
        alignItems: 'center',
        flex: 1,
        gap: '2rem'
    },
    moistureGaugeColumn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem',
        borderRight: '1px solid rgba(195, 200, 193, 0.2)',
        paddingRight: '1.5rem'
    },
    moistureGaugeWrapper: {
        position: 'relative',
        width: '110px',
        height: '110px',
        marginBottom: '0.8rem'
    },
    moistureStatusWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%'
    },
    moistureStatusTag: {
        fontSize: '0.7rem',
        fontWeight: 800,
        padding: '0.2rem 0.6rem',
        borderRadius: '12px',
        letterSpacing: '0.04em'
    },
    moistureAdvText: {
        fontSize: '0.78rem',
        fontWeight: 500,
        color: 'var(--text-muted)',
        margin: '0.4rem 0 0.8rem 0',
        lineHeight: 1.3
    },
    nextIrrigationBox: {
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '0.4rem 0.8rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
    },
    nextIrrigationLabel: {
        fontSize: '0.62rem',
        fontWeight: 700,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        marginBottom: '0.1rem'
    },
    nextIrrigationVal: {
        fontSize: '0.78rem',
        fontWeight: 700,
        color: 'var(--text-main)'
    },
    moistureChartColumn: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        height: '100%'
    },
    chartCanvas: {
        flex: 1,
        display: 'flex',
        alignItems: 'end',
        gap: '0.5rem',
        padding: '0 0.5rem',
        height: '150px',
        position: 'relative'
    },
    chartBar: {
        flex: 1,
        borderRadius: '6px 6px 0 0',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '0%'
    },
    chartLabels: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.7rem',
        fontWeight: 700,
        color: 'var(--text-muted)',
        marginTop: '0.6rem',
        textTransform: 'uppercase',
        borderTop: '1px solid rgba(195, 200, 193, 0.15)',
        paddingTop: '0.5rem'
    },
    chartTooltipArea: {
        marginTop: '0.8rem',
        background: 'rgba(27, 48, 34, 0.02)',
        borderRadius: '8px',
        padding: '0.5rem 0.8rem',
        textAlign: 'center',
        border: '1px solid rgba(195, 200, 193, 0.1)',
        minHeight: '34px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    chartTooltipText: {
        margin: 0,
        fontSize: '0.78rem',
        fontWeight: 650,
        color: 'var(--text-main)'
    },
    insightsRow: {
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '2.2rem'
    },
    insightsCard: {
        borderRadius: '20px',
        padding: '1.8rem',
        border: '1px solid #c3c8c1',
        background: '#1b3022',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left'
    },
    insightsHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        marginBottom: '0.8rem'
    },
    insightsIcon: {
        fontSize: '1.4rem'
    },
    insightsHeading: {
        fontSize: '0.85rem',
        fontWeight: 700,
        color: '#d4e9c4',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        margin: 0
    },
    insightsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        flex: 1
    },
    insightItem: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1rem',
        borderRadius: '12px'
    },
    insightText: {
        fontSize: '0.9rem',
        lineHeight: 1.45,
        fontStyle: 'italic',
        color: 'var(--text-inverse)',
        margin: 0
    },
    historySection: {
        marginTop: '1.5rem',
        textAlign: 'left'
    },
    tableWrapper: {
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-primary)'
    },
    noHistory: {
        padding: '4rem 2rem',
        textAlign: 'center',
        color: 'var(--text-muted)'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    thRow: {
        background: 'rgba(255, 255, 255, 0.02)',
        borderBottom: '1px solid var(--border-color)'
    },
    th: {
        padding: '1rem 1.2rem',
        fontSize: '0.82rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        textAlign: 'left'
    },
    tr: {
        borderBottom: '1px solid var(--border-color)',
        transition: 'all 0.2s ease',
        ':hover': {
            background: 'var(--bg-secondary)'
        }
    },
    td: {
        padding: '1rem 1.2rem',
        fontSize: '0.88rem',
        color: 'var(--text-main)',
        verticalAlign: 'middle'
    },
    cropCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem'
    },
    cropIcon: {
        fontSize: '1.3rem'
    },
    cropName: {
        fontWeight: 700,
        color: 'var(--text-main)',
        display: 'block'
    },
    stageTag: {
        fontSize: '0.72rem',
        background: 'var(--bg-secondary)',
        color: 'var(--text-muted)',
        padding: '0.1rem 0.35rem',
        borderRadius: '4px',
        fontWeight: 600,
        marginTop: '0.2rem',
        display: 'inline-block'
    },
    fertilizerBadge: {
        background: 'var(--accent-glow)',
        color: 'var(--accent)',
        padding: '0.25rem 0.6rem',
        borderRadius: '6px',
        fontWeight: 700,
        fontSize: '0.82rem'
    },
    actionRow: {
        display: 'flex',
        gap: '0.6rem'
    },
    viewBtn: {
        background: 'var(--accent-glow)',
        color: 'var(--accent)',
        border: 'none',
        borderRadius: '6px',
        padding: '0.35rem 0.8rem',
        fontSize: '0.78rem',
        fontWeight: 700,
        cursor: 'pointer'
    },
    deleteBtn: {
        background: 'rgba(186, 26, 26, 0.08)',
        color: 'var(--danger)',
        border: 'none',
        borderRadius: '6px',
        padding: '0.35rem 0.8rem',
        fontSize: '0.78rem',
        fontWeight: 700,
        cursor: 'pointer'
    },
    diagnosticsPanel: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        textAlign: 'left',
        marginTop: '0.5rem'
    },
    diagnosticsDivider: {
        height: '1px',
        background: 'rgba(195, 200, 193, 0.3)',
        margin: '0.5rem 0 0.8rem 0'
    },
    diagnosticsTitle: {
        fontSize: '0.92rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: '#061b0e',
        margin: '0 0 0.4rem 0',
        fontFamily: '"Hanken Grotesk", sans-serif'
    },
    diagnosticsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: '0.6rem',
        width: '100%'
    },
    diagCard: {
        background: 'rgba(27, 48, 34, 0.02)',
        border: '1px solid rgba(195, 200, 193, 0.2)',
        borderRadius: '10px',
        padding: '0.6rem 0.8rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    scoreBadge: {
        fontSize: '1rem',
        fontWeight: 800,
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    diagLabel: {
        fontSize: '0.65rem',
        color: '#516447',
        fontWeight: 700,
        textTransform: 'uppercase',
        display: 'block',
        lineHeight: 1.1,
        marginBottom: '2px'
    },
    diagValue: {
        fontSize: '0.78rem',
        fontWeight: 750,
        color: '#061b0e',
        display: 'block'
    },
    adviceBox: {
        background: 'rgba(16, 185, 129, 0.04)',
        border: '1px solid rgba(16, 185, 129, 0.15)',
        borderRadius: '10px',
        padding: '0.8rem',
        marginTop: '0.4rem'
    },
    adviceHeader: {
        fontSize: '0.75rem',
        fontWeight: 800,
        color: '#059669',
        textTransform: 'uppercase',
        display: 'block',
        marginBottom: '4px'
    },
    adviceText: {
        fontSize: '0.8rem',
        fontWeight: 500,
        color: '#061b0e',
        lineHeight: 1.35,
        margin: 0
    }
};

export default Dashboard;
