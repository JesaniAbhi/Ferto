import React, { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
    en: {
        nav: {
            dashboard: "Dashboard",
            recommendationEngine: "Recommendation Engine",
            calculationHistory: "Calculation History",
            logout: "Log Out Account",
            farmer: "Farmer",
            admin: "Admin",
            role: "Account Role",
            email: "Email Address",
            farmerMember: "Farmer Member",
            administrator: "Administrator",
            themeLight: "light",
            themeDark: "dark"
        },
        dashboard: {
            controlRoom: "Control Room",
            sensorBaselines: "Sensor Baselines",
            recalibrateSensors: "Recalibrate Sensors",
            recalibrating: "Recalibrating soil sensors...",
            adjusting: "Adjusting NPK baseline filters...",
            avgNitrogen: "Average Nitrogen (N)",
            avgPhosphorus: "Average Phosphorus (P)",
            avgPotassium: "Average Potassium (K)",
            connecting: "Connecting to GreenSteward Sensors...",
            recentActivity: "Recent Activity",
            noActivity: "No previous calculation records found. Run a new scan using the Recommendation Engine.",
            recentPredictions: "Recent Predictions",
            sensorStats: "Sensor Stats",
            active: "Active",
            calibrated: "Calibrated",
            mgKg: "mg/kg",
            calibrationSuccess: "Sensors recalibrated successfully!",
            activeMonitoring: "Active Monitoring",
            fieldOps: "Field Ops",
            centralWheat: "Central Field Ops: Wheat Monitoring",
            latestRec: "Latest recommendation",
            stableStage: "Currently in stable vegetative stage. Soil scans running at 04:00 AM daily.",
            runScan: "Run New Scan",
            nutrientBalance: "Nutrient Balance (NPK)",
            optimalRange: "Optimal Range",
            target: "Target: +5%",
            soilDiagnostics: "Soil Diagnostics",
            vitalityScore: "Vitality Score",
            overallHealth: "Overall Health",
            soilStatus: "Soil Status",
            agronomicAdvice: "Agronomic Advice",
            localForecast: "Local Forecast",
            soilMoistureTrends: "Soil Moisture Trends",
            biometricHistory: "Biometric moisture history (14 Days)",
            moistPct: "Moisture %",
            daysAgo: "14 Days Ago",
            today: "Today",
            fieldInsights: "Field Insights",
            insightNitrogen: "Nitrogen indices across your field are balanced at {val} mg/kg. Maintain scheduled irrigation to stabilize vegetative leaf production.",
            insightPhosphorusLow: "Phosphorus deficiency alert detected ({val} mg/kg). Consider applying a starter basal dressing before local rain cycles.",
            insightPhosphorusOpt: "Phosphorus indices are optimal at {val} mg/kg. Root structure development is proceeding healthily.",
            scanHistory: "Biometric Scan History",
            crop: "Crop",
            region: "Region",
            recommendation: "Recommendation",
            actions: "Actions",
            view: "View",
            delete: "Delete"
        },
        form: {
            title: "Fertilizer Recommendation",
            description: "Provide soil parameters and crop configurations to generate a tailored report.",
            step1: "Soil Properties",
            step2: "Crop & Location",
            stepTitle1: "Step 1: Soil Nutrients & Composition",
            stepTitle2: "Step 2: Crop Selection & Environment",
            autofill: "Auto-Fill Form from Soil Report",
            uploadDesc: "Upload an image or PDF of your soil report to automatically extract N, P, K, pH, moisture, and carbon values.",
            chooseFile: "Choose PDF or Image",
            scanning: "Scanning Report...",
            parsedSuccess: "Soil Report Successfully Parsed!",
            parsedDetails: "Extracted parameters from {name}. Please review the values populated below.",
            nitrogen: "Nitrogen (N)",
            phosphorus: "Phosphorus (P)",
            potassium: "Potassium (K)",
            ph: "Soil pH",
            moisture: "Moisture Percentage",
            carbon: "Organic Carbon (OC)",
            low: "Low",
            optimum: "Optimum",
            high: "High",
            acidic: "Acidic",
            neutral: "Neutral",
            alkaline: "Alkaline",
            dry: "Dry",
            adequate: "Adequate",
            saturated: "Saturated",
            criticallyLow: "Critically Low",
            good: "Good",
            rich: "Rich",
            next: "Next: Crop & Location",
            back: "Back",
            soilType: "Soil Type",
            cropName: "Crop Name",
            suggest: "Suggest",
            suggestTitle: "Recommended Crops for Your Soil & Region",
            match: "Match",
            cropSeason: "Crop Season",
            growthStage: "Growth Stage",
            location: "Field Location / Region",
            generate: "Generate AI Recommendation",
            analyzing: "Analyzing Soil..."
        },
        result: {
            title: "Agronomic Analysis Report",
            subtitle: "Generated by AI Fertilizer Recommendation Engine",
            date: "Date",
            locationLabel: "Location",
            recommendedProduct: "Recommended Product",
            dosage: "Dosage",
            aiConfidence: "AI Confidence Rating",
            expectedYield: "Expected Crop Yield",
            inputMetrics: "Input Soil & Field Metrics",
            targetCrop: "Target Crop",
            temp: "Field Temperature",
            humidity: "Field Humidity",
            rainfall: "Field Rainfall",
            diagnostic: "Agronomic Diagnostic Analysis",
            guidelines: "Field Application Guidelines",
            signature: "Authorized AI Soil Recommendation Engine Signature",
            printReport: "Print PDF Report",
            downloadReport: "Download Report",
            backToForm: "Back to Form"
        },
        history: {
            title: "Calculation History",
            subtitle: "Track all previously generated fertilizer recommendations and soil profiles.",
            emptyTitle: "No Historical Records",
            emptyDesc: "You haven't run any recommendations yet. Submit your first soil profile to see reports saved here.",
            getFirst: "Get First Recommendation",
            viewFull: "View & Print Full Report",
            recsDetail: "Recommendation Detail",
            loading: "Retrieving calculations history...",
            confidence: "Confidence",
            soilType: "Soil Type"
        },
        support: {
            welcome: "Hello! I am your GreenSteward AI Assistant. How can I help you manage your soil, crops, and fertilizers today?",
            title: "GreenSteward Support",
            subtitle: "We reply immediately",
            aiAssistant: "AI Assistant",
            contactChannels: "Contact Channels",
            requestStatus: "Request Status",
            typeQuestion: "Type your question...",
            emailSupport: "Email Support",
            phoneHotline: "Phone Hotline",
            callbackRegistered: "Callback Registered",
            thankYouCallback: "Thank you, {name}! Your request to talk to an executive has been logged. We will call you within 24 business hours.",
            submitAnother: "Submit another request",
            talkExecutive: "Talk to an Executive",
            formSubtitle: "Request a personal consultation or query callback.",
            nameLabel: "Name *",
            emailLabel: "Email Address *",
            phoneLabel: "Phone Number",
            queryCategory: "Query Category",
            messageLabel: "Message / Describe your problem",
            messagePlaceholder: "Describe what fertilizer, soil, or recommendation queries you want to discuss...",
            submitting: "Submitting...",
            requestCallbackBtn: "Request Executive Callback",
            requestHistory: "Request History",
            fetchingRequests: "Fetching requests...",
            noTickets: "No support tickets found.",
            submitRequest: "Submit a Request",
            ticketType: "Type",
            executiveCallback: "Executive Callback",
            generalQuery: "General Query",
            technicalSupport: "Technical Support",
            errorRequired: "Name and Email are required.",
            errorGeneric: "Something went wrong. Please try again.",
            resolved: "RESOLVED",
            pending: "PENDING",
            q1: "What is NPK?",
            q2: "How do I adjust soil pH?",
            q3: "How does recommendation work?",
            q4: "Talk to an Executive"
        },
        states: {
            "Punjab": "Punjab (Semi-arid Plains)",
            "Andhra Pradesh": "Andhra Pradesh (Deccan Coast)",
            "Maharashtra": "Maharashtra (Black Cotton Soil)",
            "Assam": "Assam (Humid Valley)",
            "Karnataka": "Karnataka (Southern Hills)",
            "Gujarat": "Gujarat (West Coast Plains)",
            "Rajasthan": "Rajasthan (Thar Desert)",
            "Tamil Nadu": "Tamil Nadu (Coromandel Coast)",
            "Uttar Pradesh": "Uttar Pradesh (Indo-Gangetic Plains)",
            "West Bengal": "West Bengal (Ganges Delta)",
            "Madhya Pradesh": "Madhya Pradesh (Central Plateau)",
            "Haryana": "Haryana (Alluvial Plains)",
            "Bihar": "Bihar (Ganges Plains)",
            "Kerala": "Kerala (Malabar Coast)"
        },
        soilTypes: {
            "Loamy": "Loamy (Fertile & Balanced)",
            "Clayey": "Clayey (Heavy & Holds Water)",
            "Sandy": "Sandy (Light & Quick Draining)",
            "Silty": "Silty (Smooth & Good Retention)",
            "Peaty": "Peaty (High Organic Matter)"
        },
        crops: {
            "Rice": "Rice",
            "Wheat": "Wheat",
            "Maize": "Maize",
            "Cotton": "Cotton",
            "Sugarcane": "Sugarcane",
            "Tea": "Tea",
            "Potato": "Potato",
            "Tomato": "Tomato",
            "Groundnut": "Groundnut",
            "Barley": "Barley",
            "Mustard": "Mustard",
            "Soybeans": "Soybeans",
            "Onion": "Onion",
            "Garlic": "Garlic"
        },
        seasons: {
            "Kharif": "Kharif (Monsoon Crop)",
            "Rabi": "Rabi (Winter Crop)",
            "Zaid": "Zaid (Summer Crop)"
        },
        stages: {
            "Germination": "Germination (Sprouting)",
            "Vegetative": "Vegetative (Growth & Leafing)",
            "Flowering": "Flowering (Budding)",
            "Maturity": "Maturity (Yield & Harvest)"
        }
    },
    hi: {
        nav: {
            dashboard: "डैशबोर्ड",
            recommendationEngine: "अनुशंसा इंजन",
            calculationHistory: "गणना इतिहास",
            logout: "खाता लॉग आउट करें",
            farmer: "किसान",
            admin: "प्रशासक",
            role: "खाता भूमिका",
            email: "ईमेल पता",
            farmerMember: "किसान सदस्य",
            administrator: "प्रशासक सदस्य",
            themeLight: "लाइट",
            themeDark: "डार्क"
        },
        dashboard: {
            controlRoom: "नियंत्रण कक्ष",
            sensorBaselines: "सेंसर बेसलाइन",
            recalibrateSensors: "सेंसर रीकैलिब्रेट करें",
            recalibrating: "मिट्टी के सेंसर रीकैलिब्रेट किए जा रहे हैं...",
            adjusting: "NPK बेसलाइन फिल्टर समायोजित किए जा रहे हैं...",
            avgNitrogen: "औसत नाइट्रोजन (N)",
            avgPhosphorus: "औसत फास्फोरस (P)",
            avgPotassium: "औसत पोटेशियम (K)",
            connecting: "ग्रीनस्टीवर्ड सेंसर से जुड़ रहा है...",
            recentActivity: "हाल की गतिविधि",
            noActivity: "कोई पिछला गणना रिकॉर्ड नहीं मिला। अनुशंसा इंजन का उपयोग करके नया स्कैन चलाएं।",
            recentPredictions: "हालिया भविष्यवाणियां",
            sensorStats: "सेंसर आँकड़े",
            active: "सक्रिय",
            calibrated: "कैलिब्रेटेड",
            mgKg: "मिलीग्राम/किग्रा",
            calibrationSuccess: "सेंसर सफलतापूर्वक रीकैलिब्रेट किए गए!",
            activeMonitoring: "सक्रिय निगरानी",
            fieldOps: "फील्ड संचालन",
            centralWheat: "केंद्रीय क्षेत्र संचालन: गेहूं की निगरानी",
            latestRec: "नवीनतम सिफारिश",
            stableStage: "वर्तमान में स्थिर वानस्पतिक अवस्था में है। दैनिक सुबह 04:00 बजे मृदा स्कैन चल रहे हैं।",
            runScan: "नया स्कैन चलाएं",
            nutrientBalance: "पोषक तत्व संतुलन (NPK)",
            optimalRange: "इष्टतम सीमा",
            target: "लक्ष्य: +5%",
            soilDiagnostics: "मृदा निदान",
            vitalityScore: "सजीवता स्कोर",
            overallHealth: "समग्र स्वास्थ्य",
            soilStatus: "मिट्टी की स्थिति",
            agronomicAdvice: "कृषि सलाह",
            localForecast: "स्थानीय पूर्वानुमान",
            soilMoistureTrends: "मिट्टी की नमी का रुझान",
            biometricHistory: "बायोमेट्रिक नमी इतिहास (14 दिन)",
            moistPct: "नमी %",
            daysAgo: "14 दिन पहले",
            today: "आज",
            fieldInsights: "खेत की जानकारी",
            insightNitrogen: "आपके खेत में नाइट्रोजन का सूचकांक {val} मिलीग्राम/किग्रा पर संतुलित है। वानस्पतिक पत्तियों के उत्पादन को स्थिर करने के लिए निर्धारित सिंचाई बनाए रखें।",
            insightPhosphorusLow: "फास्फोरस की कमी का अलर्ट पाया गया ({val} मिलीग्राम/किग्रा)। स्थानीय वर्षा चक्र से पहले एक स्टार्टर बेसल ड्रेसिंग लगाने पर विचार करें।",
            insightPhosphorusOpt: "फास्फोरस सूचकांक {val} मिलीग्राम/किग्रा पर इष्टतम है। जड़ संरचना का विकास स्वस्थ रूप से चल रहा है।",
            scanHistory: "बायोमेट्रिक स्कैन इतिहास",
            crop: "फसल",
            region: "क्षेत्र",
            recommendation: "सिफारिश",
            actions: "कार्रवाई",
            view: "देखें",
            delete: "हटाएं"
        },
        form: {
            title: "उर्वरक सिफारिश",
            description: "एक अनुकूलित रिपोर्ट तैयार करने के लिए मिट्टी के मापदंडों और फसल विन्यासों को प्रदान करें।",
            step1: "मिट्टी के गुण",
            step2: "फसल और स्थान",
            stepTitle1: "चरण 1: मिट्टी के पोषक तत्व और संरचना",
            stepTitle2: "चरण 2: फसल चयन और पर्यावरण",
            autofill: "मृदा रिपोर्ट से स्वतः भरें",
            uploadDesc: "एन, पी, के, पीएच, नमी और कार्बन मानों को स्वतः निकालने के लिए अपनी मृदा रिपोर्ट की एक छवि या पीडीएफ अपलोड करें।",
            chooseFile: "पीडीएफ या छवि चुनें",
            scanning: "रिपोर्ट स्कैन की जा रही है...",
            parsedSuccess: "मृदा रिपोर्ट सफलतापूर्वक पार्स की गई!",
            parsedDetails: "{name} से निकाले गए मापदंड। कृपया नीचे भरे गए मानों की समीक्षा करें।",
            nitrogen: "नाइट्रोजन (N)",
            phosphorus: "फास्फोरस (P)",
            potassium: "पोटेशियम (K)",
            ph: "मिट्टी पीएच (pH)",
            moisture: "नमी प्रतिशत",
            carbon: "जैविक कार्बन (OC)",
            low: "कम",
            optimum: "इष्टतम",
            high: "उच्च",
            acidic: "अम्लीय",
            neutral: "तटस्थ",
            alkaline: "क्षारीय",
            dry: "सूखा",
            adequate: "पर्याप्त",
            saturated: "संतृप्त",
            criticallyLow: "गंभीर रूप से कम",
            good: "अच्छा",
            rich: "समृद्ध",
            next: "आगे: फसल और स्थान",
            back: "पीछे",
            soilType: "मिट्टी का प्रकार",
            cropName: "फसल का नाम",
            suggest: "सुझाव दें",
            suggestTitle: "आपकी मिट्टी और क्षेत्र के लिए अनुशंसित फसलें",
            match: "मैच",
            cropSeason: "फसल का मौसम",
            growthStage: "विकास की अवस्था",
            location: "खेत का स्थान / क्षेत्र",
            generate: "एआई सिफारिश उत्पन्न करें",
            analyzing: "मिट्टी का विश्लेषण किया जा रहा है..."
        },
        result: {
            title: "कृषि विज्ञान विश्लेषण रिपोर्ट",
            subtitle: "एआई उर्वरक सिफारिश इंजन द्वारा उत्पन्न",
            date: "दिनांक",
            locationLabel: "स्थान",
            recommendedProduct: "अनुशंसित उत्पाद",
            dosage: "खुराक",
            aiConfidence: "एआई विश्वसनीयता रेटिंग",
            expectedYield: "अपेक्षित फसल उपज",
            inputMetrics: "इनपुट मिट्टी और क्षेत्र मेट्रिक्स",
            targetCrop: "लक्षित फसल",
            temp: "क्षेत्र का तापमान",
            humidity: "क्षेत्र की नमी",
            rainfall: "क्षेत्र की वर्षा",
            diagnostic: "कृषि निदान विश्लेषण",
            guidelines: "क्षेत्र अनुप्रयोग दिशानिर्देश",
            signature: "अधिकृत एआई मृदा सिफारिश इंजन हस्ताक्षर",
            printReport: "पीडीएफ रिपोर्ट प्रिंट करें",
            downloadReport: "रिपोर्ट डाउनलोड करें",
            backToForm: "फॉर्म पर वापस जाएं"
        },
        history: {
            title: "गणना इतिहास",
            subtitle: "सभी पूर्व जनित उर्वरक सिफारिशों और मिट्टी प्रोफाइलों को ट्रैक करें।",
            emptyTitle: "कोई ऐतिहासिक रिकॉर्ड नहीं",
            emptyDesc: "आपने अभी तक कोई सिफारिश नहीं चलाई है। यहाँ रिपोर्ट देखने के लिए अपनी पहली मृदा प्रोफाइल जमा करें।",
            getFirst: "पहली सिफारिश प्राप्त करें",
            viewFull: "पूर्ण रिपोर्ट देखें और प्रिंट करें",
            recsDetail: "सिफारिश विवरण",
            loading: "गणना इतिहास पुनः प्राप्त किया जा रहा है...",
            confidence: "विश्वसनीयता",
            soilType: "मिट्टी का प्रकार"
        },
        support: {
            welcome: "नमस्ते! मैं आपका ग्रीनस्टीवर्ड एआई सहायक हूँ। आज मैं आपकी मिट्टी, फसलों और उर्वरकों के प्रबंधन में आपकी क्या सहायता कर सकता हूँ?",
            title: "ग्रीनस्टीवर्ड सहायता",
            subtitle: "हम तुरंत जवाब देते हैं",
            aiAssistant: "एआई सहायक",
            contactChannels: "संपर्क माध्यम",
            requestStatus: "अनुरोध की स्थिति",
            typeQuestion: "अपना प्रश्न लिखें...",
            emailSupport: "ईमेल सहायता",
            phoneHotline: "फोन हॉटलाइन",
            callbackRegistered: "कॉल-बैक पंजीकृत",
            thankYouCallback: "धन्यवाद, {name}! एक कार्यकारी से बात करने का आपका अनुरोध दर्ज कर लिया गया है। हम आपको 24 व्यावसायिक घंटों के भीतर कॉल करेंगे।",
            submitAnother: "दूसरा अनुरोध सबमिट करें",
            talkExecutive: "एक कार्यकारी से बात करें",
            formSubtitle: "एक व्यक्तिगत परामर्श या प्रश्न कॉल-बैक का अनुरोध करें।",
            nameLabel: "नाम *",
            emailLabel: "ईमेल पता *",
            phoneLabel: "फ़ोन नंबर",
            queryCategory: "प्रश्न की श्रेणी",
            messageLabel: "संदेश / अपनी समस्या का वर्णन करें",
            messagePlaceholder: "उस उर्वरक, मिट्टी या सिफारिश प्रश्न का वर्णन करें जिस पर आप चर्चा करना चाहते हैं...",
            submitting: "सबमिट किया जा रहा है...",
            requestCallbackBtn: "कार्यकारी कॉल-बैक का अनुरोध करें",
            requestHistory: "अनुरोध इतिहास",
            fetchingRequests: "अनुरोध प्राप्त किए जा रहे हैं...",
            noTickets: "कोई सहायता टिकट नहीं मिला।",
            submitRequest: "अनुरोध सबमिट करें",
            ticketType: "प्रकार",
            executiveCallback: "कार्यकारी कॉल-बैक",
            generalQuery: "सामान्य प्रश्न",
            technicalSupport: "तकनीकी सहायता",
            errorRequired: "नाम और ईमेल आवश्यक हैं।",
            errorGeneric: "कुछ गलत हो गया। कृपया पुन: प्रयास करें।",
            resolved: "हल किया गया",
            pending: "लंबित",
            q1: "एनपीके (NPK) क्या है?",
            q2: "मिट्टी पीएच को कैसे समायोजित करें?",
            q3: "सिफारिश कैसे काम करती है?",
            q4: "एक कार्यकारी से बात करें"
        },
        states: {
            "Punjab": "पंजाब (अर्ध-शुष्क मैदान)",
            "Andhra Pradesh": "आंध्र प्रदेश (दक्कन तट)",
            "Maharashtra": "महाराष्ट्र (काली कपास मिट्टी)",
            "Assam": "असम (आर्द्र घाटी)",
            "Karnataka": "कर्नाटक (दक्षिणी पहाड़ियाँ)",
            "Gujarat": "गुजरात (पश्चिम तट मैदान)",
            "Rajasthan": "राजस्थान (थार मरुस्थल)",
            "Tamil Nadu": "तमिलनाडु (कोरोमंडल तट)",
            "Uttar Pradesh": "उत्तर प्रदेश (गंगा के मैदान)",
            "West Bengal": "पश्चिम बंगाल (गंगा डेल्टा)",
            "Madhya Pradesh": "मध्य प्रदेश (केंद्रीय पठार)",
            "Haryana": "हरियाणा (जलोढ़ मैदान)",
            "Bihar": "बिहार (गंगा के मैदान)",
            "Kerala": "केरल (मालाबार तट)"
        },
        soilTypes: {
            "Loamy": "दोमट (उर्वर और संतुलित)",
            "Clayey": "चिकनी (भारी और जल-धारक)",
            "Sandy": "रेतीली (हल्की और तीव्र जल-निकासी)",
            "Silty": "सिल्टी (चिकनी और अच्छी धारण क्षमता)",
            "Peaty": "पीटयुक्त (उच्च कार्बनिक पदार्थ)"
        },
        crops: {
            "Rice": "चावल (धान)",
            "Wheat": "गेहूं",
            "Maize": "मक्का",
            "Cotton": "कपास",
            "Sugarcane": "गन्ना",
            "Tea": "चाय",
            "Potato": "आलू",
            "Tomato": "टमाटर",
            "Groundnut": "मूंगफली",
            "Barley": "जौ",
            "Mustard": "सरसों",
            "Soybeans": "सोयाबीन",
            "Onion": "प्याज़",
            "Garlic": "लहसुन"
        },
        seasons: {
            "Kharif": "खरीफ (मानसून फसल)",
            "Rabi": "रबी (शीतकालीन फसल)",
            "Zaid": "जायद (ग्रीष्मकालीन फसल)"
        },
        stages: {
            "Germination": "अंकुरण (उगना)",
            "Vegetative": "वानस्पतिक (विकास और पत्तियां)",
            "Flowering": "पुष्पन (कलियां आना)",
            "Maturity": "परिपक्वता (पैदावार और कटाई)"
        }
    },
    gu: {
        nav: {
            dashboard: "ડેશબોર્ડ",
            recommendationEngine: "ભલામણ એન્જિન",
            calculationHistory: "ગણતરીનો ઇતિહાસ",
            logout: "ખાતું લોગ આઉટ કરો",
            farmer: "ખેડૂત",
            admin: "એડમિન",
            role: "ખાતાની ભૂમિકા",
            email: "ઈમેલ સરનામું",
            farmerMember: "ખેડૂત સભ્ય",
            administrator: "વહીવટકર્તા",
            themeLight: "લાઇટ",
            themeDark: "ડાર્ક"
        },
        dashboard: {
            controlRoom: "નિયંત્રણ રૂમ",
            sensorBaselines: "સેન્સર બેઝલાઇન",
            recalibrateSensors: "સેન્સર્સ પુનઃપ્રમાણિત કરો",
            recalibrating: "જમીનના સેન્સર્સ પુનઃપ્રમાણિત થઈ રહ્યા છે...",
            adjusting: "NPK બેઝલાઇન ફિલ્ટર્સ એડજસ્ટ થઈ રહ્યા છે...",
            avgNitrogen: "સરેરાશ નાઇટ્રોજન (N)",
            avgPhosphorus: "સરેરાશ ફોસ્ફરસ (P)",
            avgPotassium: "સરેરાશ પોટેશિયમ (K)",
            connecting: "ગ્રીનસ્ટુઅર્ડ સેન્સર્સ સાથે જોડાઈ રહ્યું છે...",
            recentActivity: "તાજેતરની પ્રવૃત્તિ",
            noActivity: "કોઈ અગાઉના ગણતરી રેકોર્ડ મળ્યા નથી. ભલામણ એન્જિનનો ઉપયોગ કરીને નવો સ્કેન ચલાવો.",
            recentPredictions: "તાજેતરની આગાહીઓ",
            sensorStats: "સેન્સર આંકડા",
            active: "સક્રિય",
            calibrated: "કેલિબ્રેટેડ",
            mgKg: "મિલીગ્રામ/કિલો",
            calibrationSuccess: "સેન્સર્સ સફળતાપૂર્વક પુનઃપ્રમાણિત થયા!",
            activeMonitoring: "સક્રિય દેખરેખ",
            fieldOps: "ક્ષેત્ર કામગીરી",
            centralWheat: "செಂಟ્રல் ஃபீல்டு: ઘઉંની દેખરેખ",
            latestRec: "નવીનતમ ભલામણ",
            stableStage: "હાલમાં સ્થિર વનસ્પતિ તબક્કામાં છે. જમીન સ્કેન દરરોજ સવારે 04:00 વાગ્યે ચાલે છે.",
            runScan: "નવો સ્કેન ચલાવો",
            nutrientBalance: "પોષક તત્વોનું સંતુલન (NPK)",
            optimalRange: "શ્રેષ્ઠ શ્રેણી",
            target: "લક્ષ્ય: +5%",
            localForecast: "સ્થાનિક આગાહી",
            soilMoistureTrends: "જમીનના ભેજનો ટ્રેન્ડ",
            biometricHistory: "બાયોમેટ્રિક ભેજનો ઇતિહાસ (14 દિવસ)",
            moistPct: "ભેજ %",
            daysAgo: "14 દિવસ પહેલા",
            today: "આજે",
            fieldInsights: "ખેતરની આંતરદૃષ્ટિ",
            insightNitrogen: "તમારા ખેતરમાં નાઇટ્રોજનનું સ્તર {val} મિલીગ્રામ/કિલો પર સંતુલિત છે. વનસ્પતિ પાંદડાના ઉત્પાદનને સ્થિર રાખવા માટે નિર્ધારિત સિંચાઈ જાળવી રાખો.",
            insightPhosphorusLow: "ફોસ્ફરસની ઉણપની ચેતવણી મળી છે ({val} મિલીગ્રામ/કિલો). સ્થાનિક વરસાદ ચક્ર પહેલાં સ્ટાર્ટર બેઝલ ડ્રેસિંગ લાગુ કરવાનું વિચારો.",
            insightPhosphorusOpt: "ફોસ્ફરસ સ્તર {val} મિલીગ્રામ/કિલો પર શ્રેષ્ઠ છે. મૂળની રચનાનો વિકાસ તંદુરસ્ત રીતે આગળ વધી રહ્યો છે.",
            scanHistory: "બાયોમેટ્રિક સ્કેન ઇતિહાસ",
            crop: "પાક",
            region: "પ્રદેશ",
            recommendation: "ભલામણ",
            actions: "પગલાં",
            view: "જુઓ",
            delete: "ડીલીટ"
        },
        form: {
            title: "ખાતરની ભલામણ",
            description: "અનુકૂળ અહેવાલ જનરેટ કરવા માટે જમીનના પરિમાણો અને પાક ગોઠવણીઓ પ્રદાન કરો.",
            step1: "જમીનની ગુણધર્મો",
            step2: "પાક અને સ્થાન",
            stepTitle1: "પગલું 1: જમીનના પોષક તત્વો અને બંધારણ",
            stepTitle2: "પગલું 2: પાકની પસંદગી અને પર્યાવરણ",
            autofill: "જમીનના અહેવાલમાંથી આપમેળે ભરો",
            uploadDesc: "નાઇટ્રોજન, ફોસ્ફરસ, પોટેશિયમ, પીએચ, ભેજ અને કાર્બન મૂલ્યો આપમેળે કાઢવા માટે તમારા જમીનના અહેવાલની છબી અથવા પીડીએફ અપલોડ કરો.",
            chooseFile: "પીડીએફ અથવા છબી પસંદ કરો",
            scanning: "અહેવાલ સ્કેન થઈ રહ્યો છે...",
            parsedSuccess: "જમીનનો અહેવાલ સફળતાપૂર્વક પારસ થયો!",
            parsedDetails: "{name} માંથી કાઢવામાં આવેલા પરિમાણો. કૃપા કરીને નીચે ભરેલા મૂલ્યોની સમીક્ષા કરો.",
            nitrogen: "નાઇટ્રોજન (N)",
            phosphorus: "ફોસ્ફરસ (P)",
            potassium: "પોટેશિયમ (K)",
            ph: "જમીનનું pH",
            moisture: "ભેજની ટકાવારી",
            carbon: "ઓર્ગેનિક કાર્બન (OC)",
            low: "ઓછું",
            optimum: "શ્રેષ્ઠ",
            high: "વધારે",
            acidic: "એસિડિક",
            neutral: "તટસ્થ",
            alkaline: "આલ્કલાઇન",
            dry: "સૂકું",
            adequate: "પૂરતું",
            saturated: "ભીનું",
            criticallyLow: "ખૂબ જ ઓછું",
            good: "સારું",
            rich: "સમૃદ્ધ",
            next: "આગળ: પાક અને સ્થાન",
            back: "પાછા",
            soilType: "જમીનનો પ્રકાર",
            cropName: "પાકનું નામ",
            suggest: "સુઝાવ આપો",
            suggestTitle: "તમારી જમીન અને પ્રદેશ માટે ભલામણ કરેલ પાકો",
            match: "મેળ",
            cropSeason: "પાકની ઋતુ",
            growthStage: "વિકાસનો તબક્કો",
            location: "ખેતરનું સ્થાન / પ્રદેશ",
            generate: "એઆઈ ભલામણ બનાવો",
            analyzing: "જમીનનું વિશ્લેષણ થઈ રહ્યું છે..."
        },
        result: {
            title: "કૃષિ વિજ્ઞાન વિશ્લેષણ અહેવાલ",
            subtitle: "એઆઈ ખાતર ભલામણ એન્જિન દ્વારા જનરેટ કરાયેલ",
            date: "તારીખ",
            locationLabel: "સ્થાન",
            recommendedProduct: "ભલામણ કરેલ ઉત્પાદન",
            dosage: "ડોઝ",
            aiConfidence: "એઆઈ આત્મવિશ્વાસ રેટિંગ",
            inputMetrics: "ઇનપુટ જમીન અને ખેતરના મેટ્રિક્સ",
            targetCrop: "લક્ષ્ય પાક",
            temp: "ખેતરનું તાપમાન",
            humidity: "ખેતરની ભેજ",
            rainfall: "ખેતરનો વરસાદ",
            diagnostic: "કૃષિ નિદાન વિશ્લેષણ",
            guidelines: "ખેતરમાં ખાતર નાખવાની માર્ગદર્શિકા",
            signature: "અધિકૃત એઆઈ જમીન ભલામણ એન્જિન હસ્તાક્ષર",
            printReport: "પીડીએફ રિપોર્ટ પ્રિન્ટ કરો",
            downloadReport: "અહેવાલ ડાઉનલોડ કરો",
            backToForm: "ફોર્મ પર પાછા જાઓ"
        },
        history: {
            title: "ગણતરીનો ઇતિહાસ",
            subtitle: "અગાઉ જનરેટ કરેલી બધી ખાતર ભલામણો અને જમીનની પ્રોફાઇલ્સ ટ્રૅક કરો.",
            emptyTitle: "કોઈ ઐતિહાસિક રેકોર્ડ નથી",
            emptyDesc: "તમે હજી સુધી કોઈ ભલામણ ચલાવી નથી. અહીં રિપોર્ટ્સ જોવા માટે તમારી પ્રથમ જમીનની પ્રોફાઇલ સબમિટ કરો.",
            getFirst: "પ્રથમ ભલામણ મેળવો",
            viewFull: "સંપૂર્ણ અહેવાલ જુઓ અને પ્રિન્ટ કરો",
            recsDetail: "ભલામણ વિગત",
            loading: "ગણતરીનો ઇતિહાસ મેળવી રહ્યો છે...",
            confidence: "આત્મવિશ્વાસ",
            soilType: "જમીનનો પ્રકાર"
        },
        support: {
            welcome: "નમસ્તે! હું તમારો ગ્રીનસ્ટુઅર્ડ એઆઈ સહાયક છું. આજે હું તમારી જમીન, પાક અને ખાતરોના સંચાલનમાં તમને કેવી રીતે મદદ કરી શકું?",
            title: "ગ્રીનસ્ટુઅર્ડ સપોર્ટ",
            subtitle: "અમે તરત જ જવાબ આપીએ છીએ",
            aiAssistant: "એઆઈ સહાયક",
            contactChannels: "સંપર્ક માધ્યમો",
            requestStatus: "અનુરোধની સ્થિતિ",
            typeQuestion: "તમારો પ્રશ્ન લખો...",
            emailSupport: "ઈમેલ સપોર્ટ",
            phoneHotline: "ફોન હોટલાઇન",
            callbackRegistered: "કોલ-બેક રજીસ્ટર થયેલ છે",
            thankYouCallback: "આભાર, {name}! એક વહીવટી અધિકારી સાથે વાત કરવાની તમારી વિનંતી નોંધવામાં આવી છે. અમે તમને 24 વ્યવસાયિક કલાકોમાં કૉલ કરીશું.",
            submitAnother: "બીજી વિનંતી સબમિટ કરો",
            talkExecutive: "અધિકારી સાથે વાત કરો",
            formSubtitle: "વ્યક્તિગત પરામર્શ અથવા પ્રશ્ન કોલ-બેકની વિનંતી કરો.",
            nameLabel: "નામ *",
            emailLabel: "ઈમેલ સરનામું *",
            phoneLabel: "ફોન નંબર",
            queryCategory: "પ્રશ્નની શ્રેણી",
            messageLabel: "સંદેશ / તમારી સમસ્યાનું વર્ણન કરો",
            messagePlaceholder: "તમે જે ખાતર, જમીન અથવા ભલામણના પ્રશ્નો વિશે ચર્ચા કરવા માંગો છો તેનું વર્ણન કરો...",
            submitting: "સબમિટ થઈ રહ્યું છે...",
            requestCallbackBtn: "કોલ-બેકની વિનંતી કરો",
            requestHistory: "વિનંતીનો ઇતિહાસ",
            fetchingRequests: "વિનંતીઓ મેળવી રહ્યાં છીએ...",
            noTickets: "કોઈ સપોર્ટ ટિકિટ મળી નથી.",
            submitRequest: "વિનંતી સબમિટ કરો",
            ticketType: "પ્રકાર",
            executiveCallback: "એક્ઝિક્યુટિવ કોલ-બેક",
            generalQuery: "સામાન્ય પ્રશ્ન",
            technicalSupport: "તકનીકી સપોર્ટ",
            errorRequired: "નામ અને ઈમેલ જરૂરી છે.",
            errorGeneric: "કંઈક ખોટું થયું. કૃપા કરીને ફરી પ્રયાસ કરો.",
            resolved: "ઉકેલાયેલ",
            pending: "બાકી",
            q1: "NPK શું છે?",
            q2: "જમીનની પીએચ કેવી રીતે એડજસ્ટ કરવી?",
            q3: "ભલામણ કેવી રીતે કામ કરે છે?",
            q4: "એક્ઝિક્યુટિવ સાથે વાત કરો"
        },
        states: {
            "Punjab": "પંજાબ (અર્ધ-શુષ્ક મેદાન)",
            "Andhra Pradesh": "આંધ્રપ્રદેશ (ડેક્કન કોસ્ટ)",
            "Maharashtra": "મહારાષ્ટ્ર (કાળી કપાસની જમીન)",
            "Assam": "આસામ (ભેજવાળી ખીણ)",
            "Karnataka": "કર્ણાટક (દક્ષિણ ટેકરીઓ)",
            "Gujarat": "ગુજરાત (પશ્ચિમ કિનારાના મેદાનો)",
            "Rajasthan": "રાજસ્થાન (થાર રણ)",
            "Tamil Nadu": "તમિલનાડુ (કોરોમંડલ કોસ્ટ)",
            "Uttar Pradesh": "ઉત્તર પ્રદેશ (ગંગાના મેદાનો)",
            "West Bengal": "પશ્ચિમ બંગાળ (ગંગા ડેલ્ટા)"
        },
        soilTypes: {
            "Loamy": "દોમટ (ફળદ્રુપ અને સંતુલિત)",
            "Clayey": "ચીકણી (ભારે અને પાણી-ધારક)",
            "Sandy": "રેતાળ (હલકી અને ઝડપી નિકાલવાળી)",
            "Silty": "સિલ્ટી (લીસી અને સારી પકડ ધરાવતી)",
            "Peaty": "પીટયુક્ત (ઉચ્ચ કાર્બનિક પદાર્થ)"
        },
        crops: {
            "Rice": "ડાંગર (ચોખા)",
            "Wheat": "ઘઉં",
            "Maize": "મકાઈ",
            "Cotton": "કપાસ",
            "Sugarcane": "શેરડી",
            "Tea": "ચા",
            "Potato": "બટાટા",
            "Tomato": "ટામેટા",
            "Groundnut": "મગફળી",
            "Barley": "જવ",
            "Mustard": "રાઈ",
            "Soybeans": "સોયાબીન",
            "Onion": "ડુંગળી",
            "Garlic": "લસણ"
        },
        seasons: {
            "Kharif": "ખરીફ (ચોમાસુ પાક)",
            "Rabi": "રવિ (શિયાળુ પાક)",
            "Zaid": "જાયદ (ઉનાળુ પાક)"
        },
        stages: {
            "Germination": "અંકુરણ (ઉગવું)",
            "Vegetative": "વાનસ્પતિક (વિકાસ અને પાંદડા)",
            "Flowering": "ફૂલ આવવા",
            "Maturity": "પરિપક્વતા (લણણી)"
        }
    },
    hingi: {
        nav: {
            dashboard: "Dashboard",
            recommendationEngine: "Recommendation Engine",
            calculationHistory: "Calculation History",
            logout: "Log Out Account",
            farmer: "Farmer",
            admin: "Admin",
            role: "Account Role",
            email: "Email Address",
            farmerMember: "Farmer Member",
            administrator: "Administrator",
            themeLight: "light",
            themeDark: "dark"
        },
        dashboard: {
            controlRoom: "Control Room",
            sensorBaselines: "Sensor Baselines",
            recalibrateSensors: "Sensors Recalibrate Karein",
            recalibrating: "Soil sensors recalibrate ho rahe hain...",
            adjusting: "NPK baseline filters adjust ho rahe hain...",
            avgNitrogen: "Average Nitrogen (N)",
            avgPhosphorus: "Average Phosphorus (P)",
            avgPotassium: "Average Potassium (K)",
            connecting: "GreenSteward Sensors se connect ho raha hai...",
            recentActivity: "Recent Activity",
            noActivity: "Koi purana record nahi mila. Recommendation Engine se naya scan karein.",
            recentPredictions: "Recent Predictions",
            sensorStats: "Sensor Stats",
            active: "Active",
            calibrated: "Calibrated",
            mgKg: "mg/kg",
            calibrationSuccess: "Sensors successfully recalibrate ho gaye!",
            activeMonitoring: "Active Monitoring",
            fieldOps: "Field Ops",
            centralWheat: "Central Field Ops: Wheat Monitoring",
            latestRec: "Latest recommendation",
            stableStage: "Abhi stable vegetative stage pe hai. Soil scan roz subah 04:00 baje hote hain.",
            runScan: "Naya Scan Karein",
            nutrientBalance: "Nutrient Balance (NPK)",
            optimalRange: "Optimal Range",
            target: "Target: +5%",
            localForecast: "Local Forecast",
            soilMoistureTrends: "Soil Moisture Trends",
            biometricHistory: "Biometric moisture history (14 Days)",
            moistPct: "Moisture %",
            daysAgo: "14 Days Ago",
            today: "Today",
            fieldInsights: "Field Insights",
            insightNitrogen: "Aapke khet me Nitrogen levels {val} mg/kg pe balanced hain. Vegetative leaf production ke liye scheduled irrigation barkarar rakhein.",
            insightPhosphorusLow: "Phosphorus ki kami ka alert mila hai ({val} mg/kg). Local rain cycle se pehle starter basal dressing dalne ka sochein.",
            insightPhosphorusOpt: "Phosphorus levels {val} mg/kg pe optimal hain. Root development sahi chal raha hai.",
            scanHistory: "Biometric Scan History",
            crop: "Crop",
            region: "Region",
            recommendation: "Recommendation",
            actions: "Actions",
            view: "View",
            delete: "Delete"
        },
        form: {
            title: "Fertilizer Recommendation",
            description: "Apne soil parameters aur crop detail bharein naya report banane ke liye.",
            step1: "Soil Properties",
            step2: "Crop & Location",
            stepTitle1: "Step 1: Soil Nutrients & Composition",
            stepTitle2: "Step 2: Crop Selection & Environment",
            autofill: "Soil Report se Auto-Fill karein",
            uploadDesc: "Apne soil report ka PDF ya photo upload karein N, P, K, pH aur moisture nikalne ke liye.",
            chooseFile: "PDF ya Photo select karein",
            scanning: "Report scan ho raha hai...",
            parsedSuccess: "Soil Report successfully parse ho gaya!",
            parsedDetails: "{name} se details nikaal li gayi hain. Ek baar neeche di gayi values check kar lein.",
            nitrogen: "Nitrogen (N)",
            phosphorus: "Phosphorus (P)",
            potassium: "Potassium (K)",
            ph: "Soil pH",
            moisture: "Moisture Percentage",
            carbon: "Organic Carbon (OC)",
            low: "Kam",
            optimum: "Sahi",
            high: "Jyada",
            acidic: "Acidic",
            neutral: "Neutral",
            alkaline: "Alkaline",
            dry: "Sookha",
            adequate: "Adequate",
            saturated: "Saturated",
            criticallyLow: "Bahut Kam",
            good: "Acha",
            rich: "Rich",
            next: "Aage: Crop & Location",
            back: "Peeche",
            soilType: "Soil Type",
            cropName: "Crop Name",
            suggest: "Suggest karein",
            suggestTitle: "Aapki soil aur region ke liye recommended crops",
            match: "Match",
            cropSeason: "Crop Season",
            growthStage: "Growth Stage",
            location: "Field Location / Region",
            generate: "AI Recommendation Banayein",
            analyzing: "Soil analyze ho raha hai..."
        },
        result: {
            title: "Agronomic Analysis Report",
            subtitle: "AI Fertilizer Recommendation Engine se banaya gaya",
            date: "Date",
            locationLabel: "Location",
            recommendedProduct: "Recommended Product",
            dosage: "Dosage",
            aiConfidence: "AI Confidence Rating",
            inputMetrics: "Input Soil & Field Metrics",
            targetCrop: "Target Crop",
            temp: "Field Temperature",
            humidity: "Field Humidity",
            rainfall: "Field Rainfall",
            diagnostic: "Agronomic Diagnostic Analysis",
            guidelines: "Field Application Guidelines",
            signature: "Authorized AI Soil Recommendation Engine Signature",
            printReport: "PDF Report Print Karein",
            backToForm: "Form Pe Wapas Jayein"
        },
        history: {
            title: "Calculation History",
            subtitle: "Pehle banayi gayi saari recommendations aur soil profiles yahan dekhein.",
            emptyTitle: "Koi history nahi hai",
            emptyDesc: "Aapne abhi tak koi recommendation nahi chalayi hai. Yahan details dekhne ke liye pehli request submit karein.",
            getFirst: "Pehli Recommendation Banayein",
            viewFull: "Full Report Dekhein & Print Karein",
            recsDetail: "Recommendation Detail",
            loading: "History load ho rahi hai...",
            confidence: "Confidence",
            soilType: "Soil Type"
        },
        support: {
            welcome: "Namaste! Main aapka GreenSteward AI Assistant hoon. Aaj main aapki soil aur crop management me kya madad kar sakta hoon?",
            title: "GreenSteward Support",
            subtitle: "Hum turant reply karte hain",
            aiAssistant: "AI Assistant",
            contactChannels: "Contact Channels",
            requestStatus: "Request Status",
            typeQuestion: "Apna sawaal likhein...",
            emailSupport: "Email Support",
            phoneHotline: "Phone Hotline",
            callbackRegistered: "Callback Register Ho Gaya",
            thankYouCallback: "Shukriya, {name}! Executive se baat karne ki aapki request save ho gayi hai. Hum aapko 24 ghante me call karenge.",
            submitAnother: "Ek aur request bhejein",
            talkExecutive: "Executive se baat karein",
            formSubtitle: "Callback ya personal consultation request karein.",
            nameLabel: "Naam *",
            emailLabel: "Email Address *",
            phoneLabel: "Phone Number",
            queryCategory: "Query Category",
            messageLabel: "Message / Apni problem batayein",
            messagePlaceholder: "Jo bhi fertilizer, soil ya custom query discuss karni ho, likhein...",
            submitting: "Submit ho raha hai...",
            requestCallbackBtn: "Executive Callback Request Karein",
            requestHistory: "Request History",
            fetchingRequests: "Requests load ho rahi hain...",
            noTickets: "Koi support ticket nahi mila.",
            submitRequest: "Request Bhejein",
            ticketType: "Type",
            executiveCallback: "Executive Callback",
            generalQuery: "General Query",
            technicalSupport: "Technical Support",
            errorRequired: "Naam aur Email jaruri hain.",
            errorGeneric: "Kuch galat ho gaya. Dobara try karein.",
            resolved: "RESOLVED",
            pending: "PENDING",
            q1: "NPK kya hai?",
            q2: "Soil pH kaise adjust karein?",
            q3: "Recommendation kaise kaam karta hai?",
            q4: "Executive se baat karein"
        },
        states: {
            "Punjab": "Punjab",
            "Andhra Pradesh": "Andhra Pradesh",
            "Maharashtra": "Maharashtra",
            "Assam": "Assam",
            "Karnataka": "Karnataka",
            "Gujarat": "Gujarat",
            "Rajasthan": "Rajasthan",
            "Tamil Nadu": "Tamil Nadu",
            "Uttar Pradesh": "Uttar Pradesh",
            "West Bengal": "West Bengal"
        },
        soilTypes: {
            "Loamy": "Loamy Soil",
            "Clayey": "Clayey Soil",
            "Sandy": "Sandy Soil",
            "Silty": "Silty Soil",
            "Peaty": "Peaty Soil"
        },
        crops: {
            "Rice": "Rice",
            "Wheat": "Wheat",
            "Maize": "Maize",
            "Cotton": "Cotton",
            "Sugarcane": "Sugarcane",
            "Tea": "Tea",
            "Potato": "Potato",
            "Tomato": "Tomato",
            "Groundnut": "Groundnut",
            "Barley": "Barley",
            "Mustard": "Mustard",
            "Soybeans": "Soybeans",
            "Onion": "Onion",
            "Garlic": "Garlic"
        },
        seasons: {
            "Kharif": "Kharif (Monsoon Crop)",
            "Rabi": "Rabi (Winter Crop)",
            "Zaid": "Zaid (Summer Crop)"
        },
        stages: {
            "Germination": "Germination",
            "Vegetative": "Vegetative Stage",
            "Flowering": "Flowering Stage",
            "Maturity": "Maturity Stage"
        }
    },
    pa: {
        nav: {
            dashboard: "ਡੈਸ਼ਬੋਰਡ",
            recommendationEngine: "ਸਿਫਾਰਸ਼ ਇੰਜਣ",
            calculationHistory: "ਗਣਨਾ ਇਤਿਹਾਸ",
            logout: "ਖਾਤਾ ਲੌਗ ਆਉਟ ਕਰੋ",
            farmer: "ਕਿਸਾਨ",
            admin: "ਪ੍ਰਸ਼ਾਸਕ",
            role: "ਖਾਤਾ ਭੂਮਿਕਾ",
            email: "ਈਮੇਲ ਪਤਾ",
            farmerMember: "ਕਿਸਾਨ ਮੈਂਬਰ",
            administrator: "ਪ੍ਰਸ਼ਾਸਕ ਮੈਂਬਰ",
            themeLight: "ਲਾਈਟ",
            themeDark: "ਡਾਰਕ"
        },
        dashboard: {
            controlRoom: "ਕੰਟਰੋਲ ਰੂਮ",
            sensorBaselines: "ਸੈਂਸਰ ਬੇસਲਾਈਨ",
            recalibrateSensors: "ਸੈਂਸਰ ਰੀਕੈਲੀਬਰੇਟ ਕਰੋ",
            recalibrating: "ਮਿੱਟੀ ਦੇ ਸੈਂਸਰ ਰੀਕੈਲੀਬਰੇਟ ਕੀਤੇ ਜਾ ਰਹੇ ਹਨ...",
            adjusting: "NPK ਬੇਸਲਾਈਨ ਫਿਲਟਰ ਠੀਕ ਕੀਤੇ ਜਾ ਰਹੇ ਹਨ...",
            avgNitrogen: "ਔਸਤ ਨਾਈਟ੍ਰੋਜਨ (N)",
            avgPhosphorus: "ਔਸਤ ਫਾਸਫੋਰਸ (P)",
            avgPotassium: "ਔਸਤ ਪੋਟਾਸ਼ੀਅਮ (K)",
            connecting: "ਗ੍ਰੀਨਸਟੀਵਰਡ ਸੈਂਸਰਾਂ ਨਾਲ ਜੁੜ ਰਿਹਾ ਹੈ...",
            recentActivity: "ਹਾਲੀਆ ਸਰਗਰਮੀ",
            noActivity: "ਕੋਈ ਪਿਛਲਾ ਰਿਕਾਰਡ ਨਹੀਂ ਮਿਲਿਆ। ਸਿਫਾਰਸ਼ ਇੰਜਣ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਨਵਾਂ ਸਕੈਨ ਚਲਾਓ।",
            recentPredictions: "ਹਾਲੀਆ ਭਵਿੱਖਬਾਣੀਆਂ",
            sensorStats: "ਸੈਂਸਰ ਅੰਕੜੇ",
            active: "ਸਰਗਰਮ",
            calibrated: "ਕੈਲੀਬਰੇਟਡ",
            mgKg: "ਮਿਲੀਗ੍ਰਾਮ/ਕਿਲੋਗ੍ਰਾਮ",
            calibrationSuccess: "ਸੈਂਸਰ ਸਫਲਤਾਪੂਰਵਕ ਰੀਕੈਲੀਬਰੇਟ ਕੀਤੇ ਗਏ!",
            activeMonitoring: "ਸਰਗਰਮ ਨਿਗਰਾਨੀ",
            fieldOps: "ਫੀਲਡ ਓਪਰੇਸ਼ਨ",
            centralWheat: "ਕੇਂਦਰੀ ਫੀਲਡ ਓਪਰੇਸ਼ਨ: ਕਣਕ ਦੀ ਨਿਗਰਾਨੀ",
            latestRec: "ਤਾਜ਼ਾ ਸਿਫਾਰਸ਼",
            stableStage: "ਵਰਤਮਾਨ ਵਿੱਚ ਸਥਿਰ ਵਾਧੇ ਦੇ ਪੜਾਅ 'ਤੇ ਹੈ। ਰੋਜ਼ਾਨਾ ਸਵੇਰੇ 04:00 ਵਜੇ ਮਿੱਟੀ ਦੀ ਜਾਂਚ ਹੁੰਦੀ ਹੈ।",
            runScan: "ਨਵਾਂ ਸਕੈਨ ਕਰੋ",
            nutrientBalance: "ਪੋਸ਼ਕ ਤੱਤਾਂ ਦਾ ਸੰਤੁલਨ (NPK)",
            optimalRange: "ਢੁਕਵੀਂ ਸੀਮਾ",
            target: "ਟੀਚਾ: +5%",
            localForecast: "ਸਥਾਨਕ ਪੂਰਵ-ਅਨੁਮਾਨ",
            soilMoistureTrends: "ਮਿੱਟੀ ਦੀ ਨਮੀ ਦੇ ਰੁਝਾਨ",
            biometricHistory: "ਬਾਇਓਮੈਟ੍ਰਿਕ ਨਮੀ ਦਾ ਇਤਿਹਾਸ (14 ਦਿਨ)",
            moistPct: "ਨਮੀ %",
            daysAgo: "14 ਦਿਨ ਪਹਿਲਾਂ",
            today: "ਅੱਜ",
            fieldInsights: "ਖੇਤ ਸੰਬੰਧੀ ਜਾਣਕਾਰੀ",
            insightNitrogen: "ਤੁਹਾਡੇ ਖੇਤ ਵਿੱਚ ਨਾਈਟ੍ਰੋਜਨ ਦਾ ਪੱਧਰ {val} ਮਿਲੀਗ੍ਰਾਮ/ਕਿਲੋਗ੍ਰਾਮ 'ਤੇ ਸੰਤੁਲਿਤ ਹੈ। ਪੱਤਿਆਂ ਦੇ ਵਾਧੇ ਨੂੰ ਸਥਿਰ ਰੱਖਣ ਲਈ ਸਿੰਚਾਈ ਜਾਰੀ ਰੱਖੋ।",
            insightPhosphorusLow: "ਫਾਸਫੋਰਸ ਦੀ ਕਮੀ ਦੀ ਚੇਤਾਵਨੀ ਮਿਲੀ ਹੈ ({val} ਮਿਲੀਗ੍ਰਾਮ/ਕਿਲੋਗ੍ਰਾਮ)। ਮੀਂਹ ਦੇ ਚੱਕਰ ਤੋਂ ਪਹਿਲਾਂ ਸ਼ੁਰੂਆਤੀ ਖਾਦ ਪਾਉਣ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ।",
            insightPhosphorusOpt: "ਫਾਸਫੋਰਸ ਦਾ ਪੱਧਰ {val} ਮਿਲੀਗ੍ਰਾਮ/ਕਿਲੋਗ੍ਰਾਮ 'ਤੇ ਬਿਲਕੁલ ਢੁਕਵਾਂ ਹੈ। ਜੜ੍ਹਾਂ ਦਾ ਵਿਕਾਸ ਸਹੀ ਢੰਗ ਨਾਲ ਹੋ ਰਇਆ ਹੈ।",
            scanHistory: "ਬਾਇਓਮੈਟ੍ਰਿਕ ਸਕੈਨ ਇਤਿਹਾਸ",
            crop: "ਫਸਲ",
            region: "ਖੇਤਰ",
            recommendation: "ਸਿਫਾਰਸ਼",
            actions: "ਕਾਰਵਾਈਆਂ",
            view: "ਦੇਖੋ",
            delete: "ਹਟਾਓ"
        },
        form: {
            title: "ਖਾਦ ਦੀ ਸਿਫਾਰਸ਼",
            description: "ਇੱਕ ਅਨੁਕੂਲਿਤ ਰਿਪੋਰਟ ਤਿਆਰ ਕਰਨ ਲਈ ਮਿੱਟੀ ਦੇ ਮਾਪਦੰਡ ਅਤੇ ਫਸਲ ਦੀ ਸੰਰਚਨਾ ਪ੍ਰਦਾਨ ਕਰੋ।",
            step1: "ਮਿੱਟੀ ਦੇ ਗੁਣ",
            step2: "ਫਸਲ ਅਤੇ ਸਥਾਨ",
            stepTitle1: "ਕਦਮ 1: ਮਿੱਟੀ ਦੇ ਪੋਸ਼ਕ ਤੱਤ ਅਤੇ ਬਣਤਰ",
            stepTitle2: "ਕਦਮ 2: ਫਸਲ ਦੀ ਚੋਣ ਅਤੇ ਵਾਤਾਵਰਣ",
            autofill: "ਮਿੱਟੀ ਦੀ ਰਿਪੋਰਟ ਤੋਂ ਸਵੈ-ਭਰੋ",
            uploadDesc: "ਐਨ, ਪੀ, ਕੇ, ਪੀਐਚ, ਨਮੀ ਅਤੇ ਕਾਰਬਨ ਮੁੱਲਾਂ ਨੂੰ ਸਵੈਚਾਲਤ ਰੂਪ ਵਿੱਚ ਕੱਢਣ ਲਈ ਆਪਣੀ ਮਿੱਟੀ ਦੀ ਰਿਪੋਰਟ ਦੀ ਇੱਕ ਤਸਵੀਰ ਜਾਂ ਪੀਡੀਐਫ ਅਪਲੋਡ ਕਰੋ।",
            chooseFile: "ਪੀਡੀਐਫ ਜਾਂ ਤਸਵੀਰ ਚੁਣੋ",
            scanning: "ਰਿਪੋਰਟ ਸਕੈਨ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...",
            parsedSuccess: "ਮਿੱਟੀ ਦੀ ਰਿਪੋਰਟ ਸਫਲਤਾਪੂਰਵਕ ਪਾਰਸ ਕੀਤੀ ਗਈ!",
            parsedDetails: "{name} ਤੋਂ ਕੱਢੇ ਗਏ ਮਾਪਦੰਡ। ਕਿਰਪਾ ਕਰਕੇ ਹੇਠਾਂ ਦਿੱਤੇ ਮੁੱਲਾਂ ਦੀ ਸਮੀਖਿਆ ਕਰੋ।",
            nitrogen: "ਨਾਈਟ੍ਰੋਜਨ (N)",
            phosphorus: "ਫਾਸਫੋਰਸ (P)",
            potassium: "ਪੋਟਾਸ਼ੀਅਮ (K)",
            ph: "ਮਿੱਟੀ ਦਾ pH",
            moisture: "ਨਮੀ ਪ੍ਰਤੀਸ਼ਤ",
            carbon: "ਜੈਵਿਕ ਕਾਰਬਨ (OC)",
            low: "ਘੱਟ",
            optimum: "ਢੁਕਵਾਂ",
            high: "ਬਹੁਤ ਜ਼ਿਆਦਾ",
            acidic: "ਤੇਜ਼ਾਬੀ",
            neutral: "ਸਧਾਰਨ",
            alkaline: "ਖਾਰੀ",
            dry: "ਸੁੱਕਾ",
            adequate: "ਲੋੜੀਂਦਾ",
            saturated: "ਤਰ",
            criticallyLow: "ਬਹੁਤ ਹੀ ਘੱਟ",
            good: "ਵਧੀਆ",
            rich: "ਭਰਪੂਰ",
            next: "ਅੱਗੇ: ਫਸਲ ਅਤੇ ਸਥਾਨ",
            back: "ਪਿੱਛੇ",
            soilType: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ",
            cropName: "ਫਸਲ ਦਾ ਨਾਮ",
            suggest: "ਸੁਝਾਅ ਦਿਓ",
            suggestTitle: "ਤੁਹਾਡੀ ਮਿੱਟੀ ਅਤੇ ਖੇਤਰ ਲਈ ਸਿਫਾਰਸ਼ ਕੀਤੀਆਂ ਫਸਲਾਂ",
            match: "ਮੇਲ",
            cropSeason: "ਫਸਲ ਦਾ ਸੀਜ਼ਨ",
            growthStage: "ਵਾਧੇ ਦਾ ਪੜਾਅ",
            location: "ਖੇਤ ਦਾ ਸਥਾਨ / ਖੇਤਰ",
            generate: "AI ਸਿਫਾਰਸ਼ ਤਿਆਰ ਕਰੋ",
            analyzing: "ਮਿੱਟੀ ਦੀ ਜਾਂਚ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ..."
        },
        result: {
            title: "ਖੇਤੀਬਾੜੀ ਵਿਸ਼ਲੇਸ਼ਣ ਰਿਪੋਰਟ",
            subtitle: "AI ਖਾਦ ਸਿਫਾਰਸ਼ ਇੰਜਣ ਦੁਆਰਾ ਤਿਆਰ ਕੀਤਾ ਗਿਆ",
            date: "ਮਿਤੀ",
            locationLabel: "ਸਥਾਨ",
            recommendedProduct: "ਸਿਫਾਰਸ਼ ਕੀਤੀ ਖਾਦ",
            dosage: "ਮਾਤਰਾ",
            aiConfidence: "AI ਭਰੋਸੇਯੋਗਤਾ ਦਰਜਾ",
            inputMetrics: "ਦਰਜ ਕੀਤੇ ਮਿੱਟੀ ਅਤੇ ਖੇਤ ਦੇ ਅੰਕੜੇ",
            targetCrop: "ਲקਸ਼ਿਤ ਫਸਲ",
            temp: "ਖੇਤ ਦਾ ਤਾਪਮਾਨ",
            humidity: "ਖੇਤ ਦੀ ਨਮੀ",
            rainfall: "ਖੇਤ ਦੀ ਵਰਖਾ",
            diagnostic: "ਖੇਤੀਬਾੜੀ ਡਾਇਗਨੌਸਟਿਕ ਵਿਸ਼ਲੇਸ਼ਣ",
            guidelines: "ਖੇਤ ਵਿੱਚ ਵਰਤੋਂ ਦੇ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼",
            signature: "ਅਧਿਕਾਰਤ AI ਮਿੱਟੀ ਸਿਫਾਰਸ਼ ਇੰਜਣ ਦਸਤਖਤ",
            printReport: "ਪੀਡੀਐਫ ਰਿਪੋਰਟ ਪ੍ਰਿੰਟ ਕਰੋ",
            backToForm: "ਫਾਰਮ 'ਤੇ ਵਾਪਸ ਜਾਓ"
        },
        history: {
            title: "ਗਣਨਾ ਇਤਿਹਾਸ",
            subtitle: "ਪਹਿਲਾਂ ਤਿਆਰ ਕੀਤੀਆਂ ਸਾਰੀਆਂ ਖਾਦ ਸਿਫਾਰਸ਼ਾਂ ਅਤੇ ਮਿੱਟੀ ਦੇ ਪ੍ਰੋਫਾਈਲਾਂ ਨੂੰ ਟਰੈਕ ਕਰੋ।",
            emptyTitle: "ਕੋਈ ਇਤਿਹਾਸਕ ਰਿਕਾਰਡ ਨਹੀਂ",
            emptyDesc: "ਤੁਸੀਂ ਅਜੇ ਤੱਕ ਕੋਈ ਸਿਫਾਰਸ਼ ਨਹੀਂ ਚਲਾਈ ਹੈ। ਰਿਪੋਰਟਾਂ ਨੂੰ ਦੇਖਣ ਲਈ ਆਪਣੀ ਪਹਿਲੀ ਮਿੱਟੀ ਦੀ ਪ੍ਰੋਫਾਈਲ ਜਮ੍ਹਾਂ ਕਰੋ।",
            getFirst: "ਪਹਿਲੀ ਸਿਫਾਰਸ਼ ਪ੍ਰਾਪਤ ਕਰੋ",
            viewFull: "ਪੂਰੀ ਰਿਪੋਰਟ ਦੇਖੋ ਅਤੇ ਪ੍ਰਿੰਟ ਕਰੋ",
            recsDetail: "ਸਿਫਾਰਸ਼ ਦਾ ਵੇਰਵਾ",
            loading: "ਗਣਨਾ ਇਤਿਹਾਸ ਪ੍ਰਾਪਤ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
            confidence: "ਭਰੋਸਾ",
            soilType: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ"
        },
        support: {
            welcome: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਗ੍ਰੀਨਸਟੀਵਰਡ AI ਸਹਾਇਕ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਮਿੱਟੀ, ਫਸਲਾਂ ਅਤੇ ਖਾਦਾਂ ਦੇ ਪ੍ਰਬੰਧਨ ਵਿੱਚ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
            title: "ਗ੍ਰੀਨਸਟੀਵਰਡ ਸਹਾਇਤਾ",
            subtitle: "ਅਸੀਂ ਤੁਰੰਤ ਜਵਾਬ ਦਿੰਦੇ ਹਾਂ",
            aiAssistant: "AI ਸਹਾਇਕ",
            contactChannels: "ਸੰਪਰਕ ਚੈਨਲ",
            requestStatus: "ਅਨੁਰੋਧ ਦੀ ਸਥਿਤੀ",
            typeQuestion: "ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ...",
            emailSupport: "ਈਮੇਲ ਸਹਾਇਤਾ",
            phoneHotline: "ਫ਼ੋਨ ਹਾਟਲਾਈਨ",
            callbackRegistered: "ਕਾਲ-ਬੈਕ ਰਜਿਸਟਰਡ",
            thankYouCallback: "ਧੰਨਵਾਦ, {name}! ਇੱਕ ਕਾਰਜਕਾਰੀ ਨਾਲ ਗੱਲ ਕਰਨ ਦੀ ਤੁਹਾਡੀ ਬੇਨਤੀ ਦਰਜ ਕਰ ਲਈ ਗਈ ਹੈ। ਅਸੀਂ ਤੁਹਾਨੂੰ 24 ਕਾਰੋਬਾਰੀ ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ ਕਾਲ ਕਰਾਂਗੇ।",
            submitAnother: "ਦੂਜੀ ਬੇਨਤੀ ਸਪੁਰਦ ਕਰੋ",
            talkExecutive: "ਇੱਕ ਕਾਰਜਕਾਰੀ ਨਾਲ ਗੱਲ ਕਰੋ",
            formSubtitle: "ਇੱਕ ਨਿੱਜੀ ਸਲਾਹ ਜਾਂ ਸਵਾਲ ਕਾਲ-ਬੈਕ ਦੀ ਬੇਨਤੀ ਕਰੋ।",
            nameLabel: "ਨਾਮ *",
            emailLabel: "ਈਮੇਲ ਪਤਾ *",
            phoneLabel: "ਫ਼ੋਨ ਨੰਬਰ",
            queryCategory: "ਸਵਾਲ ਦੀ ਸ਼੍ਰੇਣੀ",
            messageLabel: "ਸੁਨੇਹਾ / ਆਪਣੀ ਸਮੱਸਿਆ ਕਰੋ",
            messagePlaceholder: "ਉਸ ਖਾਦ, ਮਿੱਟੀ ਜਾਂ ਸਿਫਾਰਸ਼ ਬਾਰੇ ਦੱਸੋ ਜਿਸ ਬਾਰੇ ਤੁਸੀਂ ਗੱਲ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ...",
            submitting: "ਸਪੁਰਦ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
            requestCallbackBtn: "ਕਾਰਜਕਾਰੀ ਕਾਲ-ਬੈਕ ਦੀ ਬੇਨਤੀ ਕਰੋ",
            requestHistory: "ਬੇਨਤੀ ਦਾ ਇਤਿਹਾਸ",
            fetchingRequests: "ਬੇਨਤੀਆਂ ਪ੍ਰਾਪਤ ਕੀਤੀਆਂ ਜਾ ਰਹੀਆਂ ਹਨ...",
            noTickets: "ਕੋਈ ਟਿਕਟ ਨਹੀਂ ਮਿਲੀ।",
            submitRequest: "ਬੇਨਤੀ ਸਪੁਰਦ ਕਰੋ",
            ticketType: "ਕਿਸਮ",
            executiveCallback: "ਕਾਰਜਕਾਰੀ ਕਾਲ-ਬੈਕ",
            generalQuery: "ਆਮ ਸਵਾਲ",
            technicalSupport: "ਤਕਨੀਕੀ ਸਹਾਇਤਾ",
            errorRequired: "ਨਾਮ ਅਤੇ ਈਮੇਲ ਲੋੜੀਂਦੇ ਹਨ।",
            errorGeneric: "ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
            resolved: "ਹੱਲ ਕੀਤਾ ਗਿਆ",
            pending: "ਲੰਬਿਤ",
            q1: "ਐਨਪੀਕੇ (NPK) ਕੀ ਹੈ?",
            q2: "ਮਿੱਟੀ ਦਾ pH ਕਿਵੇਂ ਠੀਕ ਕਰੀਏ?",
            q3: "ਸਿਫਾਰਸ਼ ਕਿਵੇਂ ਕੰਮ ਕਰਦੀ ਹੈ?",
            q4: "ਇੱਕ ਕਾਰਜਕਾਰੀ ਨਾਲ ਗੱਲ ਕਰੋ"
        },
        states: {
            "Punjab": "ਪੰਜਾਬ (ਅਰਧ-ਖੁਸ਼ਕ ਮੈਦਾਨ)",
            "Andhra Pradesh": "ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼ (ਦੱਖਣੀ ਤੱਟ)",
            "Maharashtra": "ਮਹਾਰਾਸ਼ਟਰ (ਕਾਲੀ ਕਪਾਹ ਮਿੱਟੀ)",
            "Assam": "ਅਸਾਮ (ਨਮੀ ਵਾਲੀ ਘਾਟੀ)",
            "Karnataka": "ਕਰਨਾਟਕ (ਦੱਖਣੀ ਪਹਾੜੀਆਂ)",
            "Gujarat": "ਗੁਜਰਾਤ (ਪੱਛਮੀ ਤੱਟ ਮੈਦਾਨ)",
            "Rajasthan": "ਰਾਜਸਥਾਨ (ਥਾਰ ਮਾਰੂਥਲ)",
            "Tamil Nadu": "ਤਾਮਿਲਨਾਡੂ (ਕੋਰੋਮੰਡਲ ਤੱਟ)",
            "Uttar Pradesh": "ਉੱਤਰ ਪ੍ਰਦੇਸ਼ (ਗੰਗਾ ਦੇ ਮੈਦਾਨ)",
            "West Bengal": "ਪੱਛਮੀ ਬੰਗਾਲ (ਗੰਗਾ ਡੈਲਟา)"
        },
        soilTypes: {
            "Loamy": "ਦੋਮਟ (ਉਪਜਾਊ ਅਤੇ ਸੰਤੁਲਿਤ)",
            "Clayey": "ਚਿਕਣੀ (ਭਾਰੀ ਅਤੇ ਪਾਣੀ ਰੋਕਣ ਵਾਲੀ)",
            "Sandy": "ਰੇਤਲੀ (ਹਲਕੀ ਅਤੇ ਤੇਜ਼ ਨਿਕਾਸ)",
            "Silty": "ਸਿਲਟੀ (ਮੁਲਾਇਮ ਅਤੇ ਵਧੀਆ ਰੋਕਥਾਮ)",
            "Peaty": "ਪੀਟ ਵਾਲੀ (ਉੱਚ ਜੈਵਿਕ ਪਦਾਰਥ)"
        },
        crops: {
            "Rice": "ਝੋਨਾ (ਚਾਵਲ)",
            "Wheat": "ਕਣਕ",
            "Maize": "ਮੱਕੀ",
            "Cotton": "ਨਰਮਾ (ਕਪਾਹ)",
            "Sugarcane": "ਗੰਨਾ",
            "Tea": "ਚਾਹ",
            "Potato": "ਆਲੂ",
            "Tomato": "ਟਮਾਟਰ",
            "Groundnut": "ਮੂੰਗਫਲੀ",
            "Barley": "ਜੌਂ",
            "Mustard": "ਸਰ੍ਹੋਂ",
            "Soybeans": "ਸੋਇਆਬੀਨ",
            "Onion": "ਗੰਢਾ (ਪਿਆਜ਼)",
            "Garlic": "ਲਸਣ"
        },
        seasons: {
            "Kharif": "ਹਾੜੀ (ਖਰੀਫ)",
            "Rabi": "ਸਾਉਣੀ (ਰਬੀ)",
            "Zaid": "ਜ਼ੈਦ (ਗਰਮੀ ਦੀ ਫਸਲ)"
        },
        stages: {
            "Germination": "ਪੁੰਗਰਨਾ",
            "Vegetative": "ਫਸਲ ਦਾ ਵਾਧਾ",
            "Flowering": "ਫੁੱਲ ਪੈਣਾ",
            "Maturity": "ਪੱਕਣਾ (ਕਟਾਈ)"
        }
    }
};

