import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav.standard_dashboard": "Standard Dashboard",
      "nav.clinical_hub": "Clinical Hub",
      "nav.signals_feed": "Signals Feed",
      "nav.live_map_view": "Live Map View",
      "nav.notification": "Notification",
      "nav.patient_registry": "Patient Registry",
      "nav.registry_queue": "Registry Queue",
      "nav.clinical_scheduler": "Clinical Scheduler",
      "nav.bed_allocation_requests": "Bed Allocation",
      "nav.system_infrastructure": "System Infrastructure",
      "nav.billing_gateway": "Billing Gateway",
      "nav.vitals_analytics": "Vitals Analytics",
      "nav.staff_personnel": "Staff Personnel",
      "topbar.new_admission": "New Admission",
      "topbar.logout": "Exit",
      "topbar.search_placeholder": "SEARCH REGISTRY BY NAME OR UID...",
      "common.status": "Status",
      "common.priority": "Priority",
      "common.actions": "Actions",
      "common.patient": "Patient",
      "common.id": "ID",
      "common.age": "Age",
      "common.gender": "Gender",
      "common.loading": "Establishing Satellite Link...",
      "dashboard.overview": "Overview"
    }
  },
  hi: {
    translation: {
      "nav.standard_dashboard": "मानक डैशबोर्ड",
      "nav.clinical_hub": "क्लिनिकल हब",
      "nav.signals_feed": "सिग्नल फीड",
      "nav.live_map_view": "लाइव मैप व्यू",
      "nav.notification": "सूचना",
      "nav.patient_registry": "मरीज रजिस्ट्री",
      "nav.registry_queue": "रजिस्ट्री कतार",
      "nav.clinical_scheduler": "क्लिनिकल शेड्यूलर",
      "nav.bed_allocation_requests": "बिस्तर आवंटन",
      "nav.system_infrastructure": "सिस्टम बुनियादी ढांचा",
      "nav.billing_gateway": "बिलिंग गेटवे",
      "nav.vitals_analytics": "महत्वपूर्ण आँकड़े",
      "nav.staff_personnel": "कर्मचारी कर्मी",
      "topbar.new_admission": "नया प्रवेश",
      "topbar.logout": "बाहर निकलें",
      "topbar.search_placeholder": "नाम या यूआईडी द्वारा खोजें...",
      "common.status": "स्थिति",
      "common.priority": "प्राथमिकता",
      "common.actions": "कार्रवाई",
      "common.patient": "मरीज",
      "common.id": "आईडी",
      "common.age": "उम्र",
      "common.gender": "लिंग",
      "common.loading": "सेटेलाइट लिंक स्थापित हो रहा है...",
      "dashboard.overview": "अवलोकन"
    }
  },
  mr: {
    translation: {
      "nav.standard_dashboard": "मानक डॅशबोर्ड",
      "nav.clinical_hub": "क्लिनिकल हब",
      "nav.signals_feed": "सिग्नल फीड",
      "nav.live_map_view": "लाइव्ह मॅप व्यू",
      "nav.notification": "सूचना",
      "nav.patient_registry": "रुग्ण नोंदणी",
      "nav.registry_queue": "नोंदणी रांग",
      "nav.clinical_scheduler": "क्लिनिकल शेड्यूलर",
      "nav.bed_allocation_requests": "खाट वाटप विनंत्या",
      "nav.system_infrastructure": "सिस्टम पायाभूत सुविधा",
      "nav.billing_gateway": "बिलिंग गेटवे",
      "nav.vitals_analytics": "जीवनावश्यक विश्लेषण",
      "nav.staff_personnel": "कर्मचारी वर्ग",
      "topbar.new_admission": "नवीन प्रवेश",
      "topbar.logout": "बाहेर पडा",
      "topbar.search_placeholder": "नाव किंवा UID द्वारे शोधा...",
      "common.status": "स्थिती",
      "common.priority": "प्राधान्य",
      "common.actions": "कृती",
      "common.patient": "रुग्ण",
      "common.id": "आयडी",
      "common.age": "वय",
      "common.gender": "लिंग",
      "common.loading": "सॅटेलाईट लिंक स्थापित होत आहे...",
      "dashboard.overview": "आढावा"
    }
  },
  ta: {
    translation: {
      "nav.standard_dashboard": "நிலையான டாஷ்போர்டு",
      "nav.clinical_hub": "மருத்துவ மையம்",
      "nav.signals_feed": "சிக்னல் ஊட்டம்",
      "nav.live_map_view": "நேரடி வரைபடக் காட்சி",
      "nav.notification": "அறிவிப்பு",
      "nav.patient_registry": "நோயாளி பதிவு",
      "nav.registry_queue": "பதிவு வரிசை",
      "nav.clinical_scheduler": "மருத்துவ திட்டமிடுபவர்",
      "nav.bed_allocation_requests": "படுக்கை ஒதுக்கீடு கோரிக்கைகள்",
      "nav.system_infrastructure": "கணினி உள்கட்டமைப்பு",
      "nav.billing_gateway": "பில்லிங் கேட்வே",
      "nav.vitals_analytics": "முக்கிய பகுப்பாய்வு",
      "nav.staff_personnel": "பணியாளர்கள்",
      "topbar.new_admission": "புதிய சேர்க்கை",
      "topbar.logout": "வெளியேறு",
      "topbar.search_placeholder": "பெயர் அல்லது UID மூலம் தேடுக...",
      "common.status": "நிலை",
      "common.priority": "முன்னுரிமை",
      "common.actions": "நடவடிக்கைகள்",
      "common.patient": "நோயாளி",
      "common.id": "அடையாளம்",
      "common.age": "வயது",
      "common.gender": "பாலினம்",
      "common.loading": "செயற்கைக்கோள் இணைப்பு நிறுவப்படுகிறது...",
      "dashboard.overview": "கண்ணோட்டம்"
    }
  },
  kn: {
    translation: {
      "nav.standard_dashboard": "ಪ್ರಾಮಾಣಿಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      "nav.clinical_hub": "ಕ್ಲಿನಿಕಲ್ ಹಬ್",
      "nav.signals_feed": "ಸಿಗ್ನಲ್ ಫೀಡ್",
      "nav.live_map_view": "ಲೈವ್ ಮ್ಯಾಪ್ ನೋಟ",
      "nav.notification": "ಸೂಚನೆ",
      "nav.patient_registry": "ರೋಗಿಗಳ ನೋಂದಣಿ",
      "nav.registry_queue": "ನೋಂದಣಿ ಸಾಲು",
      "nav.clinical_scheduler": "ಕ್ಲಿನಿಕಲ್ ವೇಳಾಪಟ್ಟಿ",
      "nav.bed_allocation_requests": "ಹಾಸಿಗೆ ಹಂಚಿಕೆ ವಿನಂತಿಗಳು",
      "nav.system_infrastructure": "ಸಿಸ್ಟಮ್ ಮೂಲಸೌಕರ್ಯ",
      "nav.billing_gateway": "ಬಿಲ್ಲಿಂಗ್ ಗೇಟ್‌ವೇ",
      "nav.vitals_analytics": "ವೈಟಲ್ಸ್ ವಿಶ್ಲೇಷಣೆ",
      "nav.staff_personnel": "ಸಿಬ್ಬಂದಿ ವರ್ಗ",
      "topbar.new_admission": "ಹೊಸ ದಾಖಲಾತಿ",
      "topbar.logout": "ನಿರ್ಗಮಿಸಿ",
      "topbar.search_placeholder": "ಹೆಸರು ಅಥವಾ UID ಮೂಲಕ ಹುಡುಕಿ...",
      "common.status": "ಸ್ಥಿತಿ",
      "common.priority": "ಆದ್ಯತೆ",
      "common.actions": "ಕ್ರಮಗಳು",
      "common.patient": "ರೋಗಿ",
      "common.id": "ಐಡಿ",
      "common.age": "ವಯಸ್ಸು",
      "common.gender": "ಲಿಂಗ",
      "common.loading": "ಸ್ಯಾಟಲೈಟ್ ಲಿಂಕ್ ಸ್ಥಾಪಿಸಲಾಗುತ್ತಿದೆ...",
      "dashboard.overview": "ಅವಲೋಕನ"
    }
  },
  ml: {
    translation: {
      "nav.standard_dashboard": "സ്റ്റാൻഡേർഡ് ഡാഷ്ബോർഡ്",
      "nav.clinical_hub": "ക്ലിനിക്കൽ ഹബ്",
      "nav.signals_feed": "സിഗ്നൽ ഫീഡ്",
      "nav.live_map_view": "ലൈവ് മാപ്പ് വ്യൂ",
      "nav.notification": "അറിയിപ്പ്",
      "nav.patient_registry": "രോഗി രജിസ്ട്രി",
      "nav.registry_queue": "രജിസ്ട്രി ക്യൂ",
      "nav.clinical_scheduler": "ക്ലിനിക്കൽ ഷെഡ്യൂളർ",
      "nav.bed_allocation_requests": "ബെഡ് അലോക്കേഷൻ അഭ്യർത്ഥനകൾ",
      "nav.system_infrastructure": "സിസ്റ്റം ഇൻഫ്രാസ്ട്രക്ചർ",
      "nav.billing_gateway": "ബില്ലിംഗ് ഗേറ്റ്‌വേ",
      "nav.vitals_analytics": "വൈറ്റൽസ് അനലിറ്റിക്സ്",
      "nav.staff_personnel": "സ്റ്റാഫ് പേഴ്സണൽ",
      "topbar.new_admission": "புതിയ അഡ്മിഷൻ",
      "topbar.logout": "പുറത്തുകടക്കുക",
      "topbar.search_placeholder": "പേര് അല്ലെങ്കിൽ UID വഴി തിരയുക...",
      "common.status": "നില",
      "common.priority": "മുൻഗണന",
      "common.actions": "നടപടികൾ",
      "common.patient": "രോഗി",
      "common.id": "ഐഡി",
      "common.age": "വയസ്സ്",
      "common.gender": "ലിംഗം",
      "common.loading": "സാറ്റലൈറ്റ് ലിങ്ക് സ്ഥാപിക്കുന്നു...",
      "dashboard.overview": "അവലോകനം"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
