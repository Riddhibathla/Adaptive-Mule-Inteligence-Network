const API = "";

const LANG = {
  en: {
    speech: "en-IN",
    language: "Language",
    secureSession: "Secure check",
    misuseVerification: "Account misuse verification",
    heroTitle: "Check if your PAN or phone number was used to open a suspicious account",
    heroBody: "A simple, secure self-check for identity misuse signals with private masked results.",
    privateResult: "Private result",
    phoneTab: "Phone",
    consentText: "I consent to checking this identity number for account misuse signals",
    runSelfCheck: "Check safely",
    panLabel: "PAN number",
    phoneLabel: "Phone number",
    ready: "Ready",
    checking: "Checking",
    readyToCheck: "Ready to check",
    readyBody: "Enter your PAN or phone number, confirm consent, and run Satark AI.",
    privacyCopy: "Your data is analyzed securely and never stored permanently.",
    voiceTitle: "Prefer speaking?",
    voiceReady: "Press the microphone and speak your PAN or phone number slowly.",
    speakNow: "Speak now",
    readHelp: "Read help",
    noteMasked: "Only masked results are shown.",
    noteOfficial: "Use official bank and cybercrime channels for reporting.",
    trustScore: "Trust Score",
    noMisuse: "No misuse found",
    review: "Possible match",
    urgent: "Misuse likely",
    invalid: "Invalid",
    highRisk: "HIGH RISK",
    reviewRisk: "REVIEW",
    checkInput: "CHECK INPUT",
    lowRisk: "LOW RISK",
    whyFlagged: "Why flagged?",
    noFlagYet: "No check has been run yet.",
    reasonClean: "No suspicious mule-account signal found",
    reasonSuspicious: "Linked to suspicious account-opening activity",
    reasonReported: "Matched with partner fraud-intelligence records",
    reasonUnusual: "Unusual onboarding or transaction behavior",
    recommendedAction: "Recommended Action",
    readyRecommendation: "Run a check before sharing sensitive documents or making large transfers.",
    safeRecommendation: "No suspicious account was found. Stay careful and use official support if anyone pressures you.",
    reviewRecommendation: "Avoid large transfers and verify directly with official support before sharing documents or money.",
    urgentRecommendation: "Do not transfer money. Contact your bank, report at cybercrime.gov.in, or call 1930.",
    officialHelp: "Official support",
    contactHeading: "Where to report",
    cyberPortal: "National Cyber Crime Portal",
    cyberDetail: "Report at cybercrime.gov.in or call 1930 for cyber fraud assistance.",
    bankContact: "Your bank or wallet provider",
    bankDetail: "Ask for KYC dispute review and temporary restrictions on accounts you did not open.",
    clearSpeech: "No mule account or suspicious account was found for this identity in the current partner records.",
    reviewSpeech: "A possible suspicious account match was found. Please verify ownership and contact your bank or the National Cyber Crime Portal.",
    urgentSpeech: "A likely mule account or suspicious account match was found. Contact your bank immediately, report at cybercrime.gov.in, or call 1930.",
    invalidSpeech: "Please check the number format and consent box, then try again.",
    helpSpeech: "Select PAN or phone. Press speak now. Say the number slowly. I will check and read the result.",
    voiceUnsupported: "Voice input is not supported in this browser. You can still type the number.",
    listening: "Listening. Please speak now.",
    heard: "I heard",
  },
  hi: {
    speech: "hi-IN",
    language: "भाषा",
    secureSession: "सुरक्षित जांच",
    misuseVerification: "खाता दुरुपयोग जांच",
    heroTitle: "जांचें कि आपके PAN या फोन नंबर से कोई संदिग्ध खाता तो नहीं खुला",
    heroBody: "पहचान दुरुपयोग संकेतों के लिए आसान और सुरक्षित स्व-जांच, निजी मास्क किए गए परिणामों के साथ।",
    privateResult: "निजी परिणाम",
    phoneTab: "फोन",
    consentText: "मैं इस पहचान नंबर को खाता दुरुपयोग संकेतों के लिए जांचने की सहमति देता/देती हूं",
    runSelfCheck: "सुरक्षित जांच करें",
    panLabel: "PAN नंबर",
    phoneLabel: "फोन नंबर",
    ready: "तैयार",
    checking: "जांच हो रही है",
    readyToCheck: "जांच के लिए तैयार",
    readyBody: "PAN या फोन नंबर डालें, सहमति दें और Satark AI चलाएं।",
    privacyCopy: "आपका डेटा सुरक्षित रूप से जांचा जाता है और स्थायी रूप से संग्रहित नहीं किया जाता।",
    voiceTitle: "बोलकर जांच करना चाहते हैं?",
    voiceReady: "माइक्रोफोन दबाएं और अपना PAN या फोन नंबर धीरे बोलें।",
    speakNow: "बोलें",
    readHelp: "मदद सुनें",
    noteMasked: "केवल मास्क किए गए परिणाम दिखाए जाते हैं।",
    noteOfficial: "रिपोर्ट के लिए आधिकारिक बैंक और साइबरक्राइम चैनल इस्तेमाल करें।",
    trustScore: "ट्रस्ट स्कोर",
    noMisuse: "दुरुपयोग नहीं मिला",
    review: "संभावित मिलान",
    urgent: "दुरुपयोग की संभावना",
    invalid: "गलत",
    highRisk: "उच्च जोखिम",
    reviewRisk: "समीक्षा",
    checkInput: "इनपुट जांचें",
    lowRisk: "कम जोखिम",
    whyFlagged: "क्यों चिन्हित हुआ?",
    noFlagYet: "अभी कोई जांच नहीं हुई है।",
    reasonClean: "कोई संदिग्ध म्यूल-अकाउंट संकेत नहीं मिला",
    reasonSuspicious: "संदिग्ध खाता खोलने की गतिविधि से जुड़ा",
    reasonReported: "पार्टनर फ्रॉड-इंटेलिजेंस रिकॉर्ड से मिलान",
    reasonUnusual: "असामान्य ऑनबोर्डिंग या लेन-देन व्यवहार",
    recommendedAction: "सुझाव",
    readyRecommendation: "बड़े ट्रांसफर या दस्तावेज साझा करने से पहले जांच करें।",
    safeRecommendation: "कोई संदिग्ध खाता नहीं मिला। फिर भी दबाव आने पर केवल आधिकारिक सहायता लें।",
    reviewRecommendation: "बड़े ट्रांसफर से बचें और दस्तावेज या पैसा साझा करने से पहले आधिकारिक सहायता से सत्यापन करें।",
    urgentRecommendation: "पैसे ट्रांसफर न करें। अपने बैंक से संपर्क करें, cybercrime.gov.in पर रिपोर्ट करें या 1930 पर कॉल करें।",
    officialHelp: "आधिकारिक सहायता",
    contactHeading: "कहां रिपोर्ट करें",
    cyberPortal: "राष्ट्रीय साइबर अपराध पोर्टल",
    cyberDetail: "cybercrime.gov.in पर रिपोर्ट करें या साइबर धोखाधड़ी सहायता के लिए 1930 पर कॉल करें।",
    bankContact: "आपका बैंक या वॉलेट प्रदाता",
    bankDetail: "KYC विवाद समीक्षा और आपके नाम से खुले अनजान खातों पर अस्थायी रोक के लिए कहें।",
    clearSpeech: "इस पहचान से वर्तमान पार्टनर रिकॉर्ड में कोई म्यूल अकाउंट या संदिग्ध खाता नहीं मिला।",
    reviewSpeech: "संभावित संदिग्ध खाता मिला है। स्वामित्व सत्यापित करें और बैंक या राष्ट्रीय साइबर अपराध पोर्टल से संपर्क करें।",
    urgentSpeech: "संभावित म्यूल या संदिग्ध खाता मिला है। तुरंत बैंक से संपर्क करें, cybercrime.gov.in पर रिपोर्ट करें या 1930 पर कॉल करें।",
    invalidSpeech: "कृपया नंबर प्रारूप और सहमति बॉक्स जांचें, फिर प्रयास करें।",
    helpSpeech: "PAN या फोन चुनें। बोलें बटन दबाएं। नंबर धीरे बोलें। मैं परिणाम पढ़ दूंगा।",
    voiceUnsupported: "इस ब्राउजर में आवाज इनपुट उपलब्ध नहीं है। आप नंबर टाइप कर सकते हैं।",
    listening: "सुन रहा हूं। कृपया बोलें।",
    heard: "मैंने सुना",
  },
  mr: {
    speech: "mr-IN",
    language: "भाषा",
    secureSession: "सुरक्षित तपासणी",
    misuseVerification: "खाते गैरवापर तपासणी",
    heroTitle: "तुमच्या PAN किंवा फोन नंबरवर संशयास्पद खाते उघडले आहे का ते तपासा",
    heroBody: "ओळख गैरवापर संकेतांसाठी सोपी आणि सुरक्षित स्व-तपासणी, खाजगी मास्क केलेल्या निकालांसह.",
    privateResult: "खाजगी निकाल",
    phoneTab: "फोन",
    consentText: "मी या ओळख क्रमांकाची खाते गैरवापर संकेतांसाठी तपासणी करण्यास संमती देतो/देते",
    runSelfCheck: "सुरक्षित तपासणी करा",
    panLabel: "PAN नंबर",
    phoneLabel: "फोन नंबर",
    ready: "तयार",
    checking: "तपासणी सुरू",
    readyToCheck: "तपासणीस तयार",
    readyBody: "PAN किंवा फोन नंबर भरा, संमती द्या आणि Satark AI चालवा.",
    privacyCopy: "तुमचा डेटा सुरक्षितपणे तपासला जातो आणि कायमस्वरूपी साठवला जात नाही.",
    voiceTitle: "बोलून तपासायचे आहे?",
    voiceReady: "माइक दाबा आणि PAN किंवा फोन नंबर हळू बोला.",
    speakNow: "बोला",
    readHelp: "मदत ऐका",
    noteMasked: "फक्त मास्क केलेले निकाल दाखवले जातात.",
    noteOfficial: "रिपोर्टसाठी अधिकृत बँक आणि सायबरक्राइम चॅनेल वापरा.",
    trustScore: "ट्रस्ट स्कोर",
    noMisuse: "गैरवापर आढळला नाही",
    review: "संभाव्य जुळणी",
    urgent: "गैरवापराची शक्यता",
    invalid: "चुकीचे",
    highRisk: "उच्च धोका",
    reviewRisk: "पुनरावलोकन",
    checkInput: "इनपुट तपासा",
    lowRisk: "कमी धोका",
    whyFlagged: "का चिन्हांकित झाले?",
    noFlagYet: "अजून तपासणी झालेली नाही.",
    reasonClean: "संशयास्पद म्यूल-अकाउंट संकेत आढळला नाही",
    reasonSuspicious: "संशयास्पद खाते उघडण्याच्या क्रियेशी जोडलेले",
    reasonReported: "पार्टनर फ्रॉड-इंटेलिजन्स रेकॉर्डशी जुळले",
    reasonUnusual: "असामान्य ऑनबोर्डिंग किंवा व्यवहार वर्तन",
    recommendedAction: "शिफारस",
    readyRecommendation: "मोठे ट्रान्सफर किंवा कागदपत्रे शेअर करण्यापूर्वी तपासणी करा.",
    safeRecommendation: "संशयास्पद खाते आढळले नाही. कोणी दबाव टाकल्यास अधिकृत मदत वापरा.",
    reviewRecommendation: "मोठे ट्रान्सफर टाळा आणि कागदपत्रे किंवा पैसे शेअर करण्यापूर्वी अधिकृत सहाय्याशी पडताळा.",
    urgentRecommendation: "पैसे ट्रान्सफर करू नका. बँकेशी संपर्क करा, cybercrime.gov.in वर रिपोर्ट करा किंवा 1930 वर कॉल करा.",
    officialHelp: "अधिकृत मदत",
    contactHeading: "कुठे रिपोर्ट करावे",
    cyberPortal: "राष्ट्रीय सायबर गुन्हे पोर्टल",
    cyberDetail: "cybercrime.gov.in वर रिपोर्ट करा किंवा सायबर फसवणूक सहाय्यासाठी 1930 वर कॉल करा.",
    bankContact: "तुमची बँक किंवा वॉलेट प्रदाता",
    bankDetail: "KYC विवाद पुनरावलोकन आणि तुम्ही न उघडलेल्या खात्यांवर तात्पुरती मर्यादा मागा.",
  },
  ta: {
    speech: "ta-IN",
    language: "மொழி",
    secureSession: "பாதுகாப்பான சரிபார்ப்பு",
    misuseVerification: "கணக்கு தவறான பயன்பாடு சரிபார்ப்பு",
    heroTitle: "உங்கள் PAN அல்லது தொலைபேசி எண்ணால் சந்தேகமான கணக்கு திறக்கப்பட்டதா என்று சரிபார்க்கவும்",
    heroBody: "அடையாள தவறான பயன்பாட்டு சிக்னல்களுக்கு எளிய, பாதுகாப்பான சுய சரிபார்ப்பு.",
    privateResult: "தனிப்பட்ட முடிவு",
    phoneTab: "தொலைபேசி",
    consentText: "இந்த அடையாள எண்ணை கணக்கு தவறான பயன்பாட்டு சிக்னல்களுக்கு சரிபார்க்க நான் ஒப்புக்கொள்கிறேன்",
    runSelfCheck: "பாதுகாப்பாக சரிபார்க்கவும்",
    panLabel: "PAN எண்",
    phoneLabel: "தொலைபேசி எண்",
    ready: "தயார்",
    checking: "சரிபார்க்கிறது",
    readyToCheck: "சரிபார்க்க தயார்",
    readyBody: "PAN அல்லது தொலைபேசி எண்ணை உள்ளிட்டு Satark AI இயக்கவும்.",
    privacyCopy: "உங்கள் தரவு பாதுகாப்பாக ஆய்வு செய்யப்படுகிறது; நிரந்தரமாக சேமிக்கப்படாது.",
    voiceTitle: "பேசி சரிபார்க்க வேண்டுமா?",
    voiceReady: "மைக்ரோஃபோனை அழுத்தி PAN அல்லது தொலைபேசி எண்ணை மெதுவாக சொல்லுங்கள்.",
    speakNow: "பேசுங்கள்",
    readHelp: "உதவி கேளுங்கள்",
    noteMasked: "மறைக்கப்பட்ட முடிவுகள் மட்டுமே காட்டப்படும்.",
    noteOfficial: "அதிகாரப்பூர்வ வங்கி மற்றும் சைபர் குற்ற சேனல்களை பயன்படுத்தவும்.",
    trustScore: "நம்பிக்கை மதிப்பெண்",
    noMisuse: "தவறான பயன்பாடு இல்லை",
    review: "சாத்தியமான பொருத்தம்",
    urgent: "தவறான பயன்பாடு இருக்கலாம்",
    invalid: "தவறு",
    highRisk: "அதிக ஆபத்து",
    reviewRisk: "மதிப்பாய்வு",
    checkInput: "உள்ளீட்டை சரிபார்க்கவும்",
    lowRisk: "குறைந்த ஆபத்து",
    whyFlagged: "ஏன் குறிக்கப்பட்டது?",
    noFlagYet: "இன்னும் சரிபார்ப்பு இயக்கப்படவில்லை.",
    reasonClean: "சந்தேகமான கணக்கு சிக்னல் இல்லை",
    reasonSuspicious: "சந்தேகமான கணக்கு திறப்பு செயல்பாட்டுடன் இணைப்பு",
    reasonReported: "பங்குதாரர் மோசடி பதிவுகளுடன் பொருந்தியது",
    reasonUnusual: "அசாதாரண ஆன்போர்டிங் அல்லது பரிவர்த்தனை நடத்தை",
    recommendedAction: "பரிந்துரைக்கப்பட்ட செயல்",
    readyRecommendation: "பெரிய பரிமாற்றம் அல்லது ஆவண பகிர்வுக்கு முன் சரிபார்க்கவும்.",
    safeRecommendation: "சந்தேகமான கணக்கு கிடைக்கவில்லை. அழுத்தம் இருந்தால் அதிகாரப்பூர்வ உதவியைப் பயன்படுத்தவும்.",
    reviewRecommendation: "பெரிய பரிமாற்றங்களை தவிர்த்து, அதிகாரப்பூர்வ உதவியுடன் உறுதிப்படுத்தவும்.",
    urgentRecommendation: "பணம் அனுப்ப வேண்டாம். உங்கள் வங்கியை தொடர்பு கொள்ளுங்கள், cybercrime.gov.in இல் புகார் செய்யுங்கள் அல்லது 1930 அழைக்கவும்.",
    officialHelp: "அதிகாரப்பூர்வ உதவி",
    contactHeading: "எங்கு புகார் செய்வது",
    cyberPortal: "தேசிய சைபர் குற்ற போர்டல்",
    cyberDetail: "cybercrime.gov.in இல் புகார் செய்யவும் அல்லது 1930 அழைக்கவும்.",
    bankContact: "உங்கள் வங்கி அல்லது வாலெட் வழங்குநர்",
    bankDetail: "KYC விவாத மதிப்பாய்வு மற்றும் நீங்கள் திறக்காத கணக்குகளுக்கு தற்காலிக கட்டுப்பாடு கேளுங்கள்.",
  },
  te: {
    speech: "te-IN",
    language: "భాష",
    secureSession: "సురక్షిత తనిఖీ",
    misuseVerification: "ఖాతా దుర్వినియోగ తనిఖీ",
    heroTitle: "మీ PAN లేదా ఫోన్ నంబర్‌తో అనుమానాస్పద ఖాతా తెరవబడిందా చూడండి",
    heroBody: "గుర్తింపు దుర్వినియోగ సంకేతాల కోసం సులభమైన, సురక్షిత స్వీయ తనిఖీ.",
    privateResult: "ప్రైవేట్ ఫలితం",
    phoneTab: "ఫోన్",
    consentText: "ఈ గుర్తింపు సంఖ్యను ఖాతా దుర్వినియోగ సంకేతాల కోసం తనిఖీ చేయడానికి నేను సమ్మతిస్తున్నాను",
    runSelfCheck: "సురక్షితంగా తనిఖీ చేయండి",
    panLabel: "PAN నంబర్",
    phoneLabel: "ఫోన్ నంబర్",
    ready: "సిద్ధం",
    checking: "తనిఖీ జరుగుతోంది",
    readyToCheck: "తనిఖీకి సిద్ధం",
    readyBody: "PAN లేదా ఫోన్ నంబర్ నమోదు చేసి Satark AI నడపండి.",
    privacyCopy: "మీ డేటా సురక్షితంగా విశ్లేషించబడుతుంది మరియు శాశ్వతంగా నిల్వ చేయబడదు.",
    voiceTitle: "మాట్లాడి తనిఖీ చేయాలా?",
    voiceReady: "మైక్ నొక్కి PAN లేదా ఫోన్ నంబర్‌ను నెమ్మదిగా చెప్పండి.",
    speakNow: "మాట్లాడండి",
    readHelp: "సహాయం వినండి",
    noteMasked: "మాస్క్ చేసిన ఫలితాలు మాత్రమే చూపబడతాయి.",
    noteOfficial: "రిపోర్ట్ కోసం అధికారిక బ్యాంక్ మరియు సైబర్ క్రైమ్ ఛానళ్లను ఉపయోగించండి.",
    trustScore: "ట్రస్ట్ స్కోర్",
    noMisuse: "దుర్వినియోగం లేదు",
    review: "సంభావ్య మ్యాచ్",
    urgent: "దుర్వినియోగం ఉండవచ్చు",
    invalid: "చెల్లదు",
    highRisk: "అధిక ప్రమాదం",
    reviewRisk: "సమీక్ష",
    checkInput: "ఇన్‌పుట్ తనిఖీ",
    lowRisk: "తక్కువ ప్రమాదం",
    whyFlagged: "ఎందుకు గుర్తించారు?",
    noFlagYet: "ఇంకా తనిఖీ జరగలేదు.",
    reasonClean: "అనుమానాస్పద ఖాతా సంకేతం లేదు",
    reasonSuspicious: "అనుమానాస్పద ఖాతా తెరవడపు కార్యకలాపంతో లింక్",
    reasonReported: "పార్ట్నర్ ఫ్రాడ్ ఇంటెలిజెన్స్ రికార్డులతో సరిపోలింది",
    reasonUnusual: "అసాధారణ ఆన్‌బోర్డింగ్ లేదా లావాదేవీ ప్రవర్తన",
    recommendedAction: "సిఫార్సు చేసిన చర్య",
    readyRecommendation: "పెద్ద బదిలీలు లేదా పత్రాలు పంచుకునే ముందు తనిఖీ చేయండి.",
    safeRecommendation: "అనుమానాస్పద ఖాతా కనిపించలేదు. ఒత్తిడి ఉంటే అధికారిక సహాయాన్ని ఉపయోగించండి.",
    reviewRecommendation: "పెద్ద బదిలీలను నివారించి, అధికారిక సహాయంతో నేరుగా ధృవీకరించండి.",
    urgentRecommendation: "డబ్బు బదిలీ చేయవద్దు. బ్యాంకును సంప్రదించండి, cybercrime.gov.in లో రిపోర్ట్ చేయండి లేదా 1930కు కాల్ చేయండి.",
    officialHelp: "అధికారిక సహాయం",
    contactHeading: "ఎక్కడ రిపోర్ట్ చేయాలి",
    cyberPortal: "జాతీయ సైబర్ క్రైమ్ పోర్టల్",
    cyberDetail: "cybercrime.gov.in లో రిపోర్ట్ చేయండి లేదా 1930కు కాల్ చేయండి.",
    bankContact: "మీ బ్యాంక్ లేదా వాలెట్ ప్రొవైడర్",
    bankDetail: "KYC వివాద సమీక్ష మరియు మీరు తెరవని ఖాతాలపై తాత్కాలిక పరిమితులు అడగండి.",
  },
  pa: {
    speech: "pa-IN",
    language: "ਭਾਸ਼ਾ",
    secureSession: "ਸੁਰੱਖਿਅਤ ਜਾਂਚ",
    misuseVerification: "ਖਾਤਾ ਦੁਰਵਰਤੋਂ ਜਾਂਚ",
    heroTitle: "ਚੈੱਕ ਕਰੋ ਕਿ ਤੁਹਾਡੇ PAN ਜਾਂ ਫੋਨ ਨੰਬਰ ਨਾਲ ਸ਼ੱਕੀ ਖਾਤਾ ਖੁੱਲਿਆ ਹੈ ਜਾਂ ਨਹੀਂ",
    heroBody: "ਪਛਾਣ ਦੁਰਵਰਤੋਂ ਸਿਗਨਲਾਂ ਲਈ ਆਸਾਨ ਅਤੇ ਸੁਰੱਖਿਅਤ ਸਵੈ-ਜਾਂਚ।",
    privateResult: "ਨਿੱਜੀ ਨਤੀਜਾ",
    phoneTab: "ਫੋਨ",
    consentText: "ਮੈਂ ਇਸ ਪਛਾਣ ਨੰਬਰ ਨੂੰ ਖਾਤਾ ਦੁਰਵਰਤੋਂ ਸਿਗਨਲਾਂ ਲਈ ਜਾਂਚਣ ਲਈ ਸਹਿਮਤ ਹਾਂ",
    runSelfCheck: "ਸੁਰੱਖਿਅਤ ਜਾਂਚ ਕਰੋ",
    panLabel: "PAN ਨੰਬਰ",
    phoneLabel: "ਫੋਨ ਨੰਬਰ",
    ready: "ਤਿਆਰ",
    checking: "ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ",
    readyToCheck: "ਜਾਂਚ ਲਈ ਤਿਆਰ",
    readyBody: "PAN ਜਾਂ ਫੋਨ ਨੰਬਰ ਭਰੋ ਅਤੇ Satark AI ਚਲਾਓ।",
    privacyCopy: "ਤੁਹਾਡਾ ਡਾਟਾ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਵਿਸ਼ਲੇਸ਼ਿਤ ਹੁੰਦਾ ਹੈ ਅਤੇ ਸਥਾਈ ਤੌਰ ਤੇ ਸਟੋਰ ਨਹੀਂ ਹੁੰਦਾ।",
    voiceTitle: "ਬੋਲ ਕੇ ਜਾਂਚ ਕਰਨੀ ਹੈ?",
    voiceReady: "ਮਾਈਕ ਦਬਾਓ ਅਤੇ PAN ਜਾਂ ਫੋਨ ਨੰਬਰ ਹੌਲੀ ਬੋਲੋ।",
    speakNow: "ਬੋਲੋ",
    readHelp: "ਮਦਦ ਸੁਣੋ",
    noteMasked: "ਸਿਰਫ਼ ਮਾਸਕ ਕੀਤੇ ਨਤੀਜੇ ਦਿਖਾਏ ਜਾਂਦੇ ਹਨ।",
    noteOfficial: "ਰਿਪੋਰਟ ਲਈ ਅਧਿਕਾਰਤ ਬੈਂਕ ਅਤੇ ਸਾਈਬਰਕ੍ਰਾਈਮ ਚੈਨਲ ਵਰਤੋ।",
    trustScore: "ਟਰਸਟ ਸਕੋਰ",
    noMisuse: "ਦੁਰਵਰਤੋਂ ਨਹੀਂ ਮਿਲੀ",
    review: "ਸੰਭਾਵੀ ਮਿਲਾਣ",
    urgent: "ਦੁਰਵਰਤੋਂ ਦੀ ਸੰਭਾਵਨਾ",
    invalid: "ਗਲਤ",
    highRisk: "ਉੱਚ ਜੋਖਮ",
    reviewRisk: "ਸਮੀਖਿਆ",
    checkInput: "ਇਨਪੁੱਟ ਜਾਂਚੋ",
    lowRisk: "ਘੱਟ ਜੋਖਮ",
    whyFlagged: "ਕਿਉਂ ਨਿਸ਼ਾਨਿਤ ਕੀਤਾ?",
    noFlagYet: "ਹਾਲੇ ਕੋਈ ਜਾਂਚ ਨਹੀਂ ਹੋਈ।",
    reasonClean: "ਕੋਈ ਸ਼ੱਕੀ ਖਾਤਾ ਸਿਗਨਲ ਨਹੀਂ ਮਿਲਿਆ",
    reasonSuspicious: "ਸ਼ੱਕੀ ਖਾਤਾ ਖੋਲ੍ਹਣ ਦੀ ਗਤੀਵਿਧੀ ਨਾਲ ਜੁੜਿਆ",
    reasonReported: "ਪਾਰਟਨਰ ਫਰੌਡ ਰਿਕਾਰਡ ਨਾਲ ਮਿਲਿਆ",
    reasonUnusual: "ਅਸਧਾਰਣ ਆਨਬੋਰਡਿੰਗ ਜਾਂ ਲੈਣ-ਦੇਣ ਵਿਹਾਰ",
    recommendedAction: "ਸਿਫਾਰਸ਼ੀ ਕਾਰਵਾਈ",
    readyRecommendation: "ਵੱਡੇ ਟ੍ਰਾਂਸਫਰ ਜਾਂ ਦਸਤਾਵੇਜ਼ ਸਾਂਝੇ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂਚ ਕਰੋ।",
    safeRecommendation: "ਕੋਈ ਸ਼ੱਕੀ ਖਾਤਾ ਨਹੀਂ ਮਿਲਿਆ। ਦਬਾਅ ਹੋਵੇ ਤਾਂ ਅਧਿਕਾਰਤ ਸਹਾਇਤਾ ਵਰਤੋ।",
    reviewRecommendation: "ਵੱਡੇ ਟ੍ਰਾਂਸਫਰ ਤੋਂ ਬਚੋ ਅਤੇ ਅਧਿਕਾਰਤ ਸਹਾਇਤਾ ਨਾਲ ਪੁਸ਼ਟੀ ਕਰੋ।",
    urgentRecommendation: "ਪੈਸੇ ਟ੍ਰਾਂਸਫਰ ਨਾ ਕਰੋ। ਬੈਂਕ ਨਾਲ ਸੰਪਰਕ ਕਰੋ, cybercrime.gov.in ਤੇ ਰਿਪੋਰਟ ਕਰੋ ਜਾਂ 1930 ਕਾਲ ਕਰੋ।",
    officialHelp: "ਅਧਿਕਾਰਤ ਸਹਾਇਤਾ",
    contactHeading: "ਕਿੱਥੇ ਰਿਪੋਰਟ ਕਰਨੀ ਹੈ",
    cyberPortal: "ਰਾਸ਼ਟਰੀ ਸਾਈਬਰ ਅਪਰਾਧ ਪੋਰਟਲ",
    cyberDetail: "cybercrime.gov.in ਤੇ ਰਿਪੋਰਟ ਕਰੋ ਜਾਂ 1930 ਕਾਲ ਕਰੋ।",
    bankContact: "ਤੁਹਾਡਾ ਬੈਂਕ ਜਾਂ ਵਾਲਿਟ ਪ੍ਰਦਾਤਾ",
    bankDetail: "KYC ਵਿਵਾਦ ਸਮੀਖਿਆ ਅਤੇ ਨਾ ਖੋਲ੍ਹੇ ਖਾਤਿਆਂ ਤੇ ਅਸਥਾਈ ਰੋਕ ਲਈ ਕਹੋ।",
  },
  kn: {
    speech: "kn-IN",
    language: "ಭಾಷೆ",
    secureSession: "ಸುರಕ್ಷಿತ ಪರಿಶೀಲನೆ",
    misuseVerification: "ಖಾತೆ ದುರುಪಯೋಗ ಪರಿಶೀಲನೆ",
    heroTitle: "ನಿಮ್ಮ PAN ಅಥವಾ ಫೋನ್ ಸಂಖ್ಯೆಯಿಂದ ಅನುಮಾನಾಸ್ಪದ ಖಾತೆ ತೆರೆದಿದೆಯೇ ಪರಿಶೀಲಿಸಿ",
    heroBody: "ಗುರುತು ದುರುಪಯೋಗ ಸೂಚನೆಗಳಿಗೆ ಸರಳ, ಸುರಕ್ಷಿತ ಸ್ವಯಂ ಪರಿಶೀಲನೆ.",
    privateResult: "ಖಾಸಗಿ ಫಲಿತಾಂಶ",
    phoneTab: "ಫೋನ್",
    consentText: "ಈ ಗುರುತು ಸಂಖ್ಯೆಯನ್ನು ಖಾತೆ ದುರುಪಯೋಗ ಸೂಚನೆಗಳಿಗೆ ಪರಿಶೀಲಿಸಲು ನಾನು ಒಪ್ಪುತ್ತೇನೆ",
    runSelfCheck: "ಸುರಕ್ಷಿತವಾಗಿ ಪರಿಶೀಲಿಸಿ",
    panLabel: "PAN ಸಂಖ್ಯೆ",
    phoneLabel: "ಫೋನ್ ಸಂಖ್ಯೆ",
    ready: "ಸಿದ್ಧ",
    checking: "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ",
    readyToCheck: "ಪರಿಶೀಲನೆಗೆ ಸಿದ್ಧ",
    readyBody: "PAN ಅಥವಾ ಫೋನ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ Satark AI ನಡೆಸಿ.",
    privacyCopy: "ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತದೆ ಮತ್ತು ಶಾಶ್ವತವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗುವುದಿಲ್ಲ.",
    voiceTitle: "ಮಾತನಾಡಿ ಪರಿಶೀಲಿಸಬೇಕೆ?",
    voiceReady: "ಮೈಕ್ ಒತ್ತಿ PAN ಅಥವಾ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಿಧಾನವಾಗಿ ಹೇಳಿ.",
    speakNow: "ಮಾತನಾಡಿ",
    readHelp: "ಸಹಾಯ ಕೇಳಿ",
    noteMasked: "ಮಾಸ್ಕ್ ಮಾಡಿದ ಫಲಿತಾಂಶಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸಲಾಗುತ್ತದೆ.",
    noteOfficial: "ರಿಪೋರ್ಟ್ ಮಾಡಲು ಅಧಿಕೃತ ಬ್ಯಾಂಕ್ ಮತ್ತು ಸೈಬರ್ ಕ್ರೈಮ್ ಚಾನಲ್ ಬಳಸಿ.",
    trustScore: "ಟ್ರಸ್ಟ್ ಸ್ಕೋರ್",
    noMisuse: "ದುರುಪಯೋಗ ಕಂಡುಬಂದಿಲ್ಲ",
    review: "ಸಂಭಾವ್ಯ ಹೊಂದಾಣಿಕೆ",
    urgent: "ದುರುಪಯೋಗ ಸಾಧ್ಯತೆ",
    invalid: "ಅಮಾನ್ಯ",
    highRisk: "ಹೆಚ್ಚಿನ ಅಪಾಯ",
    reviewRisk: "ಪರಿಶೀಲನೆ",
    checkInput: "ಇನ್‌ಪುಟ್ ಪರಿಶೀಲಿಸಿ",
    lowRisk: "ಕಡಿಮೆ ಅಪಾಯ",
    whyFlagged: "ಏಕೆ ಗುರುತಿಸಲಾಗಿದೆ?",
    noFlagYet: "ಇನ್ನೂ ಪರಿಶೀಲನೆ ನಡೆದಿಲ್ಲ.",
    reasonClean: "ಅನುಮಾನಾಸ್ಪದ ಖಾತೆ ಸೂಚನೆ ಕಂಡುಬಂದಿಲ್ಲ",
    reasonSuspicious: "ಅನುಮಾನಾಸ್ಪದ ಖಾತೆ ತೆರೆಯುವ ಚಟುವಟಿಕೆಗೆ ಲಿಂಕ್",
    reasonReported: "ಪಾರ್ಟ್ನರ್ ಫ್ರಾಡ್ ದಾಖಲೆಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗಿದೆ",
    reasonUnusual: "ಅಸಾಮಾನ್ಯ ಆನ್‌ಬೋರ್ಡಿಂಗ್ ಅಥವಾ ವ್ಯವಹಾರ ವರ್ತನೆ",
    recommendedAction: "ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮ",
    readyRecommendation: "ದೊಡ್ಡ ವರ್ಗಾವಣೆ ಅಥವಾ ದಾಖಲೆ ಹಂಚುವ ಮೊದಲು ಪರಿಶೀಲಿಸಿ.",
    safeRecommendation: "ಅನುಮಾನಾಸ್ಪದ ಖಾತೆ ಕಂಡುಬಂದಿಲ್ಲ. ಒತ್ತಡ ಇದ್ದರೆ ಅಧಿಕೃತ ಸಹಾಯ ಬಳಸಿ.",
    reviewRecommendation: "ದೊಡ್ಡ ವರ್ಗಾವಣೆ ತಪ್ಪಿಸಿ ಮತ್ತು ಅಧಿಕೃತ ಸಹಾಯದಿಂದ ಪರಿಶೀಲಿಸಿ.",
    urgentRecommendation: "ಹಣ ವರ್ಗಾಯಿಸಬೇಡಿ. ಬ್ಯಾಂಕ್ ಸಂಪರ್ಕಿಸಿ, cybercrime.gov.in ನಲ್ಲಿ ರಿಪೋರ್ಟ್ ಮಾಡಿ ಅಥವಾ 1930 ಕರೆ ಮಾಡಿ.",
    officialHelp: "ಅಧಿಕೃತ ಸಹಾಯ",
    contactHeading: "ಎಲ್ಲಿ ರಿಪೋರ್ಟ್ ಮಾಡಬೇಕು",
    cyberPortal: "ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಕ್ರೈಮ್ ಪೋರ್ಟಲ್",
    cyberDetail: "cybercrime.gov.in ನಲ್ಲಿ ರಿಪೋರ್ಟ್ ಮಾಡಿ ಅಥವಾ 1930 ಕರೆ ಮಾಡಿ.",
    bankContact: "ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಅಥವಾ ವಾಲೆಟ್ ಒದಗಿಸುವವರು",
    bankDetail: "KYC ವಿವಾದ ಪರಿಶೀಲನೆ ಮತ್ತು ನೀವು ತೆರೆಯದ ಖಾತೆಗಳಿಗೆ ತಾತ್ಕಾಲಿಕ ನಿರ್ಬಂಧ ಕೇಳಿ.",
  },
  bn: {
    speech: "bn-IN",
    language: "ভাষা",
    secureSession: "সুরক্ষিত পরীক্ষা",
    misuseVerification: "অ্যাকাউন্ট অপব্যবহার পরীক্ষা",
    heroTitle: "আপনার PAN বা ফোন নম্বর দিয়ে সন্দেহজনক অ্যাকাউন্ট খোলা হয়েছে কি না দেখুন",
    heroBody: "পরিচয় অপব্যবহার সংকেতের জন্য সহজ, নিরাপদ স্ব-পরীক্ষা।",
    privateResult: "ব্যক্তিগত ফলাফল",
    phoneTab: "ফোন",
    consentText: "আমি এই পরিচয় নম্বরটি অ্যাকাউন্ট অপব্যবহার সংকেতের জন্য পরীক্ষা করতে সম্মতি দিচ্ছি",
    runSelfCheck: "নিরাপদে পরীক্ষা করুন",
    panLabel: "PAN নম্বর",
    phoneLabel: "ফোন নম্বর",
    ready: "প্রস্তুত",
    checking: "পরীক্ষা হচ্ছে",
    readyToCheck: "পরীক্ষার জন্য প্রস্তুত",
    readyBody: "PAN বা ফোন নম্বর দিন এবং Satark AI চালান।",
    privacyCopy: "আপনার ডেটা নিরাপদে বিশ্লেষণ করা হয় এবং স্থায়ীভাবে সংরক্ষণ করা হয় না।",
    voiceTitle: "বলে পরীক্ষা করবেন?",
    voiceReady: "মাইক চাপুন এবং PAN বা ফোন নম্বর ধীরে বলুন।",
    speakNow: "বলুন",
    readHelp: "সাহায্য শুনুন",
    noteMasked: "শুধু মাস্ক করা ফলাফল দেখানো হয়।",
    noteOfficial: "রিপোর্টের জন্য অফিসিয়াল ব্যাংক এবং সাইবারক্রাইম চ্যানেল ব্যবহার করুন।",
    trustScore: "ট্রাস্ট স্কোর",
    noMisuse: "অপব্যবহার পাওয়া যায়নি",
    review: "সম্ভাব্য মিল",
    urgent: "অপব্যবহারের সম্ভাবনা",
    invalid: "ভুল",
    highRisk: "উচ্চ ঝুঁকি",
    reviewRisk: "পর্যালোচনা",
    checkInput: "ইনপুট দেখুন",
    lowRisk: "কম ঝুঁকি",
    whyFlagged: "কেন চিহ্নিত?",
    noFlagYet: "এখনও কোনো পরীক্ষা হয়নি।",
    reasonClean: "সন্দেহজনক অ্যাকাউন্ট সংকেত পাওয়া যায়নি",
    reasonSuspicious: "সন্দেহজনক অ্যাকাউন্ট খোলার কার্যকলাপের সঙ্গে যুক্ত",
    reasonReported: "পার্টনার জালিয়াতি রেকর্ডের সঙ্গে মিলেছে",
    reasonUnusual: "অস্বাভাবিক অনবোর্ডিং বা লেনদেন আচরণ",
    recommendedAction: "প্রস্তাবিত পদক্ষেপ",
    readyRecommendation: "বড় ট্রান্সফার বা নথি শেয়ার করার আগে পরীক্ষা করুন।",
    safeRecommendation: "সন্দেহজনক অ্যাকাউন্ট পাওয়া যায়নি। চাপ দিলে অফিসিয়াল সহায়তা নিন।",
    reviewRecommendation: "বড় ট্রান্সফার এড়িয়ে চলুন এবং অফিসিয়াল সহায়তার মাধ্যমে যাচাই করুন।",
    urgentRecommendation: "টাকা পাঠাবেন না। ব্যাংকে যোগাযোগ করুন, cybercrime.gov.in এ রিপোর্ট করুন বা 1930 কল করুন।",
    officialHelp: "অফিসিয়াল সহায়তা",
    contactHeading: "কোথায় রিপোর্ট করবেন",
    cyberPortal: "জাতীয় সাইবার অপরাধ পোর্টাল",
    cyberDetail: "cybercrime.gov.in এ রিপোর্ট করুন বা 1930 কল করুন।",
    bankContact: "আপনার ব্যাংক বা ওয়ালেট প্রদানকারী",
    bankDetail: "KYC বিরোধ পর্যালোচনা এবং আপনি না খোলা অ্যাকাউন্টে অস্থায়ী বিধিনিষেধ চাইুন।",
  },
};