const languagesList = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'hingi', label: 'Hinglish' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'as', label: 'অসমীয়া (Assamese)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'bn', label: 'বাংলা (Bengali)' }
];

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('ferto_language');
        const isSupported = languagesList.some(l => l.code === saved);
        return isSupported ? saved : 'en';
    });

    useEffect(() => {
        localStorage.setItem('ferto_language', language);
    }, [language]);

    const t = (path) => {
        const keys = path.split('.');
        let current = translations[language] || translations['en'];
        for (const key of keys) {
            if (current[key] === undefined) {
                // fallback to English
                let enCurrent = translations['en'];
                for (const enKey of keys) {
                    if (enCurrent[enKey] === undefined) return path;
                    enCurrent = enCurrent[enKey];
                }
                return enCurrent;
            }
            current = current[key];
        }
        return current;
    };

    const tState = (stateName) => {
        const cleanState = (stateName || '').split(' (')[0].trim();
        const stateTranslations = translations[language]?.states || translations['en']?.states;
        const keys = Object.keys(stateTranslations);
        const matchKey = keys.find(k => k.toLowerCase() === cleanState.toLowerCase());
        return matchKey ? stateTranslations[matchKey] : stateName;
    };

    const tSoilType = (soilName) => {
        const cleanSoil = (soilName || '').split(' (')[0].trim();
        const soilTranslations = translations[language]?.soilTypes || translations['en']?.soilTypes;
        const keys = Object.keys(soilTranslations);
        const matchKey = keys.find(k => k.toLowerCase() === cleanSoil.toLowerCase());
        return matchKey ? soilTranslations[matchKey] : soilName;
    };

    const tCrop = (cropName) => {
        const cleanCrop = (cropName || '').trim();
        const cropTranslations = translations[language]?.crops || translations['en']?.crops;
        const keys = Object.keys(cropTranslations);
        const matchKey = keys.find(k => k.toLowerCase() === cleanCrop.toLowerCase());
        return matchKey ? cropTranslations[matchKey] : cropName;
    };

    const tSeason = (seasonName) => {
        const cleanSeason = (seasonName || '').split(' (')[0].trim();
        const seasonTranslations = translations[language]?.seasons || translations['en']?.seasons;
        const keys = Object.keys(seasonTranslations);
        const matchKey = keys.find(k => k.toLowerCase() === cleanSeason.toLowerCase());
        return matchKey ? seasonTranslations[matchKey] : seasonName;
    };

    const tStage = (stageName) => {
        const cleanStage = (stageName || '').split(' (')[0].trim();
        const stageTranslations = translations[language]?.stages || translations['en']?.stages;
        const keys = Object.keys(stageTranslations);
        const matchKey = keys.find(k => k.toLowerCase() === cleanStage.toLowerCase());
        return matchKey ? stageTranslations[matchKey] : stageName;
    };

    const tFertilizer = (fertName) => {
        const ferts = {
            en: {
                "Urea": "Urea", "DAP": "DAP", "MOP": "MOP", "NPK 19-19-19": "NPK 19-19-19",
                "SSP": "SSP", "Ammonium Sulfate": "Ammonium Sulfate", "Organic Compost": "Organic Compost",
                "Gypsum": "Gypsum", "SOP": "SOP", "Zinc Sulfate": "Zinc Sulfate"
            },
            hi: {
                "Urea": "यूरिया", "DAP": "डीएपी", "MOP": "एमओपी", "NPK 19-19-19": "एनपीके 19-19-19",
                "SSP": "एसएसपी", "Ammonium Sulfate": "अमोनियम सल्फेट", "Organic Compost": "जैविक कम्पोस्ट",
                "Gypsum": "जिप्सम", "SOP": "एसओपी", "Zinc Sulfate": "जिंक सल्फेट"
            },
            gu: {
                "Urea": "યુરિયા", "DAP": "ડીએપી", "MOP": "એમઓપી", "NPK 19-19-19": "એનપીકે 19-19-19",
                "SSP": "એસએસપી", "Ammonium Sulfate": "એમોનિયમ સલ્ફેટ", "Organic Compost": "સેન્દ્રિય કમ્પોસ્ટ",
                "Gypsum": "જીપ્સમ", "SOP": "એસઓપી", "Zinc Sulfate": "ઝીંક સલ્ફેટ"
            },
            hingi: {
                "Urea": "Urea", "DAP": "DAP", "MOP": "MOP", "NPK 19-19-19": "NPK 19-19-19",
                "SSP": "SSP", "Ammonium Sulfate": "Ammonium Sulfate", "Organic Compost": "Organic Compost",
                "Gypsum": "Gypsum", "SOP": "SOP", "Zinc Sulfate": "Zinc Sulfate"
            },
            pa: {
                "Urea": "ਯੂਰੀਆ", "DAP": "ਡੀਏਪੀ", "MOP": "ਐਮਓਪੀ", "NPK 19-19-19": "ਐਨਪੀਕੇ 19-19-19",
                "SSP": "ਐਸਐਸਪੀ", "Ammonium Sulfate": "ਅਮੋਨੀਅਮ ਸਲਫੇਟ", "Organic Compost": "ਜੈਵਿਕ ਖਾਦ (ਕੰਪੋਸਟ)",
                "Gypsum": "ਜਿਪਸਮ", "SOP": "ਐਸਓਪੀ", "Zinc Sulfate": "ਜ਼ਿੰਕ ਸਲਫੇਟ"
            }
        };
        const activeMap = ferts[language] || ferts['en'];
        const matchKey = Object.keys(activeMap).find(k => k.toLowerCase() === (fertName || '').trim().toLowerCase());
        return matchKey ? activeMap[matchKey] : fertName;
    };

    const tDosage = (dosageStr) => {
        if (!dosageStr) return '';
        const match = dosageStr.match(/^(\d+)\s*kg\/acre$/i);
        if (!match) return dosageStr;
        const num = match[1];
        const suffixMap = {
            en: "kg/acre",
            hi: "किग्रा/एकड़",
            gu: "કિગ્રા/એકર",
            hingi: "kg/acre",
            pa: "ਕਿਲੋਗ੍ਰਾਮ/ਏਕੜ",
            te: "kg/acre",
            mr: "kg/acre",
            as: "kg/acre",
            kn: "kg/acre",
            ta: "kg/acre",
            bn: "kg/acre"
        };
        const suffix = suffixMap[language] || suffixMap['en'];
        return `${num} ${suffix}`;
    };

    const getExplanationTranslation = (englishExplanation) => {
        if (!englishExplanation) return '';

        const database = {
            urea: {
                en: "The soil test shows a critical deficiency in Nitrogen (N) while Phosphorus and Potassium levels are adequate. Urea is a highly concentrated nitrogenous fertilizer that will promote rapid vegetative growth and leaf greening.",
                hi: "मिट्टी के परीक्षण से नाइट्रोजन (N) की अत्यधिक कमी का पता चलता है जबकि फास्फोरस और पोटेशियम का स्तर पर्याप्त है। यूरिया एक अत्यधिक संकेंद्रित नाइट्रोजनयुक्त उर्वरक है जो पौधों के तेजी से विकास और पत्तियों को हरा करने में मदद करेगा।",
                gu: "જમીનની ચકાસણીમાં નાઇટ્રોજન (N) ની ભારે ઉણપ જોવા મળે છે જ્યારે ફોસ્ફરસ અને પોટેશિયમનું પ્રમાણ પૂરતું છે. યુરિયા એ અત્યંત કેન્દ્રિત નાઇટ્રોજનયુક્ત ખાતર છે જે છોડના ઝડપી વિકાસ અને પાંદડાને લીલા કરવામાં મદદ કરશે।",
                hingi: "Soil test me Nitrogen (N) ki critical deficiency dikhi hai, jabki Phosphorus aur Potassium levels thik hain. Urea ek high-concentration nitrogen fertilizer hai jo jaldi leaf greening aur vegetative growth me madad karega.",
                pa: "ਮਿੱਟੀ ਦੀ ਜਾਂਚ ਨਾਈਟ੍ਰੋਜਨ (N) ਦੀ ਭਾਰੀ ਕਮੀ ਦਰਸਾਉਂਦੀ ਹੈ ਜਦੋਂ ਕਿ ਫਾਸਫੋਰਸ ਅਤੇ ਪੋਟਾਸ਼ੀਅਮ ਦਾ ਪੱਧਰ ਠੀਕ ਹੈ। ਯੂਰੀਆ ਇੱਕ ਬਹੁਤ ਹੀ ਸੰਘਣਾ ਨਾਈਟ੍ਰੋਜਨ ਵਾਲਾ ਖਾਦ ਹੈ ਜੋ ਫਸਲ ਦੇ ਤੇਜ਼ੀ ਨਾਲ ਵਧਣ ਅਤੇ ਪੱਤਿਆਂ ਨੂੰ ਹਰਾ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰੇਗਾ।"
            },
            dap: {
                en: "Low Phosphorus (P) coupled with low-to-moderate Nitrogen (N) is detected. Diammonium Phosphate (DAP) provides the essential starter phosphorus required for robust root establishment and early seedling vigor.",
                hi: "कम फास्फोरस (P) के साथ निम्न-से-मध्यम नाइट्रोजन (N) का पता चला है। डायमोनियम फॉस्फेट (DAP) मजबूत जड़ स्थापना और शुरुआती पौधे की शक्ति के लिए आवश्यक शुरुआती फास्फोरस प्रदान करता है।",
                gu: "ઓછા ફોસ્ફરસ (P) સાથે ઓછાથી મધ્યમ નાઇટ્રોજન (N) ની હાજરી જોવા મળી છે. ડાયમોનિયમ ફોસ્ફેટ (DAP) મજબૂત મૂળ સ્થાપના અને પ્રારંભિક વિકાસ માટે જરૂરી ફોસ્ફરસ પ્રદાન કરે છે।",
                hingi: "Low Phosphorus (P) aur low-to-moderate Nitrogen (N) mila hai. Diammonium Phosphate (DAP) khet ko shuruaati phosphorus deta hai jo strong root development aur shuruaati growth ke liye jaruri hai.",
                pa: "ਘੱਟ ਫਾਸਫੋਰਸ (P) ਦੇ ਨਾਲ ਘੱਟ ਤੋਂ ਮੱਧਮ ਨਾਈਟ੍ਰੋਜਨ (N) ਦੀ ਪਛਾਣ ਕੀਤੀ ਗਈ ਹੈ। ਡਾਇਮੋਨੀਅਮ ਫਾਸਫੇਟ (DAP) ਮਜ਼ਬੂਤ ਜੜ੍ਹਾਂ ਦੇ ਵਿਕਾਸ ਅਤੇ ਸ਼ੁਰੂਆਤੀ ਫਸਲ ਦੇ ਵਾਧੇ ਲਈ ਲੋੜੀਂਦਾ ਫਾਸਫੋਰਸ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ।"
            },
            mop: {
                en: "Potassium (K) levels are deficient. Muriate of Potash (MOP) is recommended to regulate water transport, improve crop disease resistance, and enhance grain/fruit size and overall quality.",
                hi: "पोटेशियम (K) का स्तर कम है। पानी के परिवहन को नियंत्रित करने, फसल रोग प्रतिरोधक क्षमता में सुधार करने और अनाज/फल के आकार और समग्र गुणवत्ता को बढ़ाने के लिए मूरिएट ऑफ पोटाश (MOP) की सिफारिश की जाती है।",
                gu: "પોટેશિયમ (K) નું સ્તર ઓછું છે. પાણીના વહનને નિયંત્રિત કરવા, રોગ પ્રતિકારક શક્તિ સુધારવા અને અનાજ/ફળનું કદ અને ગુણવत्ता વધારવા માટે મ્યુરિએટ ઓફ પોટાશ (MOP) ની ભલામણ કરવામાં આવે છે।",
                hingi: "Potassium (K) levels kam hain. Muriate of Potash (MOP) khet me water transport regulate karne, disease resistance badhane aur grain/fruit size aur quality badhane me madad karega.",
                pa: "ਪੋਟਾਸ਼ੀਅਮ (K) ਦਾ ਪੱਧਰ ਘੱਟ ਹੈ। ਪਾਣੀ ਦੇ ਸੰਚਾਰ ਨੂੰ ਨਿਯੰਤਰਿਤ ਕਰਨ, ਫਸਲਾਂ ਦੇ ਰੋਗਾਂ ਨਾਲ ਲੜਨ ਦੀ ਸਮਰੱਥਾ ਵਧਾਉਣ ਅਤੇ ਅਨਾਜ/ਫਲ ਦੇ ਆਕਾਰ ਅਤੇ ਗੁਣਵੱਤਾ ਨੂੰ ਸੁਧਾਰਨ ਲਈ ਮਿਊਰੀਏਟ ਆਫ ਪੋਟਾਸ਼ (MOP) ਦੀ ਸਿਫਾਰਸ਼ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।"
            },
            npk19: {
                en: "A balanced depletion of primary macronutrients (Nitrogen, Phosphorus, and Potassium) is detected. This balanced formulation will restore overall macronutrient levels across all growth stages.",
                hi: "प्राथमिक वृहद् पोषक तत्वों (नाइट्रोजन, फास्फोरस और पोटेशियम) की संतुलित कमी पाई गई है। यह संतुलित सूत्रीकरण सभी विकास चरणों में समग्र वृहद् पोषक तत्वों के स्तर को बहाल करेगा।",
                gu: "નાઇટ્રોજન, ફોસ્ફરસ અને પોટેશિયમની સંતુલિત ઉણપ જોવા મળી છે. આ સંતુલિત ખાતર પાકના તમામ વિકાસ તબક્કાઓ દરમિયાન પોષક તત્વોનું પ્રમાણ પુનઃસ્થાપિત કરશે।",
                hingi: "Primary macronutrients (Nitrogen, Phosphorus, Potassium) ki balanced depletion mili hai. NPK 19-19-19 fertilizer soil me overall macronutrients level ko restore karega.",
                pa: "ਮੁੱਖ ਪੋਸ਼ਕ ਤੱਤਾਂ (ਨਾਈਟ੍ਰੋਜਨ, ਫਾਸਫੋਰਸ ਅਤੇ ਪੋਟਾਸ਼ੀਅਮ) ਦੀ ਇੱਕਸਾਰ ਕਮੀ ਦੇਖੀ ਗਈ ਹੈ। ਇਹ ਸੰਤੁਲਿਤ ਖਾਦ ਫਸਲ ਦੇ ਵਾਧੇ ਦੇ ਸਾਰੇ ਪੜਾਵਾਂ ਵਿੱਚ ਪੋਸ਼ਕ ਤੱਤਾਂ ਦੇ ਪੱਧਰ ਨੂੰ ਬਹਾਲ ਕਰੇਗੀ।"
            },
            ssp: {
                en: "Low Phosphorus levels in acidic soil. Single Super Phosphate (SSP) provides readily available phosphorus along with sulfur and calcium, which helps buffer acidic soil conditions and support root growth.",
                hi: "अम्लीय मिट्टी में कम फास्फोरस स्तर। सिंगल सुपर फॉस्फेट (SSP) सल्फर और कैल्शियम के साथ आसानी से उपलब्ध फास्फोरस प्रदान करता है, जो अम्लीय मिट्टी की स्थिति को बफर करने और जड़ों के विकास में मदद करता है।",
                gu: "એસિડિક જમીનમાં ફોસ્ફરસનું ઓછું પ્રમાણ. સિંગલ સુપર ફોસ્ફેટ (SSP) સલ્ફર અને કેલ્શિયમ સાથે સરળતાથી ઉપલબ્ધ ફોસ્ફરસ પ્રદાન કરે છે, જે એસિડિક જમીનની સ્થિતિને સુધારવામાં અને મૂળના વિકાસમાં મદદ કરે છે।",
                hingi: "Acidic soil me Phosphorus levels kam hain. Single Super Phosphate (SSP) sulphur aur calcium ke sath active phosphorus deta hai, jo root growth me support karta hai.",
                pa: "ਤੇਜ਼ਾਬੀ ਮਿੱਟੀ ਵਿੱਚ ਫਾਸਫੋਰਸ ਦਾ ਘੱਟ ਪੱਧਰ। ਸਿੰਗਲ ਸੁਪਰ ਫਾਸਫੇਟ (SSP) ਗੰਧਕ ਅਤੇ ਕੈਲਸ਼ੀਅਮ ਦੇ ਨਾਲ ਜਲਦੀ ਉਪਲਬਧ ਫਾਸਫੋਰਸ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ, ਜੋ ਤੇਜ਼ਾਬੀ ਮਿੱਟੀ ਨੂੰ ਠੀਕ ਕਰਨ ਅਤੇ ਜੜ੍ਹਾਂ ਦੇ ਵਾਧੇ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।"
            },
            ammoniumSulfate: {
                en: "Soil pH is alkaline (> 7.6) and Nitrogen is deficient. Ammonium Sulfate helps acidify the soil surrounding the roots while supplying essential nitrogen and sulfur.",
                hi: "मिट्टी का पीएच क्षारीय (> 7.6) है और नाइट्रोजन की कमी है। अमोनियम सल्फेट आवश्यक नाइट्रोजन और सल्फर की आपूर्ति करते हुए जड़ों के आसपास की मिट्टी को अम्लीकृत करने में मदद करता है।",
                gu: "જમીનનો pH આલ્કલાઇન (> ૭.૬) છે અને નાઇટ્રોજનની ઉણપ છે. એમોનિયમ સલ્ફેટ મૂળની આસપાસની જમીનને એસિડિક બનાવવામાં મદદ કરે છે અને જરૂરી નાઇટ્રોજન અને સલ્ફર પ્રદાન કરે છે।",
                hingi: "Soil pH alkaline (> 7.6) hai aur Nitrogen kam hai. Ammonium Sulfate roots ke aas-paas ki soil ko acidify karega aur Nitrogen/Sulphur supply karega.",
                pa: "ਮਿੱਟੀ ਦਾ pH ਖਾਰਾ (> 7.6) ਹੈ ਅਤੇ ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਕਮੀ ਹੈ। ਅਮੋਨੀਅਮ ਸਲਫੇਟ ਜੜ੍ਹਾਂ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਦੀ ਮਿੱਟੀ ਦੇ ਖਾਰੇਪਣ ਨੂੰ ਘਟਾਉਣ ਦੇ ਨਾਲ-ਨਾਲ ਲੋੜੀਂਦਾ ਨਾਈਟ੍ਰੋਜਨ ਅਤੇ ਗੰਧਕ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ।"
            },
            compost: {
                en: "Organic Carbon is critically low (< 0.45%). Applying organic compost will improve soil structure, microbial activity, water retention capacity, and overall long-term soil fertility.",
                hi: "जैविक कार्बन गंभीर रूप से कम (< 0.45%) है। जैविक खाद डालने से मिट्टी की संरचना, सूक्ष्मजीवी गतिविधि, जल धारण क्षमता और समग्र दीर्घकालिक मिट्टी की उर्वरता में सुधार होगा।",
                gu: "ઓર્ગેનિક કાર્બન ખૂબ જ ઓછો (< ૦.૪૫%) છે. સેન્દ્રિય ખાતર વાપરવાથી જમીનનું બંધારણ, સૂક્ષ્મજીવોની પ્રવૃત્તિ, જળ સંગ્રહ ક્ષમતા અને લાંબા ગાળાની ફળદ્રુપતામાં સુધારો થશે।",
                hingi: "Organic Carbon bahut kam (< 0.45%) hai. Organic compost lagane se soil structure, microbial activity, water holding capacity aur fertility improve hogi.",
                pa: "ਜੈਵਿਕ ਕਾਰਬਨ ਬਹੁਤ ਹੀ ਘੱਟ (< 0.45%) ਹੈ। ਜੈਵਿਕ ਖਾਦ ਪਾਉਣ ਨਾਲ ਮਿੱਟੀ ਦੀ ਬਣਤਰ, ਸੂਖਮ ਜੀਵਾਂ ਦੀ ਗਤੀਵਿਧੀ, ਪਾਣੀ ਰੋਕਣ ਦੀ ਸਮਰੱਥਾ ਅਤੇ ਮਿੱਟੀ ਦੀ ਉਪਜਾਊ ਸ਼ਕਤੀ ਵਿੱਚ ਲੰਬੇ ਸਮੇਂ ਲਈ ਸੁਧਾਰ ਹੋਵੇਗਾ।"
            },
            gypsum: {
                en: "Highly alkaline soil (pH > 8.0) is detected. Gypsum supplies calcium and sulfate sulfur, which helps displace sodium on soil particles, improving permeability and lowering soil pH.",
                hi: "अत्यधिक क्षारीय मिट्टी (pH > 8.0) का पता चला है। जिप्सम कैल्शियम और सल्फेट सल्फर की आपूर्ति करता है, जो मिट्टी के कणों पर सोडियम को विस्थापित करने, पारगम्यता में सुधार करने और मिट्टी के पीएच को कम करने में मदद करता है।",
                gu: "અત્યંત આલ્કલાઇન જમીન (pH > ૮.૦) જોવા મળી છે. જીપ્સમ કેલ્શિયમ અને સલ્ફેટ પૂરા પાડે છે, જે જમીનના કણો પરના સોડિયમને વિસ્થાપિત કરવામાં, પાણી શોષવાની ક્ષમતા વધારવામાં અને જમીનનો pH ઘટાડવામાં મદદ કરે છે।",
                hingi: "Alkaline soil (pH > 8.0) mili hai. Gypsum calcium aur sulphate supply karta hai jo sodium ko displace karke pH ko neutral range me lata hai.",
                pa: "ਮਿੱਟੀ ਬਹੁਤ ਜ਼ਿਆਦਾ ਖਾਰੀ (pH > 8.0) ਪਾਈ ਗਈ ਹੈ। ਜਿਪਸਮ ਕੈਲਸ਼ੀਅਮ ਅਤੇ ਸਲਫੇਟ ਗੰਧਕ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ, ਜੋ ਮਿੱਟੀ ਵਿੱਚੋਂ ਸੋਡੀਅਮ ਨੂੰ ਬਾਹਰ ਕੱਢਣ, ਪਾਣੀ ਦੇ ਲਾਂਘੇ ਨੂੰ ਸੁਧਾਰਨ ਅਤੇ pH ਘਟਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।"
            }
        };

        const activeMap = database[englishExplanation] || database[englishExplanation.toLowerCase()];
        if (activeMap) {
            return activeMap[language] || activeMap['en'];
        }

        // Search in keys
        for (const key of Object.keys(database)) {
            const row = database[key];
            if (row.en.trim().toLowerCase() === englishExplanation.trim().toLowerCase()) {
                return row[language] || row['en'];
            }
        }

        return englishExplanation;
    };

    const getTipsTranslation = (englishTips) => {
        if (!englishTips) return '';
        
        const database = {
            urea: {
                en: "Apply in split doses (basal and top-dressing) during the vegetative stage. Avoid applying when the soil is dry or waterlogged to minimize volatile loss. Mix with dry soil before broadcasting.",
                hi: "वानस्पतिक अवस्था के दौरान विभाजित खुराक (आधार और टॉप-ड्रेसिंग) में प्रयोग करें। वाष्पीकरण से होने वाले नुकसान को कम करने के लिए सूखी या जलभराव वाली मिट्टी में प्रयोग से बचें। छिड़काव से पहले सूखी मिट्टी के साथ मिलाएं।",
                gu: "છોડના વિકાસના તબક્કા દરમિયાન વિભાજિત માત્રામાં (પાયાની અને પૂર્તિ ખાતર તરીકે) વાપરો. નાઇટ્રોજનનો વ્યય ઘટાડવા માટે જમીન સૂકી હોય કે પાણી ભરાયેલું હોય ત્યારે વાપરવાનું ટાળો. છાંટતા પહેલા સૂકી માટી સાથે મિક્સ કરો।",
                hingi: "Vegetative stage me split doses (basal aur top-dressing) me dalein. Dry ya flooded khet me dalne se bachein. Use karne se pehle sukhi soil ke sath mix karein.",
                pa: "ਫਸਲ ਦੇ ਵਾਧੇ ਦੇ ਸਮੇਂ ਖਾਦ ਨੂੰ ਵੱਖ-ਵੱਖ ਹਿੱਸਿਆਂ ਵਿੱਚ ਦਿਓ। ਖਾਦ ਦੇ ਉੱਡਣ ਦੇ ਨੁਕਸਾਨ ਨੂੰ ਘਟਾਉਣ ਲਈ ਸੁੱਕੀ ਜਾਂ ਪਾਣੀ ਨਾਲ ਭਰੀ ਮਿੱਟੀ ਵਿੱਚ ਪਾਉਣ ਤੋਂ ਬਚੋ। ਛਿੜਕਾਅ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਸੁੱਕੀ ਮਿੱਟੀ ਵਿੱਚ ਮਿਲਾਓ।"
            },
            dap: {
                en: "Apply as a basal dose during sowing or transplanting. Place it 2-3 inches below and to the side of the seed to prevent chemical seed burn.",
                hi: "बुवाई या रोपाई के दौरान आधार खुराक के रूप में प्रयोग करें। रासायनिक बीज जलने से रोकने के लिए इसे बीज के नीचे और बगल में 2-3 इंच रखें।",
                gu: "વાવણી અથવા રોપણી દરમિયાન પાયાના ડોઝ તરીકે વાપરો. રાસાયણિક પ્રતિક્રિયાથી બીજ બળી ન જાય તે માટે બીજની નીચે અને બાજુ પર ૨-૩ ઈંચ નીચે રાખો।",
                hingi: "Sowing ya transplanting ke time pe basal dose ki tarah use karein. Seed burn se bachne ke liye ise seed se 2-3 inch neeche aur side me dalein.",
                pa: "ਬਿਜਾਈ ਜਾਂ ਲੁਆਈ ਦੇ ਸਮੇਂ ਖਾਦ ਪਾਓ। ਬੀਜ ਨੂੰ ਰਸਾਇਣਕ ਨੁਕਸਾਨ ਤੋਂ ਬਚਾਉਣ ਲਈ ਇਸਨੂੰ ਬੀਜ ਤੋਂ 2-3 ਇੰਚ ਹੇਠਾਂ ਅਤੇ ਪਾਸੇ ਰੱਖੋ।"
            },
            mop: {
                en: "Apply during land preparation or as a top-dressing. Ensure adequate soil moisture is present during application for optimal potassium dissolution and root uptake.",
                hi: "भूमि की तैयारी के दौरान या टॉप-ड्रेसिंग के रूप में प्रयोग करें। इष्टतम पोटेशियम विघटन और जड़ों के ग्रहण के लिए आवेदन के दौरान पर्याप्त मिट्टी की नमी सुनिश्चित करें।",
                gu: "જમીન તૈયાર કરતી વખતે અથવા પૂર્તિ ખાતર તરીકે વાપરો. પોટેશિયમ યોગ્ય રીતે ઓગળે અને મૂળ દ્વારા શોષાય તે માટે જમીનમાં પૂરતો ભેજ હોવો જરૂરી છે।",
                hingi: "Land preparation ke time pe ya top-dressing me use karein. Potassium ke sahi absorption ke liye khet me moisture hona jaruri hai.",
                pa: "ਜ਼ਮੀਨ ਦੀ ਤਿਆਰੀ ਦੌਰਾਨ ਜਾਂ ਫਸਲ ਦੇ ਵਾਧੇ ਸਮੇਂ ਪਾਓ। ਪੋਟਾਸ਼ੀਅਮ ਦੇ ਚੰਗੀ ਤਰ੍ਹਾਂ ਘੁਲਣ ਅਤੇ ਜੜ੍ਹਾਂ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਖੇਤ ਵਿੱਚ ਢੁਕਵੀਂ ਨਮੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।"
            },
            npk19: {
                en: "Can be applied through foliar spray or fertigation. Best applied during the early growth and flowering stages for uniform nutrient absorption.",
                hi: "पर्ण छिड़काव या फर्टिगेशन के माध्यम से लगाया जा सकता है। समान पोषक तत्व अवशोषण के लिए शुरुआती विकास और फूलों के चरणों के दौरान सबसे अच्छा लागू होता है।",
                gu: "પાંદડા પર છંટકાવ દ્વારા અથવા ડ્રિપ પદ્ધતિથી આપી શકાય છે. પોષક તત્ત્વોના સમાન શોષણ માટે પ્રારંભિક વિકાસ અને ફૂલ આવવાના તબક્કા દરમિયાન આપવું ઉત્તમ રહેશે।",
                hingi: "Foliar spray ya fertigation ke through use kiya ja sakta hai. Early growth aur flowering stages me absorption sabse best hota hai.",
                pa: "ਪੱਤਿਆਂ 'ਤੇ ਛਿੜਕਾਅ ਜਾਂ ਪਾਣੀ ਨਾਲ ਦਿੱਤਾ ਜਾ ਸਕਦਾ ਹੈ। ਪੋਸ਼ਕ ਤੱਤਾਂ ਦੇ ਸਹੀ ਸਮਾਈ ਲਈ ਸ਼ੁਰੂਆਤੀ ਵਾਧੇ ਅਤੇ ਫੁੱਲ ਪੈਣ ਦੇ ਸਮੇਂ ਪਾਉਣਾ ਸਭ ਤੋਂ ਵਧੀਆ ਹੈ।"
            },
            ssp: {
                en: "Apply as a basal dose before sowing. Incorporation deep into the root zone is recommended as phosphorus moves very slowly through the soil profile.",
                hi: "बुवाई से पहले आधार खुराक के रूप में प्रयोग करें। जड़ क्षेत्र में गहराई से शामिल करने की सिफारिश की जाती है क्योंकि फास्फोरस मिट्टी में बहुत धीरे-धीरे चलता है।",
                gu: "વાવણી પહેલાં પાયાના ડોઝ તરીકે વાપરો. ફોસ્ફરસ જમીનમાં ખૂબ જ ધીમેથી ફેલાતો હોવાથી તેને મૂળના વિસ્તારમાં ઊંડે સુધી નાખવાની ભલામણ કરવામાં આવે છે।",
                hingi: "Sowing se pehle basal dose me dalein. Root zone me thoda gehra dalein kyunki phosphorus mitti me bahut slow move karta hai.",
                pa: "ਬਿਜਾਈ ਤੋਂ ਪਹਿਲਾਂ ਖਾਦ ਪਾਓ। ਜੜ੍ਹਾਂ ਦੇ ਨੇੜੇ ਡੂੰਘਾ ਪਾਉਣ ਦੀ ਸਿਫਾਰਸ਼ ਕੀਤੀ ਜਾਂਦੀ ਹੈ ਕਿਉਂਕਿ ਫਾਸਫੋਰਸ ਮਿੱਟੀ ਵਿੱਚ ਬਹੁਤ ਹੌਲੀ-ਹੌਲੀ ਫੈਲਦਾ ਹੈ।"
            },
            ammoniumSulfate: {
                en: "Apply close to the root zone. Highly beneficial for sulfur-loving crops like oilseeds and brassicas. Avoid mixing with lime or alkaline fertilizers.",
                hi: "जड़ क्षेत्र के करीब प्रयोग करें। तिलहन और ब्रैसिका जैसी सल्फर-प्रिय फसलों के लिए अत्यधिक लाभकारी। चूने या क्षारीय उर्वरकों के साथ मिलाने से बचें।",
                gu: "મૂળના વિસ્તારની નજીક વાપરો. તેલીબિયાં જેવા પાકો માટે ખૂબ જ ફાયદાકારક છે. ચૂનો કે આલ્કલાઇન ખાતરો સાથે મિક્સ કરવાનું ટાળો।",
                hingi: "Root zone ke pass dalein. Oilseed aur brassica crops ke liye bahut beneficial hai. Lime ya alkaline fertilizer ke sath mix mat karein.",
                pa: "ਜੜ੍ਹਾਂ ਦੇ ਨੇੜੇ ਪਾਓ। ਤੇਲ ਬੀਜਾਂ ਵਰਗੀਆਂ ਗੰਧਕ ਪਸੰਦ ਫਸਲਾਂ ਲਈ ਬਹੁਤ ਫਾਇਦੇਮੰਦ ਹੈ। ਚੂਨੇ ਜਾਂ ਖਾਰੀਆਂ ਖਾਦਾਂ ਨਾਲ ਮਿਲਾਉਣ ਤੋਂ ਬਚੋ।"
            },
            compost: {
                en: "Spread evenly over the field and plow it into the top 6 inches of soil during land preparation. Best applied 2-3 weeks before planting.",
                hi: "भूमि की तैयारी के दौरान खेत में समान रूप से फैलाएं और मिट्टी की ऊपरी 6 इंच की परत में जुताई करें। रोपण से 2-3 सप्ताह पहले सबसे अच्छा लागू होता है।",
                gu: "જમીન તૈયાર કરતી વખતે ખેતરમાં સમાન રીતે ફેલાવો અને જમીનની ઉપરની ૬ ઈંચની સપાટીમાં ખેડી નાખો. વાવણીના ૨-૩ અઠવાડિયા પહેલા આપવું ઉત્તમ રહેશે।",
                hingi: "Khet me barabar failayein aur land preparation ke time 6 inch gehra mix karein. Planting se 2-3 week pehle dalna best hota hai.",
                pa: "ਜ਼ਮੀਨ ਦੀ ਤਿਆਰੀ ਦੌਰਾਨ ਖੇਤ ਵਿੱਚ ਬਰਾਬਰ ਖਿਲਾਰੋ ਅਤੇ ਮਿੱਟੀ ਦੀ ਉੱਪਰਲੀ 6 ਇੰਚ ਦੀ ਪਰਤ ਵਿੱਚ ਵਾਹ ਦਿਓ। ਬਿਜਾਈ ਤੋਂ 2-3 ਹਫ਼ਤੇ ਪਹਿਲਾਂ ਪਾਉਣਾ ਸਭ ਤੋਂ ਵਧੀਆ ਹੈ।"
            },
            gypsum: {
                en: "Broadcast evenly during land preparation and thoroughly mix into the top 6 inches of soil. Irrigate after application to flush out excess sodium.",
                hi: "भूमि की तैयारी के दौरान समान रूप से प्रसारित करें और मिट्टी के ऊपरी 6 इंच में अच्छी तरह मिलाएं। अतिरिक्त सोडियम को बाहर निकालने के लिए आवेदन के बाद सिंचाई करें।",
                gu: "જમીન તૈયાર કરતી વખતે સમાન રીતે ફેલાવો અને ઉપરની ૬ ઈંચ માટીમાં સારી રીતે મિક્સ કરો. વધારાનું સોડિયમ બહાર કાઢવા માટે આપ્યા પછી પાણી આપો।",
                hingi: "Land preparation ke time barabar failayein aur 6 inch mitti me mix karein. Use karne ke baad khet me paani dalein taaki extra sodium nikal jaye.",
                pa: "ਜ਼ਮੀਨ ਦੀ ਤਿਆਰੀ ਦੌਰਾਨ ਬਰਾਬਰ ਛਿੜਕਾਅ ਕਰੋ ਅਤੇ ਮਿੱਟੀ ਦੇ ਉੱਪਰਲੇ 6 ਇੰਚ ਵਿੱਚ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਾਓ। ਵਾਧੂ ਸੋਡੀਅਮ ਬਾਹਰ ਕੱਢਣ ਲਈ ਖਾਦ ਪਾਉਣ ਤੋਂ ਬਾਅਦ ਪਾਣੀ ਦਿਓ।"
            }
        };

        // Match based on values
        for (const key of Object.keys(database)) {
            const row = database[key];
            if (row.en.trim().toLowerCase() === englishTips.trim().toLowerCase()) {
                return row[language] || row['en'];
            }
        }
        
        return englishTips;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, languagesList, t, tState, tSoilType, tCrop, tSeason, tStage, tFertilizer, tDosage, getExplanationTranslation, getTipsTranslation }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
