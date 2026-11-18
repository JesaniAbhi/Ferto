import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const SoilForm = ({ setActiveTab, setResultData }) => {
    const { fetchWithAuth } = useAuth();
    const { language, t, tState, tSoilType, tCrop, tSeason, tStage } = useLanguage();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form inputs state
    const [nitrogen, setNitrogen] = useState(60);
    const [phosphorus, setPhosphorus] = useState(50);
    const [potassium, setPotassium] = useState(60);
    const [ph, setPh] = useState(6.5);
    const [moisture, setMoisture] = useState(45);
    const [organicCarbon, setOrganicCarbon] = useState(0.65);
    const [soilType, setSoilType] = useState('Loamy');
    const [cropName, setCropName] = useState('Rice');
    const [cropSeason, setCropSeason] = useState('Kharif');
    const [growthStage, setGrowthStage] = useState('Vegetative');
    const [location, setLocation] = useState('Gujarat');

    const [latitude, setLatitude] = useState(23.02);
    const [longitude, setLongitude] = useState(72.57);

    // Update coordinates and initialize map when step 2 mounts or location changes
    const stateCoords = {
        'Punjab': [31.02, 75.35],
        'Andhra Pradesh': [15.91, 79.74],
        'Maharashtra': [19.75, 75.71],
        'Assam': [26.20, 92.93],
        'Karnataka': [15.31, 75.71],
        'Gujarat': [23.02, 72.57],
        'Rajasthan': [27.02, 74.21],
        'Tamil Nadu': [11.12, 78.65],
        'Uttar Pradesh': [26.84, 80.94],
        'West Bengal': [22.98, 87.85],
        'Madhya Pradesh': [22.97, 78.65],
        'Haryana': [29.05, 76.08],
        'Bihar': [25.09, 85.31],
        'Kerala': [10.85, 76.27]
    };

    React.useEffect(() => {
        if (step === 2) {
            const coords = stateCoords[location] || [23.02, 72.57];
            setLatitude(coords[0]);
            setLongitude(coords[1]);

            if (!window.L) return;
            const mapContainer = document.getElementById('map');
            if (!mapContainer) return;

            const map = window.L.map('map').setView(coords, 6);
            
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            let marker = window.L.marker(coords, { draggable: true }).addTo(map);

            marker.on('dragend', function () {
                const position = marker.getLatLng();
                setLatitude(parseFloat(position.lat.toFixed(4)));
                setLongitude(parseFloat(position.lng.toFixed(4)));
            });

            map.on('click', function (event) {
                const clicked = event.latlng;
                marker.setLatLng(clicked);
                setLatitude(parseFloat(clicked.lat.toFixed(4)));
                setLongitude(parseFloat(clicked.lng.toFixed(4)));
            });

            return () => {
                map.remove();
            };
        }
    }, [step, location]);

    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(null);
    const [uploadWarnings, setUploadWarnings] = useState([]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError(null);
        setUploadSuccess(null);
        setUploadWarnings([]);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetchWithAuth('/api/recommendations/parse-report', {
                method: 'POST',
                body: formData
            });
            const resData = await res.json();
            
            if (!res.ok) {
                throw new Error(resData.detail || resData.message || 'Failed to parse report.');
            }
            
            if (resData.success && resData.data) {
                const parsed = resData.data;
                if (parsed.nitrogen !== undefined) setNitrogen(parsed.nitrogen);
                if (parsed.phosphorus !== undefined) setPhosphorus(parsed.phosphorus);
                if (parsed.potassium !== undefined) setPotassium(parsed.potassium);
                if (parsed.ph !== undefined) setPh(parsed.ph);
                if (parsed.moisture !== undefined) setMoisture(parsed.moisture);
                if (parsed.organicCarbon !== undefined) setOrganicCarbon(parsed.organicCarbon);
                if (parsed.soilType) setSoilType(parsed.soilType);
                if (parsed.location) setLocation(parsed.location);
                
                setUploadSuccess(file.name);
                if (resData.warnings && resData.warnings.length > 0) {
                    setUploadWarnings(resData.warnings);
                }
            } else {
                throw new Error('No parsed data returned from service.');
            }
        } catch (err) {
            setError('Report parsing error: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [suggestedCrops, setSuggestedCrops] = useState([]);

    const handleSuggestCrops = async () => {
        setLoadingSuggestions(true);
        setError(null);
        try {
            const res = await fetchWithAuth('/api/recommendations/suggest-crops', {
                method: 'POST',
                body: JSON.stringify({
                    soilType,
                    location,
                    ph: parseFloat(ph),
                    moisture: parseFloat(moisture),
                    nitrogen: parseFloat(nitrogen),
                    phosphorus: parseFloat(phosphorus),
                    potassium: parseFloat(potassium),
                    organicCarbon: parseFloat(organicCarbon)
                })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to fetch suggestions.');
            }
            setSuggestedCrops(data);
        } catch (err) {
            setError('Crop suggestions error: ' + err.message);
        } finally {
            setLoadingSuggestions(false);
        }
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const getLocalizedValue = (val, type) => {
            if (language === 'hi' || language === 'gu') {
                if (type === 'soilType') return tSoilType(val);
                if (type === 'cropName') return tCrop(val);
                if (type === 'location') return tState(val).split(' (')[0].trim();
            }
            return val;
        };

        const payload = {
            nitrogen: parseFloat(nitrogen),
            phosphorus: parseFloat(phosphorus),
            potassium: parseFloat(potassium),
            ph: parseFloat(ph),
            moisture: parseFloat(moisture),
            organicCarbon: parseFloat(organicCarbon),
            soilType: getLocalizedValue(soilType, 'soilType'),
            cropName: getLocalizedValue(cropName, 'cropName'),
            location: getLocalizedValue(location, 'location'),
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            language
        };

        try {
            const res = await fetchWithAuth('/api/recommendations/predict', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || 'Error occurred while computing prediction.');
            }
            
            setResultData(data);
            setActiveTab('result');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '680px' }}>
            {/* Header Title */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>{t('form.title')}</h1>
                <p>{t('form.description')}</p>
            </div>

            {/* Wizard Progress Indicator */}
            <div style={styles.progressContainer}>
                <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: step === 1 ? '50%' : '100%' }}></div>
                </div>
                <div style={styles.stepIndicators}>
                    <div style={{ ...styles.stepNum, ...(step >= 1 ? styles.activeStepNum : {}) }}>1</div>
                    <div style={{ ...styles.stepNum, ...(step >= 2 ? styles.activeStepNum : {}) }}>2</div>
                </div>
                <div style={styles.stepLabels}>
                    <span>{t('form.step1')}</span>
                    <span>{t('form.step2')}</span>
                </div>
            </div>

            {/* Form Card */}
            <div className="glass-card animate-slide-up" style={{ padding: '2.5rem' }}>
                {error && (
                    <div style={styles.alertDanger}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* STEP 1: Soil Properties */}
                    {step === 1 && (
                        <div>
                            <h3 style={styles.stepTitle}>{t('form.stepTitle1')}</h3>
                            
                            {/* File Upload Dropzone */}
                            <div style={styles.uploadZone}>
                                <div style={styles.uploadHeader}>
                                    <svg width="24" height="24" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24" style={{ animation: uploading ? 'pulse 1.5s infinite ease-in-out' : 'none' }}>
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                    </svg>
                                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t('form.autofill')}</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0 1rem 0' }}>
                                    {t('form.uploadDesc')}
                                </p>
                                <div style={styles.fileInputWrapper}>
                                    <input 
                                        type="file" 
                                        accept="image/*,application/pdf,.txt" 
                                        onChange={handleFileUpload} 
                                        style={styles.fileInputHidden}
                                        id="soil-report-upload"
                                        disabled={uploading}
                                    />
                                    <label htmlFor="soil-report-upload" style={uploading ? styles.uploadLabelDisabled : styles.uploadLabel}>
                                        {uploading ? (
                                            <>
                                                <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: 'var(--accent)', marginRight: '6px' }}></div>
                                                {t('form.scanning')}
                                            </>
                                        ) : t('form.chooseFile')}
                                    </label>
                                </div>
                                {uploadSuccess && (
                                    <div style={styles.alertSuccess}>
                                        <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>✓ {t('form.parsedSuccess')}</div>
                                        <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>{t('form.parsedDetails').replace('{name}', uploadSuccess)}</div>
                                        {uploadWarnings.length > 0 && (
                                            <div style={{ marginTop: '0.4rem', borderTop: '1px solid rgba(16, 185, 129, 0.15)', paddingTop: '0.4rem' }}>
                                                {uploadWarnings.map((w, idx) => (
                                                    <div key={idx} style={{ fontSize: '0.72rem', opacity: 0.8 }}>• {w}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            {/* Nitrogen Slider */}
                            <div className="form-group">
                                <label className="form-label">
                                    {t('form.nitrogen')} <span>{nitrogen} mg/kg</span>
                                </label>
                                <input 
                                    type="range" min="10" max="500" step="1" 
                                    value={nitrogen} onChange={(e) => setNitrogen(e.target.value)} 
                                />
                                <div style={styles.sliderLabels}>
                                    <span>{t('form.low')} (10)</span>
                                    <span>{t('form.optimum')} (140-280)</span>
                                    <span>{t('form.high')} (500)</span>
                                </div>
                            </div>

                            {/* Phosphorus Slider */}
                            <div className="form-group">
                                <label className="form-label">
                                    {t('form.phosphorus')} <span>{phosphorus} mg/kg</span>
                                </label>
                                <input 
                                    type="range" min="5" max="150" step="1" 
                                    value={phosphorus} onChange={(e) => setPhosphorus(e.target.value)} 
                                />
                                <div style={styles.sliderLabels}>
                                    <span>{t('form.low')} (5)</span>
                                    <span>{t('form.optimum')} (10-25)</span>
                                    <span>{t('form.high')} (150)</span>
                                </div>
                            </div>

                            {/* Potassium Slider */}
                            <div className="form-group">
                                <label className="form-label">
                                    {t('form.potassium')} <span>{potassium} mg/kg</span>
                                </label>
                                <input 
                                    type="range" min="50" max="800" step="1" 
                                    value={potassium} onChange={(e) => setPotassium(e.target.value)} 
                                />
                                <div style={styles.sliderLabels}>
                                    <span>{t('form.low')} (50)</span>
                                    <span>{t('form.optimum')} (110-280)</span>
                                    <span>{t('form.high')} (800)</span>
                                </div>
                            </div>

                            {/* pH Slider */}
                            <div className="form-group">
                                <label className="form-label">
                                    {t('form.ph')} <span>{ph}</span>
                                </label>
                                <input 
                                    type="range" min="3.5" max="9.0" step="0.1" 
                                    value={ph} onChange={(e) => setPh(e.target.value)} 
                                />
                                <div style={styles.sliderLabels}>
                                    <span>{t('form.acidic')} (3.5)</span>
                                    <span>{t('form.neutral')} (6.5-7.2)</span>
                                    <span>{t('form.alkaline')} (9.0)</span>
                                </div>
                            </div>

                            {/* Moisture Slider */}
                            <div className="form-group">
                                <label className="form-label">
                                    {t('form.moisture')} <span>{moisture}%</span>
                                </label>
                                <input 
                                    type="range" min="10" max="90" step="1" 
                                    value={moisture} onChange={(e) => setMoisture(e.target.value)} 
                                />
                                <div style={styles.sliderLabels}>
                                    <span>{t('form.dry')} (10%)</span>
                                    <span>{t('form.adequate')} (40-60%)</span>
                                    <span>{t('form.saturated')} (90%)</span>
                                </div>
                            </div>

                            {/* Organic Carbon Slider */}
                            <div className="form-group">
                                <label className="form-label">
                                    {t('form.carbon')} <span>{organicCarbon}%</span>
                                </label>
                                <input 
                                    type="range" min="0.10" max="2.50" step="0.01" 
                                    value={organicCarbon} onChange={(e) => setOrganicCarbon(e.target.value)} 
                                />
                                <div style={styles.sliderLabels}>
                                    <span>{t('form.criticallyLow')} (&lt;0.5)</span>
                                    <span>{t('form.good')} (0.5-0.75)</span>
                                    <span>{t('form.rich')} (&gt;0.75)</span>
                                </div>
                            </div>

                            <button type="button" className="btn-primary" onClick={handleNext} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                                {t('form.next')}
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* STEP 2: Crop & Location */}
                    {step === 2 && (
                        <div>
                            <h3 style={styles.stepTitle}>{t('form.stepTitle2')}</h3>

                            {/* Soil Type Select */}
                            <div className="form-group">
                                <label className="form-label">{t('form.soilType')}</label>
                                <select className="form-control" value={soilType} onChange={(e) => setSoilType(e.target.value)}>
                                    <option value="Loamy">{tSoilType('Loamy')}</option>
                                    <option value="Clayey">{tSoilType('Clayey')}</option>
                                    <option value="Sandy">{tSoilType('Sandy')}</option>
                                    <option value="Silty">{tSoilType('Silty')}</option>
                                    <option value="Peaty">{tSoilType('Peaty')}</option>
                                </select>
                            </div>

                            {/* Crop Select */}
                            <div className="form-group">
                                <label className="form-label">{t('form.cropName')}</label>
                                <div style={{ display: 'flex', gap: '0.8rem' }}>
                                    <select className="form-control" value={cropName} onChange={(e) => setCropName(e.target.value)} style={{ flex: 1 }}>
                                        <option value="Rice">{tCrop('Rice')}</option>
                                        <option value="Wheat">{tCrop('Wheat')}</option>
                                        <option value="Maize">{tCrop('Maize')}</option>
                                        <option value="Cotton">{tCrop('Cotton')}</option>
                                        <option value="Sugarcane">{tCrop('Sugarcane')}</option>
                                        <option value="Tea">{tCrop('Tea')}</option>
                                        <option value="Potato">{tCrop('Potato')}</option>
                                        <option value="Tomato">{tCrop('Tomato')}</option>
                                        <option value="Groundnut">{tCrop('Groundnut')}</option>
                                        <option value="Barley">{tCrop('Barley')}</option>
                                        <option value="Mustard">{tCrop('Mustard')}</option>
                                        <option value="Soybeans">{tCrop('Soybeans')}</option>
                                        <option value="Onion">{tCrop('Onion')}</option>
                                        <option value="Garlic">{tCrop('Garlic')}</option>
                                    </select>
                                    <button 
                                        type="button" 
                                        className="btn-secondary" 
                                        style={styles.suggestCropsBtn}
                                        onClick={handleSuggestCrops}
                                        disabled={loadingSuggestions}
                                    >
                                        {loadingSuggestions ? (
                                            <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: 'var(--accent)' }}></div>
                                        ) : `💡 ${t('form.suggest')}`}
                                    </button>
                                </div>
                            </div>

                            {/* Crop Suggestions Advisor Panel */}
                            {suggestedCrops && suggestedCrops.length > 0 && (
                                <div style={styles.suggestionsContainer} className="animate-slide-up">
                                    <h4 style={styles.suggestionsTitle}>💡 {t('form.suggestTitle')}</h4>
                                    <div style={styles.suggestionsGrid}>
                                        {suggestedCrops.map((item, idx) => (
                                            <div 
                                                key={idx} 
                                                style={{
                                                    ...styles.suggestionItem,
                                                    borderColor: cropName === item.crop ? 'var(--accent)' : 'var(--border-color)',
                                                    background: cropName === item.crop ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)'
                                                }}
                                                onClick={() => setCropName(item.crop)}
                                            >
                                                <div style={styles.suggestionHeader}>
                                                    <span style={styles.suggestionName}>{tCrop(item.crop)}</span>
                                                    <span style={{
                                                        ...styles.suggestionScore,
                                                        color: item.suitability > 80 ? '#10B981' : item.suitability > 60 ? '#F59E0B' : '#EF4444'
                                                    }}>{item.suitability}% {t('form.match')}</span>
                                                </div>
                                                <p style={styles.suggestionReason}>{item.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Crop Season Select */}
                            <div className="form-group">
                                <label className="form-label">{t('form.cropSeason')}</label>
                                <select className="form-control" value={cropSeason} onChange={(e) => setCropSeason(e.target.value)}>
                                    <option value="Kharif">{tSeason('Kharif')}</option>
                                    <option value="Rabi">{tSeason('Rabi')}</option>
                                    <option value="Zaid">{tSeason('Zaid')}</option>
                                </select>
                            </div>

                            {/* Growth Stage Select */}
                            <div className="form-group">
                                <label className="form-label">{t('form.growthStage')}</label>
                                <select className="form-control" value={growthStage} onChange={(e) => setGrowthStage(e.target.value)}>
                                    <option value="Germination">{tStage('Germination')}</option>
                                    <option value="Vegetative">{tStage('Vegetative')}</option>
                                    <option value="Flowering">{tStage('Flowering')}</option>
                                    <option value="Maturity">{tStage('Maturity')}</option>
                                </select>
                            </div>

                            {/* Location Select */}
                            <div className="form-group">
                                <label className="form-label">{t('form.location')}</label>
                                <select className="form-control" value={location} onChange={(e) => setLocation(e.target.value)}>
                                    <option value="Punjab">{tState('Punjab')}</option>
                                    <option value="Andhra Pradesh">{tState('Andhra Pradesh')}</option>
                                    <option value="Maharashtra">{tState('Maharashtra')}</option>
                                    <option value="Assam">{tState('Assam')}</option>
                                    <option value="Karnataka">{tState('Karnataka')}</option>
                                    <option value="Gujarat">{tState('Gujarat')}</option>
                                    <option value="Rajasthan">{tState('Rajasthan')}</option>
                                    <option value="Tamil Nadu">{tState('Tamil Nadu')}</option>
                                    <option value="Uttar Pradesh">{tState('Uttar Pradesh')}</option>
                                    <option value="West Bengal">{tState('West Bengal')}</option>
                                    <option value="Madhya Pradesh">{tState('Madhya Pradesh')}</option>
                                    <option value="Haryana">{tState('Haryana')}</option>
                                    <option value="Bihar">{tState('Bihar')}</option>
                                    <option value="Kerala">{tState('Kerala')}</option>
                                </select>
                            </div>

                            {/* Coordinate picker Leaflet Map */}
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label">
                                    📍 Farm Coordinates Selector 
                                    <span style={{ float: 'right', fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 'bold' }}>
                                        Lat: {latitude}, Lon: {longitude}
                                    </span>
                                </label>
                                <div id="map" style={{ height: '220px', borderRadius: '10px', marginTop: '0.5rem', border: '1px solid var(--border-color)', zIndex: 1 }}></div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', margin: 0 }}>
                                    Drag the marker or click on the map to pinpoint your farm location for precise micro-weather syncing.
                                </p>
                            </div>

                            <div style={styles.btnRow}>
                                <button type="button" className="btn-secondary" onClick={handleBack} disabled={loading} style={{ flex: 1 }}>
                                    {t('form.back')}
                                </button>
                                <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center' }}>
                                    {loading ? (
                                        <>
                                            <div className="spinner"></div>
                                            {t('form.analyzing')}
                                        </>
                                    ) : (
                                        <>
                                            {t('form.generate')}
                                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

const styles = {
    progressContainer: {
        position: 'relative',
        marginBottom: '2.5rem',
        padding: '0 1rem'
    },
    progressBar: {
        height: '4px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '2px',
        position: 'absolute',
        top: '18px',
        left: 0,
        zIndex: 0
    },
    progressFill: {
        height: '100%',
        background: 'var(--accent)',
        borderRadius: '2px',
        transition: 'var(--transition-smooth)'
    },
    stepIndicators: {
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1
    },
    stepNum: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'var(--bg-secondary)',
        border: '2px solid var(--border-color)',
        color: 'var(--text-muted)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 700,
        fontSize: '0.95rem',
        transition: 'var(--transition-smooth)'
    },
    activeStepNum: {
        borderColor: 'var(--accent)',
        background: 'var(--accent)',
        color: 'var(--text-inverse)',
        boxShadow: '0 0 12px var(--accent)'
    },
    stepLabels: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '0.5rem',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: 'var(--text-muted)'
    },
    stepTitle: {
        fontSize: '1.25rem',
        fontWeight: 700,
        marginBottom: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.75rem'
    },
    sliderLabels: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        marginTop: '-4px',
        marginBottom: '0.5rem'
    },
    btnRow: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1.5rem'
    },
    alertDanger: {
        background: 'rgba(239, 68, 68, 0.15)',
        color: 'var(--danger)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        padding: '0.8rem 1rem',
        borderRadius: '10px',
        fontSize: '0.9rem',
        fontWeight: 500,
        marginBottom: '1.5rem',
        textAlign: 'center'
    },
    uploadZone: {
        background: 'rgba(1, 152, 99, 0.02)',
        border: '1.5px dashed var(--border-color)',
        borderRadius: '12px',
        padding: '1.2rem',
        marginBottom: '2rem',
        textAlign: 'center',
        transition: 'var(--transition-smooth)'
    },
    uploadHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        color: 'var(--text-main)'
    },
    fileInputWrapper: {
        display: 'inline-block',
        position: 'relative'
    },
    fileInputHidden: {
        display: 'none'
    },
    uploadLabel: {
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(27, 48, 34, 0.04)',
        border: '1px solid var(--border-color)',
        padding: '0.5rem 1.2rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--text-main)',
        transition: 'all 0.2s ease-in-out'
    },
    uploadLabelDisabled: {
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-color)',
        padding: '0.5rem 1.2rem',
        borderRadius: '8px',
        cursor: 'not-allowed',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--text-muted)'
    },
    alertSuccess: {
        background: 'rgba(16, 185, 129, 0.12)',
        color: 'var(--success)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        padding: '0.8rem 1rem',
        borderRadius: '8px',
        fontSize: '0.82rem',
        marginTop: '1rem',
        textAlign: 'left',
        lineHeight: 1.4
    },
    suggestCropsBtn: {
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid var(--border-color)',
        padding: '0 1.2rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--text-main)',
        transition: 'all 0.2s ease-in-out',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap'
    },
    suggestionsContainer: {
        background: 'rgba(255, 255, 255, 0.01)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '1.2rem',
        marginTop: '1.5rem',
        marginBottom: '1.5rem'
    },
    suggestionsTitle: {
        fontSize: '0.95rem',
        fontWeight: 700,
        marginBottom: '0.8rem',
        color: 'var(--text-main)'
    },
    suggestionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.8rem'
    },
    suggestionItem: {
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        padding: '0.8rem',
        cursor: 'pointer',
        transition: 'var(--transition-smooth)'
    },
    suggestionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.4rem'
    },
    suggestionName: {
        fontWeight: 700,
        fontSize: '0.88rem',
        color: 'var(--text-main)'
    },
    suggestionScore: {
        fontWeight: 700,
        fontSize: '0.78rem'
    },
    suggestionReason: {
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        lineHeight: 1.35,
        margin: 0
    }
};

export default SoilForm;