const SPEECH_TEXT = {
  mr: {
    clearSpeech: "या ओळखीवर सध्याच्या पार्टनर रेकॉर्डमध्ये कोणतेही म्यूल खाते किंवा संशयास्पद खाते आढळले नाही.",
    reviewSpeech: "संभाव्य संशयास्पद खाते आढळले आहे. कृपया मालकी पडताळा आणि तुमच्या बँक किंवा राष्ट्रीय सायबर गुन्हे पोर्टलशी संपर्क करा.",
    urgentSpeech: "संभाव्य म्यूल खाते किंवा संशयास्पद खाते आढळले आहे. लगेच तुमच्या बँकेशी संपर्क करा, cybercrime.gov.in वर रिपोर्ट करा किंवा 1930 वर कॉल करा.",
    invalidSpeech: "कृपया नंबरचा फॉरमॅट आणि संमती बॉक्स तपासा, मग पुन्हा प्रयत्न करा.",
    helpSpeech: "PAN किंवा फोन निवडा. बोलण्याचे बटण दाबा. नंबर हळू बोला. मी तपासून निकाल वाचून दाखवेन.",
    voiceUnsupported: "या ब्राउजरमध्ये आवाज इनपुट उपलब्ध नाही. तुम्ही नंबर टाइप करू शकता.",
    listening: "ऐकत आहे. कृपया आता बोला.",
    heard: "मी ऐकले",
  },
  ta: {
    clearSpeech: "இந்த அடையாளத்திற்கு தற்போதைய பங்குதாரர் பதிவுகளில் ம்யூல் கணக்கு அல்லது சந்தேகமான கணக்கு எதுவும் கிடைக்கவில்லை.",
    reviewSpeech: "சாத்தியமான சந்தேகமான கணக்கு பொருத்தம் கிடைத்துள்ளது. உரிமையை சரிபார்த்து உங்கள் வங்கி அல்லது தேசிய சைபர் குற்ற போர்டலை தொடர்பு கொள்ளுங்கள்.",
    urgentSpeech: "சாத்தியமான ம்யூல் கணக்கு அல்லது சந்தேகமான கணக்கு கிடைத்துள்ளது. உடனே உங்கள் வங்கியை தொடர்பு கொள்ளுங்கள், cybercrime.gov.in இல் புகார் செய்யுங்கள் அல்லது 1930 அழைக்கவும்.",
    invalidSpeech: "எண் வடிவத்தையும் ஒப்புதல் பெட்டியையும் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",
    helpSpeech: "PAN அல்லது தொலைபேசியை தேர்வு செய்யுங்கள். பேசுங்கள் பட்டனை அழுத்துங்கள். எண்ணை மெதுவாக சொல்லுங்கள். நான் முடிவை வாசிப்பேன்.",
    voiceUnsupported: "இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை. நீங்கள் எண்ணை தட்டச்சு செய்யலாம்.",
    listening: "கேட்கிறேன். தயவுசெய்து இப்போது பேசுங்கள்.",
    heard: "நான் கேட்டது",
  },
  te: {
    clearSpeech: "ఈ గుర్తింపుకు ప్రస్తుత భాగస్వామి రికార్డుల్లో మ్యూల్ ఖాతా లేదా అనుమానాస్పద ఖాతా కనిపించలేదు.",
    reviewSpeech: "సంభావ్య అనుమానాస్పద ఖాతా మ్యాచ్ కనిపించింది. దయచేసి యాజమాన్యాన్ని ధృవీకరించి మీ బ్యాంక్ లేదా నేషనల్ సైబర్ క్రైమ్ పోర్టల్‌ను సంప్రదించండి.",
    urgentSpeech: "సంభావ్య మ్యూల్ ఖాతా లేదా అనుమానాస్పద ఖాతా కనిపించింది. వెంటనే మీ బ్యాంకును సంప్రదించండి, cybercrime.gov.in లో రిపోర్ట్ చేయండి లేదా 1930కు కాల్ చేయండి.",
    invalidSpeech: "దయచేసి నంబర్ ఫార్మాట్ మరియు సమ్మతి బాక్స్‌ను తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.",
    helpSpeech: "PAN లేదా ఫోన్ ఎంచుకోండి. మాట్లాడండి బటన్ నొక్కండి. నంబర్‌ను నెమ్మదిగా చెప్పండి. నేను తనిఖీ చేసి ఫలితాన్ని చదువుతాను.",
    voiceUnsupported: "ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్‌కు మద్దతు లేదు. మీరు నంబర్‌ను టైప్ చేయవచ్చు.",
    listening: "వింటున్నాను. దయచేసి ఇప్పుడు మాట్లాడండి.",
    heard: "నేను విన్నది",
  },
  pa: {
    clearSpeech: "ਇਸ ਪਛਾਣ ਲਈ ਮੌਜੂਦਾ ਪਾਰਟਨਰ ਰਿਕਾਰਡਾਂ ਵਿੱਚ ਕੋਈ ਮਿਊਲ ਖਾਤਾ ਜਾਂ ਸ਼ੱਕੀ ਖਾਤਾ ਨਹੀਂ ਮਿਲਿਆ।",
    reviewSpeech: "ਸੰਭਾਵੀ ਸ਼ੱਕੀ ਖਾਤੇ ਦਾ ਮਿਲਾਣ ਮਿਲਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਮਾਲਕੀ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਆਪਣੀ ਬੈਂਕ ਜਾਂ ਰਾਸ਼ਟਰੀ ਸਾਈਬਰ ਅਪਰਾਧ ਪੋਰਟਲ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
    urgentSpeech: "ਸੰਭਾਵੀ ਮਿਊਲ ਖਾਤਾ ਜਾਂ ਸ਼ੱਕੀ ਖਾਤਾ ਮਿਲਿਆ ਹੈ। ਤੁਰੰਤ ਆਪਣੀ ਬੈਂਕ ਨਾਲ ਸੰਪਰਕ ਕਰੋ, cybercrime.gov.in ਤੇ ਰਿਪੋਰਟ ਕਰੋ ਜਾਂ 1930 ਕਾਲ ਕਰੋ।",
    invalidSpeech: "ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਫਾਰਮੈਟ ਅਤੇ ਸਹਿਮਤੀ ਬਾਕਸ ਦੀ ਜਾਂਚ ਕਰੋ, ਫਿਰ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    helpSpeech: "PAN ਜਾਂ ਫੋਨ ਚੁਣੋ। ਬੋਲੋ ਬਟਨ ਦਬਾਓ। ਨੰਬਰ ਹੌਲੀ ਬੋਲੋ। ਮੈਂ ਜਾਂਚ ਕੇ ਨਤੀਜਾ ਪੜ੍ਹ ਦਿਆਂਗਾ।",
    voiceUnsupported: "ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਵੌਇਸ ਇਨਪੁੱਟ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ। ਤੁਸੀਂ ਨੰਬਰ ਟਾਈਪ ਕਰ ਸਕਦੇ ਹੋ।",
    listening: "ਸੁਣ ਰਿਹਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਹੁਣ ਬੋਲੋ।",
    heard: "ਮੈਂ ਸੁਣਿਆ",
  },
  kn: {
    clearSpeech: "ಈ ಗುರುತಿಗೆ ಪ್ರಸ್ತುತ ಪಾರ್ಟ್ನರ್ ದಾಖಲೆಗಳಲ್ಲಿ ಯಾವುದೇ ಮ್ಯೂಲ್ ಖಾತೆ ಅಥವಾ ಅನುಮಾನಾಸ್ಪದ ಖಾತೆ ಕಂಡುಬಂದಿಲ್ಲ.",
    reviewSpeech: "ಸಂಭಾವ್ಯ ಅನುಮಾನಾಸ್ಪದ ಖಾತೆ ಹೊಂದಾಣಿಕೆ ಕಂಡುಬಂದಿದೆ. ದಯವಿಟ್ಟು ಮಾಲೀಕತ್ವವನ್ನು ಪರಿಶೀಲಿಸಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಅಥವಾ ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಕ್ರೈಮ್ ಪೋರ್ಟಲ್ ಸಂಪರ್ಕಿಸಿ.",
    urgentSpeech: "ಸಂಭಾವ್ಯ ಮ್ಯೂಲ್ ಖಾತೆ ಅಥವಾ ಅನುಮಾನಾಸ್ಪದ ಖಾತೆ ಕಂಡುಬಂದಿದೆ. ತಕ್ಷಣ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಸಂಪರ್ಕಿಸಿ, cybercrime.gov.in ನಲ್ಲಿ ರಿಪೋರ್ಟ್ ಮಾಡಿ ಅಥವಾ 1930ಕ್ಕೆ ಕರೆ ಮಾಡಿ.",
    invalidSpeech: "ದಯವಿಟ್ಟು ಸಂಖ್ಯೆ ರೂಪ ಮತ್ತು ಒಪ್ಪಿಗೆ ಬಾಕ್ಸ್ ಪರಿಶೀಲಿಸಿ, ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    helpSpeech: "PAN ಅಥವಾ ಫೋನ್ ಆಯ್ಕೆಮಾಡಿ. ಮಾತನಾಡಿ ಬಟನ್ ಒತ್ತಿ. ಸಂಖ್ಯೆಯನ್ನು ನಿಧಾನವಾಗಿ ಹೇಳಿ. ನಾನು ಪರಿಶೀಲಿಸಿ ಫಲಿತಾಂಶವನ್ನು ಓದುತ್ತೇನೆ.",
    voiceUnsupported: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ. ನೀವು ಸಂಖ್ಯೆಯನ್ನು ಟೈಪ್ ಮಾಡಬಹುದು.",
    listening: "ಕೇಳುತ್ತಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ಈಗ ಮಾತನಾಡಿ.",
    heard: "ನಾನು ಕೇಳಿದ್ದು",
  },
  bn: {
    clearSpeech: "এই পরিচয়ের জন্য বর্তমান পার্টনার রেকর্ডে কোনো মিউল অ্যাকাউন্ট বা সন্দেহজনক অ্যাকাউন্ট পাওয়া যায়নি।",
    reviewSpeech: "সম্ভাব্য সন্দেহজনক অ্যাকাউন্টের মিল পাওয়া গেছে। দয়া করে মালিকানা যাচাই করুন এবং আপনার ব্যাংক বা জাতীয় সাইবার অপরাধ পোর্টালের সঙ্গে যোগাযোগ করুন।",
    urgentSpeech: "সম্ভাব্য মিউল অ্যাকাউন্ট বা সন্দেহজনক অ্যাকাউন্ট পাওয়া গেছে। অবিলম্বে আপনার ব্যাংকের সঙ্গে যোগাযোগ করুন, cybercrime.gov.in এ রিপোর্ট করুন বা 1930 কল করুন।",
    invalidSpeech: "দয়া করে নম্বরের ফরম্যাট এবং সম্মতি বাক্স পরীক্ষা করে আবার চেষ্টা করুন।",
    helpSpeech: "PAN বা ফোন নির্বাচন করুন। বলুন বোতাম চাপুন। নম্বরটি ধীরে বলুন। আমি পরীক্ষা করে ফলাফল পড়ে শোনাব।",
    voiceUnsupported: "এই ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়। আপনি নম্বর টাইপ করতে পারেন।",
    listening: "শুনছি। দয়া করে এখন বলুন।",
    heard: "আমি শুনেছি",
  },
};

