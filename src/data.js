export const STR = {
  en: {
    title: "Ops Cockpit", subtitle: "Morning Brief",
    lowbw: "Low-bandwidth",
    queueTitle: "Needs your call today",
    open: "open",
    queueHint: "Ranked by urgency. Press j/k to move, a to approve, h to hold.",
    cutoffLabel: "Next dispatch cutoff", queuedLabel: "Orders queued for cutoff",
    anomalyTitle: "System-flagged anomalies", autoTag: "auto",
    footerNote: "Mock data · refreshes locally · no data leaves this browser",
    approve: "Approve", hold: "Hold", approved: "Approved", held: "On hold", undo: "Undo",
    due: "Due", owner: "Owner",
    priority: { high: "High", medium: "Medium", low: "Low" },
    severity: { critical: "Critical", warning: "Warning", info: "Info" },
    detected: "Flagged",
  },
  hi: {
    title: "ऑप्स कॉकपिट", subtitle: "सुबह की ब्रीफ़िंग",
    lowbw: "लो-बैंडविड्थ",
    queueTitle: "आज आपका निर्णय चाहिए",
    open: "शेष",
    queueHint: "तात्कालिकता के अनुसार क्रमबद्ध। j/k से घुमाएं, a से स्वीकृत करें, h से रोकें।",
    cutoffLabel: "अगली डिस्पैच कट-ऑफ़", queuedLabel: "कट-ऑफ़ के लिए कतार में ऑर्डर",
    anomalyTitle: "सिस्टम द्वारा चिह्नित विसंगतियाँ", autoTag: "स्वचालित",
    footerNote: "नमूना डेटा · स्थानीय रूप से रीफ़्रेश होता है · कोई डेटा ब्राउज़र से बाहर नहीं जाता",
    approve: "स्वीकृत करें", hold: "रोकें", approved: "स्वीकृत", held: "रोका गया", undo: "पूर्ववत करें",
    due: "समय-सीमा", owner: "ज़िम्मेदार",
    priority: { high: "उच्च", medium: "मध्यम", low: "निम्न" },
    severity: { critical: "गंभीर", warning: "चेतावनी", info: "सूचना" },
    detected: "चिह्नित",
  },
};

export const ACTION_ITEMS = [
  { id: 'PO-48213', priority: 'high',
    en: { title: "Nagpur DC stock mismatch", context: "1,200 units short vs manifest — blocks the 11:00 dispatch cutoff.", owner: "R. Kulkarni" },
    hi: { title: "नागपुर डीसी स्टॉक बेमेल", context: "मैनिफेस्ट से 1,200 यूनिट कम — 11:00 डिस्पैच कट-ऑफ़ में बाधा।", owner: "आर. कुलकर्णी" },
    due: "10:30" },
  { id: 'VND-091', priority: 'high',
    en: { title: "Chakrata Logistics SLA breach", context: "3 deliveries past delay threshold this week — contract review triggered.", owner: "S. Bhatt" },
    hi: { title: "चकराता लॉजिस्टिक्स SLA उल्लंघन", context: "इस सप्ताह 3 डिलीवरी विलंब सीमा पार — अनुबंध समीक्षा शुरू।", owner: "एस. भट्ट" },
    due: "11:00" },
  { id: 'RFD-772', priority: 'medium',
    en: { title: "Refund batch #772 stuck in review", context: "₹4.8L on hold, customer escalations rising on the ticket queue.", owner: "N. Iyer" },
    hi: { title: "रिफंड बैच #772 समीक्षा में अटका", context: "₹4.8L रुका हुआ, टिकट कतार में शिकायतें बढ़ रही हैं।", owner: "एन. अय्यर" },
    due: "12:00" },
  { id: 'CHN-12R', priority: 'high',
    en: { title: "Cold-chain excursion, Route 12", context: "Reefer ran 2°C above threshold for 40 min — QA sign-off needed before delivery.", owner: "D. Fernandes" },
    hi: { title: "कोल्ड-चेन विचलन, रूट 12", context: "रीफर 40 मिनट तक सीमा से 2°C ऊपर रहा — डिलीवरी से पहले QA अनुमोदन ज़रूरी।", owner: "डी. फर्नांडीस" },
    due: "09:45" },
  { id: 'STF-PN6', priority: 'medium',
    en: { title: "Pune night shift short 6 pickers", context: "Tonight's dispatch volume needs backfill approval by noon.", owner: "A. Deshmukh" },
    hi: { title: "पुणे नाइट शिफ्ट में 6 पिकर्स की कमी", context: "आज रात की डिस्पैच मात्रा के लिए दोपहर तक बैकफिल स्वीकृति चाहिए।", owner: "ए. देशमुख" },
    due: "12:00" },
];

export const ANOMALIES = [
  { id: 1, severity: 'critical', sysEn: "Inventory Sync", sysHi: "इन्वेंटरी सिंक", descEn: "SKU count delta over 5% at DC-04", descHi: "DC-04 पर SKU गिनती अंतर 5% से अधिक", time: "08:41" },
  { id: 2, severity: 'critical', sysEn: "Fleet Telemetry", sysHi: "फ्लीट टेलीमेट्री", descEn: "Geofence exit without dispatch close — TN09-4471", descHi: "डिस्पैच बंद किए बिना जियोफेंस से बाहर — TN09-4471", time: "08:12" },
  { id: 3, severity: 'warning', sysEn: "Payment Gateway", sysHi: "पेमेंट गेटवे", descEn: "Refund latency p95 up 3.2x vs 7-day average", descHi: "रिफंड लेटेंसी p95, 7-दिन औसत से 3.2 गुना अधिक", time: "07:55" },
  { id: 4, severity: 'warning', sysEn: "Returns QC", sysHi: "रिटर्न QC", descEn: "Rejection rate 18 points above rolling average", descHi: "अस्वीकृति दर रोलिंग औसत से 18 अंक अधिक", time: "08:02" },
  { id: 5, severity: 'info', sysEn: "Order Routing", sysHi: "ऑर्डर रूटिंग", descEn: "12% of orders rerouted to DC-02 amid DC-01 congestion", descHi: "DC-01 में भीड़भाड़ के कारण 12% ऑर्डर DC-02 भेजे गए", time: "06:30" },
];

export const SEVERITY_STYLE = {
  critical: { dot: 'bg-signal-red', text: 'text-signal-red', ring: 'ring-signal-red/20' },
  warning: { dot: 'bg-signal-amber', text: 'text-signal-amber', ring: 'ring-signal-amber/20' },
  info: { dot: 'bg-signal-teal', text: 'text-signal-teal', ring: 'ring-signal-teal/20' },
};

export const PRIORITY_STYLE = {
  high: 'bg-signal-red/15 text-signal-red',
  medium: 'bg-signal-amber/15 text-signal-amber',
  low: 'bg-signal-teal/15 text-signal-teal',
};

export const CUTOFFS = [9 * 60 + 45, 11 * 60, 14 * 60, 17 * 60, 20 * 60];
