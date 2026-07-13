import React, { createContext, useContext, useState, useCallback } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navbar
    nav_home: 'Home',
    nav_map: 'Map',
    nav_track: 'Track Complaint',
    nav_report: 'Report Drainage Issue',
    nav_admin: 'Admin Panel',
    nav_signin: 'Sign In',
    nav_signup: 'Sign Up',
    nav_logout: 'Logout',
    nav_profile: 'Profile',

    // Home Page
    hero_badge: 'Civic Service Hub',
    hero_title_1: 'Report Drainage Issues,',
    hero_title_2: 'Build a Cleaner City',
    hero_desc: 'A professional digital platform for citizens to upload photographs and capture precise GPS locations of drainage blockages. Directly routed to municipal authorities for prompt intervention.',
    hero_report_btn: 'Report Issue Now',
    hero_get_started: 'Get Started',
    hero_track_btn: 'Track Complaint',
    stat_total: 'Total Complaints',
    stat_resolved: 'Resolved Cases',
    stat_pending: 'Pending Cases',
    stat_users: 'Active Users',
    how_title: 'How It Works',
    how_desc: 'Reporting drainage leakages and resolving civic problems in three simple steps.',
    step1_title: 'Capture & Upload',
    step1_desc: 'Take a photo of the clogged manhole or leakage directly at the site using your smartphone camera.',
    step2_title: 'Pin GPS Location',
    step2_desc: 'Use our GPS integration to automatically pin the exact longitude and latitude coordinates of the issue.',
    step3_title: 'Resolve Swiftly',
    step3_desc: 'The municipality receives the report, assigns maintenance teams, and updates you on the progress via email.',
    hero_overflow: 'Drainage Overflow',
    hero_sector4: 'Sector 4 - Residential Colony',
    hero_pending: 'Pending',
    hero_resolved_card: 'Clogged Drain Resolved',
    hero_sector1: 'Sector 1 - Downtown',
    hero_resolved: 'Resolved',

    // Report Page
    report_title: 'Report Drainage Issue',
    report_subtitle: 'Provide details, take/upload a photo, and share GPS coordinates to notify the municipality department.',
    report_contact_title: 'Contact Info & Issue Details',
    report_name: 'Full Name',
    report_name_ph: 'Enter full name',
    report_phone: 'Phone Number',
    report_phone_ph: 'Enter phone number',
    report_area: 'Sector Area',
    report_address: 'Specific Site Address',
    report_address_ph: 'e.g. Near Building 4, Road 2',
    report_desc: 'Drainage Issue Description',
    report_desc_ph: 'Describe the leak, blockage details, overflow level...',
    report_photo_title: 'Upload Photo',
    report_photo_required: '(Required)',
    report_photo_drag: 'Drag & Drop or Click to Upload Image',
    report_photo_format: 'JPEG, PNG, or WebP up to 5MB',
    report_photo_remove: 'Remove',
    report_gps_title: 'Pin GPS Location',
    report_gps_btn: 'Use My GPS',
    report_gps_capturing: 'Capturing...',
    report_submit: 'Submit Complaint',
    report_submitting: 'Submitting Report...',
    report_err_fields: 'All fields are required.',
    report_err_photo: 'Please upload a photo of the drainage issue. Photo proof is mandatory.',
    report_address_autofill: 'Address auto-filled from location!',
    report_coords_updated: 'Coordinates updated from map selection!',
    report_loc_captured: 'Location captured successfully!',
    report_gps_fail: 'Failed to access GPS. Please select a spot manually on the map.',
    report_gps_unsupported: 'Geolocation is not supported by your browser.',
    report_file_size: 'File size cannot exceed 5MB.',
    report_success: 'Complaint submitted successfully!',
    report_fail: 'Submission failed.',

    // Login Page
    login_title: 'Sign In',
    login_subtitle: 'Access civic services, report drainage issues, or check complaint history.',
    login_email: 'Email Address',
    login_password: 'Password',
    login_btn: 'Sign In',
    login_no_account: "Don't have an account?",
    login_signup_link: 'Sign up here',
    login_admin: 'Admin Login',

    // Register Page
    register_title: 'Create Account',
    register_subtitle: 'Create an account to report issues, track resolutions, and coordinate with the municipality.',
    register_name: 'Full Name',
    register_email: 'Email Address',
    register_phone: 'Phone Number',
    register_password: 'Password',
    register_confirm: 'Confirm Password',
    register_btn: 'Create Account',
    register_has_account: 'Already have an account?',
    register_login_link: 'Sign in',

    // Track Page
    track_title: 'Track Complaint',
    track_subtitle: 'Enter your complaint tracking ID to check the current status and resolution progress.',
    track_placeholder: 'Enter Complaint ID (e.g. SDM-2026-00001)',
    track_btn: 'Track Status',
    track_searching: 'Searching...',

    // Footer
    footer_desc: 'Smart Drainage Management System (SDMS) is a municipal initiative enabling citizens to report road drainage issues instantly, promoting a cleaner, safer, and healthier environment.',
    footer_quick: 'Quick Links',
    footer_home: 'Home',
    footer_map: 'Interactive Map',
    footer_track: 'Track Complaint',
    footer_report: 'Report Issue',
    footer_contact: 'Contact Municipal Dept',
    footer_address: 'Civic Center, Municipality Head Office, Sector 1, City.',
    footer_toll: '1800-123-4567 (Toll-Free)',
    footer_copyright: '© {year} Smart Drainage Management System. All rights reserved.',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',
    footer_govt: 'Government Initiative',

    // Map Page
    map_title: 'Live Complaints Map',
    map_subtitle: 'Explore all reported drainage issues across the city on an interactive map.',
    map_loading: 'Mapping Civic Reports...',

    // Profile Page
    profile_title: 'My Profile',
    profile_complaints: 'My Complaints',
    profile_no_complaints: 'No Complaints Reported',
    profile_no_complaints_desc: "You haven't reported any drainage leakages yet. Help us clean up our city roads!",
    profile_report_btn: 'Report an Issue Now',

    // Language names
    lang_en: 'English',
    lang_hi: 'हिंदी',
    lang_te: 'తెలుగు',
  },

  hi: {
    // Navbar
    nav_home: 'होम',
    nav_map: 'मानचित्र',
    nav_track: 'शिकायत ट्रैक करें',
    nav_report: 'नाली समस्या रिपोर्ट करें',
    nav_admin: 'एडमिन पैनल',
    nav_signin: 'लॉगिन करें',
    nav_signup: 'साइन अप करें',
    nav_logout: 'लॉगआउट',
    nav_profile: 'प्रोफ़ाइल',

    // Home Page
    hero_badge: 'नागरिक सेवा केंद्र',
    hero_title_1: 'नाली की समस्या रिपोर्ट करें,',
    hero_title_2: 'एक स्वच्छ शहर बनाएं',
    hero_desc: 'नागरिकों के लिए एक पेशेवर डिजिटल प्लेटफॉर्म जहाँ वे नालियों में रुकावट की तस्वीरें अपलोड करें और सटीक GPS स्थान साझा करें। सीधे नगरपालिका अधिकारियों को भेजा जाता है।',
    hero_report_btn: 'अभी समस्या रिपोर्ट करें',
    hero_get_started: 'शुरू करें',
    hero_track_btn: 'शिकायत ट्रैक करें',
    stat_total: 'कुल शिकायतें',
    stat_resolved: 'समाधान किए गए',
    stat_pending: 'लंबित मामले',
    stat_users: 'सक्रिय उपयोगकर्ता',
    how_title: 'यह कैसे काम करता है',
    how_desc: 'तीन सरल चरणों में नाली की समस्या रिपोर्ट करें और नागरिक समस्याओं का समाधान करें।',
    step1_title: 'फोटो खींचें और अपलोड करें',
    step1_desc: 'अपने स्मार्टफोन कैमरे से सीधे साइट पर बंद मैनहोल या रिसाव की तस्वीर लें।',
    step2_title: 'GPS स्थान चिह्नित करें',
    step2_desc: 'हमारे GPS एकीकरण का उपयोग करके समस्या के सटीक अक्षांश और देशांतर निर्देशांक स्वचालित रूप से चिह्नित करें।',
    step3_title: 'शीघ्र समाधान',
    step3_desc: 'नगरपालिका रिपोर्ट प्राप्त करती है, रखरखाव दल नियुक्त करती है और ईमेल के माध्यम से प्रगति की जानकारी देती है।',
    hero_overflow: 'नाली अतिप्रवाह',
    hero_sector4: 'सेक्टर 4 - आवासीय कॉलोनी',
    hero_pending: 'लंबित',
    hero_resolved_card: 'बंद नाली का समाधान किया',
    hero_sector1: 'सेक्टर 1 - डाउनटाउन',
    hero_resolved: 'समाधान',

    // Report Page
    report_title: 'नाली समस्या रिपोर्ट करें',
    report_subtitle: 'विवरण प्रदान करें, तस्वीर लें/अपलोड करें, और नगरपालिका विभाग को सूचित करने के लिए GPS निर्देशांक साझा करें।',
    report_contact_title: 'संपर्क जानकारी और समस्या विवरण',
    report_name: 'पूरा नाम',
    report_name_ph: 'पूरा नाम दर्ज करें',
    report_phone: 'फोन नंबर',
    report_phone_ph: 'फोन नंबर दर्ज करें',
    report_area: 'सेक्टर क्षेत्र',
    report_address: 'विशिष्ट स्थान का पता',
    report_address_ph: 'उदा. भवन 4 के पास, रोड 2',
    report_desc: 'नाली समस्या का विवरण',
    report_desc_ph: 'रिसाव, रुकावट विवरण, अतिप्रवाह स्तर बताएं...',
    report_photo_title: 'फोटो अपलोड करें',
    report_photo_required: '(आवश्यक)',
    report_photo_drag: 'खींचें और छोड़ें या अपलोड करने के लिए क्लिक करें',
    report_photo_format: 'JPEG, PNG, या WebP 5MB तक',
    report_photo_remove: 'हटाएं',
    report_gps_title: 'GPS स्थान चिह्नित करें',
    report_gps_btn: 'मेरा GPS उपयोग करें',
    report_gps_capturing: 'प्राप्त कर रहा है...',
    report_submit: 'शिकायत जमा करें',
    report_submitting: 'रिपोर्ट जमा हो रही है...',
    report_err_fields: 'सभी फ़ील्ड आवश्यक हैं।',
    report_err_photo: 'कृपया नाली समस्या की तस्वीर अपलोड करें। फोटो प्रमाण अनिवार्य है।',
    report_address_autofill: 'पता स्थान से स्वतः भर गया!',
    report_coords_updated: 'निर्देशांक मानचित्र चयन से अपडेट किए गए!',
    report_loc_captured: 'स्थान सफलतापूर्वक प्राप्त किया!',
    report_gps_fail: 'GPS एक्सेस करने में विफल। कृपया मानचित्र पर मैन्युअली स्थान चुनें।',
    report_gps_unsupported: 'आपका ब्राउज़र जियोलोकेशन का समर्थन नहीं करता।',
    report_file_size: 'फ़ाइल का आकार 5MB से अधिक नहीं हो सकता।',
    report_success: 'शिकायत सफलतापूर्वक जमा की गई!',
    report_fail: 'जमा करना विफल रहा।',

    // Login Page
    login_title: 'लॉगिन करें',
    login_subtitle: 'नागरिक सेवाओं तक पहुंचें, नाली की समस्या रिपोर्ट करें, या शिकायत इतिहास देखें।',
    login_email: 'ईमेल पता',
    login_password: 'पासवर्ड',
    login_btn: 'लॉगिन करें',
    login_no_account: 'खाता नहीं है?',
    login_signup_link: 'यहाँ साइन अप करें',
    login_admin: 'एडमिन लॉगिन',

    // Register Page
    register_title: 'खाता बनाएं',
    register_subtitle: 'समस्या रिपोर्ट करने, समाधान ट्रैक करने और नगरपालिका के साथ समन्वय करने के लिए खाता बनाएं।',
    register_name: 'पूरा नाम',
    register_email: 'ईमेल पता',
    register_phone: 'फोन नंबर',
    register_password: 'पासवर्ड',
    register_confirm: 'पासवर्ड की पुष्टि करें',
    register_btn: 'खाता बनाएं',
    register_has_account: 'पहले से खाता है?',
    register_login_link: 'लॉगिन करें',

    // Track Page
    track_title: 'शिकायत ट्रैक करें',
    track_subtitle: 'वर्तमान स्थिति और समाधान प्रगति जानने के लिए अपना शिकायत ट्रैकिंग ID दर्ज करें।',
    track_placeholder: 'शिकायत ID दर्ज करें (उदा. SDM-2026-00001)',
    track_btn: 'स्थिति ट्रैक करें',
    track_searching: 'खोज रहा है...',

    // Footer
    footer_desc: 'स्मार्ट ड्रेनेज प्रबंधन प्रणाली (SDMS) एक नगरपालिका पहल है जो नागरिकों को सड़क नाली की समस्याओं की तुरंत रिपोर्ट करने में सक्षम बनाती है।',
    footer_quick: 'त्वरित लिंक',
    footer_home: 'होम',
    footer_map: 'इंटरैक्टिव मानचित्र',
    footer_track: 'शिकायत ट्रैक करें',
    footer_report: 'समस्या रिपोर्ट करें',
    footer_contact: 'नगरपालिका विभाग से संपर्क',
    footer_address: 'सिविक सेंटर, नगरपालिका मुख्यालय, सेक्टर 1, शहर।',
    footer_toll: '1800-123-4567 (टोल-फ्री)',
    footer_copyright: '© {year} स्मार्ट ड्रेनेज प्रबंधन प्रणाली। सर्वाधिकार सुरक्षित।',
    footer_privacy: 'गोपनीयता नीति',
    footer_terms: 'सेवा की शर्तें',
    footer_govt: 'सरकारी पहल',

    // Map Page
    map_title: 'लाइव शिकायत मानचित्र',
    map_subtitle: 'इंटरैक्टिव मानचित्र पर शहर भर में रिपोर्ट की गई सभी नाली समस्याओं का अन्वेषण करें।',
    map_loading: 'नागरिक रिपोर्ट मैप कर रहा है...',

    // Profile Page
    profile_title: 'मेरी प्रोफ़ाइल',
    profile_complaints: 'मेरी शिकायतें',
    profile_no_complaints: 'कोई शिकायत रिपोर्ट नहीं',
    profile_no_complaints_desc: 'आपने अभी तक कोई नाली रिसाव की रिपोर्ट नहीं की है। हमारे शहर की सड़कों को साफ करने में मदद करें!',
    profile_report_btn: 'अभी समस्या रिपोर्ट करें',

    // Language names
    lang_en: 'English',
    lang_hi: 'हिंदी',
    lang_te: 'తెలుగు',
  },

  te: {
    // Navbar
    nav_home: 'హోమ్',
    nav_map: 'మ్యాప్',
    nav_track: 'ఫిర్యాదు ట్రాక్',
    nav_report: 'డ్రైనేజీ సమస్య నివేదించండి',
    nav_admin: 'అడ్మిన్ ప్యానెల్',
    nav_signin: 'సైన్ ఇన్',
    nav_signup: 'సైన్ అప్',
    nav_logout: 'లాగ్ అవుట్',
    nav_profile: 'ప్రొఫైల్',

    // Home Page
    hero_badge: 'పౌర సేవా కేంద్రం',
    hero_title_1: 'డ్రైనేజీ సమస్యలను నివేదించండి,',
    hero_title_2: 'శుభ్రమైన నగరాన్ని నిర్మించండి',
    hero_desc: 'పౌరులు డ్రైనేజీ అడ్డంకుల ఫోటోలను అప్‌లోడ్ చేయడానికి మరియు ఖచ్చితమైన GPS స్థానాలను పంచుకోవడానికి ఒక వృత్తిపరమైన డిజిటల్ ప్లాట్‌ఫారం. నేరుగా మున్సిపల్ అధికారులకు పంపబడుతుంది.',
    hero_report_btn: 'ఇప్పుడే సమస్య నివేదించండి',
    hero_get_started: 'ప్రారంభించండి',
    hero_track_btn: 'ఫిర్యాదు ట్రాక్ చేయండి',
    stat_total: 'మొత్తం ఫిర్యాదులు',
    stat_resolved: 'పరిష్కరించిన కేసులు',
    stat_pending: 'పెండింగ్ కేసులు',
    stat_users: 'యాక్టివ్ యూజర్లు',
    how_title: 'ఇది ఎలా పని చేస్తుంది',
    how_desc: 'మూడు సాధారణ దశల్లో డ్రైనేజీ లీకేజీలను నివేదించండి మరియు పౌర సమస్యలను పరిష్కరించండి.',
    step1_title: 'ఫోటో తీసి అప్‌లోడ్ చేయండి',
    step1_desc: 'మీ స్మార్ట్‌ఫోన్ కెమెరాతో నేరుగా మూసుకుపోయిన మ్యాన్‌హోల్ లేదా లీకేజీ ఫోటో తీయండి.',
    step2_title: 'GPS స్థానం గుర్తించండి',
    step2_desc: 'మా GPS ఇంటిగ్రేషన్ ఉపయోగించి సమస్య ఖచ్చితమైన అక్షాంశ రేఖాంశ కోఆర్డినేట్‌లను ఆటోమేటిక్‌గా గుర్తించండి.',
    step3_title: 'త్వరగా పరిష్కరించండి',
    step3_desc: 'మున్సిపాలిటీ నివేదికను స్వీకరిస్తుంది, నిర్వహణ బృందాలను నియమిస్తుంది మరియు ఇమెయిల్ ద్వారా ప్రగతిని తెలియజేస్తుంది.',
    hero_overflow: 'డ్రైనేజీ ఓవర్‌ఫ్లో',
    hero_sector4: 'సెక్టార్ 4 - రెసిడెన్షియల్ కాలనీ',
    hero_pending: 'పెండింగ్',
    hero_resolved_card: 'మూసుకుపోయిన డ్రైన్ పరిష్కరించబడింది',
    hero_sector1: 'సెక్టార్ 1 - డౌన్‌టౌన్',
    hero_resolved: 'పరిష్కరించబడింది',

    // Report Page
    report_title: 'డ్రైనేజీ సమస్య నివేదించండి',
    report_subtitle: 'వివరాలు అందించండి, ఫోటో తీయండి/అప్‌లోడ్ చేయండి మరియు మున్సిపల్ విభాగానికి తెలియజేయడానికి GPS కోఆర్డినేట్‌లు షేర్ చేయండి.',
    report_contact_title: 'సంప్రదింపు సమాచారం & సమస్య వివరాలు',
    report_name: 'పూర్తి పేరు',
    report_name_ph: 'పూర్తి పేరు నమోదు చేయండి',
    report_phone: 'ఫోన్ నంబర్',
    report_phone_ph: 'ఫోన్ నంబర్ నమోదు చేయండి',
    report_area: 'సెక్టార్ ప్రాంతం',
    report_address: 'నిర్దిష్ట ప్రదేశ చిరునామా',
    report_address_ph: 'ఉదా. బిల్డింగ్ 4 దగ్గర, రోడ్ 2',
    report_desc: 'డ్రైనేజీ సమస్య వివరణ',
    report_desc_ph: 'లీక్, బ్లాకేజ్ వివరాలు, ఓవర్‌ఫ్లో స్థాయి వివరించండి...',
    report_photo_title: 'ఫోటో అప్‌లోడ్ చేయండి',
    report_photo_required: '(తప్పనిసరి)',
    report_photo_drag: 'డ్రాగ్ & డ్రాప్ చేయండి లేదా అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి',
    report_photo_format: 'JPEG, PNG, లేదా WebP 5MB వరకు',
    report_photo_remove: 'తీసివేయండి',
    report_gps_title: 'GPS స్థానం గుర్తించండి',
    report_gps_btn: 'నా GPS ఉపయోగించు',
    report_gps_capturing: 'గుర్తిస్తోంది...',
    report_submit: 'ఫిర్యాదు సమర్పించండి',
    report_submitting: 'నివేదిక సమర్పిస్తోంది...',
    report_err_fields: 'అన్ని ఫీల్డ్‌లు అవసరం.',
    report_err_photo: 'దయచేసి డ్రైనేజీ సమస్య ఫోటో అప్‌లోడ్ చేయండి. ఫోటో రుజువు తప్పనిసరి.',
    report_address_autofill: 'చిరునామా స్థానం నుండి స్వయంచాలకంగా నమోదు చేయబడింది!',
    report_coords_updated: 'మ్యాప్ ఎంపిక నుండి కోఆర్డినేట్‌లు అప్‌డేట్ చేయబడ్డాయి!',
    report_loc_captured: 'స్థానం విజయవంతంగా గుర్తించబడింది!',
    report_gps_fail: 'GPS యాక్సెస్ విఫలమైంది. దయచేసి మ్యాప్‌పై మాన్యువల్‌గా స్థానాన్ని ఎంచుకోండి.',
    report_gps_unsupported: 'మీ బ్రౌజర్ జియోలొకేషన్‌ను సపోర్ట్ చేయదు.',
    report_file_size: 'ఫైల్ సైజ్ 5MB దాటకూడదు.',
    report_success: 'ఫిర్యాదు విజయవంతంగా సమర్పించబడింది!',
    report_fail: 'సమర్పణ విఫలమైంది.',

    // Login Page
    login_title: 'సైన్ ఇన్',
    login_subtitle: 'పౌర సేవలను యాక్సెస్ చేయండి, డ్రైనేజీ సమస్యలను నివేదించండి, లేదా ఫిర్యాదు చరిత్ర చూడండి.',
    login_email: 'ఇమెయిల్ అడ్రస్',
    login_password: 'పాస్‌వర్డ్',
    login_btn: 'సైన్ ఇన్',
    login_no_account: 'ఖాతా లేదా?',
    login_signup_link: 'ఇక్కడ సైన్ అప్ చేయండి',
    login_admin: 'అడ్మిన్ లాగిన్',

    // Register Page
    register_title: 'ఖాతా సృష్టించండి',
    register_subtitle: 'సమస్యలను నివేదించడానికి, పరిష్కారాలను ట్రాక్ చేయడానికి మరియు మున్సిపాలిటీతో సమన్వయం చేయడానికి ఖాతా సృష్టించండి.',
    register_name: 'పూర్తి పేరు',
    register_email: 'ఇమెయిల్ అడ్రస్',
    register_phone: 'ఫోన్ నంబర్',
    register_password: 'పాస్‌వర్డ్',
    register_confirm: 'పాస్‌వర్డ్ నిర్ధారించండి',
    register_btn: 'ఖాతా సృష్టించండి',
    register_has_account: 'ఇప్పటికే ఖాతా ఉందా?',
    register_login_link: 'సైన్ ఇన్ చేయండి',

    // Track Page
    track_title: 'ఫిర్యాదు ట్రాక్ చేయండి',
    track_subtitle: 'ప్రస్తుత స్థితి మరియు పరిష్కార పురోగతిని తెలుసుకోవడానికి మీ ఫిర్యాదు ట్రాకింగ్ ID నమోదు చేయండి.',
    track_placeholder: 'ఫిర్యాదు ID నమోదు చేయండి (ఉదా. SDM-2026-00001)',
    track_btn: 'స్థితి ట్రాక్ చేయండి',
    track_searching: 'వెతుకుతోంది...',

    // Footer
    footer_desc: 'స్మార్ట్ డ్రైనేజీ మేనేజ్‌మెంట్ సిస్టమ్ (SDMS) పౌరులు రోడ్ డ్రైనేజీ సమస్యలను తక్షణమే నివేదించడానికి వీలు కల్పించే మున్సిపల్ కార్యక్రమం.',
    footer_quick: 'త్వరిత లింక్‌లు',
    footer_home: 'హోమ్',
    footer_map: 'ఇంటరాక్టివ్ మ్యాప్',
    footer_track: 'ఫిర్యాదు ట్రాక్',
    footer_report: 'సమస్య నివేదించండి',
    footer_contact: 'మున్సిపల్ విభాగాన్ని సంప్రదించండి',
    footer_address: 'సివిక్ సెంటర్, మున్సిపాలిటీ ప్రధాన కార్యాలయం, సెక్టార్ 1, నగరం.',
    footer_toll: '1800-123-4567 (టోల్-ఫ్రీ)',
    footer_copyright: '© {year} స్మార్ట్ డ్రైనేజీ మేనేజ్‌మెంట్ సిస్టమ్. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.',
    footer_privacy: 'గోప్యతా విధానం',
    footer_terms: 'సేవా నిబంధనలు',
    footer_govt: 'ప్రభుత్వ కార్యక్రమం',

    // Map Page
    map_title: 'లైవ్ ఫిర్యాదుల మ్యాప్',
    map_subtitle: 'ఇంటరాక్టివ్ మ్యాప్‌పై నగరం అంతటా నివేదించబడిన అన్ని డ్రైనేజీ సమస్యలను అన్వేషించండి.',
    map_loading: 'పౌర నివేదికలు మ్యాపింగ్ చేస్తోంది...',

    // Profile Page
    profile_title: 'నా ప్రొఫైల్',
    profile_complaints: 'నా ఫిర్యాదులు',
    profile_no_complaints: 'ఫిర్యాదులు నివేదించబడలేదు',
    profile_no_complaints_desc: 'మీరు ఇంకా ఎటువంటి డ్రైనేజీ లీకేజీలను నివేదించలేదు. మా నగర రోడ్లను శుభ్రం చేయడంలో సహాయపడండి!',
    profile_report_btn: 'ఇప్పుడే సమస్య నివేదించండి',

    // Language names
    lang_en: 'English',
    lang_hi: 'हिंदी',
    lang_te: 'తెలుగు',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('sdms_lang') || 'en';
  });

  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
    localStorage.setItem('sdms_lang', lang);
  }, []);

  const t = useCallback((key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