const state = {
  identityType: "pan",
  language: "en",
  recognition: null,
  isListening: false,
  pendingSpeech: null,
  voices: [],
  lastResult: null,
};

const LOCALIZED_DIGITS = {
  "०": "0", "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
  "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  "௦": "0", "௧": "1", "௨": "2", "௩": "3", "௪": "4", "௫": "5", "௬": "6", "௭": "7", "௮": "8", "௯": "9",
  "౦": "0", "౧": "1", "౨": "2", "౩": "3", "౪": "4", "౫": "5", "౬": "6", "౭": "7", "౮": "8", "౯": "9",
  "੦": "0", "੧": "1", "੨": "2", "੩": "3", "੪": "4", "੫": "5", "੬": "6", "੭": "7", "੮": "8", "੯": "9",
  "೦": "0", "೧": "1", "೨": "2", "೩": "3", "೪": "4", "೫": "5", "೬": "6", "೭": "7", "೮": "8", "೯": "9",
};

const LOCALIZED_NUMBER_WORDS = {
  en: { zero: "0", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9", oh: "0", o: "0" },
  hi: { "शून्य": "0", "एक": "1", "दो": "2", "तीन": "3", "चार": "4", "पांच": "5", "पाँच": "5", "छह": "6", "सात": "7", "आठ": "8", "नौ": "9" },
  mr: { "शून्य": "0", "एक": "1", "दोन": "2", "तीन": "3", "चार": "4", "पाच": "5", "सहा": "6", "सात": "7", "आठ": "8", "नऊ": "9" },
  ta: { "பூஜ்யம்": "0", "ஒன்று": "1", "இரண்டு": "2", "மூன்று": "3", "நான்கு": "4", "ஐந்து": "5", "ஆறு": "6", "ஏழு": "7", "எட்டு": "8", "ஒன்பது": "9" },
  te: { "సున్నా": "0", "ఒకటి": "1", "రెండు": "2", "మూడు": "3", "నాలుగు": "4", "ఐదు": "5", "ఆరు": "6", "ఏడు": "7", "ఎనిమిది": "8", "తొమ్మిది": "9" },
  pa: { "ਸਿਫ਼ਰ": "0", "ਸਿਫਰ": "0", "ਇੱਕ": "1", "ਇਕ": "1", "ਦੋ": "2", "ਤਿੰਨ": "3", "ਚਾਰ": "4", "ਪੰਜ": "5", "ਛੇ": "6", "ਸੱਤ": "7", "ਅੱਠ": "8", "ਨੌਂ": "9" },
  kn: { "ಸೊನ್ನೆ": "0", "ಒಂದು": "1", "ಎರಡು": "2", "ಮೂರು": "3", "ನಾಲ್ಕು": "4", "ಐದು": "5", "ಆರು": "6", "ಏಳು": "7", "ಎಂಟು": "8", "ಒಂಬತ್ತು": "9" },
  bn: { "শূন্য": "0", "এক": "1", "দুই": "2", "তিন": "3", "চার": "4", "পাঁচ": "5", "ছয়": "6", "সাত": "7", "আট": "8", "নয়": "9" },
};

const VOICE_FALLBACK = {
  en: "Voice output for the selected language is not installed on this device. You can still use voice input or read the guidance.",
  hi: "इस डिवाइस पर चुनी गई भाषा की आवाज उपलब्ध नहीं है। आप फिर भी बोलकर नंबर दे सकते हैं या निर्देश पढ़ सकते हैं।",
  mr: "या डिव्हाइसवर निवडलेल्या भाषेचा आवाज उपलब्ध नाही. तुम्ही तरीही बोलून नंबर देऊ शकता किंवा सूचना वाचू शकता.",
  ta: "தேர்ந்தெடுத்த மொழிக்கான குரல் இந்த சாதனத்தில் இல்லை. நீங்கள் குரல் உள்ளீட்டைப் பயன்படுத்தலாம் அல்லது வழிகாட்டுதலைப் படிக்கலாம்.",
  te: "ఎంచుకున్న భాషకు వాయిస్ ఈ పరికరంలో అందుబాటులో లేదు. మీరు వాయిస్ ఇన్‌పుట్‌ను ఉపయోగించవచ్చు లేదా సూచనలను చదవవచ్చు.",
  pa: "ਚੁਣੀ ਹੋਈ ਭਾਸ਼ਾ ਲਈ ਆਵਾਜ਼ ਇਸ ਡਿਵਾਈਸ 'ਤੇ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਤੁਸੀਂ ਫਿਰ ਵੀ ਬੋਲ ਕੇ ਨੰਬਰ ਦੇ ਸਕਦੇ ਹੋ ਜਾਂ ਹਦਾਇਤਾਂ ਪੜ੍ਹ ਸਕਦੇ ਹੋ।",
  kn: "ಆಯ್ಕೆ ಮಾಡಿದ ಭಾಷೆಯ ಧ್ವನಿ ಈ ಸಾಧನದಲ್ಲಿ ಲಭ್ಯವಿಲ್ಲ. ನೀವು ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬಳಸಬಹುದು ಅಥವಾ ಮಾರ್ಗದರ್ಶನವನ್ನು ಓದಬಹುದು.",
  bn: "নির্বাচিত ভাষার কণ্ঠ এই ডিভাইসে উপলব্ধ নেই। আপনি তবুও ভয়েস ইনপুট ব্যবহার করতে পারেন বা নির্দেশনা পড়তে পারেন।",
};

const el = {
  languageSelect: document.querySelector("#languageSelect"),
  form: document.querySelector("#identityCheckForm"),
  identityInputLabel: document.querySelector("#identityInputLabel"),
  result: document.querySelector("#identityCheckResult"),
  statusBadge: document.querySelector("#consumerStatusBadge"),
  nextSteps: document.querySelector("#nextSteps"),
  flagReasons: document.querySelector("#flagReasons"),
  resultSection: document.querySelector("#resultSection"),
  voiceStatus: document.querySelector("#voiceStatus"),
  startVoice: document.querySelector("#startVoice"),
  readHelp: document.querySelector("#readHelp"),
};

async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) throw data;
  return data;
}

function t(key) {
  return LANG[state.language]?.[key] || SPEECH_TEXT[state.language]?.[key] || LANG.en[key] || key;
}

function applyLanguage() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    refreshVoices();
  }
  document.documentElement.lang = state.language;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  el.identityInputLabel.textContent = state.identityType === "phone" ? t("phoneLabel") : t("panLabel");
  setStatus(el.statusBadge.dataset.status || "ready");
  if (state.lastResult) renderResult(state.lastResult, { announce: false });
}

function statusLabel(status) {
  if (status === "urgent") return t("urgent");
  if (status === "review") return t("review");
  if (status === "invalid") return t("invalid");
  if (status === "checking") return t("checking");
  if (status === "ready") return t("ready");
  return t("noMisuse");
}

function setStatus(status) {
  el.statusBadge.dataset.status = status;
  el.statusBadge.textContent = statusLabel(status);
  el.statusBadge.className = `satark-inline-status ${status === "urgent" ? "danger" : status === "review" ? "watch" : ""}`;
}

function translatedRecommendation(status) {
  if (status === "urgent") return t("urgentSpeech");
  if (status === "review") return t("reviewSpeech");
  if (status === "invalid") return t("invalidSpeech");
  return t("clearSpeech");
}

function linkOfficialPortal(text) {
  return String(text).replace(
    /cybercrime\.gov\.in/gi,
    '<a class="official-portal-link" href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer">cybercrime.gov.in</a>',
  );
}

function riskBadgeText(status) {
  if (status === "urgent") return t("highRisk");
  if (status === "review") return t("reviewRisk");
  if (status === "invalid") return t("checkInput");
  return t("lowRisk");
}

function renderResult(result, { announce = true } = {}) {
  state.lastResult = result;
  const status = result.status || "clear";
  setStatus(status);
  const riskScore = Number(result.riskScore || 0);
  const trustScore = Math.max(0, Math.min(100, 100 - riskScore));
  const badgeClass = status === "urgent" ? "danger" : status === "review" ? "watch" : status === "invalid" ? "watch" : "safe";
  const matches = (result.matches || []).map((match) => `
    <li>
      <strong>${match.institution}</strong>
      <span>${match.account} | ${match.opened} | ${match.city} | risk ${match.risk}</span>
    </li>
  `).join("");

  el.result.className = `satark-result-card ${badgeClass}`;
  el.result.innerHTML = `
    <div class="satark-score-ring ${badgeClass}" style="--score:${trustScore}">
      <strong>${trustScore}<small>/100</small></strong>
      <span>${t("trustScore")}</span>
    </div>
    <div class="satark-result-copy">
      <span class="satark-risk-badge ${badgeClass}">${riskBadgeText(status)}</span>
      <h2>${result.identifierMask || "Satark AI"}: ${statusLabel(status)}</h2>
      <p>${linkOfficialPortal(result.error || translatedRecommendation(status))}</p>
      ${matches ? `<ul class="satark-match-list">${matches}</ul>` : ""}
    </div>
  `;

  renderFlagReasons(status, result);
  el.nextSteps.className = `satark-recommendation ${status}`;
  el.nextSteps.innerHTML = nextStepContent(status);
  if (announce) {
    el.resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    speak(resultSpeech(result));
  }
}

function renderFlagReasons(status, result) {
  const hasMatch = (result.matches || []).length > 0;
  const reasons = status === "clear"
    ? [t("reasonClean")]
    : [t("reasonSuspicious"), hasMatch ? t("reasonReported") : t("reasonUnusual"), t("reasonUnusual")];
  el.flagReasons.innerHTML = reasons.map((reason) => `<li>${reason}</li>`).join("");
}

function contactList(status) {
  if (status === "clear") {
    return `<ul class="report-contacts"><li><strong>${t("cyberPortal")}</strong><br>${linkOfficialPortal(t("cyberDetail"))}</li></ul>`;
  }
  return `
    <ul class="report-contacts">
      <li><strong>${t("cyberPortal")}</strong><br>${linkOfficialPortal(t("cyberDetail"))}</li>
      <li><strong>${t("bankContact")}</strong><br>${t("bankDetail")}</li>
    </ul>
  `;
}

function nextStepContent(status) {
  const recommendation = status === "urgent"
    ? t("urgentRecommendation")
    : status === "review"
      ? t("reviewRecommendation")
      : status === "invalid"
        ? t("invalidSpeech")
        : t("safeRecommendation");
  return `<strong>${t("recommendedAction")}</strong><span>${linkOfficialPortal(recommendation)}</span>${contactList(status)}`;
}

function resultSpeech(result) {
  const status = result.status || "clear";
  return `${statusLabel(status)}. ${translatedRecommendation(status)}`;
}

async function runSelfCheck(identifier) {
  const payload = {
    identifierType: state.identityType,
    identifier,
    consent: el.form.elements.consent.checked,
  };
  setStatus("checking");
  try {
    const result = await api("/api/identity-checks", { method: "POST", body: JSON.stringify(payload) });
    renderResult(result);
  } catch (error) {
    renderResult({ status: "invalid", error: error.error || t("invalidSpeech") });
  }
}

function submitSelfCheck(event) {
  event.preventDefault();
  runSelfCheck(new FormData(event.currentTarget).get("identifier"));
}

function normalizeSpeech(text) {
  const digitWords = { ...LOCALIZED_NUMBER_WORDS.en, ...(LOCALIZED_NUMBER_WORDS[state.language] || {}) };
  const normalizedText = Array.from(text || "")
    .map((character) => LOCALIZED_DIGITS[character] || character)
    .join("");
  return normalizedText
    .toLowerCase()
    .split(/[\s,.-]+/)
    .map((part) => digitWords[part] || part)
    .join("")
    .replace(/[^a-z0-9]/gi, "")
    .toUpperCase();
}

function recognitionSupported() {
  return window.SpeechRecognition || window.webkitSpeechRecognition;
}

function speechLang() {
  return LANG[state.language]?.speech || LANG.en.speech;
}

function refreshVoices() {
  if (!("speechSynthesis" in window)) return [];
  state.voices = window.speechSynthesis.getVoices();
  return state.voices;
}

function normaliseLocale(locale) {
  return String(locale || "").replace("_", "-").toLowerCase();
}

function preferredVoice() {
  refreshVoices();
  const lang = normaliseLocale(speechLang());
  const baseLang = lang.split("-")[0];
  return state.voices.find((voice) => normaliseLocale(voice.lang) === lang)
    || state.voices.find((voice) => normaliseLocale(voice.lang).split("-")[0] === baseLang)
    || null;
}

function startVoiceInput() {
  if (state.isListening) return;
  const SpeechRecognition = recognitionSupported();
  if (!SpeechRecognition) {
    el.voiceStatus.textContent = t("voiceUnsupported");
    speak(t("voiceUnsupported"));
    return;
  }
  const recognition = new SpeechRecognition();
  state.recognition = recognition;
  state.isListening = true;
  state.pendingSpeech = null;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  recognition.lang = speechLang();
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  el.startVoice.classList.add("listening");
  el.voiceStatus.textContent = t("listening");
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const identifier = normalizeSpeech(transcript);
    el.form.elements.identifier.value = identifier;
    el.voiceStatus.textContent = `${t("heard")}: ${identifier}`;
    recognition.stop();
    runSelfCheck(identifier);
  };
  recognition.onerror = () => {
    el.voiceStatus.textContent = t("voiceUnsupported");
  };
  recognition.onend = () => {
    state.isListening = false;
    if (state.recognition === recognition) state.recognition = null;
    el.startVoice.classList.remove("listening");
    const pendingSpeech = state.pendingSpeech;
    state.pendingSpeech = null;
    if (pendingSpeech) speak(pendingSpeech);
  };
  recognition.start();
}

function speak(text, { showFallback = true, retry = true } = {}) {
  if (!("speechSynthesis" in window)) return false;
  if (state.isListening) {
    state.pendingSpeech = text;
    return false;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = preferredVoice();
  if (!voice && state.language !== "en") {
    // Some browsers use an English default voice when no matching voice is installed.
    // Do not misrepresent that output as the selected language.
    if (retry && state.voices.length === 0) {
      window.setTimeout(() => speak(text, { showFallback, retry: false }), 250);
      return false;
    }
    if (showFallback) el.voiceStatus.textContent = VOICE_FALLBACK[state.language] || VOICE_FALLBACK.en;
    return false;
  }
  utterance.lang = voice ? voice.lang : speechLang();
  if (voice) {
    try {
      utterance.voice = voice;
    } catch (error) {
      utterance.voice = null;
    }
  }
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
  return true;
}

document.querySelectorAll("[data-identity-type]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-identity-type]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.identityType = button.dataset.identityType;
    const input = el.form.elements.identifier;
    input.value = state.identityType === "phone" ? "9876543210" : "ABCDE1234F";
    input.inputMode = state.identityType === "phone" ? "tel" : "text";
    el.identityInputLabel.textContent = state.identityType === "phone" ? t("phoneLabel") : t("panLabel");
  });
});

el.languageSelect.addEventListener("change", () => {
  state.language = el.languageSelect.value;
  applyLanguage();
});

el.form.addEventListener("submit", submitSelfCheck);
el.startVoice.addEventListener("click", startVoiceInput);
el.readHelp.addEventListener("click", () => speak(t("helpSpeech")));

if ("speechSynthesis" in window) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

applyLanguage();
